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
  AlertCircle,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Loader from "../ui/Loader";
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
}: TestCasesPanelProps) => {
  const [activeTab, setActiveTab] = useState("testcases");

  // Use WebSocket test result if available, otherwise fall back to runCodeResponse
  const data: TestResult | null = wsTestResult ?? runCodeResponse?.DATA ?? null;

  // Switch to terminal tab when running starts
  useEffect(() => {
    if (isRunning) {
      setActiveTab("terminal");
    }
  }, [isRunning]);

  // Switch to output tab when test results arrive
  useEffect(() => {
    if (data && !isRunning) {
      setActiveTab("output");
    }
  }, [data, isRunning]);

  const total = data?.TotalTestcases ?? 0;
  const passed = data?.PassedTestcases ?? 0;
  const failed = data?.FailedTestcases ?? 0;
  const reports = data?.Reports ?? [];

  // Get report for a specific test case
  const getReport = (testCaseNo: number): TestReport | undefined => {
    return reports.find((r) => r.testCaseNo === testCaseNo);
  };

  return (
    <ScrollArea className="h-full relative">
      {/* Loader overlay */}
      {/* {isRunning && <Loader />} */}

      <div className="h-full flex flex-col bg-background border-t">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          {/* HEADER */}
          <div className="border-b">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
              <TabsList className="bg-transparent">
                <TabsTrigger value="testcases" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Test Cases ({sampleTestCases.length})
                </TabsTrigger>

                <TabsTrigger value="terminal" className="gap-2">
                  <TerminalIcon className="w-4 h-4" />
                  Terminal
                  {logs.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {logs.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger value="output" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Output
                  {data && (
                    <Badge variant="secondary" className="ml-1">
                      {passed}/{total}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <TabsContent value="testcases" className="flex-1 p-0 mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {sampleTestCases.map((testCase, index) => {
                  const testIndex = index + 1;
                  const report = getReport(testIndex);
                  const isPassed = report?.status === "PASSED";
                  const isFailed = report?.status === "FAILED";

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg bg-card overflow-hidden"
                    >
                      {/* HEADER */}
                      <div className="flex items-center justify-between p-3 bg-muted/40 border-b">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">
                            Test Case {testIndex}
                          </span>

                          <Badge variant="secondary">
                            {testCase.method}
                          </Badge>

                          <Badge variant="outline">
                            {testCase.expectedStatus}
                          </Badge>

                          {isPassed && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Passed
                            </Badge>
                          )}

                          {isFailed && (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-4 space-y-3">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2">
                            Input
                          </div>
                          <pre className="bg-muted/50 rounded-md p-3 text-xs border">
                            {JSON.stringify(
                              testCase.inputJson,
                              null,
                              2
                            )}
                          </pre>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2">
                            Expected Output
                          </div>
                          <pre className="bg-muted/50 rounded-md p-3 text-xs border">
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
            </ScrollArea>
          </TabsContent>

          <TabsContent value="terminal" className="flex-1 p-0 mt-0">
            <Terminal logs={logs} isConnected={isConnected} isConnecting={isConnecting} className="h-full rounded-none border-0" />
          </TabsContent>

          <TabsContent value="output" className="flex-1 p-0 mt-0">
            <ScrollArea className="h-full">
              <AnimatePresence mode="wait">
                {/* EMPTY */}
                {!data && !isRunning && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground p-8"
                  >
                    <AlertCircle className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-sm font-medium">
                      No tests run yet
                    </p>
                    <p className="text-xs mt-1">
                      Submit your code to see results
                    </p>
                  </motion.div>
                )}

                {/* RESULT */}
                {data && !isRunning && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 space-y-4"
                  >
                    {/* SUMMARY */}
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <h3 className="font-semibold text-sm mb-2">
                        Execution Summary
                      </h3>
                      <div className="flex gap-6">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {passed}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Passed
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">
                            {failed}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Failed
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TEST CASE DETAILS */}
                    {reports.length > 0 && (
                      <div className="space-y-3">
                        {reports.map((report) => (
                          <div
                            key={report.testCaseNo}
                            className={`border rounded-lg overflow-hidden ${report.status === "PASSED"
                              ? "border-green-500/30 bg-green-500/5"
                              : "border-red-500/30 bg-red-500/5"
                              }`}
                          >
                            <div className="p-3 border-b flex items-center gap-2">
                              {report.status === "PASSED" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-semibold text-sm">
                                Test Case {report.testCaseNo}
                              </span>
                              <Badge
                                className={`ml-auto ${report.status === "PASSED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {report.status}
                              </Badge>
                            </div>

                            {report.status === "FAILED" && report.error && (
                              <div className="p-4">
                                <div className="text-xs font-semibold text-red-600 mb-2">
                                  Error
                                </div>
                                <pre className="bg-red-500/10 p-3 rounded text-xs text-red-600">
                                  {report.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TestCasesPanel;
