
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, RefreshCcw } from 'lucide-react';
import { getAnimeRecommendations } from '../src/geminiService';
import { ChatMessage } from '../src/types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Ohayo! I'm your Anime Sensei. Ask me anything about the universe of anime! Looking for something gritty or perhaps a wholesome slice of life?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getAnimeRecommendations(input);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#020617] to-[#0f172a] overflow-hidden relative">
      <style>{`
        @keyframes subtle-idle {
          0%, 100% { 
            transform: translateY(0) rotate(-0.5deg); 
            filter: drop-shadow(0 10px 20px rgba(236, 72, 153, 0.1));
          }
          50% { 
            transform: translateY(-8px) rotate(0.5deg); 
            filter: drop-shadow(0 20px 30px rgba(236, 72, 153, 0.2));
          }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        @keyframes blink {
          0%, 48%, 52%, 100% { transform: scaleY(0); }
          50% { transform: scaleY(1); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes brain-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        .animate-subtle-float { 
          animation: subtle-idle 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; 
        }
        .animate-breathing { animation: breathing 5s ease-in-out infinite; }
        .animate-blink { animation: blink 5s linear infinite; }
        .animate-scan { animation: scanline 3s linear infinite; }
        .animate-think-glow { animation: brain-pulse 1.2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Visual Novel Avatar Side */}
        <div className="relative group flex justify-center lg:justify-start order-2 lg:order-1 cursor-pointer perspective-1000">
          {/* Ambient Glow - Intensifies on group hover with enhanced bloom */}
          <div className={`absolute -inset-12 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-[100px] transition-all duration-700 ${isLoading ? 'animate-think-glow opacity-100' : 'opacity-30 group-hover:opacity-100 group-hover:from-pink-500/40 group-hover:to-purple-500/40 group-hover:blur-[140px]'}`} />
          
          {/* Avatar Container - Enhanced 3D-like hover effect */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 shadow-2xl animate-subtle-float transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-1 group-hover:shadow-[0_0_60px_rgba(236,72,153,0.25)]">
            <img 
              src="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800" 
              alt="AI Assistant"
              className={`w-full h-full object-cover grayscale-[15%] transition-all duration-1000 animate-breathing ${isLoading ? 'scale-105 saturate-[1.1] grayscale-0' : 'group-hover:grayscale-0 group-hover:saturate-125'}`}
            />
            
            {/* Glossy overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Blinking Layer */}
            <div className="absolute inset-0 bg-slate-900 origin-top pointer-events-none z-10 animate-blink opacity-40" />

            {/* Thinking Scanline */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <div className="w-full h-1/4 bg-gradient-to-b from-transparent via-pink-400/20 to-transparent animate-scan" />
              </div>
            )}

            {/* Content Overlays */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-slate-950/90 to-transparent z-30">
              <div className="bg-pink-500/80 inline-block px-4 py-1 rounded-sm text-xs font-black tracking-[0.2em] mb-2 shadow-lg transition-transform duration-700 group-hover:-translate-y-2">
                SENSEI-AI
              </div>
              <div className="flex items-center gap-2 text-white/80 text-[10px] font-black tracking-widest uppercase transition-transform duration-700 group-hover:-translate-y-2">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-pink-400 animate-ping' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                {isLoading ? 'Processing Matrices...' : 'Link Stable'}
              </div>
            </div>
          </div>
        </div>

        {/* Chat UI Side */}
        <div className="flex flex-col h-[600px] glass rounded-3xl overflow-hidden border border-white/5 order-1 lg:order-2 shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Sparkles className="text-pink-500" size={20} />
              <h3 className="font-anime font-bold text-lg tracking-[0.2em] uppercase">AI CONCIERGE</h3>
            </div>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <RefreshCcw size={16} className="text-slate-500" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-purple-600' : 'bg-pink-600'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-purple-600/10 border border-purple-500/20 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-950/40 border-t border-white/5">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Talk to sensei..."
                className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-6 py-3 text-sm text-white outline-none focus:border-pink-500/40 transition-colors placeholder:text-slate-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-pink-600 hover:bg-pink-500 text-white p-3 rounded-xl shadow-lg hover:shadow-pink-600/20 transition-all disabled:opacity-50 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
