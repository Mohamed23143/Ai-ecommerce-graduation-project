import { useState, useRef, useEffect, useCallback } from 'react';
import {
  IoClose, IoChatbubbleEllipses, IoArrowUp, IoPaperPlane,
  IoSparkles, IoPersonOutline, IoStop, IoRefresh,
  IoCopy, IoCheckmark, IoEllipsisHorizontal, IoTrashOutline,
  IoInformationCircleOutline, IoShirtOutline, IoRibbonOutline,
  IoCardOutline, IoHelpCircleOutline,
} from 'react-icons/io5';
import { getAIResponse } from '../../services/openrouter';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  error?: boolean;
};

const quickReplies = [
  "Show me new arrivals",
  "What's on sale?",
  "Help with sizing",
  "Return policy",
];

const capabilities = [
  { icon: IoShirtOutline, title: 'Outfit Advice', desc: 'Personalized styling tips' },
  { icon: IoRibbonOutline, title: 'New Arrivals', desc: 'Latest collections & trends' },
  { icon: IoCardOutline, title: 'Sizing & Fit', desc: 'Find your perfect size' },
  { icon: IoHelpCircleOutline, title: 'Store Info', desc: 'Shipping, returns & more' },
];

let nextId = 2;

const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((item, i) => (
      <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
    ));
    if (listType === 'ul') {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">{items}</ul>);
    } else if (listType === 'ol') {
      elements.push(<ol key={`ol-${elements.length}`} className="list-decimal pl-5 space-y-1 my-2">{items}</ol>);
    }
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)/);
    const olMatch = trimmed.match(/^\d+[.)]\s+(.*)/);

    if (ulMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(ulMatch[1]);
      return;
    }
    if (olMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(olMatch[1]);
      return;
    }

    flushList();

    if (trimmed === '') {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
};

