"use client"
import ProblemDetailsPanel from '@/components/problems/left-panal/problem-details-panel';
import CodeEditor from '@/components/problems/right-panal/editor';
import TestCasesPanel from '@/components/problems/Testcases';
import Loader from '@/components/ui/Loader';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useProblem } from '@/data/problem-mapper';
import { useParams } from 'next/navigation'

const page = () => {
  const parmas = useParams();
  const {slug} = parmas;
  if(!slug ) return (
    <Loader />
  )

  if(slug && typeof slug !== "string") return (
    <div>Invalid slug</div>
  )

  const pro = useProblem(slug);
  
  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="max-h-screen h-[calc(100vh-4rem)] overflow-hidden ">
        <ResizablePanel
         className='min-h-screen min-w-50 max-w-180'
        >
          {pro && <ProblemDetailsPanel problem={pro.problem} details={pro.details} />}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" className="h-full overflow-hidden ">
            <ResizablePanel>
              <CodeEditor tags={pro?.problem.tags} />
            </ResizablePanel>
            <ResizableHandle />
             <ResizablePanel defaultSize={35} minSize={20}>
              <TestCasesPanel sampleTestCases={pro?.details?.sampleTestCases ?? []} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default page