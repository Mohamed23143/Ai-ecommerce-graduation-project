import { useState, useRef, useEffect } from 'react';
import { IoClose, IoChatbubbleEllipses, IoArrowUp, IoPaperPlane } from 'react-icons/io5';
import { getAIResponse } from '../../services/openrouter';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const quickReplies = [
  "Show me new arrivals",
  "What's on sale?",
  "Help with sizing",
  "Return policy",
];

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm Nasseg's AI stylist. How can I help you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    addMessage(msg, 'user');
    setInput('');

    const botId = Date.now() + 1;
    setMessages(prev => [...prev, { id: botId, text: '', sender: 'bot' }]);
    setLoading(true);

    const history = [...messages, { id: Date.now(), text: msg, sender: 'user' as const }];
    const apiMessages = history.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    await getAIResponse(apiMessages, (chunk) => {
      setMessages(prev => prev.map(m =>
        m.id === botId ? { ...m, text: m.text + chunk } : m
      ));
    });
    setLoading(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-14 h-14 rounded-full bg-dark text-white shadow-lg flex items-center justify-center hover:bg-gold transition-all duration-300 active:scale-95 ${
            showBackToTop && !isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <IoArrowUp className="w-6 h-6" />
        </button>

        {isOpen && (
          <div
            className="w-[360px] sm:w-[400px] h-[560px] bg-cream rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-light"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-cream px-6 py-5 flex items-center justify-between border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-dark flex items-center justify-center overflow-hidden">
                  <img src="/favicon.svg" alt="NASSEG" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-medium text-dark">AI Stylist</h3>
                  <span className="text-[10px] text-muted font-sans tracking-widest-xl uppercase">Powered by NASSEG</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors"
              >
                <IoClose className="w-4 h-4 text-muted" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex gap-2 max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-dark flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden">
                        <img src="/favicon.svg" alt="NASSEG" className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-dark text-white rounded-tr-md'
                          : 'bg-white text-dark border border-border-light rounded-tl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length < 3 && !loading && (
              <div className="px-6 pb-3 flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2 border border-border-light rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-6 py-4 border-t border-border-light bg-cream-dark/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-border-light rounded-full px-5 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
                />
                <button
                  onClick={() => handleSend()}
                  className="w-10 h-10 rounded-full bg-dark text-white flex items-center justify-center hover:bg-gold transition-colors flex-shrink-0"
                >
                  <IoPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-dark text-white shadow-lg flex items-center justify-center hover:bg-gold transition-all duration-300 active:scale-95 relative group"
        >
          {isOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <IoChatbubbleEllipses className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </>
  );
};

export default AIChatBot;
