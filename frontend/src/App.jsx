
import { useState } from "react";
import {
  Bot,
  Plus,
  Send,
  MessageSquare,
  Menu,
  X,
  Trash2,
} from "lucide-react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = async (e) => {
  e.preventDefault();

  if (!message.trim() || loading) return;

  const userMessage = {
    role: "user",
    content: message.trim(),
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setMessage("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Error: ${error.message}`,
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  const newChat = () => {
    setMessages([]);
    setMessage("");
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121] text-white">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#171717] p-4 transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Bot className="h-7 w-7 text-emerald-400" />
            AI SmartBot Chatbot
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>
        </div>

        <button
          onClick={newChat}
          className="flex items-center gap-3 rounded-lg border border-white/20 px-4 py-3 text-sm transition hover:bg-white/10"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Your conversations
          </p>

          {messages.length > 0 && (
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10">
              <MessageSquare size={17} />
              Current Chat
            </button>
          )}
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="text-xs text-gray-500">
            Developed by Mosaib Khan
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu />
            </button>

            <h1 className="font-semibold">AI Assistant</h1>
          </div>

          {messages.length > 0 && (
            <button
              onClick={newChat}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <Trash2 size={16} />
              Clear Chat
            </button>
          )}
        </header>

        {/* Messages */}
        <section className="flex flex-1 flex-col overflow-y-auto">

          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
              <div className="mb-5 rounded-2xl bg-emerald-500/10 p-5">
                <Bot size={42} className="text-emerald-400" />
              </div>

              <h2 className="mb-3 text-2xl font-semibold">
                How can I help you today?
              </h2>

              <p className="max-w-md text-sm text-gray-400">
                Ask me anything. I'm here to help you with coding,
                learning, writing, and more.
              </p>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-5 py-8">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Bot size={20} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                      msg.role === "user"
                        ? "bg-[#303030]"
                        : "bg-transparent text-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Bot size={22} className="text-emerald-400" />
                  Thinking...
                </div>
              )}
            </div>
          )}
        </section>

        {/* Input Area */}
        <div className="px-4 pb-6 pt-3">
          <form
            onSubmit={handleSend}
            className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-[#303030] p-3 focus-within:border-emerald-500/50"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message SmartBot AI Assistant..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="rounded-xl bg-emerald-500 p-2.5 text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-gray-500">
            AI can make mistakes. Verify important information.
          </p>
        </div>

      </main>
    </div>
  );
}

export default App;
