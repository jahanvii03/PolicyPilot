import { useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "loading";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sources?: number[];
}

const API_URL =import.meta.env.VITE_API_BASE_URL || ""
// }/api/chat/stream` || "";

const uuid = () => Math.random().toString(36).slice(2);
function normalizeAssistantText(text: string) {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/([^\n])(\d+\.\s+)/g, "$1\n\n$2")
    .replace(/([^\n])([-*]\s+)/g, "$1\n$2");

  const lines = normalized.split("\n");
  const formattedLines: string[] = [];
  let insideOrderedSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      formattedLines.push("");
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (
        formattedLines.length > 0 &&
        formattedLines[formattedLines.length - 1] !== ""
      ) {
        formattedLines.push("");
      }

      formattedLines.push(trimmed);
      insideOrderedSection = true;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed) && insideOrderedSection) {
      const previousLine = formattedLines[formattedLines.length - 1];
      if (previousLine && previousLine !== "") {
        formattedLines.push("");
      }

      formattedLines.push(`   ${trimmed}`);
      continue;
    }

    formattedLines.push(trimmed);
  }

  return formattedLines.join("\n");
}
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuid(),
      role: "assistant",
      content: "Hello! I am an HR virtual assistant here to support you with any questions related to relocation, budget inquiries, and available amenities at your new location.How may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "user",
          content: trimmed,
          timestamp: new Date(),
        },
        {
          id: uuid(),
          role: "assistant",
          content: "You are not logged in. Please log in first.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const assistantId = uuid();
    let conversationHistory: ChatMessage[] = [];

    setMessages((prev) => {
      conversationHistory = [...prev, userMessage];
      return [
        ...prev,
        userMessage,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        },
      ];
    });

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_query: trimmed,
          conversation_history: conversationHistory.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let assistantText = "";

      const updateAssistantMessage = (text: string, isStreaming = true) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: normalizeAssistantText(text), isStreaming } : m
          )
        );
      };

      const processEvent = (eventChunk: string) => {
        // One SSE event may contain multiple lines:
        // data: hello
        // data: world
        // joined as "hello\nworld"
        const lines = eventChunk.split(/\r?\n/);

        const dataParts: string[] = [];

        for (const line of lines) {
          if (line.startsWith("data:")) {
            // Remove only "data:" prefix, preserve spaces after it
            dataParts.push(line.slice(6));
          }
        }

        if (dataParts.length === 0) return;

        const rawData = dataParts.join("\n");

        if (!rawData || rawData === "[DONE]") return;

        let chunk = rawData;
        try {
          const parsed = JSON.parse(rawData);
          chunk = parsed.content ?? parsed.message ?? parsed.response ?? rawData;
        } catch {
          chunk = rawData;
        }

        assistantText += chunk;
        updateAssistantMessage(assistantText, true);
      };

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          // Flush any remaining decoder content
          buffer += decoder.decode();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Split by SSE event boundary
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";

        for (const eventChunk of events) {
          if (!eventChunk.trim()) continue;
          processEvent(eventChunk);
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        processEvent(buffer);
      }

      updateAssistantMessage(assistantText, false);
    } catch (error) {
      console.error("Chat stream error:", error);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Sorry, something went wrong.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}