import { prisma } from "@/lib/prisma";
import { createStory } from "@/lib/actions/stories";
import StoryForm from "@/components/admin/StoryForm";

export default async function NewStoryManualPage() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Story</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below. You can save as a draft and publish later.
        </p>
      </div>
      <StoryForm genres={genres} action={createStory} />
    </div>
  );
}
