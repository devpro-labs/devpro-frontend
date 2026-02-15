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

const Terminal = ({
  logs,
  isConnected = false,
  isConnecting = false,
  className = "",
}: TerminalProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <div
      className={`flex flex-col bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <Circle
            className={`w-2 h-2 fill-current ${
              isConnected ? "text-emerald-400" : "text-zinc-600"
            }`}
          />
          <span className="text-xs text-zinc-500">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="h-64">
        <div className="p-4 font-mono text-xs">
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <span className="text-yellow-400 animate-pulse">Connecting...</span>
              <span className="text-zinc-500">
                Establishing connection to execution server
              </span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <TerminalIcon className="w-8 h-8 text-zinc-700" />
              <span className="text-zinc-500">No output yet</span>
              <span className="text-zinc-600 text-xs">
                Run your code to see logs here
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-3"
                >
                  <span className="text-zinc-600 shrink-0 select-none">
                    [{formatTime(log.timestamp)}]
                  </span>
                  <pre className="text-zinc-300 whitespace-pre-wrap break-all">
                    {log.message}
                  </pre>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Terminal;