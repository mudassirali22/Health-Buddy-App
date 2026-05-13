import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, User, Bot, Sparkles, RefreshCw, ChevronRight, Zap } from 'lucide-react';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';

const SymptomChecker = () => {
  const { selectedFamilyMember } = useFamily();
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello!  I'm your **HealthBuddy AI Assistant**.\n\nI'm here to help ${selectedFamilyMember ? selectedFamilyMember.name : user?.name || 'you'} with health insights, medicine information, and wellness tips.\n\nPlease describe your symptoms or ask a health-related question.\n\n⚠️ *Always talk to a doctor for real medical advice.*`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: "Analyze Symptoms", query: "I have certain symptoms, can you help me analyze them?" },
    { label: "Dietary Guidance", query: "Can you suggest a balanced diet plan for better immunity?" },
    { label: "Medication Info", query: "I need information regarding common medications and their interactions." },
    { label: "Wellness Habits", query: "What are some effective habits for better cardiovascular health?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hello! 👋 I'm your **HealthBuddy AI Assistant**.\n\nI'm here to help ${selectedFamilyMember ? selectedFamilyMember.name : user?.name || 'you'} with health insights and wellness tips.\n\nHow can I assist with your health today?`
    }]);
  }, [selectedFamilyMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
  };

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const profileContext = selectedFamilyMember
        ? `Context: Patient ${selectedFamilyMember.name} (${selectedFamilyMember.relation}, Age ${selectedFamilyMember.age || 'N/A'}, Blood ${selectedFamilyMember.bloodGroup || 'N/A'}). `
        : `Context: Patient ${user?.name} (Age ${user?.age || 'N/A'}, Blood ${user?.bloodGroup || 'N/A'}). `;

      const response = await api.post('/gemini/chat-ai', {
        query: profileContext + text,
        history: messages.slice(-10)
      });

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, I'm having trouble processing that right now. Please try again later." }]);
    } finally {
      setLoading(true); // Artificial delay for premium feel
      setTimeout(() => setLoading(false), 500);
    }
  };

  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      if (processed.startsWith('• ') || processed.startsWith('- ')) {
        return <div key={i} className="flex gap-2 ml-2 my-1"><span>•</span><span dangerouslySetInnerHTML={{ __html: processed.replace(/^[•\-]\s/, '') }} /></div>;
      }
      const numMatch = processed.match(/^(\d+)\.\s(.*)$/);
      if (numMatch) {
        return <div key={i} className="flex gap-2 ml-2 my-1"><span className="font-bold text-emerald-600">{numMatch[1]}.</span><span dangerouslySetInnerHTML={{ __html: numMatch[2] }} /></div>;
      }
      if (!processed.trim()) return <div key={i} className="h-2" />;
      return <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 h-[calc(100vh-64px)] lg:h-[calc(100vh-2rem)] flex flex-col space-y-6">

      {/* Unified Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <Brain size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">AI Health Assistant</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {selectedFamilyMember ? `Chatting for ${selectedFamilyMember.name}` : "Intelligent health insights and guidance."}
            </p>
          </div>
        </div>

        <button onClick={() => setMessages([messages[0]])} className="bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider relative z-10">
          <RefreshCw size={16} /> New Session
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                  {msg.role === 'assistant' ? <div>{renderContent(msg.content)}</div> : <p className="whitespace-pre-wrap font-bold">{msg.content}</p>}
                </div>
              </div>
            </div>
          ))}

          {messages.length <= 1 && !loading && (
            <div className="pt-6 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Zap className="text-emerald-500" size={12} /> Common Questions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.query)}
                    className="flex items-center justify-between p-4 bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 uppercase tracking-widest transition-all group hover:border-emerald-200"
                  >
                    <span>{action.label}</span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse ml-2">
                    AI Assistant is thinking...
                  </p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-50 relative z-10">
          <form onSubmit={handleSubmit} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I assist with your health today?"
              className="w-full bg-slate-50 border-none rounded-xl py-4 pl-6 pr-14 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all ${loading || !input.trim()
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-slate-800 text-white hover:bg-emerald-600 shadow-md active:scale-95'
                }`}
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-4 flex justify-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span>Confidential Analysis</span>
            <span>•</span>
            <span>Health Tips</span>
            <span>•</span>
            <span>AI Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
