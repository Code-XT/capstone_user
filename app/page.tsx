"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { CircleAlert, FileCheck2, Settings, X } from "lucide-react";
import { ModeToggle } from "@/components/modetoggle";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ChatComponent from "@/components/chatcomponent";
import ReportComponent from "@/components/ReportComponent";

const Home = () => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onReportConfirmation = (data: string) => {
    setReportData(data);
    toast({
      title: "Case Information Updated",
      description: "Your case details have been successfully applied.",
      className:
        "bg-green-50/90 border-green-200 dark:bg-green-900/90 dark:border-green-800",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-50 flex h-16 bg-background/90 backdrop-blur-md items-center gap-2 border-b px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D90013] to-red-500 text-white">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="bg-gradient-to-r from-[#D90013] to-red-500 bg-clip-text text-transparent">
              JuriSight
            </span>
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-3">
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
            <DrawerContent className="max-h-[90vh] p-0">
              <div className="bg-muted/30 p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-[#D90013]" />
                  Case Information
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-4rem)]">
                <ReportComponent onReportConfirmation={onReportConfirmation} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 p-4 md:p-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="hidden md:flex flex-col bg-background rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md">
          <div className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20 p-4 border-b border-rose-100 dark:border-rose-900/30">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D90013]/10">
                <CircleAlert className="h-4 w-4 text-[#D90013]" />
              </div>
              Case Information
            </h2>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(100vh-12rem)]">
            <ReportComponent onReportConfirmation={onReportConfirmation} />
          </div>
        </div>

        <div className="lg:col-span-2 transition-all">
          <ChatComponent reportData={reportData} />
        </div>
      </main>
    </div>
  );
};

export default Home;
