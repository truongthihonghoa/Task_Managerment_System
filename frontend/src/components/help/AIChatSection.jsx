import React, { useState } from 'react';

const AIChatSection = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your TaskFlow AI Assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Thanks for your question! I\'m here to help you with TaskFlow.' }]);
      }, 1000);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EADFF9] flex items-center justify-center text-[#2D1B4E]">
            <i className="w-5 h-5" data-lucide="bot"></i>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">TaskFlow AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-green-700">Online & ready</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-[#2D1B4E] text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <input
            className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D1B4E] focus:border-transparent"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="absolute right-2 w-9 h-9 bg-[#2D1B4E] text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <i className="w-4 h-4" data-lucide="send"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;