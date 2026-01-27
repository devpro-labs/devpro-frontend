"use client"
import { fetchSampleTestCases } from '@/components/problems/api';
import ProblemDetailsPanel from '@/components/problems/left-panal/problem-details-panel';
import CodeEditor from '@/components/problems/right-panal/editor';
import TestCasesPanel from '@/components/problems/Testcases';
import Loader from '@/components/ui/Loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Response } from '@/lib/const/response';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation'
import { useState } from 'react';

const page = () => {
  const parmas = useParams();
  const { slug } = parmas;
  const { getToken, userId } = useAuth();
  const [runCodeResponse, setRunCodeResponse] = useState<Response | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!slug) return (
    <Loader />
  )

  if (slug && typeof slug !== "string") return (
    <div>Invalid slug</div>
  )

  const problemQuery = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => {
      return getToken().then((token) => fetchSampleTestCases(token ?? "", slug));
    }
  })

  const res: Response | undefined = problemQuery.data;

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="max-h-screen h-[calc(100vh-4rem)] overflow-hidden ">
        <ResizablePanel
          className='min-h-screen min-w-50 max-w-180'
        >
          {res && <ProblemDetailsPanel problem={res?.DATA?.problem} testcases={res?.DATA.testCases} />}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Tabs defaultValue="code" className="h-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger value="code" className="rounded-none">Code</TabsTrigger>
              <TabsTrigger value="testcases" className="rounded-none">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="flex-1 overflow-hidden">
              <CodeEditor
              userId={userId ?? ""}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                runCodeResponse={runCodeResponse}
                setRunCodeResponse={setRunCodeResponse}
                problemId={res?.DATA?.problem?.id ?? ""}
                tags={res?.DATA?.problem?.tags ?? []} />
            </TabsContent>
            <TabsContent value="testcases" className="flex-1 overflow-hidden">
              <TestCasesPanel
                isRunning={isRunning}
                runCodeResponse={runCodeResponse}
                sampleTestCases={res?.DATA?.testCases ?? []} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default page