"use client"
import { fetchSampleTestCases } from '@/components/problems/api';
import ProblemDetailsPanel from '@/components/problems/left-panal/problem-details-panel';
import CodeEditor from '@/components/problems/right-panal/editor';
import TestCasesPanel from '@/components/problems/Testcases';
import Loader from '@/components/ui/Loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Response } from '@/lib/const/response';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation'
import { useState } from 'react';

const page = () => {
  const parmas = useParams();
  const {slug} = parmas;
  const {getToken} = useAuth();
  const [runCodeResponse, setRunCodeResponse] = useState<Response | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if(!slug ) return (
    <Loader />
  )

  if(slug && typeof slug !== "string") return (
    <div>Invalid slug</div>
  )

  const problemQuery =  useQuery({
    queryKey: ['problem', slug],
    queryFn: () => {
      return getToken().then((token) => fetchSampleTestCases(token??"", slug));
    }
  })

  const res: Response|undefined = problemQuery.data;
  
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
          <ResizablePanelGroup direction="vertical" className="h-full overflow-hidden ">
            <ResizablePanel>
              <CodeEditor 
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              runCodeResponse={runCodeResponse}
              setRunCodeResponse={setRunCodeResponse}
              problemId={res?.DATA?.problem?.id ?? ""}
              tags={res?.DATA?.problem?.tags ?? []} />
            </ResizablePanel>
            <ResizableHandle />
             <ResizablePanel defaultSize={35} minSize={20}>
              <TestCasesPanel
              isRunning={isRunning}
              runCodeResponse={runCodeResponse}
              sampleTestCases={res?.DATA?.testCases ?? []} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default page