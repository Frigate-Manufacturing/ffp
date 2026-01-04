import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CommandBlockProps = {
  command: string;
};

export function CommandBlock({ command }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <code className="font-mono text-sm text-slate-900 truncate">
        <span className="text-slate-500 mr-1">$</span>
        {command}
      </code>

      <button
        onClick={handleCopy}
        className="flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
