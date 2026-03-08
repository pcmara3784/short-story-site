"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveBio } from "@/lib/actions/bio";

type Props = {
  initialBio: string;
  initialPhotoUrl: string;
};

export default function BioEditor({ initialBio, initialPhotoUrl }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bio, setBio] = useState(initialBio);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [saved, setSaved] = useState(false);

  function handleCancel() {
    setBio(initialBio);
    setPhotoUrl(initialPhotoUrl);
  }

  function handleSave() {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("photoUrl", photoUrl);

    startTransition(async () => {
      await saveBio(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    });
  }

  // Render bio paragraphs for preview (split on blank lines)
  const paragraphs = bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Edit form */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6">
        <div>
          <label className="admin-label">Bio Text</label>
          <p className="text-xs text-gray-400 mb-2">
            Separate paragraphs with a blank line. Changes preview instantly below.
          </p>
          <textarea
            value={bio}
            onChange={(e) => { setBio(e.target.value); setSaved(false); }}
            rows={10}
            className="admin-input font-[family-name:var(--font-sans)] resize-y"
            placeholder="Write your author bio here…"
          />
        </div>

        <div>
          <label className="admin-label">Photo URL</label>
          <p className="text-xs text-gray-400 mb-2">
            Paste a direct link to your photo (e.g. from Google Drive, Dropbox, or any image host).
            Leave blank to keep the book icon placeholder.
          </p>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => { setPhotoUrl(e.target.value); setSaved(false); }}
            className="admin-input"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-sm bg-[var(--color-amber)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save Bio"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Saved — live on the site now
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Preview
        </h2>
        <div className="bg-[var(--color-parchment)] border border-[var(--color-border)] rounded-sm p-8">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-40 h-40 rounded-full bg-[var(--color-parchment-dark)] border-2 border-[var(--color-border)] overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt="Author photo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-5xl select-none">📖</span>
                )}
              </div>
            </div>

            {/* Bio text */}
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[var(--color-ink)] mb-4">
                About the Author
              </h3>
              {paragraphs.length > 0 ? (
                <div className="space-y-3 text-[var(--color-ink-muted)] leading-relaxed text-sm">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">
                  Your bio will appear here as you type…
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
