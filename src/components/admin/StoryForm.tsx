"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/slugify";
import DocxUploader from "./DocxUploader";

type Genre = { id: string; name: string };

type Story = {
  id: string;
  title: string;
  slug: string;
  blurb: string;
  content: string;
  authorNotes: string | null;
  published: boolean;
  genres: { genre: Genre }[];
};

type Props = {
  genres: Genre[];
  story?: Story;
  action: (formData: FormData) => Promise<void>;
};

export default function StoryForm({ genres, story, action }: Props) {
  const [title, setTitle] = useState(story?.title ?? "");
  const [slug, setSlug] = useState(story?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!story);
  const [content, setContent] = useState(story?.content ?? "");
  const [preview, setPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const selectedGenreIds = story?.genres.map((sg) => sg.genre.id) ?? [];

  return (
    <form ref={formRef} action={action} className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <label className="admin-label">Title *</label>
        <input
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="admin-input"
          placeholder="The name of your story"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="admin-label">
          URL Slug *
          <span className="ml-2 text-xs font-normal text-gray-400 normal-case tracking-normal">
            (auto-generated from title —{" "}
            <button
              type="button"
              onClick={() => setSlugManual(!slugManual)}
              className="text-[var(--color-amber)] hover:underline"
            >
              {slugManual ? "auto-generate" : "edit manually"}
            </button>
            )
          </span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">/stories/</span>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            readOnly={!slugManual}
            className={`admin-input flex-1 ${!slugManual ? "opacity-60" : ""}`}
            placeholder="url-slug"
          />
        </div>
      </div>

      {/* Blurb */}
      <div>
        <label className="admin-label">Blurb / Description *</label>
        <textarea
          name="blurb"
          required
          defaultValue={story?.blurb ?? ""}
          rows={3}
          className="admin-input resize-y"
          placeholder="A short description that appears on the story card and in search results (1–3 sentences)"
        />
      </div>

      {/* Genres */}
      <div>
        <label className="admin-label">Genres</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {genres.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name="genreIds"
                value={genre.id}
                defaultChecked={selectedGenreIds.includes(genre.id)}
                className="accent-[var(--color-amber)] w-4 h-4"
              />
              <span className="text-sm text-gray-700">{genre.name}</span>
            </label>
          ))}
          {genres.length === 0 && (
            <p className="text-sm text-gray-400">
              No genres yet.{" "}
              <a
                href="/admin/genres"
                className="text-[var(--color-amber)] hover:underline"
              >
                Add some first →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Story Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="admin-label mb-0">Story Content *</label>
          {content && (
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs text-[var(--color-amber)] hover:underline"
            >
              {preview ? "Edit HTML" : "Preview"}
            </button>
          )}
        </div>

        {/* Word upload */}
        <div className="mb-3">
          <DocxUploader onExtracted={(html) => { setContent(html); setPreview(true); }} />
        </div>

        {/* Hidden field carries the content value on submit */}
        <input type="hidden" name="content" value={content} />

        {preview ? (
          /* Rendered preview */
          <div className="admin-input min-h-64 overflow-y-auto">
            <div
              className="story-content text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : (
          /* Raw HTML editor */
          <textarea
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required={!content}
            className="admin-input resize-y font-mono text-xs leading-relaxed"
            placeholder="Upload a .docx above, or type/paste HTML directly.&#10;&#10;Example:&#10;&lt;p&gt;It was a dark and stormy night.&lt;/p&gt;&#10;&lt;p&gt;The kind of night that &lt;em&gt;makes you question&lt;/em&gt; your choices.&lt;/p&gt;"
          />
        )}

        {!preview && (
          <p className="mt-1 text-xs text-gray-400">
            Basic HTML only: &lt;p&gt;, &lt;em&gt;, &lt;strong&gt;, &lt;h2&gt;, &lt;h3&gt;. Use the Preview button to see how it will look.
          </p>
        )}
      </div>

      {/* Author Notes */}
      <div>
        <label className="admin-label">
          Author&apos;s Note
          <span className="ml-2 text-xs font-normal text-gray-400 normal-case tracking-normal">
            (optional — appears at the bottom of the story)
          </span>
        </label>
        <textarea
          name="authorNotes"
          defaultValue={story?.authorNotes ?? ""}
          rows={4}
          className="admin-input resize-y"
          placeholder="Anything you'd like to share about how or why you wrote this story…"
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={story?.published ?? false}
          className="accent-[var(--color-amber)] w-4 h-4"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Publish immediately (visible to readers)
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-sm bg-[var(--color-amber)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors"
        >
          {story ? "Save Changes" : "Create Story"}
        </button>
        <a
          href="/admin/stories"
          className="rounded-sm border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
