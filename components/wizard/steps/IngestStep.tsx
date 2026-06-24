"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, ArrowRight, Lightbulb, Loader2, File } from "lucide-react";
import { LaunchBriefData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IngestStepProps {
  onBriefSubmit: (data: LaunchBriefData) => void;
  onTextSubmit: (text: string, fileName?: string) => void;
}

const emptyBrief: LaunchBriefData = {
  featureName: "",
  description: "",
  targetUsers: "",
  valueProposition: "",
  launchGoal: "",
  timeline: "",
  competitors: "",
  concerns: "",
};

type Mode = "brief" | "paste";

export default function IngestStep({ onBriefSubmit, onTextSubmit }: IngestStepProps) {
  const [mode, setMode] = useState<Mode>("brief");
  const [brief, setBrief] = useState<LaunchBriefData>(emptyBrief);
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    setParseError(null);

    if (ext === "txt" || ext === "md" || ext === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? "";
        setUploadedFile({ name: file.name, content });
        window.pendo?.track("file_uploaded", {
          fileName: file.name,
          fileExtension: ext ?? "",
          fileSize: file.size,
          parseMethod: "client",
          extractedContentLength: content.length,
        });
      };
      reader.readAsText(file);
      return;
    }

    // Binary formats (pptx, ppt, docx, doc) → parse via API
    setParsing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-file", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) {
        setParseError(data.error);
      } else {
        setUploadedFile({ name: data.fileName, content: data.text });
        window.pendo?.track("file_uploaded", {
          fileName: file.name,
          fileExtension: ext ?? "",
          fileSize: file.size,
          parseMethod: "api",
          extractedContentLength: (data.text as string)?.length ?? 0,
        });
      }
    } catch {
      setParseError("Failed to parse file. Try pasting the content manually.");
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.featureName || !brief.description) return;
    onBriefSubmit(brief);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = uploadedFile?.content || pastedText;
    if (!text.trim()) return;
    onTextSubmit(text, uploadedFile?.name);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Tell us about your launch
        </h2>
        <p className="text-[var(--text-secondary)]">
          Fill a guided brief or upload your product deck
        </p>
      </motion.div>

      {/* Mode tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 mb-8">
        {(["brief", "paste"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
              mode === m
                ? "bg-violet-600 text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {m === "brief" ? (
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Guided Brief
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload / Paste
              </span>
            )}
          </button>
        ))}
      </div>

      {mode === "brief" ? (
        <motion.form
          key="brief"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleBriefSubmit}
          className="space-y-5"
        >
          {(
            [
              {
                key: "featureName" as const,
                label: "Feature Name *",
                placeholder: "e.g. AI Auto-Recap for Product Teams",
                required: true,
                hint: "What is being launched?",
              },
              {
                key: "description" as const,
                label: "Description *",
                placeholder: "Describe what the feature does and how it works...",
                required: true,
                multiline: true,
                hint: "The more detail, the better the simulation",
              },
              {
                key: "targetUsers" as const,
                label: "Target Users *",
                placeholder: "e.g. Product managers, founders, team leads",
                required: true,
                hint: "Who are you launching to?",
              },
              {
                key: "valueProposition" as const,
                label: "Value Proposition",
                placeholder: "e.g. Save 30 min per meeting, never miss action items again",
                hint: "What's the core promise?",
              },
              {
                key: "launchGoal" as const,
                label: "Launch Goal",
                placeholder: "e.g. Reach 1000 MAU in 60 days, reduce churn by 15%",
                hint: "What does success look like?",
              },
              {
                key: "timeline" as const,
                label: "Timeline",
                placeholder: "e.g. Public launch in 3 weeks, beta in 1 week",
                hint: "How much runway do you have?",
              },
              {
                key: "competitors" as const,
                label: "Competitors / Alternatives",
                placeholder: "e.g. Otter.ai, Fireflies.ai, manual note-taking",
                hint: "What are users using today?",
              },
              {
                key: "concerns" as const,
                label: "Known Concerns",
                placeholder: "e.g. Privacy worries, integration complexity, pricing...",
                multiline: true,
                hint: "What keeps you up at night about this launch?",
              },
            ] as const
          ).map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                {field.label}
                {field.hint && (
                  <span className="ml-2 text-xs font-normal text-[var(--text-tertiary)]">
                    — {field.hint}
                  </span>
                )}
              </label>
              {"multiline" in field && field.multiline ? (
                <textarea
                  rows={3}
                  value={brief[field.key]}
                  onChange={(e) => setBrief({ ...brief, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required={"required" in field ? field.required : false}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--glass-border)] focus:border-violet-500/50 focus:outline-none resize-none transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={brief[field.key]}
                  onChange={(e) => setBrief({ ...brief, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required={"required" in field ? field.required : false}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--glass-border)] focus:border-violet-500/50 focus:outline-none transition-colors"
                />
              )}
            </div>
          ))}

          <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
            Extract Insights <ArrowRight className="w-5 h-5" />
          </button>
        </motion.form>
      ) : (
        <motion.div key="paste" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={cn(
              "glass rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all mb-4",
              isDragActive
                ? "border-violet-500 bg-violet-500/10"
                : "border-[var(--border)] hover:border-violet-500/40"
            )}
          >
            <input {...getInputProps()} />
            {parsing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                <p className="text-[var(--text-secondary)] font-medium">Extracting text from file...</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center gap-2">
                <File className="w-10 h-10 text-violet-400" />
                <p className="font-semibold text-[var(--text-primary)]">{uploadedFile.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {uploadedFile.content.length.toLocaleString()} characters extracted
                </p>
                <p className="text-xs text-violet-400 mt-1">Click or drop to replace</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3" />
                <p className="text-[var(--text-secondary)] font-medium">
                  Drop your deck or doc here, or click to select
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-2">
                  Supports <span className="text-violet-400 font-semibold">.pptx · .ppt · .docx · .doc · .txt</span> · Max 20MB
                </p>
              </>
            )}
          </div>

          {parseError && (
            <div className="glass rounded-xl p-3 border border-red-500/30 text-red-400 text-sm mb-4">
              ⚠ {parseError}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-tertiary)]">or paste text</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <textarea
            rows={10}
            value={uploadedFile ? uploadedFile.content : pastedText}
            onChange={(e) => {
              setUploadedFile(null);
              setPastedText(e.target.value);
            }}
            placeholder="Paste your product brief, PRD excerpt, pitch deck text, or any launch description here..."
            className="w-full glass rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--glass-border)] focus:border-violet-500/50 focus:outline-none resize-none transition-colors mb-4"
          />

          <div className="flex items-start gap-3 glass rounded-xl p-4 border border-amber-500/20 mb-6">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-secondary)]">
              Tip: Upload any PowerPoint deck or Word doc — LauncHappy extracts the text and analyzes it automatically.
              Or paste any unstructured text like meeting notes, a one-pager, or bullet points.
            </p>
          </div>

          <button
            onClick={handleTextSubmit}
            disabled={!(uploadedFile?.content || pastedText.trim()) || parsing}
            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Parsing file...</>
            ) : (
              <>Extract Insights <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}
