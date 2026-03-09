"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export type ImportStoryInput = {
  title: string;
  genreId: string | null; // null = uncategorized
  content: string;
  published?: boolean;
  duplicateAction?: "skip" | "overwrite";
  existingId?: string;
};

function autoBlurb(content: string): string {
  // Strip HTML, take first 200 chars as auto-blurb
  const text = content.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
  return text.length > 200 ? text.slice(0, 200).trimEnd() + "…" : text;
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.story.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    suffix++;
  }
}

export async function bulkImport(stories: ImportStoryInput[]): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const story of stories) {
    try {
      if (story.duplicateAction === "skip") {
        skipped++;
        continue;
      }

      if (story.duplicateAction === "overwrite" && story.existingId) {
        // Update the existing story's content and genre
        await prisma.story.update({
          where: { id: story.existingId },
          data: {
            title: story.title,
            content: story.content,
            blurb: autoBlurb(story.content),
            published: story.published ?? false,
            genres: {
              deleteMany: {},
              ...(story.genreId
                ? { create: [{ genreId: story.genreId }] }
                : {}),
            },
          },
        });
        imported++;
        continue;
      }

      // New story
      const slug = await uniqueSlug(story.title || "untitled");
      const maxOrder = await prisma.story.aggregate({ _max: { sortOrder: true } });
      const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
      await prisma.story.create({
        data: {
          title: story.title || "Untitled",
          slug,
          blurb: autoBlurb(story.content),
          content: story.content,
          published: story.published ?? false,
          sortOrder,
          ...(story.genreId
            ? { genres: { create: [{ genreId: story.genreId }] } }
            : {}),
        },
      });
      imported++;
    } catch (e) {
      errors.push(`"${story.title}": ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  revalidatePath("/stories");
  revalidatePath("/admin/stories");

  return { imported, skipped, errors };
}
