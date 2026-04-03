"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with that email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      // @ts-ignore
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Failed to register:", error);
    return { error: "Failed to create account" };
  }
}
