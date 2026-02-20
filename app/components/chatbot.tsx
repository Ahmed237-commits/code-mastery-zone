"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";
import {useSession} from "next-auth/react"
import Image from "next/image";

type Message = {
  time: string;
  from: "user" | "bot";
  text: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
const {data:session} = useSession();
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText, time },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || "Sorry, I couldn't generate a response.",
          time,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Failed to connect to server. Is it running?",
          time,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative small:hidden">
      {/* Chat window */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top-right sm:origin-bottom-right ${open
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 -translate-y-10 sm:translate-y-10 pointer-events-none"
          } fixed top-[85px] sm:top-auto sm:bottom-24 right-4 sm:right-6 z-40 w-[calc(100%-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.15)] flex flex-col overflow-hidden mb-4`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 flex justify-between items-center shadow-lg relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
              <FaRobot className="text-xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">AI Assistant</h3>
              <p className="text-xs text-white/90 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="hover:bg-white/20 p-2.5 rounded-xl transition-colors duration-200 group relative z-10"
          >
            <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 scrollbar-thin scrollbar-thumb-indigo-200">
          {messages.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center animate-fade-in">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-indigo-100">
                <FaRobot className="text-4xl text-indigo-300" />
              </div>
              <h4 className="text-slate-800 font-bold mb-1">Welcome!</h4>
              <p className="text-slate-500 text-sm max-w-[200px]">I can help you with your courses and learning journey.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"
                } animate-message-in`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-110 ${msg.from === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-indigo-50 text-indigo-600"
                  }`}
              >
                {msg.from === "user" ? <Image width={20} height={20} className="rounded-full" src={session?.user?.image || ''} alt="" /> : <FaRobot size={18} />}
              </div>

              <div
                className={`max-w-[80%] flex flex-col ${msg.from === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all duration-300 ${msg.from === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none hover:shadow-indigo-200"
                    : "bg-white text-slate-700 border border-indigo-50 rounded-tl-none hover:shadow-gray-200"
                    }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 font-medium px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-message-in">
              <div className="w-9 h-9 bg-white border border-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <FaRobot size={18} className="animate-pulse" />
              </div>
              <div className="bg-white border border-indigo-50 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:200ms]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:400ms]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-indigo-50/50 backdrop-blur-md">
          <div className="flex gap-2 items-center bg-gray-50 border border-indigo-100 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400/50 transition-all duration-300">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              placeholder="How can I help you today?"
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="text-indigo-600 disabled:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-200 p-1"
            >
              <FaPaperPlane className={loading ? "opacity-30" : "opacity-100"} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
            AI Assistant may provide inaccurate info.
          </p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all duration-500 group overflow-hidden ${open
          ? "bg-slate-800 text-white rotate-90 scale-90"
          : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 active:scale-95"
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 flex items-center justify-center">
          {open ? <FaTimes size={24} /> : <FaCommentDots size={28} />}
        </div>
      </button>
    </div>
  );
}