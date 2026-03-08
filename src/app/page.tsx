import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <p className="font-[family-name:var(--font-serif)] text-sm italic tracking-widest text-[var(--color-amber-light)] uppercase mb-4">
          Welcome to my little corner of the page
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-5xl font-bold leading-tight text-[var(--color-ink)] sm:text-6xl">
          Stories Written
          <br />
          <span className="text-[var(--color-amber)]">From the Heart</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-[var(--color-ink-muted)] leading-relaxed">
          Short stories in fantasy, horror, humor, and whatever else keeps me up at night.
          Pull up a chair. Stay a while.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/stories"
            className="inline-block rounded-sm bg-[var(--color-amber)] px-8 py-3 text-sm font-semibold text-white tracking-wide hover:bg-[var(--color-ink)] transition-colors"
          >
            Browse the Library
          </Link>
          <a
            href="#about"
            className="inline-block rounded-sm border border-[var(--color-border)] px-8 py-3 text-sm font-semibold text-[var(--color-ink-muted)] tracking-wide hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
          >
            About the Author
          </a>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="divider">
          <span className="text-lg text-[var(--color-amber-light)]">✦</span>
        </div>
      </div>

      {/* About the Author */}
      <section id="about" className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Photo placeholder */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-52 h-52 rounded-full bg-[var(--color-parchment-dark)] border-2 border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              <span className="text-6xl select-none">📖</span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[var(--color-ink)] mb-6">
              About the Author
            </h2>
            <div className="space-y-4 text-[var(--color-ink-muted)] leading-relaxed">
              <p>
                [This is where your bio goes. Tell your readers a little about yourself —
                where you&apos;re from, how long you&apos;ve been writing, what draws you to storytelling.
                Keep it warm and personal, like you&apos;re chatting over coffee.]
              </p>
              <p>
                [You might mention what genres you love to write, what inspires your stories,
                or a fun fact or two. Readers who connect with the author connect with the work.]
              </p>
              <p>
                [You can update this section anytime through the admin panel — no code required.]
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Fantasy", "Horror", "Humor"].map((genre) => (
                <Link
                  key={genre}
                  href={`/stories?genre=${genre.toLowerCase()}`}
                  className="inline-block rounded-full bg-[var(--color-amber-pale)] border border-[var(--color-border)] px-4 py-1.5 text-xs font-semibold text-[var(--color-amber)] tracking-wide hover:bg-[var(--color-amber)] hover:text-white transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-[var(--color-parchment-dark)] border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[var(--color-ink)] mb-4">
            Ready to read?
          </h2>
          <p className="text-[var(--color-ink-muted)] mb-8 max-w-md mx-auto">
            The story library has something for every mood — from quiet dread to laugh-out-loud absurdity.
          </p>
          <Link
            href="/stories"
            className="inline-block rounded-sm bg-[var(--color-amber)] px-8 py-3 text-sm font-semibold text-white tracking-wide hover:bg-[var(--color-ink)] transition-colors"
          >
            Explore All Stories
          </Link>
        </div>
      </section>
    </>
  );
}
