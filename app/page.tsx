"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Bot,
  CircleAlert,
  CircleAlertIcon,
  DoorClosedIcon,
  FileCheck2,
  LucideCircleAlert,
  OctagonAlert,
  Plus,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { ModeToggle } from "@/components/modetoggle";
import { useState } from "react";
import { useChat } from "ai/react";
import ReportComponent from "@/components/ReportComponent";
// import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import ChatComponent from "@/components/chatcomponent";

const Home = () => {
  const { toast } = useToast();

  const [reportData, setreportData] = useState("");
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({
      description: "Updated!",
    });
  };

  // Home component return
  return (
    <div className="grid h-screen w-full bg-gradient-to-br from-background to-muted/20">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 bg-background/80 backdrop-blur-sm items-center gap-2 border-b px-6 shadow-sm">
          <h1 className="text-xl font-bold">
            <span className="flex flex-row items-center gap-2">
              <FileCheck2 className="text-[#D90013]" />
              <span className="bg-gradient-to-r from-[#D90013] to-red-500 bg-clip-text text-transparent">
                JurySight
              </span>
            </span>
          </h1>
          <div className="w-full flex flex-row justify-end gap-3">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-full"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Case Information
                  </h2>
                  <ReportComponent
                    onReportConfirmation={onReportConfirmation}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main className="grid flex-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="hidden md:flex flex-col bg-background rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-muted/30 p-4 border-b">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-[#D90013]" />
                Case Information
              </h2>
            </div>
            <ReportComponent onReportConfirmation={onReportConfirmation} />
          </div>
          <div className="lg:col-span-2">
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
