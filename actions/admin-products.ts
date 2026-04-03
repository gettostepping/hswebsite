"use server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { syncCourseClassSessions } from "@/lib/scheduling";

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  duration: z.string().min(2),
  category: z.string().min(2),
  priceOriginal: z.coerce.number().min(1),
  priceRenewal: z.coerce.number().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export async function createCourse(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      category: formData.get("category") as string,
      priceOriginal: formData.get("priceOriginal"),
      priceRenewal: formData.get("priceRenewal"),
      imageUrl: formData.get("imageUrl") as string,
      active: formData.get("active") === "true",
    };

    const data = courseSchema.parse(rawData);

    // 1. Create Product in Stripe
    const stripeProduct = await stripe.products.create({
      name: data.title,
      description: data.description,
      metadata: { slug: data.slug, category: data.category },
    });

    // 2. Create Original Price in Stripe
    const stripePriceOrig = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(data.priceOriginal * 100),
      currency: "usd",
    });

    // 3. Create Renewal Price (if provided)
    let stripePriceRen = null;
    if (data.priceRenewal && data.priceRenewal > 0) {
      stripePriceRen = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(data.priceRenewal * 100),
        currency: "usd",
      });
    }

    // 4. Save to Database
    await prisma.course.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        priceRenewal: data.priceRenewal || null,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePriceOrig.id,
        stripeRenewalPriceId: stripePriceRen?.id || null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/courses");
    revalidatePath("/pricing");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create course" };
  }
}

export async function deleteCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({ where: { id } });
    if (course?.stripeProductId) {
      // Archive the product in Stripe (Stripe doesn't allow physical deletion easily if there are payments)
      await stripe.products.update(course.stripeProductId, { active: false });
    }
    await prisma.course.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/courses");
    revalidatePath("/pricing");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete course" };
  }
}

export async function updateCourseStatus(id: string, active: boolean) {
  try {
    const course = await prisma.course.update({
      where: { id },
      data: { active },
    });

    if (course.stripeProductId) {
      await stripe.products.update(course.stripeProductId, { active });
    }

    revalidatePath("/admin/products");
    revalidatePath("/courses");
    revalidatePath("/pricing");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update course status" };
  }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      category: formData.get("category") as string,
      priceOriginal: formData.get("priceOriginal"),
      priceRenewal: formData.get("priceRenewal"),
      imageUrl: formData.get("imageUrl") as string,
      active: formData.get("active") === "true",
    };

    const data = courseSchema.parse(rawData);

    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) throw new Error("Course not found");

    let stripePriceId = existingCourse.stripePriceId;
    let stripeRenewalPriceId = existingCourse.stripeRenewalPriceId;

    if (existingCourse.stripeProductId) {
      // Update Stripe product details
      await stripe.products.update(existingCourse.stripeProductId, {
        name: data.title,
        description: data.description,
        metadata: { slug: data.slug, category: data.category },
      });

      // If original price changed
      if (existingCourse.priceOriginal !== data.priceOriginal) {
        const newPrice = await stripe.prices.create({
          product: existingCourse.stripeProductId,
          unit_amount: Math.round(data.priceOriginal * 100),
          currency: "usd",
        });
        stripePriceId = newPrice.id;
      }

      // If renewal price changed
      if (existingCourse.priceRenewal !== data.priceRenewal) {
        if (data.priceRenewal && data.priceRenewal > 0) {
          const newPrice = await stripe.prices.create({
            product: existingCourse.stripeProductId,
            unit_amount: Math.round(data.priceRenewal * 100),
            currency: "usd",
          });
          stripeRenewalPriceId = newPrice.id;
        } else {
          stripeRenewalPriceId = null;
        }
      }
    }

    await prisma.course.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        priceRenewal: data.priceRenewal || null,
        stripePriceId,
        stripeRenewalPriceId,
        schedulingRules: formData.get("schedulingRules") ? JSON.parse(formData.get("schedulingRules") as string) : null,
      },
    });

    // 5. Trigger schedule sync if rules provided
    const schedulingRulesStr = formData.get("schedulingRules");
    if (schedulingRulesStr) {
      await syncCourseClassSessions(id, JSON.parse(schedulingRulesStr as string));
    }

    revalidatePath("/admin/products");
    revalidatePath("/courses");
    revalidatePath("/pricing");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update course" };
  }
}
