import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import type { Message } from "../../types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function ChatWindow({ messages, isLoading, onSend }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50 scrollbar-hide">
      <div
        className="
         flex-1 overflow-y-auto scrollbar-hide
    px-3 py-4
    sm:px-4 sm:py-5
    md:px-6
    lg:px-8
        "
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div
          className="
            mx-auto w-full
            max-w-full
            sm:max-w-2xl
            lg:max-w-3xl
            xl:max-w-4xl
          "
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className="
          shrink-0  bg-slate-50
          px-3 py-3
          sm:px-4
          md:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto w-full
            max-w-full
            sm:max-w-2xl
            lg:max-w-3xl
            xl:max-w-4xl
          "
        >
          <ChatInput onSend={onSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
