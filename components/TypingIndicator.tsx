
import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-center justify-start">
    <div className="p-4 rounded-2xl max-w-lg lg:max-w-xl shadow-md bg-slate-100 text-slate-800 self-start">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
      </div>
    </div>
  </div>
);
