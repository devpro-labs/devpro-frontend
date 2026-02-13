"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Circle } from "lucide-react";

export interface LogEntry {
  timestamp: Date;
  message: string;
}

interface TerminalProps {
  logs: LogEntry[];
  isConnected?: boolean;
  isConnecting?: boolean;
  className?: string;
}

const Terminal = ({ logs, isConnected = false, isConnecting = false, className = "" }: TerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={`flex flex-col h-full bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">Terminal Output</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle
            className={`w-2.5 h-2.5 ${isConnected ? "fill-green-500 text-green-500" : "fill-zinc-500 text-zinc-500"
              }`}
          />
          <span className={`text-xs ${isConnected ? "text-green-500" : "text-zinc-500"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Terminal Body */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 font-mono text-sm">
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-400">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-zinc-500 border-t-blue-500 rounded-full mb-4"
              />
              <p className="text-sm font-medium">Connecting...</p>
              <p className="text-xs mt-1 text-zinc-500">Establishing connection to execution server</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-500">
              <TerminalIcon className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No output yet</p>
              <p className="text-xs mt-1">Run your code to see logs here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-3 group hover:bg-zinc-900/50 px-2 py-1 -mx-2 rounded"
                >
                  <span className="text-zinc-600 text-xs whitespace-nowrap select-none">
                    [{formatTime(log.timestamp)}]
                  </span>
                  <pre className="text-zinc-300 whitespace-pre-wrap break-all flex-1">
                    {log.message}
                  </pre>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {logs.length} {logs.length === 1 ? "line" : "lines"}
        </span>
        {isConnected && (
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Streaming...
          </span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
