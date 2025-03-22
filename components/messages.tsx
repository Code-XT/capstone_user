import { Message } from "ai";
import React from "react";
import MessageBox from "./messagebox";
import { Bot, Loader2 } from "lucide-react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const Messages = ({ messages, isLoading }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((m, index) => {
        return <MessageBox key={index} role={m.role} content={m.content} />;
      })}
      {isLoading && (
        <div className="flex items-start gap-2 animate-pulse">
          <div className="p-1.5 rounded-full bg-sky-100 dark:bg-sky-900/50">
            <Bot className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 p-3 rounded-lg flex items-center">
            <Loader2 className="h-4 w-4 text-sky-600 dark:text-sky-400 animate-spin mr-2" />
            <span className="text-sm text-sky-700 dark:text-sky-300">
              Analyzing your query...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
