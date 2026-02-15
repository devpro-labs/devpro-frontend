"use client"
import { fetchSampleTestCases, fetchSubmissions } from '@/components/problems/api';
import LeftPanelWrapper from '@/components/problems/left-panal/left-panel-wrapper';
import CodeEditor from '@/components/problems/right-panal/editor';
import TestCasesPanel from '@/components/problems/Testcases';
import Loader from '@/components/ui/Loader';
import { Response } from '@/lib/const/response';
import { Submission } from '@/lib/types';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useExecutionSocket } from '@/hooks/use-execution-socket';

import { useParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react';

const page = () => {
  const parmas = useParams();
  const { slug } = parmas;
  const { getToken, userId } = useAuth();
  const [runCodeResponse, setRunCodeResponse] = useState<Response | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // WebSocket hook for execution events
  const {
    logs,
    testResult,
    isConnected,
    isComplete,
    connect: connectWebSocket,
    clearLogs,
  } = useExecutionSocket();

  // Handle execution start - connect to WebSocket and open terminal
  const handleExecutionStart = useCallback((executionId: string) => {
    console.log("📡 Connecting to execution WebSocket:", executionId);
    setIsConnecting(true);
    setTerminalOpen(true);
    connectWebSocket(executionId);
  }, [connectWebSocket]);

  // Reset connecting state when connected
  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false);
    }
  }, [isConnected]);

  // Stop running when execution is complete
  useEffect(() => {
    if (isComplete) {
      setIsRunning(false);
    }
  }, [isComplete]);

  if (!slug) return (
    <div>Slug is required</div>
  )

  if (slug && typeof slug !== "string") return (
    <div>Invalid slug</div>
  )

  const problemQuery = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => {
      setIsLoading(true);
      const data =  getToken().then((token) => fetchSampleTestCases(token ?? "", slug));
      setIsLoading(false);
      return data;
    }
  })

  const res: Response | undefined = problemQuery.data;
  const problemId = res?.DATA?.problem?.id;

  const submissionsQuery = useQuery({
    queryKey: ['submissions', problemId],
    queryFn: async () => {
      setIsLoading(true);
      const token = await getToken();
      const data = fetchSubmissions(token ?? "", problemId ?? "");
      setIsLoading(false);
      return data;
    },
    enabled: !!problemId,
  });

  const submissions: Submission[] = submissionsQuery.data ?? [];

  return (
    <div className="flex h-[calc(100vh)] overflow-hidden">
      {/* Left Panel - 35% width */}
      <div className="w-[35%] min-w-75 h-full overflow-hidden border-r border-zinc-800">
        {res && (
          <LeftPanelWrapper
            problem={res?.DATA?.problem}
            testcases={res?.DATA.testCases}
            submissions={submissions}
            isSubmissionsLoading={submissionsQuery.isLoading}
          />
        )}
      </div>

      {/* Right Panel - 65% width */}
      <div className="w-[65%] h-full flex flex-col overflow-hidden">
        {/* Code Editor - 60% or 100% if terminal closed */}
        <div className={
          !terminalOpen
            ? "h-full"
            : isPanelMinimized
              ? "h-[calc(100%-3rem)]"
              : "h-[60%]"
        }>
          <CodeEditor
            userId={userId ?? ""}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            runCodeResponse={runCodeResponse}
            setRunCodeResponse={setRunCodeResponse}
            problemId={res?.DATA?.problem?.id ?? ""}
            tags={res?.DATA?.problem?.tags ?? []}
            onExecutionStart={handleExecutionStart}
          />
        </div>

        {/* Terminal/TestCases Panel - Fixed 40% height */}
        {/* Terminal/TestCases Panel */}
        {terminalOpen && (
          <div className={`border-t border-zinc-800 shrink-0 ${isPanelMinimized ? "h-12" : "h-[40%]"}`}>
            <TestCasesPanel
              isRunning={isRunning}
              isConnecting={isConnecting}
              runCodeResponse={runCodeResponse}
              sampleTestCases={res?.DATA?.testCases ?? []}
              logs={logs}
              isConnected={isConnected}
              testResult={testResult}
              onClose={() => setTerminalOpen(false)}
              isPanelMinimized={isPanelMinimized}
              setIsPanelMinimized={setIsPanelMinimized}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default page