import React, { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import SocialMediaLinks from "./social-links";
// import { toast } from 'sonner'
import { useToast } from "@/components/ui/use-toast";

type Props = {
  onReportConfirmation: (data: string) => void;
};
const ReportComponent = ({ onReportConfirmation }: Props) => {
  const { toast } = useToast();

  const [base64Data, setBase64Data] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState("");
  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    // Step 1: Check if there are files in the event target
    if (!event.target.files) return;

    // Step 2: Get the first file from the file list
    const file = event.target.files[0];

    // Step 3: Check if a file was indeed selected
    if (file) {
      let isValidImage = false;
      let isValidDoc = false;
      const validImages = ["image/jpeg", "image/png", "image/webp"];
      const validDocs = ["application/pdf"];
      if (validImages.includes(file.type)) {
        isValidImage = true;
      }
      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }
      if (!(isValidImage || isValidDoc)) {
        toast({
          variant: "destructive",
          description: "Filetype not supproted!",
        });
        return;
      }

      if (isValidImage) {
        compressImage(file, (compressedFile) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result as string;
            setBase64Data(base64String);
            console.log(base64String);
          };

          reader.readAsDataURL(compressedFile);
        });
      }

      if (isValidDoc) {
        const reader = new FileReader();
        // Docs are not compressed. Might add note that upto 1MB supported. Or use server side compression libraries.
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setBase64Data(base64String);
          console.log(base64String);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  function compressImage(file: File, callback: (compressedFile: File) => void) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set  canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx!.drawImage(img, 0, 0);

        // Apply basic compression (adjust quality as needed)
        const quality = 0.1; // Adjust quality as needed

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/jpeg", quality);

        // Convert data URL back to Blob
        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const compressedFile = new File([ab], file.name, {
          type: "image/jpeg",
        });

        callback(compressedFile);
      };
      img.src = e.target!.result as string;
    };

    reader.readAsDataURL(file);
  }

  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast({
        variant: "destructive",
        description: "Upload a valid report!",
      });
      return;
    }
    setIsLoading(true);

    const response = await fetch("api/extractreportgemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64Data,
      }),
    });

    if (response.ok) {
      const reportText = await response.text();
      console.log(reportText);
      setReportData(reportText);
    }

    setIsLoading(false);
  }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4">
      <div className="relative grid gap-5 rounded-xl border p-5 bg-background">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-background/95 rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm font-medium text-muted-foreground">
              Extracting document data...
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              DOCUMENT UPLOAD
            </h3>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Input
                type="file"
                onChange={handleReportSelection}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-muted p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG or WEBP (max. 1MB)
                    </p>
                  </div>
                </div>
              </label>
              {base64Data && (
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    File uploaded successfully
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={extractDetails}
            className="w-full bg-primary/90 hover:bg-primary"
            disabled={!base64Data}
          >
            Process Document
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            CASE DATA SUMMARY
          </h3>
          <Textarea
            value={reportData}
            onChange={(e) => {
              setReportData(e.target.value);
            }}
            placeholder="Extracted data from the case file will appear here. Get better recommendations by providing additional insights..."
            className="min-h-72 resize-none border rounded-lg p-3"
          />
        </div>

        <Button
          variant="destructive"
          className="bg-[#D90013] hover:bg-[#B80010]"
          onClick={() => {
            onReportConfirmation(reportData);
          }}
          disabled={!reportData}
        >
          Confirm & Analyze
        </Button>

        <div className="flex flex-row items-center justify-center gap-2 border-t mt-2 pt-4">
          <span className="text-sm text-muted-foreground">
            Share your feedback
          </span>
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
};

export default ReportComponent;
