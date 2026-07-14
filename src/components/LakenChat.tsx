"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Wand2,
  Heart,
  Bot,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { label: "✨ Enhance my resume", text: "Help me make my resume sound amazing! I'm applying for data entry jobs." },
  { label: "📋 What skills do I need?", text: "What skills should I highlight for a data entry clerk position?" },
  { label: "💪 Interview prep", text: "Give me a quick confidence boost and interview tips for an administrative assistant role!" },
  { label: "🔥 Blow up my resume", text: "I want to generate a full professional resume for a data entry clerk position. Make it impressive!" },
];

export default function LakenChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hey Laken! 💕 I'm your AI career buddy — here to hype you up, polish that resume, and help you land the perfect job. What can I help with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Oops, something went wrong! ${data.error} But don't worry, try again Laken! 💕` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hmm, my brain glitched for a sec! 😅 Try again Laken — I'm here for you! 💕",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl
                   flex items-center justify-center transition-all duration-300
                   hover:scale-110 active:scale-95 group
                   ${open
                     ? "bg-gray-700 hover:bg-gray-800 rotate-90"
                     : "bg-gradient-to-br from-laken-500 to-purple-600 hover:from-laken-600 hover:to-purple-700 animate-bounce-gentle"
                   }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <X size={24} className="text-white" />
        ) : (
          <div className="relative">
            <MessageCircle size={26} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] 
                   bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden
                   transition-all duration-300 origin-bottom-right
                   ${open
                     ? "scale-100 opacity-100 translate-y-0"
                     : "scale-95 opacity-0 translate-y-4 pointer-events-none"
                   }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-laken-500 to-purple-600 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm">Laken&apos;s AI Buddy</h3>
            <p className="text-pink-100 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              Ready to help!
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={16} className="text-white/70" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-pink-50/50 to-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "user"
                    ? "bg-gradient-to-r from-laken-500 to-laken-600 text-white rounded-br-md"
                    : "bg-white border border-pink-100 text-gray-700 rounded-bl-md shadow-sm"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-pink-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-laken-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-laken-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-laken-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 border-t border-pink-50 bg-white">
            <p className="text-xs text-gray-400 mb-2 font-medium">QUICK ACTIONS</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => sendMessage(prompt.text)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-purple-50
                             text-laken-600 hover:from-pink-100 hover:to-purple-100
                             border border-pink-100 transition-all font-medium
                             hover:scale-105 active:scale-95"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-pink-100 bg-white flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything, Laken..."
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-pink-100
                       bg-pink-50/50 focus:border-laken-400 focus:ring-4
                       focus:ring-laken-100 outline-none transition-all text-sm
                       placeholder:text-gray-300"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-laken-500 to-laken-600
                       text-white flex items-center justify-center
                       hover:from-laken-600 hover:to-laken-700
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all active:scale-90 flex-shrink-0"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
