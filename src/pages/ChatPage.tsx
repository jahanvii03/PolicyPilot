import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { Header } from "../components/layout/Header";
import { ChatWindow } from "../components/chat/ChatWindow";
import { DocumentList } from "../components/documents/DocumentList";

export function ChatPage() {
  const { messages, isLoading, sendMessage } = useChat();
  const [activeTab, setActiveTab] = useState<"chat" | "docs">("chat");

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 hidden sm:flex">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
          />
        </div>
        <div
          className={`${activeTab !== "docs" ? "hidden sm:flex" : "flex"} w-full sm:w-80`}
        >
          <DocumentList />
        </div>
      </div>
    </div>
  );
}
