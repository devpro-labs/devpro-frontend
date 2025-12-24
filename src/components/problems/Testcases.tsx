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
} from "lucide-react";
import { useState } from "react";
import Loader from "../ui/Loader";

interface TestCasesPanelProps {
  sampleTestCases: TestCase[];
  runCodeResponse?: any;
  isRunning?: boolean;
}

interface TestResult {
  error?: string;
  ActualBody?: any;
  ExpectedBody?: any;
  ActualStatus?: number;
  ExpectedStatus?: number;
  TotalTestcases?: number;
  LastTestCase?: number;
  PassedTestcases?: number;
}

const TestCasesPanel = ({
  sampleTestCases,
  runCodeResponse,
  isRunning,
}: TestCasesPanelProps) => {
  const [activeTab, setActiveTab] = useState("testcases");

  const data: TestResult | null = runCodeResponse?.DATA ?? null;

  const total = data?.TotalTestcases ?? 0;
  const passed = data?.PassedTestcases ?? 0;
  const failed = total - passed;

  if (isRunning) {
    return <Loader />;
  }

  return (
    <ScrollArea className="h-full">
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
            </div>
          </div>

          <TabsContent value="testcases" className="flex-1 p-0 mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {sampleTestCases.map((testCase, index) => {
                  const testIndex = index + 1;

                  const isPassed = data && testIndex <= passed;
                  const isFailed =
                    data && testIndex === data.LastTestCase;

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

                    {/* FAILED DETAILS */}
                    {failed > 0 && (
                      <div className="border rounded-lg overflow-hidden bg-black">
                        <div className="p-3  border-b">
                          <span className="font-semibold text-sm ">
                            Failed at Test Case {data.LastTestCase}
                          </span>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-xs font-semibold  bg-black">
                              Expected Status
                            </div>
                            <pre className="bg-muted/50 p-3 rounded text-xs">
                              {data.ExpectedStatus}
                            </pre>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-muted-foreground">
                              Actual Status
                            </div>
                            <pre className=" p-3 rounded text-xs">
                              {data.ActualStatus}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* RUNTIME ERROR */}
                    {data.error && (
                      <div className="border border-red-200  p-4 rounded">
                        <div className="text-sm font-semibold text-red-600 mb-2">
                          Runtime Error
                        </div>
                        <pre className="text-xs text-red-600">
                          {data.error}
                        </pre>
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
