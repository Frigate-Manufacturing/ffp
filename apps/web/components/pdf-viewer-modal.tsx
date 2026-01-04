"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/lib/utils";

// Configure PDF.js worker only in browser environment
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfSrc: string;
  fileName?: string;
  variant?: "dark" | "glass";
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfSrc,
  fileName = "Document",
  variant = "glass",
}: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1.0);
      setIsLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, pdfSrc]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setScale(1.0);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
  };

  const isGlass = variant === "glass";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-300",
        isGlass
          ? "bg-slate-900/40 backdrop-blur-2xl"
          : "bg-black/95 backdrop-blur-sm",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Toolbar */}
      <div
        className={cn(
          "flex-shrink-0 p-4 flex justify-between items-center border-b transition-colors",
          isGlass
            ? "bg-white/10 border-white/20 backdrop-blur-md"
            : "bg-black/40 border-white/10",
        )}
      >
        <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
          <div
            className={cn(
              "p-2 rounded-lg shadow-inner",
              isGlass ? "bg-white/20" : "bg-blue-500/20",
            )}
          >
            <FileText
              className={cn(
                "w-5 h-5",
                isGlass ? "text-white" : "text-blue-400",
              )}
            />
          </div>
          <div>
            <p className="font-semibold text-white tracking-tight">
              {fileName}
            </p>
            <p className="text-xs text-white/60">
              {numPages > 0 ? `${numPages} pages` : "PDF Document"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="text-white hover:bg-white/10 rounded-lg h-10 w-10 transition-all hover:scale-105"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-rose-500/80 hover:text-white rounded-lg h-10 w-10 transition-all active:scale-90"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main PDF Container */}
      <div
        className={cn(
          "flex-1 overflow-auto p-8 flex flex-col items-center gap-10 scroll-smooth custom-scrollbar",
          isGlass ? "bg-transparent" : "bg-slate-900/50",
        )}
      >
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24 animate-pulse">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-blue-500/40 animate-pulse rounded-full" />
              <Loader2 className="w-10 h-10 text-white animate-spin relative" />
            </div>
            <p className="text-white/70 text-sm font-medium tracking-wide">
              Synthesizing Document...
            </p>
          </div>
        )}
        <Document
          file={pdfSrc}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex flex-col items-center gap-12"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_container_${index + 1}`}
              className={cn(
                "relative group transition-all duration-500",
                isGlass ? "hover:scale-[1.01]" : "",
              )}
            >
              {/* Decorative backglow for glass effect */}
              {isGlass && (
                <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              )}

              <Page
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className={cn(
                  "shadow-2xl transition-all duration-300",
                  isGlass
                    ? "rounded-md ring-1 ring-white/20 bg-white"
                    : "bg-white",
                )}
                loading={
                  <div
                    className={cn(
                      "flex items-center justify-center p-32 rounded-lg border min-w-[600px] animate-pulse",
                      isGlass
                        ? "bg-white/5 border-white/10"
                        : "bg-white/5 border-white/5",
                    )}
                  >
                    <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                  </div>
                }
              />

              {/* Page indicator for scroll view */}
              <div className="absolute -left-16 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                  P. {index + 1}
                </span>
              </div>
            </div>
          ))}
        </Document>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex-shrink-0 p-6">
        <div
          className={cn(
            "max-w-fit mx-auto backdrop-blur-2xl border flex items-center justify-between gap-1 shadow-2xl px-2 py-1.5 transition-all duration-500",
            isGlass
              ? "bg-white/10 border-white/30 rounded-2xl"
              : "bg-black/60 border-white/10 rounded-full",
          )}
        >
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="text-white/80 hover:bg-white/20 hover:text-white rounded-xl h-9 w-9 disabled:opacity-20 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleResetZoom}
              className="text-white/70 hover:text-white hover:bg-white/10 text-[11px] font-bold min-w-[64px] h-9 rounded-xl px-2 tracking-tighter transition-colors"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              className="text-white/80 hover:bg-white/20 hover:text-white rounded-xl h-9 w-9 disabled:opacity-20 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
