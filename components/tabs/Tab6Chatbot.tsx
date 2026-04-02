'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { chatbotWelcomeMessage, chatbotSuggestedQuestions } from '@/data/content';
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function Tab6Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: chatbotWelcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = { role: 'user', content: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setError(null);

      // Add empty assistant message to stream into
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '', isStreaming: true },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    role: 'assistant',
                    content: accumulated,
                    isStreaming: true,
                  };
                  return copy;
                });
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }

        // Mark streaming complete
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: 'assistant',
            content: accumulated || '(No response)',
            isStreaming: false,
          };
          return copy;
        });
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(err.message ?? 'Une erreur est survenue.');
        setMessages((prev) => prev.filter((m) => !m.isStreaming));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([{ role: 'assistant', content: chatbotWelcomeMessage }]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E30613]/20 border border-[#E30613]/40 flex items-center justify-center">
            <Bot size={16} className="text-[#E30613]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">REX Assistant</p>
            <p className="text-[10px] text-white/40">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors tap-target"
          aria-label="Réinitialiser la conversation"
        >
          <RefreshCw size={14} className="text-white/40" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 scrollable px-4 py-4 space-y-4">

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Suggested questions — show only after welcome message */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-white/30 text-center">Questions suggérées :</p>
            {chatbotSuggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-xs p-3 rounded-xl glass-card text-white/70 hover:text-white hover:bg-white/8 transition-colors active:scale-[0.98]"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 text-center bg-red-500/10 rounded-xl p-3 border border-red-500/20">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-none px-4 py-3 border-t border-white/8 bg-[#0a1628]/95 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            rows={1}
            className={clsx(
              'flex-1 bg-white/8 border border-white/12 rounded-2xl px-4 py-3',
              'text-sm text-white placeholder-white/30 resize-none',
              'focus:outline-none focus:border-[#E30613]/50 focus:bg-white/10',
              'transition-colors max-h-32 scrollable'
            )}
            style={{ lineHeight: '1.4' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={clsx(
              'w-11 h-11 rounded-full flex items-center justify-center flex-none transition-all duration-200',
              input.trim() && !isLoading
                ? 'bg-[#E30613] hover:bg-[#b8050f] active:scale-95 red-glow-sm'
                : 'bg-white/10 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-white/60" />
            ) : (
              <Send size={16} className={input.trim() ? 'text-white' : 'text-white/30'} />
            )}
          </button>
        </form>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-2 animate-fade-in-up', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center flex-none mt-1',
          isUser
            ? 'bg-[#E30613]/20 border border-[#E30613]/40'
            : 'bg-white/8 border border-white/12'
        )}
      >
        {isUser ? (
          <User size={13} className="text-[#E30613]" />
        ) : (
          <Bot size={13} className="text-white/60" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={clsx(
          'max-w-[80%] px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'chat-bubble-user text-white'
            : 'chat-bubble-ai text-white/90'
        )}
      >
        {message.content}
        {message.isStreaming && (
          <span className="inline-block w-1 h-4 ml-0.5 bg-[#E30613] animate-pulse rounded-full align-middle" />
        )}
      </div>
    </div>
  );
}
