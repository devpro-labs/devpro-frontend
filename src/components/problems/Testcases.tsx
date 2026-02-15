"use client";

import { TestCase } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal as TerminalIcon,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import Terminal, { LogEntry } from "./terminal";

interface TestCasesPanelProps {
  sampleTestCases: TestCase[];
  runCodeResponse?: any;
  isRunning?: boolean;
  isConnecting?: boolean;
  logs?: LogEntry[];
  isConnected?: boolean;
  testResult?: TestResult | null;
  onClose?: () => void;
  setIsPanelMinimized: (minimized: boolean) => void;
  isPanelMinimized: boolean;
}

interface TestReport {
  testCaseNo: number;
  status: "PASSED" | "FAILED";
  error?: string;
}

interface TestResult {
  TotalTestcases: number;
  PassedTestcases: number;
  FailedTestcases: number;
  Reports: TestReport[];
}

const TestCasesPanel = ({
  sampleTestCases,
  runCodeResponse,
  isRunning,
  isConnecting = false,
  logs = [],
  isConnected = false,
  testResult: wsTestResult,
  onClose,
  isPanelMinimized,
  setIsPanelMinimized
}: TestCasesPanelProps) => {
  const [activeTab, setActiveTab] = useState("testcases");

  const data: TestResult | null = wsTestResult ?? runCodeResponse?.DATA ?? null;

  // Switch to terminal tab when running starts
  useEffect(() => {
    if (isRunning) {
      setActiveTab("terminal");
      // Auto-expand panel when running starts so user can see output
      setIsPanelMinimized(false);
    }
  }, [isRunning]);


  const total = data?.TotalTestcases ?? 0;
  const passed = data?.PassedTestcases ?? 0;
  const failed = data?.FailedTestcases ?? 0;
  const reports = data?.Reports ?? [];

  const getReport = (testCaseNo: number): TestReport | undefined => {
    return reports.find((r) => r.testCaseNo === testCaseNo);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          {/* HEADER — always visible */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <TabsList className="bg-zinc-800 h-8">
              <TabsTrigger value="testcases" className="text-xs h-7 px-3">
                Test Cases ({sampleTestCases.length})
              </TabsTrigger>

              <TabsTrigger value="terminal" className="text-xs h-7 px-3 gap-1.5">
              <TerminalIcon className="w-3 h-3" />
              Terminal
              {logs.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 text-xs bg-zinc-700 text-zinc-300"
                >
                  {logs.length}
                </Badge>
              )}
            </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-1">
              {/* Minimize / Maximize the whole panel */}
              <button
                onClick={() => setIsPanelMinimized((prev) => !prev)}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                title={isPanelMinimized ? "Expand panel" : "Collapse panel"}
              >
                {isPanelMinimized ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>


            </div>
          </div>

          {/* PANEL BODY — hidden when minimized */}
          <AnimatePresence initial={false}>
            {!isPanelMinimized && (
              <motion.div
                key="panel-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* TEST CASES TAB */}
                <TabsContent
                  value="testcases"
                  className="h-auto overflow-auto"
                >
                  {/* <ScrollArea className="h-96"> */}
                  <div className="p-4 space-y-3">
                    {sampleTestCases.map((testCase, index) => {
                      const testIndex = index + 1;
                      const report = getReport(testIndex);
                      const isPassed = report?.status === "PASSED";
                      const isFailed = report?.status === "FAILED";

                      return (
                        <motion.div
                          key={testIndex}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`rounded-lg border p-4 space-y-3 ${isPassed
                            ? "border-emerald-800 bg-emerald-950/30"
                            : isFailed
                              ? "border-red-800 bg-red-950/30"
                              : "border-zinc-800 bg-zinc-900/50"
                            }`}
                        >
                          {/* Header */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-zinc-300">
                              Test Case {testIndex}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs h-5 border-zinc-700 text-zinc-400"
                            >
                              {testCase.method}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs h-5 border-zinc-700 text-zinc-400"
                            >
                              {testCase.expectedStatus}
                            </Badge>
                            {isPassed && (
                              <Badge className="text-xs h-5 bg-emerald-900 text-emerald-300 border-emerald-700 gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Passed
                              </Badge>
                            )}
                            {isFailed && (
                              <Badge className="text-xs h-5 bg-red-900 text-red-300 border-red-700 gap-1">
                                <XCircle className="w-3 h-3" />
                                Failed
                              </Badge>
                            )}
                          </div>

                          {/* Body */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">
                                Input
                              </p>
                              <pre className="text-xs bg-zinc-950 rounded p-2 border border-zinc-800 text-zinc-300 overflow-auto max-h-32">
                                {JSON.stringify(testCase.inputJson, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">
                                Expected Output
                              </p>
                              <pre className="text-xs bg-zinc-950 rounded p-2 border border-zinc-800 text-zinc-300 overflow-auto max-h-32">
                                {JSON.stringify(
                                  testCase.expectedOutputJson,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {/* </ScrollArea> */}
                </TabsContent>

                {/* TERMINAL TAB — forceMount keeps logs alive across tab switches */}
                <TabsContent
                value="terminal"
                forceMount
                className={`mt-0 p-4 ${activeTab !== "terminal" ? "hidden" : ""}`}
              >
                  <Terminal
                    logs={logs}
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                  />
              </TabsContent>


              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TestCasesPanel;