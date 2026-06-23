"use client";

import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "Berapa kalori yang dibutuhkan per hari?",
  "Makanan apa yang tinggi protein?",
  "Apa itu karbohidrat kompleks?",
  "Bagaimana cara diet sehat?",
  "Makanan apa yang rendah lemak?",
];

export default function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya NutriAI 🌿 Tanya apa saja seputar gizi dan makanan sehat!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setShowSuggestions(false);
    const userMsg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Maaf, saya tidak bisa menjawab saat ini.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Terjadi kesalahan. Coba lagi ya!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">  

      {/* CHAT BOX */}
      {isOpen && (
        <div className="w-[90vw] max-w-[360px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-slideUp">
          {/* HEADER */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <span className="text-lg">✦</span>
            <span className="text-sm font-semibold text-gray-700">Chat box AI</span>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* BRAND */}
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <img src="/assets/img/NutriAi.png" alt="AI" className="w-8 h-8 object-contain" />
            <span className="font-bold text-base">NutriAI</span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-[280px] max-h-[360px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed
                    ${msg.role === "user"
                      ? "bg-green-200 text-gray-800 rounded-br-sm"
                      : "bg-green-500 text-white rounded-bl-sm"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-green-500 text-white px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* SUGGESTED QUESTIONS */}
            {showSuggestions && !isLoading && (
              <div className="flex flex-col gap-2 mt-2 animate-fadeIn">
                <p className="text-xs text-gray-400 text-center">Atau pilih pertanyaan di bawah ini</p>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-4 py-2 rounded-xl border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pesan..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="text-gray-400 hover:text-green-500 transition disabled:opacity-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* TOMBOL AREA */}
      <div className="flex items-center gap-3">

        {/* SCROLL TO TOP */}
        {showTop && (
          <button
            onClick={scrollToTop}
            className="bg-white border border-gray-200 text-gray-500 hover:text-green-500 hover:border-green-400 p-4 rounded-xl shadow-lg transition animate-fadeIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* TOMBOL AI */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-green-500 p-4 rounded-xl shadow-lg hover:bg-green-600 transition"
        >
          <img src="/assets/img/AI.png" alt="AI" className="w-10" />
        </button>

      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}