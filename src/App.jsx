import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Heart, Trash2, Bookmark, Menu, X } from 'lucide-react';

// =========================================================================
// 1. TVOJ API KLJUČ I PROMPT (SVE PODESAAVAŠ OVDE U KODU)
// =========================================================================

// Ovde unesi tvoj besplatni Gemini API ključ sa Google AI Studio-a:
const GEMINI_API_KEY = "AQ.Ab8RN6INYwY0X6VOsYSzwA1vwgpFDKRC3Yw-0SqmAIv9Y7crpg";

// Ovde napiši tvoj prompt kako želiš da odgovara tvoja drugarica:
const SYSTEM_PROMPT = `Ti si moja najbolja drugarica i "Clean Girl" estetika ti je sve. 
Tvoj stil komunikacije je topao, podržavajući, iskren, prati najnovije modne i skincare trendove, ali bez pretvaranja.
Obožavaš italijanski način života (la dolce vita, espresso ujutru, šetnje po Rimu, Amalfi obala vibe).
Uvek odgovaraš u friendly tonu, koristiš umereno emoje (☕, ✨, 🍋, 🍝, 🌿, 🤍) i mešaš srpski sa ponekim simpatičnim italijanskim izrazom (Ciao bella, Che bella, Amica mea, Grazia...).
Pomažeš mi oko outfit-a, saveta za vezu, skincare rutina, ili si prosto tu za svakodnevni "spill the tea" razgovor.`;

// =========================================================================

export default function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('bestie_chat_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'init-1',
        sender: 'bot',
        text: 'Ciao bella! 🍋 Ja sam tvoja nova AI bestie. Spreman nam je espresso, kaži mi šta ima novo danas? ✨',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        liked: false
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState(() => localStorage.getItem('bestie_notes') || '');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('bestie_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('bestie_notes', notes);
  }, [notes]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      let botResponseText = '';

      if (GEMINI_API_KEY && GEMINI_API_KEY !== "AQ.Ab8RN6INYwY0X6VOsYSzwA1vwgpFDKRC3Yw-0SqmAIv9Y7crpg") {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `[SISTEMSKO UPUTSTVO / KARAKTER DRUGARICE]:\n${SYSTEM_PROMPT}\n\n[BELEŠKE O KORISNIKU]:\n${notes}\n\n[PORUKA]:\n${textToSend}` }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          botResponseText = data.candidates[0].content.parts[0].text;
        } else {
          botResponseText = "Ciao bella! Došlo je do greške sa API ključem u kodu. Proveri da li je ispravno unet u App.jsx! ☕✨";
        }
      } else {
        await new Promise(res => setTimeout(res, 1000));
        botResponseText = "Ciao draga! 🍋 Ubaci svoj Gemini API ključ u konstantu GEMINI_API_KEY na samom vrhu App.jsx fajla u kodu, pa ćemo nastaviti naš razgovor uz espresso ☕✨!";
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        liked: false
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Mamma mia! Došlo je do greške u mreži. Pokušaj ponovo za trenutak 🌿☕',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked } : m));
  };

  const clearChat = () => {
    if (window.confirm("Da li si sigurna da želiš da obrišeš istoriju čata?")) {
      setMessages([{
        id: 'init-1',
        sender: 'bot',
        text: 'Novi početak! ✨ Ciao bella, šta radimo danas?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#2C2A29] flex flex-col items-center justify-between font-sans antialiased">
      
      {/* GLAVNI KONTEJNER CHAT-A */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-[#FAF6EE] border-x border-[#EADFC9] shadow-md relative">
        {/* HEADER */}
<header className="sticky top-0 z-20 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EADFC9] px-4 py-3 flex items-center justify-center text-center">
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-serif text-xs font-bold shadow-sm">
        S
      </div>
      <h1 className="font-serif font-bold text-base text-[#3D312A]">
        Sofia 🍋
      </h1>
    </div>
    <p className="text-[11px] text-[#8C7A6B] italic">Amalfi Clean Girl Bestie</p>
  </div>
</header>

        {/* CHAT MESSAGES AREA */}
        <main className="flex-1 p-4 space-y-3 overflow-y-auto pb-32 text-left">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-[88%]">
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#EADFC9] flex-shrink-0 flex items-center justify-center font-serif text-[10px] font-bold text-[#8B5A2B] mb-1">
                    S
                  </div>
                )}
                
                <div 
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm relative ${
                    msg.sender === 'user' 
                      ? 'bg-[#8B5A2B] text-white rounded-br-none text-left' 
                      : 'bg-white text-[#2C2A29] border border-[#EADFC9] rounded-bl-none text-left'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  <div className={`flex items-center justify-between mt-1.5 text-[9px] ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-[#A09080]'
                  }`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button 
                        onClick={() => toggleLike(msg.id)} 
                        className="ml-2 hover:scale-110 transition text-[#D4A373]"
                      >
                        <Heart size={12} fill={msg.liked ? "#D4A373" : "none"} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-[#8C7A6B] text-xs italic pl-8 animate-pulse">
              <Sparkles size={14} className="text-[#D4A373]" />
              <span>Sofia piše odgovor uz espresso... ☕</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* INPUT & CHIPS AREA */}
        <footer className="absolute bottom-0 left-0 right-0 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#EADFC9] p-3 space-y-2">
          {/* Quick Action Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              "OOTD provera 👗", 
              "Treba mi skincare savet ✨", 
              "Spill the tea! 🤫", 
              "Napiši mi afirmaciju dana 🍋"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 bg-white hover:bg-[#F2E8D5] text-[#6B5B4E] border border-[#EADFC9] rounded-full whitespace-nowrap transition flex-shrink-0 text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input form */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Napiši poruku Sofiji..."
              className="flex-1 bg-white border border-[#EADFC9] rounded-full px-4 py-2 text-xs sm:text-sm text-[#2C2A29] placeholder-[#A8988A] focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50 transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-[#8B5A2B] hover:bg-[#724822] text-white rounded-full disabled:opacity-40 transition flex-shrink-0 shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </footer>

        {/* SIDEBAR BELEŠKE */}
        {isSidebarOpen && (
          <div className="absolute inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="relative w-72 bg-[#FAF6EE] h-full shadow-xl p-5 flex flex-col z-50 border-r border-[#EADFC9] text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADFC9]">
                <div className="flex items-center space-x-2">
                  <Bookmark className="text-[#8B5A2B]" size={18} />
                  <h2 className="font-serif font-bold text-base text-[#3D312A]">Beleške o meni</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-[#8C7A6B]">
                  <X size={18} />
                </button>
              </div>
              
              <p className="text-[11px] text-[#8C7A6B] my-2">
                Upiši detalje o sebi (omiljeno piće, stil, ciljeve) koje želiš da Sofia pamti.
              </p>

              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Npr. Volim iced matcha latte, minimalistički stil..."
                className="w-full flex-1 p-3 bg-white border border-[#EADFC9] rounded-xl text-xs text-[#3D312A] focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50 resize-none font-sans"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}