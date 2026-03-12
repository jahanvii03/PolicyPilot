import { BotIcon, UserIcon } from "lucide-react";
import type { Message } from "../../types";
import { formatTime } from "../../lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface MessageBubbleProps {
  message: Message;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-6">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
        <BotIcon size={15} className="text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
        <div
          className="flex items-center gap-1.5"
          role="status"
          aria-label="Assistant is typing"
        >
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end items-end gap-2.5 mb-6">
      <div className="max-w-[75%]">
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-md shadow-blue-200/50">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 text-right mr-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
      <div className="w-8 h-8 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
        <UserIcon size={14} className="text-slate-500" />
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const isStreaming = message?.isStreaming;

  if (isStreaming && !message.content.trim()) {
    return <TypingIndicator />;
  }

  return (
    <div className="flex items-end gap-3 mb-6">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200 self-start mt-0.5">
        <BotIcon size={15} className="text-white" />
      </div>

      <div className="max-w-[78%]">
        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
           <div className="text-sm text-slate-700 leading-relaxed  break-words">
            {/* {message.content} */}
              <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ol: ({ children }) => (
                  <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
                    {children}
                  </ol>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
                    {children}
                  </ul>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code: ({ children }) => (
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-slate-800">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle animate-pulse" />
            )}
          </div> 
        
          {/* {!isStreaming && sourceDocs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Sources
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sourceDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors cursor-default"
                  >
                    <FileIcon size={10} />
                    {doc.name}
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {!isStreaming && (
          <p className="text-[10px] text-slate-400 mt-1 ml-1">
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "loading") return <TypingIndicator />;
  if (message.role === "user") return <UserMessage message={message} />;

  if (
    message.role === "assistant" &&
    message.isStreaming &&
    !message.content.trim()
  ) {
    return <TypingIndicator />;
  }

  return <AssistantMessage message={message} />;
}
