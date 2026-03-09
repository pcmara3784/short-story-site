"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function createGenre(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const slug = slugify(name);

  const max = await prisma.genre.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;

  await prisma.genre.create({
    data: { name, slug, sortOrder },
  });

  revalidatePath("/admin/genres");
  revalidatePath("/stories");
  revalidatePath("/");
}

export async function deleteGenre(id: string) {
  await prisma.genre.delete({ where: { id } });
  revalidatePath("/admin/genres");
  revalidatePath("/stories");
  revalidatePath("/");
}

export async function reorderGenres(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.genre.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidatePath("/admin/genres");
  revalidatePath("/stories");
  revalidatePath("/");
}
