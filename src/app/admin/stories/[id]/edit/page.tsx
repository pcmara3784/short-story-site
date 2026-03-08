import { prisma } from "@/lib/prisma";
import { updateStory } from "@/lib/actions/stories";
import StoryForm from "@/components/admin/StoryForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;

  const [story, genres] = await Promise.all([
    prisma.story.findUnique({
      where: { id },
      include: { genres: { include: { genre: true } } },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!story) notFound();

  const action = updateStory.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Story</h1>
        <p className="mt-1 text-sm text-gray-500">{story.title}</p>
      </div>
      <StoryForm
        genres={genres}
        story={{
          ...story,
          genres: story.genres.map((sg) => ({ genre: sg.genre })),
        }}
        action={action}
      />
    </div>
  );
}
