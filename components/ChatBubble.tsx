
import React from 'react';
import { Sender } from '../types';

interface ChatBubbleProps {
  sender: Sender;
  message: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, message }) => {
  const isAI = sender === Sender.AI;

  const bubbleClasses = isAI
    ? 'bg-slate-100 text-slate-800 self-start'
    : 'bg-blue-600 text-white self-end';

  const containerClasses = isAI ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex w-full ${containerClasses} animate-fade-in`}>
      <div className={`p-4 rounded-2xl max-w-lg lg:max-w-2xl shadow-md ${bubbleClasses}`}>
        <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};
