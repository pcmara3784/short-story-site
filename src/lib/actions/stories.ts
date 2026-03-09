"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createStory(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const blurb = formData.get("blurb") as string;
  const content = formData.get("content") as string;
  const authorNotes = formData.get("authorNotes") as string;
  const published = formData.get("published") === "on";
  const genreIds = formData.getAll("genreIds") as string[];

  const max = await prisma.story.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;

  await prisma.story.create({
    data: {
      title,
      slug,
      blurb,
      content,
      authorNotes: authorNotes || null,
      published,
      sortOrder,
      genres: {
        create: genreIds.map((genreId) => ({ genreId })),
      },
    },
  });

  revalidatePath("/stories");
  revalidatePath("/admin/stories");
  redirect("/admin/stories");
}

export async function updateStory(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const blurb = formData.get("blurb") as string;
  const content = formData.get("content") as string;
  const authorNotes = formData.get("authorNotes") as string;
  const published = formData.get("published") === "on";
  const genreIds = formData.getAll("genreIds") as string[];

  await prisma.story.update({
    where: { id },
    data: {
      title,
      slug,
      blurb,
      content,
      authorNotes: authorNotes || null,
      published,
      genres: {
        deleteMany: {},
        create: genreIds.map((genreId) => ({ genreId })),
      },
    },
  });

  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
  revalidatePath("/admin/stories");
  redirect("/admin/stories");
}

export async function deleteStory(id: string) {
  await prisma.story.delete({ where: { id } });
  revalidatePath("/stories");
  revalidatePath("/admin/stories");
}

export async function togglePublished(id: string, published: boolean) {
  await prisma.story.update({
    where: { id },
    data: { published: !published },
  });
  revalidatePath("/stories");
  revalidatePath("/admin/stories");
}

export async function reorderStories(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.story.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidatePath("/stories");
  revalidatePath("/admin/stories");
}
