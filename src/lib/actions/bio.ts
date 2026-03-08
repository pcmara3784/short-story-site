"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveBio(formData: FormData) {
  const bio = formData.get("bio") as string;
  const photoUrl = (formData.get("photoUrl") as string) || null;

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { bio, photoUrl },
    create: { id: "singleton", bio, photoUrl },
  });

  revalidatePath("/");
}
