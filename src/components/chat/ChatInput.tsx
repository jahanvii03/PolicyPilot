import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { SendHorizontalIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasText = value.trim().length > 0;

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setValue("");
    resetTextareaHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize(e.target);
  };

  return (
    <div className="bg-slate-50/95 px-3 py-2 backdrop-blur sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <div
          className="
        relative flex items-center gap-2 rounded-2xl
        border border-white/40 bg-white/70
        px-3 py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]
        backdrop-blur-xl transition-all duration-200
        focus-within:border-blue-400/50
        focus-within:bg-white/85
        focus-within:shadow-[0_12px_30px_rgba(59,130,246,0.14)]
        focus-within:ring-1 focus-within:ring-blue-300/40
        sm:gap-3 sm:rounded-3xl sm:px-4
      "
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about relocation, budgets, or amenities..."
              rows={1}
              disabled={isLoading}
              aria-label="Type your message"
              className="
            w-full resize-none border-0 bg-transparent
            text-sm text-slate-800 placeholder:text-slate-400
            leading-5 focus:outline-none
            min-h-[20px] max-h-[160px]
            disabled:cursor-not-allowed disabled:opacity-70
          "
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!hasText || isLoading}
            aria-label="Send message"
            className="
          group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl
          bg-gradient-to-br from-blue-600 to-blue-500
          text-white shadow-sm transition-all duration-200
          hover:scale-[1.03] hover:shadow-md active:scale-95
          disabled:scale-100 disabled:cursor-not-allowed
          disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none
          sm:h-9 sm:w-9
        "
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <SendHorizontalIcon className="h-3.5 w-3.5 text-white transition-transform group-hover:translate-x-[1px]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
