import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";

export default function Chatpage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    
    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Call the Node.js backend
      // Assuming Vite proxy is not set, we'll use absolute URL or relative if it's the same domain.
      // Since Node runs on 5000 and React on 5173, we use absolute URL to the Node backend.
      // Usually, it's good practice to have an env var, but we'll hardcode localhost:5000 for local dev if needed,
      // or just use relative if proxy is set. Let's assume standard localhost:5000 for backend API.
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add AI response to UI
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "An error occurred while fetching the response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">AI Assistant</h2>
          <p className="mt-1 text-white/60 text-sm">Powered by Google Gemini</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto mb-6 bg-[#1a1a2e] rounded-xl p-4 border border-white/10 shadow-lg flex flex-col gap-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40 h-full">
            <Bot size={48} className="mb-4 opacity-50" />
            <p>Start a conversation with the AI assistant.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              <div
                className={`p-2 rounded-full shrink-0 ${
                  msg.role === "user" ? "bg-blue-600" : "bg-purple-600"
                }`}
              >
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-none"
                    : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start gap-3 self-start">
            <div className="p-2 rounded-full bg-purple-600 shrink-0">
              <Bot size={20} />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center justify-center">
              <Loader2 className="animate-spin text-purple-400" size={20} />
            </div>
          </div>
        )}
        
        {error && (
          <div className="self-center my-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 items-end bg-[#1a1a2e] p-2 rounded-xl border border-white/10 shadow-lg"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border-none outline-none resize-none p-3 max-h-32 min-h-[50px] text-white placeholder-white/40"
          rows="1"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 mb-1 mr-1 bg-purple-600 hover:bg-purple-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
