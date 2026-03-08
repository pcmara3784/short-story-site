import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { prisma } from "@/lib/prisma";

export type ParsedStory = {
  tempId: string;
  title: string;
  genreLabel: string | null; // raw text found in doc, e.g. "Fantasy"
  content: string; // HTML
  excerpt: string; // first 150 chars of plain text
  wordCount: number;
  confidence: "clean" | "review";
  reviewReason?: string;
  isDuplicate: boolean;
  existingId?: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function extractExcerpt(html: string): string {
  const text = stripHtml(html);
  return text.length > 150 ? text.slice(0, 150).trimEnd() + "…" : text;
}

function countWords(html: string): number {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

function parseStories(html: string): Omit<ParsedStory, "isDuplicate" | "existingId">[] {
  // Split on <h1> tag boundaries — each Heading 1 starts a new story
  const sections = html.split(/(?=<h1[\s>])/i).filter((s) => s.trim());

  // If no h1 found at all, treat the whole doc as one unknown story
  if (sections.length === 0 || !html.match(/<h1[\s>]/i)) {
    return [
      {
        tempId: "story-0",
        title: "",
        genreLabel: null,
        content: html,
        excerpt: extractExcerpt(html),
        wordCount: countWords(html),
        confidence: "review",
        reviewReason: "No Heading 1 styles found. Could not detect story boundaries.",
      },
    ];
  }

  // Filter out any leading content before the first h1
  const storySections = sections.filter((s) => s.match(/^<h1[\s>]/i));

  return storySections.map((section, i) => {
    // Extract title from <h1>...</h1>
    const titleMatch = section.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const rawTitle = titleMatch ? stripHtml(titleMatch[1]) : "";

    // Remove the h1 tag to get the body
    let body = section.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "").trim();

    // Look for "Genre: X" in the first 5 paragraphs
    let genreLabel: string | null = null;
    const genreMatch = body.match(/<p[^>]*>\s*Genre\s*:\s*([^<]+)<\/p>/i);
    if (genreMatch) {
      genreLabel = genreMatch[1].trim();
      body = body.replace(genreMatch[0], "").trim();
    }

    // Remove leading empty paragraphs from body
    body = body.replace(/^(<p[^>]*>\s*<\/p>)+/i, "").trim();

    const wordCount = countWords(body);

    // Determine confidence
    let confidence: "clean" | "review" = "clean";
    let reviewReason: string | undefined;

    if (!rawTitle) {
      confidence = "review";
      reviewReason = "No title detected in this section.";
    } else if (wordCount < 50) {
      confidence = "review";
      reviewReason = `Very short section (${wordCount} words) — may be a stray heading or formatting artifact.`;
    }

    return {
      tempId: `story-${i}`,
      title: rawTitle,
      genreLabel,
      content: body,
      excerpt: extractExcerpt(body),
      wordCount,
      confidence,
      reviewReason,
    };
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!file.name.endsWith(".docx")) {
    return NextResponse.json({ error: "Please upload a .docx file." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
      ],
    }
  );

  const parsed = parseStories(result.value);

  // Duplicate detection — check all titles against existing stories
  const existingTitles = await prisma.story.findMany({
    where: {
      title: {
        in: parsed.map((s) => s.title).filter(Boolean),
        mode: "insensitive",
      },
    },
    select: { id: true, title: true },
  });

  const existingMap = new Map(
    existingTitles.map((s) => [s.title.toLowerCase(), s.id])
  );

  const stories: ParsedStory[] = parsed.map((s) => ({
    ...s,
    isDuplicate: existingMap.has(s.title.toLowerCase()),
    existingId: existingMap.get(s.title.toLowerCase()),
  }));

  return NextResponse.json({ stories, warnings: result.messages.map((m) => m.message) });
}
