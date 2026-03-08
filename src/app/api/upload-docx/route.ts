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

  // Convert .docx → HTML using mammoth
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

  const rawHtml = result.value;

  // Clean up mammoth output:
  // - Remove empty paragraphs
  // - Remove any leftover Word cruft
  const html = rawHtml
    .replace(/<p><\/p>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();

  // Archive original .docx to Vercel Blob (only if token is configured)
  let blobUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "-");
    const { url } = await put(`docx-originals/${timestamp}-${safeName}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    blobUrl = url;
  }

  // Count approximate word count from plain text
  const textResult = await mammoth.extractRawText({ buffer });
  const wordCount = textResult.value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return NextResponse.json({
    html,
    wordCount,
    blobUrl,
    warnings: result.messages.map((m) => m.message),
  });
}
