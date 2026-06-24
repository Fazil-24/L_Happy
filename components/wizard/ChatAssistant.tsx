"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Loader2, Sparkles, Bot } from "lucide-react";
import { ExtractedInsights, SimulationResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  insights: ExtractedInsights;
  simulation?: SimulationResult;
}

const PROACTIVE_SUGGESTIONS = [
  "What's the biggest risk with my launch?",
  "Which persona should I prioritize first?",
  "How do I address the skeptics?",
  "What's the best rollout timing?",
  "How can I improve sentiment?",
];

export default function ChatAssistant({ insights, simulation }: ChatAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !initialized) {
      setInitialized(true);
      // Proactive opening message
      const greeting: Message = {
        role: "assistant",
        content: `I've analyzed your **${insights.featureName}** simulation. Here's my top observation:\n\n${
          simulation
            ? `Your sentiment sits at **${simulation.overallSentiment}%**. The biggest risk I see: _${simulation.topRisks[0]}_. The biggest opportunity: _${simulation.topOpportunities[0]}_.\n\nWhat would you like to dig into?`
            : `I can see your feature targets ${insights.targetSegments[0]}. Run the simulation first for specific advice, or ask me anything about your launch strategy.`
        }`,
      };
      setMessages([greeting]);
    }
  }, [open, initialized, insights, simulation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const isSuggested = PROACTIVE_SUGGESTIONS.includes(text);
    window.pendo?.track("chat_message_sent", {
      featureName: insights.featureName,
      messageLength: text.length,
      messageCount: messages.filter((m) => m.role === "user").length + 1,
      isSuggestedPrompt: isSuggested,
      hasSimulationContext: !!simulation,
      sourceStep: simulation ? "simulate" : "review",
    });

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          insights,
          simulation,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I hit an error. Please try again.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Render markdown-lite (bold, italic, newlines)
  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl",
          "bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-glow-purple",
          "hover:scale-105 transition-transform",
          open && "hidden"
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm">Launch Consultant</span>
        {simulation && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-40 w-[380px] h-[560px] glass-strong rounded-2xl border border-[var(--glass-border)] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-violet-600/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    Launch Consultant
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Active · {insights.featureName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "glass border border-[var(--glass-border)] text-[var(--text-primary)] rounded-bl-sm"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                      />
                    ) : (
                      msg.content
                    )}
                    {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-violet-400 rounded-sm animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {PROACTIVE_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full glass border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-colors whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[var(--border)]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about your launch strategy..."
                  disabled={streaming}
                  className="flex-1 glass rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--glass-border)] focus:border-violet-500/50 focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                >
                  {streaming ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