const formatInline = (text: string): string => {
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-dark/5 rounded text-[12px] font-mono text-dark">$1</code>');
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
  formatted = formatted.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em class="italic">$2</em>');

  return formatted;
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Hi there! I'm Nasseg's AI stylist. How can I help you today?", sender: 'bot' },
];

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(INITIAL_MESSAGES);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const clearChat = useCallback(() => {
    stopGeneration();
    const fresh: Message[] = [
      { id: nextId++, text: "Hi there! I'm Nasseg's AI stylist. How can I help you today?", sender: 'bot' },
    ];
    messagesRef.current = fresh;
    setMessages(fresh);
    setShowMenu(false);
    setLastFailedPrompt(null);
  }, [stopGeneration]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAbout) setShowAbout(false);
        else if (showMenu) setShowMenu(false);
        else if (loading) stopGeneration();
        else setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, showAbout, showMenu, loading, stopGeneration]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  const copyToClipboard = useCallback(async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setInput('');
    setLastFailedPrompt(null);

    const userMsg: Message = { id: nextId++, text: msg, sender: 'user' };
    const botMsg: Message = { id: nextId++, text: '', sender: 'bot' };

    const updatedMessages = [...messagesRef.current, userMsg];
    const allWithBot = [...updatedMessages, botMsg];
    messagesRef.current = allWithBot;
    setMessages(allWithBot);

    const apiMessages = updatedMessages.map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await getAIResponse(apiMessages, (chunk) => {
        setMessages(prev => prev.map(m =>
          m.id === botMsg.id ? { ...m, text: m.text + chunk } : m
        ));
      }, controller.signal);

      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === botMsg.id
            ? { ...m, text: result.content, error: result.error }
            : m
        );
        messagesRef.current = updated;
        return updated;
      });

      if (result.error) setLastFailedPrompt(msg);
    } catch {
      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === botMsg.id
            ? { ...m, text: "Something went wrong. Please try again.", error: true }
            : m
        );
        messagesRef.current = updated;
        return updated;
      });
      setLastFailedPrompt(msg);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const handleSend = useCallback(() => {
    if (loading) {
      stopGeneration();
    } else {
      sendMessage(input);
    }
  }, [loading, input, sendMessage, stopGeneration]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasUserMessages = messages.some(m => m.sender === 'user');
  const showWelcome = !hasUserMessages && !loading;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-11 h-11 rounded-lg bg-dark text-white shadow-lg flex items-center justify-center hover:bg-gold transition-all duration-300 active:scale-95 ${
            showBackToTop && !isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <IoArrowUp className="w-4 h-4" />
        </button>

        {isOpen && (
          <div
            className="w-[360px] sm:w-[400px] h-[600px] max-h-[85vh] bg-cream rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-light relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-cream px-5 py-4 flex items-center justify-between border-b border-border-light relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center overflow-hidden shadow-sm">
                  <img src="/favicon.svg" alt="NASSEG" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-serif italic font-medium text-dark tracking-wide leading-tight">AI Stylist</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-muted font-sans tracking-widest-xl uppercase">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center transition-colors"
                  aria-label="Menu"
                >
                  <IoEllipsisHorizontal className="w-4 h-4 text-muted" />
                </button>
                {showMenu && (
                  <div className="absolute right-5 top-14 w-48 bg-white rounded-xl shadow-xl border border-border-light py-1.5 z-10 fade-in-up">
                    <button
                      onClick={() => { setShowAbout(true); setShowMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-sans text-dark hover:bg-cream-dark flex items-center gap-3 transition-colors"
                    >
                      <IoInformationCircleOutline className="w-4 h-4 text-muted" />
                      About this AI
                    </button>
                    <button
                      onClick={clearChat}
                      className="w-full px-4 py-2.5 text-left text-sm font-sans text-dark hover:bg-cream-dark flex items-center gap-3 transition-colors"
                    >
                      <IoTrashOutline className="w-4 h-4 text-muted" />
                      Clear conversation
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center transition-colors group"
                  aria-label="Close"
                >
                  <IoClose className="w-4 h-4 text-muted group-hover:text-dark" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin">
              {showWelcome && (
                <div className="fade-in-up space-y-4 pb-2">
                  <div className="text-center pt-2">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-dark items-center justify-center mb-3 shadow-md">
                      <IoSparkles className="w-7 h-7 text-gold" />
                    </div>
                    <h4 className="font-serif text-lg italic text-dark">Welcome to Nasseg</h4>
                    <p className="text-xs text-muted font-sans mt-1 max-w-[260px] mx-auto leading-relaxed">
                      Your personal AI fashion stylist. Ask me about outfits, sizing, new arrivals, or anything style-related.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {capabilities.map((cap) => (
                      <div
                        key={cap.title}
                        className="bg-white border border-border-light rounded-xl p-3 text-left"
                      >
                        <cap.icon className="w-4 h-4 text-gold mb-1.5" />
                        <div className="text-[11px] font-sans font-medium text-dark">{cap.title}</div>
                        <div className="text-[10px] text-muted font-sans leading-snug mt-0.5">{cap.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-dark flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm mt-1">
                      <img src="/favicon.svg" alt="NASSEG" className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="max-w-[80%] flex flex-col gap-1">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-dark text-white rounded-tr-md shadow-md'
                          : msg.error
                            ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-md shadow-sm'
                            : 'bg-white text-dark border border-border-light rounded-tl-md shadow-sm'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      ) : msg.text ? (
                        renderMarkdown(msg.text)
                      ) : (
                        <div className="flex items-center gap-1.5 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                    {msg.sender === 'bot' && msg.text && !msg.error && (
                      <div className="flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="text-[10px] font-sans text-muted hover:text-dark flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
                          aria-label="Copy"
                        >
                          {copiedId === msg.id ? (
                            <><IoCheckmark className="w-3 h-3" /> Copied</>
                          ) : (
                            <><IoCopy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                      </div>
                    )}
                    {msg.error && lastFailedPrompt && (
                      <button
                        onClick={() => sendMessage(lastFailedPrompt)}
                        className="text-[10px] font-sans text-gold hover:text-gold-hover flex items-center gap-1 px-1.5 py-0.5 rounded self-start"
                      >
                        <IoRefresh className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                      <IoPersonOutline className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {!showWelcome && !loading && messages.length < 5 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2 border border-border-light rounded-lg hover:border-gold hover:text-gold hover:bg-white transition-all duration-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-5 py-4 border-t border-border-light bg-cream-dark/50">
              <div className="flex items-end gap-2.5">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={false}
                  rows={1}
                  className="flex-1 bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-300 placeholder:text-muted/40 resize-none scrollbar-thin disabled:opacity-50"
                  style={{ minHeight: '42px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!loading && !input.trim()}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 active:scale-95 shadow-sm ${
                    loading
                      ? 'bg-dark text-white hover:bg-red-600'
                      : 'bg-gold text-white hover:bg-gold-hover disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                  aria-label={loading ? 'Stop' : 'Send'}
                >
                  {loading ? (
                    <IoStop className="w-4 h-4" />
                  ) : (
                    <IoPaperPlane className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="text-[9px] text-muted/60 font-sans mt-1.5 text-center">
                Press Enter to send · Shift+Enter for new line
              </div>
            </div>
          </div>
        )}

        {/* Chat FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-lg bg-dark text-white shadow-lg flex items-center justify-center hover:bg-gold transition-all duration-300 active:scale-95 relative group border border-dark hover:border-gold"
          aria-label="Open chat"
        >
          <IoChatbubbleEllipses className="w-5 h-5 text-white group-hover:hidden" />
          <IoSparkles className="w-5 h-5 text-white hidden group-hover:block" />
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in-up"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-cream rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto border border-border-light"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center">
                  <IoSparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg italic text-dark">AI Stylist</h3>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted">About</p>
                </div>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <IoClose className="w-4 h-4 text-muted" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-5">
              <p className="text-sm font-sans text-dark leading-relaxed">
                Your personal AI fashion assistant, trained to help with everything related to the Nasseg boutique. Ask anything about our products, styling tips, or store policies.
              </p>
              <div>
                <h4 className="text-[10px] font-sans tracking-widest-2xl uppercase text-gold mb-3">What I Can Help With</h4>
                <div className="space-y-2.5">
                  {capabilities.map((cap) => (
                    <div key={cap.title} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white border border-border-light flex items-center justify-center flex-shrink-0">
                        <cap.icon className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-sans font-medium text-dark">{cap.title}</div>
                        <div className="text-xs text-muted font-sans">{cap.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-border-light rounded-xl p-4">
                <div className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Powered by</div>
                <div className="text-sm font-sans text-dark font-medium">DeepSeek · Nasseg Concierge</div>
                <p className="text-[11px] text-muted font-sans mt-1 leading-relaxed">
                  Responses are AI-generated. For order-specific questions, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
