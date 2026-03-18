"use client";

import React from "react";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ResumeViewerProps {
  resumeUrl: string;
  candidateName: string;
  trigger?: React.ReactNode;
}

export function ResumeViewer({ resumeUrl, candidateName, trigger }: ResumeViewerProps) {
  return (
    <ResponsiveDialogDrawer
      title={`Resume - ${candidateName}`}
      trigger={
        trigger || (
          <Button
            variant="outline"
            icon={<Eye className="w-4 h-4" />}
            iconPosition="left"
            className="border-purple text-purple hover:bg-purple/5"
          >
            View Resume
          </Button>
        )
      }
      dialogContentClassName="max-w-[90vw] h-[90vh]"
      drawerContentClassName="h-[90vh]"
    >
      <div className="h-full w-full overflow-hidden rounded-b-2xl">
        <PDFViewer
          config={{
            src: resumeUrl,
            theme: {
              preference: "light",
            },
          }}
        />
      </div>
    </ResponsiveDialogDrawer>
  );
}
