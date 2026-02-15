'use client';

import { Problem, Submission, TestCase } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, History } from 'lucide-react';
import ProblemDetailsPanel from './problem-details-panel';
import SubmissionsPanel from './submissions-panel';

interface LeftPanelWrapperProps {
  problem: Problem;
  testcases: TestCase[];
  submissions: Submission[];
  isSubmissionsLoading: boolean;
}

export default function LeftPanelWrapper({
  problem,
  testcases,
  submissions,
  isSubmissionsLoading,
}: LeftPanelWrapperProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="problem" className="h-full flex flex-col">
        <div className="border-b border-zinc-800 px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2 h-9">
            <TabsTrigger value="problem" className="flex items-center gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" />
              Problem
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-1.5 text-xs">
              <History className="w-3.5 h-3.5" />
              Submissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="problem" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ProblemDetailsPanel problem={problem} testcases={testcases} />
        </TabsContent>

        <TabsContent value="submissions" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <SubmissionsPanel submissions={submissions} isLoading={isSubmissionsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
