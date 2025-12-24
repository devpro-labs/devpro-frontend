"use client"
import { TestCase } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertCircle, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

interface TestCasesPanelProps {
  sampleTestCases: TestCase[];
  onRunTests?: () => void;
  onRunSingleTest?: (index: number) => void;
}

interface TestResult {
  passed: boolean;
  output: any;
  expected: any;
  executionTime?: number;
  error?: string;
}

const TestCasesPanel = ({ sampleTestCases, onRunTests, onRunSingleTest }: TestCasesPanelProps) => {
  const [activeTab, setActiveTab] = useState("testcases");
  const [testResults, setTestResults] = useState<(TestResult | null)[]>(
    Array(sampleTestCases.length).fill(null)
  );
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setActiveTab("output");

    // Simulate running tests (replace with actual test execution)
    setTimeout(() => {
      const results: TestResult[] = sampleTestCases.map((testCase, index) => ({
        passed: Math.random() > 0.3, // Simulate pass/fail
        output: testCase.expectedOutput, // Replace with actual output
        expected: testCase.expectedOutput,
        executionTime: Math.floor(Math.random() * 100) + 10,
      }));
      setTestResults(results);
      setIsRunning(false);

      if (onRunTests) onRunTests();
    }, 1500);
  };

  const handleRunSingleTest = async (index: number) => {
    setIsRunning(true);

    // Simulate running single test
    setTimeout(() => {
      const newResults = [...testResults];
      newResults[index] = {
        passed: Math.random() > 0.3,
        output: sampleTestCases[index].expectedOutput,
        expected: sampleTestCases[index].expectedOutput,
        executionTime: Math.floor(Math.random() * 100) + 10,
      };
      setTestResults(newResults);
      setIsRunning(false);
      setActiveTab("output");

      if (onRunSingleTest) onRunSingleTest(index);
    }, 800);
  };

  const handleReset = () => {
    setTestResults(Array(sampleTestCases.length).fill(null));
  };

  const passedCount = testResults.filter(r => r?.passed).length;
  const failedCount = testResults.filter(r => r && !r.passed).length;
  const totalRun = testResults.filter(r => r !== null).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col bg-background border-t overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
              <TabsList className="bg-transparent">
                <TabsTrigger value="testcases" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Test Cases ({sampleTestCases.length})
                </TabsTrigger>
                <TabsTrigger value="output" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Output
                  {totalRun > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {passedCount}/{totalRun}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {totalRun > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleReset}
                      className="gap-2"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    onClick={handleRunAllTests}
                    disabled={isRunning}
                    className="gap-2"
                  >
                    <Play className="w-3 h-3" />
                    {isRunning ? "Running..." : "Run All"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <TabsContent value="testcases" className="flex-1 mt-0 p-0">
            <ScrollArea className="h-full">
              <motion.div
                className="p-4 space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sampleTestCases.map((testCase, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between p-3 bg-muted/40 border-b">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">Test Case {index + 1}</span>
                        {testResults[index] && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            {testResults[index]!.passed ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunSingleTest(index)}
                          disabled={isRunning}
                          className="gap-2 h-7 text-xs"
                        >
                          <Play className="w-3 h-3" />
                          Run
                        </Button>
                      </motion.div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <div className="w-1 h-4 bg-blue-500 rounded" />
                          Input:
                        </div>
                        <motion.pre
                          className="bg-muted/50 rounded-md p-3 text-xs overflow-x-auto border"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <code>{JSON.stringify(testCase.input, null, 2)}</code>
                        </motion.pre>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <div className="w-1 h-4 bg-green-500 rounded" />
                          Expected Output:
                        </div>
                        <motion.pre
                          className="bg-muted/50 rounded-md p-3 text-xs overflow-x-auto border"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <code>{JSON.stringify(testCase.expectedOutput, null, 2)}</code>
                        </motion.pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="output" className="flex-1 mt-0 p-0">
            <ScrollArea className="h-full">
              <AnimatePresence mode="wait">
                {totalRun === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground p-8"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Clock className="w-16 h-16 mb-4 opacity-30" />
                    </motion.div>
                    <p className="text-sm font-medium">No tests run yet</p>
                    <p className="text-xs mt-1">Click "Run All" or run individual test cases</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                  >
                    {/* Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">Test Results Summary</h3>
                          <p className="text-xs text-muted-foreground">
                            {totalRun} of {sampleTestCases.length} test(s) executed
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
                            <div className="text-xs text-muted-foreground">Passed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                            <div className="text-xs text-muted-foreground">Failed</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Individual Results */}
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        result && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className={`p-3 flex items-center justify-between ${result.passed
                                ? 'bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800'
                              }`}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">Test Case {index + 1}</span>
                                {result.passed ? (
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Passed
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-600 hover:bg-red-700">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Failed
                                  </Badge>
                                )}
                              </div>
                              {result.executionTime && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {result.executionTime}ms
                                </div>
                              )}
                            </div>

                            <div className="p-4 space-y-3 bg-card">
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground mb-2">
                                  Your Output:
                                </div>
                                <pre className={`rounded-md p-3 text-xs overflow-x-auto border ${result.passed
                                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                                  }`}>
                                  <code>{JSON.stringify(result.output, null, 2)}</code>
                                </pre>
                              </div>

                              {!result.passed && (
                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                                    Expected Output:
                                  </div>
                                  <pre className="bg-muted/50 rounded-md p-3 text-xs overflow-x-auto border">
                                    <code>{JSON.stringify(result.expected, null, 2)}</code>
                                  </pre>
                                </div>
                              )}

                              {result.error && (
                                <div>
                                  <div className="text-xs font-semibold text-red-600 mb-2">
                                    Error:
                                  </div>
                                  <pre className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3 text-xs overflow-x-auto text-red-600">
                                    <code>{result.error}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      ))}
                    </div>
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