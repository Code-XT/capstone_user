import React from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import {
  Bot,
  CornerDownLeft,
  Loader2,
  TextSearch,
  SendIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import Messages from "./messages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Markdown from "./markdown";

type Props = {
  reportData?: string;
};

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "api/medichatgemini",
    });

  return (
    <div className="h-full bg-background border rounded-xl shadow-sm flex flex-col min-h-[60vh] max-h-[calc(100vh-8rem)] relative overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/20 p-4 border-b border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
            <Bot className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          Legal Assistant
        </h2>
        <Badge
          variant={reportData ? "default" : "outline"}
          className={`${
            reportData
              ? "bg-green-500 hover:bg-green-600 text-white font-medium"
              : "border-amber-500 text-amber-500 font-medium"
          } transition-colors duration-200`}
        >
          {reportData ? "✓ Report Added" : "No Report Added"}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <Messages messages={messages} isLoading={isLoading} />

        {isLoading && (
          <div className="typing-indicator mt-4 flex items-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg w-fit">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {data?.length !== undefined && data.length > 0 && (
        <Accordion type="single" className="text-sm border-t" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="px-4 py-2 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors">
              <span className="flex flex-row items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <TextSearch className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                </div>
                Relevant Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 max-h-[30vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="whitespace-pre-wrap prose-sm max-w-none prose-chat">
                <Markdown
                  text={(data[data.length - 1] as any).retrievals as string}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <form
        className="border-t p-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-[#D90013]/30 transition-all shadow-sm hover:shadow">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your legal query here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button
              disabled={isLoading}
              type="submit"
              size="sm"
              className="ml-auto bg-gradient-to-r from-[#D90013] to-red-500 hover:from-[#B80010] hover:to-red-600 text-white rounded-full px-4 transition-all shadow-sm hover:shadow"
            >
              {isLoading ? "Analyzing..." : "Ask Question"}
              {isLoading ? (
                <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <SendIcon className="ml-2 h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
