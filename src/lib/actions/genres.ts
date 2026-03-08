"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function createGenre(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const slug = slugify(name);

  await prisma.genre.create({
    data: { name, slug },
  });

  revalidatePath("/admin/genres");
  revalidatePath("/stories");
}

export async function deleteGenre(id: string) {
  await prisma.genre.delete({ where: { id } });
  revalidatePath("/admin/genres");
  revalidatePath("/stories");
}
