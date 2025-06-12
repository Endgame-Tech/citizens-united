import { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Bot, User, Trash2 } from "lucide-react";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CivicAIAssistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("civic_ai_chat");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optionsSidebarOpen, setOptionsSidebarOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const saveToLocalStorage = (updatedMessages: Message[]) => {
    localStorage.setItem("civic_ai_chat", JSON.stringify(updatedMessages));
  };

  const clearChat = () => {
    localStorage.removeItem("civic_ai_chat");
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveToLocalStorage(newMessages);
    setInput("");

    try {
      const response = await groq.chat.completions.create({
        model: "mistral-saba-24b",
        messages: [
          {
            role: "system",
            content: `You are Tolu, a civic assistant trained on Nigerian governance and politics.\nOnly respond to questions that relate to Nigerian governance, political processes, civic rights & responsibilities, or electoral processes. Politely reject unrelated questions.`,
          },
          ...newMessages,
        ],
        temperature: 0.2,
      });

      const fullMessage = response.choices[0].message.content;

      if (fullMessage) {
        let displayedMessage = "";
        fullMessage.split("").forEach((char, i) => {
          setTimeout(() => {
            displayedMessage += char;
            const updatedMessages: Message[] = [
              ...newMessages,
              { role: "assistant", content: displayedMessage },
            ];
            setMessages(updatedMessages);
            saveToLocalStorage(updatedMessages);
          }, i * 5); // 5ms delay per character for fast typing effect
        });
      } else {
        const fallback: Message[] = [
          ...newMessages,
          { role: "assistant", content: "Sorry, I couldn't respond at the moment." },
        ];
        setMessages(fallback);
        saveToLocalStorage(fallback);
      }
    } catch (err) {
      console.error("Groq API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-120px)] flex font-poppins bg-gray-50 relative">
      {/* Mobile Sidebar Overlays */}
      {(sidebarOpen || optionsSidebarOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={() => {
            setSidebarOpen(false);
            setOptionsSidebarOpen(false);
          }}
        />
      )}

      {/* Main Navigation Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static h-full z-40 w-64 bg-white border-r p-5 flex flex-col transition-transform duration-300 shadow-lg md:shadow-none`}
      >
        <div className="flex items-center mb-6">
          <img src="/ToluW.svg" alt="Tolu AI Assistant" className="h-8 mr-2" />
          <span className="text-xl font-semibold text-[#006837]">Civic AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="text-sm font-medium text-gray-500 uppercase">Chat</div>
          <div className="text-gray-800 font-semibold bg-gray-100 px-3 py-2 rounded">Civic Assistant</div>
        </nav>
        <div className="mt-auto pt-4 border-t text-sm text-gray-500">
          <button
            onClick={clearChat}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <Trash2 size={14} /> Clear History
          </button>
        </div>
      </aside>

      {/* Mobile Options Sidebar */}
      <aside
        className={`${optionsSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden fixed right-0 h-full z-40 w-64 bg-white border-l p-5 flex flex-col transition-transform duration-300 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Chat Options</span>
          <button
            onClick={() => setOptionsSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Chat History</h3>
            <p className="text-xs text-gray-500 mb-3">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'} in this conversation
            </p>
          </div>

          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={16} /> Clear Conversation History
          </button>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">About Tolu AI</h3>
            <p className="text-xs text-gray-500">
              Tolu is a civic assistant focused on Nigerian governance and politics. Ask questions about political processes, civic rights, or electoral processes.
            </p>
          </div>
        </div>
      </aside>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col w-full md:w-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1 rounded hover:bg-gray-100"
            >
              <Bot size={22} className="text-[#006837]" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Civic AI Chat</h2>
              <p className="text-sm text-gray-500 hidden sm:block">Ask about Nigerian governance, rights, elections...</p>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setOptionsSidebarOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Chat options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <img src="/ToluW.svg" alt="Tolu AI" className="w-24 h-24 mb-4 opacity-40" />
              <p>Start a conversation with Tolu AI...</p>
              <p className="text-xs mt-2 max-w-xs">Ask questions about Nigerian governance, politics, and civic processes</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="hidden sm:block">
                  <img src="/ToluW.svg" alt="Tolu AI" className="w-6 h-6 mt-1" />
                </div>
              )}
              <div
                className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm shadow max-w-[85%] sm:max-w-lg whitespace-pre-wrap ${msg.role === "user"
                  ? "bg-[#006837] text-white"
                  : "bg-white text-gray-800 border"
                  }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              {msg.role === "user" && <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#006837] mt-1" />}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t bg-white flex items-center gap-2 sm:gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something civic..."
            disabled={loading}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#006837]"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-[#006837] p-2 sm:p-3 rounded-full text-white hover:bg-[#004d2a] disabled:opacity-50 flex-shrink-0"
          >
            <ArrowUp size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}