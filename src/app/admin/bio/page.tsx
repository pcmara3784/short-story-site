import { prisma } from "@/lib/prisma";
import BioEditor from "@/components/admin/BioEditor";

export default async function AdminBioPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Author Bio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit the bio that appears on the homepage. Changes are reflected immediately on save.
        </p>
      </div>
      <BioEditor
        initialBio={settings?.bio ?? ""}
        initialPhotoUrl={settings?.photoUrl ?? ""}
      />
    </div>
  );
}
