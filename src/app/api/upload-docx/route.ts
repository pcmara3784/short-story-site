import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (
    file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    !file.name.endsWith(".docx")
  ) {
    return NextResponse.json(
      { error: "Please upload a .docx file." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Convert .docx → HTML
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh",
      ],
    }
  );

  const html = result.value
    .replace(/<p><\/p>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();

  // Extract raw text to reliably pull title and genre from first lines
  const textResult = await mammoth.extractRawText({ buffer });
  const lines = textResult.value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const title = lines[0] ?? "";

  // Check lines 2–5 for "Genre: X"
  let genreLabel: string | null = null;
  for (let i = 1; i < Math.min(lines.length, 5); i++) {
    const genreMatch = lines[i].match(/^Genre\s*:\s*(.+)$/i);
    if (genreMatch) {
      genreLabel = genreMatch[1].trim();
      break;
    }
  }

  const wordCount = textResult.value.trim().split(/\s+/).filter(Boolean).length;

  // Archive original .docx to Vercel Blob (only if token is configured)
  let blobUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "-");
    const { url } = await put(
      `docx-originals/${timestamp}-${safeName}`,
      buffer,
      { access: "public", contentType: file.type }
    );
    blobUrl = url;
  }

  return NextResponse.json({
    html,
    title,
    genreLabel,
    wordCount,
    blobUrl,
    warnings: result.messages.map((m) => m.message),
  });
}
