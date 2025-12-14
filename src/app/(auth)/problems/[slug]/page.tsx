"use client"
import CodeEditor from '@/components/problems/right-panal/editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useParams } from 'next/navigation'

const page = () => {
  const parmas = useParams();
  const {slug} = parmas;
  
  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="max-h-screen h-[calc(100vh-4rem)] overflow-hidden ">
        <ResizablePanel
         className='min-h-screen min-w-50 max-w-180'
        >
          Left panel content - problem details for slug: {slug}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" className="h-full overflow-hidden ">
            <ResizablePanel>
              <CodeEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              Bottom right panel content - test cases / output
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default page