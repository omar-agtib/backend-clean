"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Use CDN for worker (most reliable method)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFDocumentViewerProps {
  url: string;
  pageNumber: number;
  onLoadSuccess?: (pdf: { numPages: number }) => void;
  width?: number;
}

export function PDFDocumentViewer({
  url,
  pageNumber,
  onLoadSuccess,
  width = 800,
}: PDFDocumentViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Document
      file={url}
      onLoadSuccess={(pdf) => {
        setLoading(false);
        onLoadSuccess?.(pdf);
      }}
      onLoadError={(error) => {
        console.error("PDF load error:", error);
        setLoading(false);
      }}
      loading={
        <div className="flex items-center justify-center h-[1000px] w-[800px] bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      }
      error={
        <div className="flex items-center justify-center h-[1000px] w-[800px] bg-red-50 dark:bg-red-900/10">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Failed to load PDF
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again or contact support
            </p>
          </div>
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={
          <div className="flex items-center justify-center h-[1000px] w-[800px] bg-gray-100 dark:bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      />
    </Document>
  );
}
