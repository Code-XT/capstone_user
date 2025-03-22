import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Markdown from "./markdown";
import { Bot, User } from "lucide-react";

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({ role, content }: Props) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <Card
        className={`overflow-hidden shadow-sm max-w-[85%] ${
          isUser
            ? "bg-[#D90013]/10 border-[#D90013]/20 dark:bg-[#D90013]/30 dark:border-[#D90013]/40"
            : "bg-gradient-to-br from-sky-50 to-slate-50 border-sky-100 dark:from-sky-800/40 dark:to-indigo-900/40 dark:border-sky-700/50"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-6 py-3 border-b ${
            isUser
              ? "bg-[#D90013]/5 border-[#D90013]/10 dark:bg-[#D90013]/20 dark:border-[#D90013]/30"
              : "bg-sky-50/80 border-sky-100 dark:bg-sky-800/50 dark:border-sky-700/50"
          }`}
        >
          <div
            className={`p-1.5 rounded-full ${
              isUser
                ? "bg-[#D90013]/10 dark:bg-[#D90013]/30"
                : "bg-sky-100 dark:bg-sky-700"
            }`}
          >
            {isUser ? (
              <User className="h-4 w-4 text-[#D90013] dark:text-[#FF5757]" />
            ) : (
              <Bot className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            )}
          </div>
          <span
            className={`text-sm font-medium ${
              isUser
                ? "text-[#D90013] dark:text-[#FF5757]"
                : "text-sky-700 dark:text-sky-300"
            }`}
          >
            {isUser ? "You" : "Legal Assistant"}
          </span>
        </div>
        <CardContent className="p-6 text-sm dark:text-slate-200 prose prose-sm max-w-none">
          <div className="markdown-content">
            <Markdown text={content} />
          </div>
        </CardContent>
        {!isUser && (
          <CardFooter className="border-t bg-sky-50/50 dark:bg-sky-800/30 dark:border-sky-700/50 px-6 py-3 text-xs text-muted-foreground dark:text-slate-300">
            Disclaimer: The legal information and recommendations provided by
            this application are for informational purposes only and should not
            replace professional legal counsel. This application does not
            constitute legal advice, establish an attorney-client relationship,
            or provide a substitute for consultation with a qualified legal
            practitioner in India.
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default MessageBox;
