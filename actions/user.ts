"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getUserProfile() {
  const session = await getSession();
  if (!session?.user?.email) return null;
  return await prisma.user.findUnique({
    where: { email: session.user.email },
    // @ts-ignore
    select: { name: true, email: true, phone: true, address: true },
  });
}

export async function updateUserRegistrationInfo(data: {
  name: string;
  phone: string;
  address: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return { success: false, error: "Not logged in" };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      // @ts-ignore
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update user registration info:", error);
    return { success: false, error: "Failed to save information." };
  }
}
