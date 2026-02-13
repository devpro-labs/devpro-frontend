"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WS_URL } from "@/lib/const/backend_route";
import backendRoute from "@/lib/const/backend_route";

export interface ExecutionEvent {
  type: "LOG" | "TESTCASE" | "INFO";
  data: any;
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
  isConnected: boolean;
  isComplete: boolean;
  connect: (executionId: string) => void;
  disconnect: () => void;
  clearLogs: () => void;
}

export function useExecutionSocket(): UseExecutionSocketReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setTestResult(null);
    setIsComplete(false);
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

    const wsUrl = `${WS_URL}${backendRoute.ws.execution(executionId)}`;
    console.log("🔌 Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("📨 Raw WebSocket data received:", event.data);
      console.log("📨 Raw data type:", typeof event.data);

      try {
        const executionEvent: ExecutionEvent = JSON.parse(event.data);
        console.log("📩 Parsed event object:", executionEvent);
        console.log("📩 Event type:", executionEvent.type);
        console.log("📩 Event data:", executionEvent.data);
        console.log("📩 Event data type:", typeof executionEvent.data);

        if (executionEvent.type === "LOG") {
          console.log("📝 LOG event received");
          const logMessage = typeof executionEvent.data === "string"
            ? executionEvent.data
            : JSON.stringify(executionEvent.data);
          console.log("📝 Log message:", logMessage);

          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date(),
              message: logMessage,
            },
          ]);
        } else if (executionEvent.type === "TESTCASE") {
          console.log("🧪 TESTCASE event received");
          console.log("🧪 Test result data:", JSON.stringify(executionEvent.data, null, 2));

          // Extract the actual test result from the DATA wrapper
          const response = executionEvent.data as TestCaseResponse;
          const testResultData = response.DATA || executionEvent.data;

          console.log("🧪 Extracted test result:", testResultData);
          setTestResult(testResultData as TestResult);
          setIsComplete(true);
        } else if (executionEvent.type === "INFO") {
          console.log("ℹ️ INFO event received:", executionEvent.data);
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
        } else {
          console.log("⚠️ Unknown event type:", executionEvent.type);
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
      console.log("🔌 WebSocket closed:", event.code, event.reason);
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
    isConnected,
    isComplete,
    connect,
    disconnect,
    clearLogs,
  };
}
