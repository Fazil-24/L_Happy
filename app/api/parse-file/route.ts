import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";

    if (ext === "txt" || ext === "md" || ext === "csv") {
      text = buffer.toString("utf-8");
    } else if (ext === "pptx" || ext === "ppt" || ext === "docx" || ext === "doc") {
      // Use officeparser to extract text from Office files
      const officeParser = (await import("officeparser")).default;
      text = await new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (officeParser as any).parseOffice(buffer, (data: any, err: any) => {
          if (err) reject(err);
          else resolve(typeof data === "string" ? data : String(data));
        }, { outputErrorToConsole: false });
      });
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: .${ext}. Supported: .pptx, .ppt, .docx, .doc, .txt, .md` },
        { status: 400 }
      );
    }

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from file. Try pasting the content manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: text.trim(), fileName: file.name });
  } catch (err) {
    console.error("Parse-file error:", err);
    return NextResponse.json(
      { error: "Failed to parse file. Try pasting the content manually." },
      { status: 500 }
    );
  }
}
