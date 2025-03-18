import React from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Bot, CornerDownLeft, Loader2, TextSearch } from "lucide-react";
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
    <div className="h-full bg-background border rounded-xl shadow-sm flex flex-col min-h-[60vh] relative overflow-hidden">
      <div className="bg-muted/30 p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Legal Assistant
        </h2>
        <Badge
          variant={reportData ? "default" : "outline"}
          className={`${
            reportData
              ? "bg-green-500 hover:bg-green-600"
              : "border-amber-500 text-amber-500"
          }`}
        >
          {reportData ? "✓ Report Added" : "No Report Added"}
        </Badge>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      {data?.length !== undefined && data.length > 0 && (
        <Accordion type="single" className="text-sm border-t" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
              <span className="flex flex-row items-center gap-2">
                <TextSearch className="h-4 w-4" /> Relevant Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="bg-muted/30 p-4">
              <div className="whitespace-pre-wrap prose-sm max-w-none">
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
        <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-primary/50">
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
              className="ml-auto bg-[#D90013] hover:bg-[#B80010] text-white rounded-full px-4"
            >
              {isLoading ? "Analyzing..." : "Ask Question"}
              {isLoading ? (
                <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CornerDownLeft className="ml-2 h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
