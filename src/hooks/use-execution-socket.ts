"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WS_URL } from "@/lib/const/backend_route";
import backendRoute from "@/lib/const/backend_route";
import { toast } from "sonner";

export interface ExecutionEvent {
  type: "LOG" | "TESTCASE" | "INFO" | "ERROR" | "URL";
  data: any;
}

export interface ExecutionError {
  DATA: null;
  MESSAGE: string;
  STATUS: number;
  ERROR: string;
}

export interface LogEntry {
  timestamp: Date;
  message: string;
}

export interface TestResult {
  TotalTestcases: number;
  PassedTestcases: number;
  FailedTestcases: number;
  Reports: TestReport[];
}

export interface TestReport {
  testCaseNo: number;
  status: "PASSED" | "FAILED";
  error?: string;
  input?: Record<string, any>;
  endpoint?: string;
  method?: string;
  actualBody?: any;
  expectedBody?: any;
  actualStatus?: number;
  expectedStatus?: number;
  executionTimeMs?: number;
}

// Backend response wrapper
interface TestCaseResponse {
  DATA: TestResult;
  MESSAGE: string;
  STATUS: number;
  ERROR?: string;
}

interface UseExecutionSocketReturn {
  logs: LogEntry[];
  testResult: TestResult | null;
  testUrl: string | null;
  isTestUrlLoading: boolean;
  isConnected: boolean;
  isComplete: boolean;
  error: ExecutionError | null;
  connect: (executionId: string) => void;
  disconnect: () => void;
  clearLogs: () => void;
}

export function useExecutionSocket(): UseExecutionSocketReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testUrl, setTestUrl] = useState<string | null>(null);
  const [isTestUrlLoading, setIsTestUrlLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<ExecutionError | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setTestResult(null);
    setTestUrl(null);
    setIsTestUrlLoading(false);
    setIsComplete(false);
    setError(null);
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback((executionId: string) => {
    // Close existing connection if any
    disconnect();

    // Clear previous logs and results
    clearLogs();
    setIsTestUrlLoading(true);

    const wsUrl = `${WS_URL}${backendRoute.ws.execution(executionId)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const executionEvent: ExecutionEvent = JSON.parse(event.data);

        if (executionEvent.type === "LOG") {
          const logMessage = typeof executionEvent.data === "string"
            ? executionEvent.data
            : JSON.stringify(executionEvent.data);

          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date(),
              message: logMessage,
            },
          ]);
        } else if (executionEvent.type === "TESTCASE") {

          // Extract the actual test result from the DATA wrapper
          const response = executionEvent.data as TestCaseResponse;
          const testResultData = response.DATA || executionEvent.data;

          setTestResult(testResultData as TestResult);
          setIsTestUrlLoading(false);
          setIsComplete(true);
        } else if (executionEvent.type === "URL") {
          const urlData = executionEvent.data;
          const liveUrl = typeof urlData === "string"
            ? urlData
            : typeof urlData?.url === "string"
              ? urlData.url
              : typeof urlData?.liveUrl === "string"
                ? urlData.liveUrl
                : null;

          if (liveUrl) {
            setTestUrl(liveUrl.replace("https://", "http://"));
            setIsTestUrlLoading(false);
          }
        } else if (executionEvent.type === "INFO") {
          const infoMessage = typeof executionEvent.data === "string"
            ? executionEvent.data
            : JSON.stringify(executionEvent.data);

          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date(),
              message: `[INFO] ${infoMessage}`,
            },
          ]);
        } else if (executionEvent.type === "ERROR") {
          const errorData = executionEvent.data as ExecutionError;
          setError(errorData);
          setIsTestUrlLoading(false);
          setIsComplete(true);

          // Show toast notification for the error
          toast.error(errorData.MESSAGE || errorData.ERROR || "An error occurred", {
            description: errorData.ERROR !== errorData.MESSAGE ? errorData.ERROR : undefined,
            duration: 3000,
          });
        } else {
        }
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
        console.error("❌ Raw message that failed:", event.data);
        // Treat unparsed messages as raw logs
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            message: event.data,
          },
        ]);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
    };
  }, [disconnect, clearLogs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    logs,
    testResult,
    testUrl,
    isTestUrlLoading,
    isConnected,
    isComplete,
    error,
    connect,
    disconnect,
    clearLogs,
  };
}
