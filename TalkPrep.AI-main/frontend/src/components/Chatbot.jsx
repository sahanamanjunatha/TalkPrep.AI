import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Career Assistant. How can I help you today? You can ask me about resume tips, coding doubts, project ideas, or mock interview questions!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Suggest software projects",
    "Give me resume optimization tips",
    "How to prepare for System Design",
    "Explain React hooks concept"
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [history, isTyping, isOpen]);

  const handleSend = async (textToSend) => {
    const input = textToSend || message;
    if (!input.trim()) return;

    // Clear text field if sending from text input
    if (!textToSend) setMessage('');

    // Append user message
    const userMsg = { sender: 'user', text: input };
    setHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    if (!token) {
      // Prompt sign in if not authenticated
      setTimeout(() => {
        setHistory(prev => [
          ...prev,
          {
            sender: 'ai',
            text: "⚠️ Please sign in to talk to the live AI Assistant! In the meantime, I'm running in offline demonstration mode."
          }
        ]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      // Call Express API endpoint /api/ai/chat
      const res = await api.post('/ai/chat', {
        message: input,
        chatHistory: history
      });

      if (res.data.success) {
        setHistory(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error(err.message);
      setHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "Sorry, I encountered an issue connecting to the AI server. Please verify your server connection and try again."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] font-sans">
      
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center cursor-pointer transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-accent" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-[380px] h-[500px] rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl glass-panel flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    Career Coach
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-slate-400">Powered by TalkPrep.AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body (Messages) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-brand-primary shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-primary text-white rounded-tr-none'
                        : 'bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-800/40 dark:border-slate-800/40 light:border-slate-200/60 rounded-tl-none font-medium'
                    }`}
                  >
                    {/* Render basic custom bullet listings in mock replies */}
                    {msg.text.split('\n').map((para, pIdx) => {
                      if (para.startsWith('###')) {
                        return <h5 key={pIdx} className="font-semibold text-white mt-1.5 mb-1">{para.replace('###', '')}</h5>;
                      }
                      if (para.startsWith('* ') || para.startsWith('- ')) {
                        return <li key={pIdx} className="ml-2 mt-0.5">{para.substring(2)}</li>;
                      }
                      if (para.match(/^\d+\./)) {
                        return <div key={pIdx} className="ml-2 pl-1 mt-1 font-semibold text-slate-100">{para}</div>;
                      }
                      return <p key={pIdx} className={pIdx > 0 ? "mt-1" : ""}>{para}</p>;
                    })}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-brand-secondary flex items-center justify-center text-white shrink-0">
                      <User className="w-4.5 h-4.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing loader */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-brand-primary shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="bg-slate-900/60 rounded-2xl rounded-tl-none p-3 text-slate-400 border border-slate-800/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestions */}
            {history.length <= 2 && (
              <div className="px-4 py-2 border-t border-slate-900/40 bg-slate-950/20 flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[10px] text-brand-primary bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 hover:border-brand-primary/30 transition-colors px-2 py-1 rounded-full text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Footer Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me a career doubt..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-primary transition-colors"
              />
              <button
                type="submit"
                disabled={isTyping || !message.trim()}
                className="w-8 h-8 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
