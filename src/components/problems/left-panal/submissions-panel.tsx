'use client';

import { Submission, SubmissionStatus } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Cpu, HardDrive, Calendar } from 'lucide-react';

interface SubmissionsPanelProps {
  submissions: Submission[];
  isLoading: boolean;
}

const getStatusConfig = (status: SubmissionStatus) => {
  switch (status) {
    case 'ACCEPTED':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle2,
        label: 'Accepted',
      };
    case 'WRONG_ANSWER':
      return {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
        label: 'Wrong Answer',
      };
    case 'TIME_LIMIT_EXCEEDED':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
        label: 'TLE',
      };
    case 'MEMORY_LIMIT_EXCEEDED':
      return {
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: HardDrive,
        label: 'MLE',
      };
    case 'RUNTIME_ERROR':
      return {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: XCircle,
        label: 'Runtime Error',
      };
    case 'COMPILATION_ERROR':
      return {
        color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        icon: XCircle,
        label: 'Compilation Error',
      };
    case 'PENDING':
    case 'RUNNING':
      return {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Clock,
        label: status === 'PENDING' ? 'Pending' : 'Running',
      };
    default:
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: Clock,
        label: status,
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatFramework = (framework: string) => {
  const mapping: Record<string, string> = {
    'js-express': 'Express.js',
    'ts-express': 'Express (TS)',
    'py-fastapi': 'FastAPI',
    'py-flask': 'Flask',
    'go-fiber': 'Fiber',
    'java-spring': 'Spring Boot',
  };
  return mapping[framework] || framework;
};

export default function SubmissionsPanel({ submissions, isLoading }: SubmissionsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <XCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No submissions yet</p>
        <p className="text-sm">Submit your solution to see results here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {submissions.map((submission, index) => {
          const statusConfig = getStatusConfig(submission.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={submission.id}
              className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${statusConfig.color} border`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFramework(submission.framework)}
                </span>
              </div>

              {/* Test Cases */}
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Test Cases:</span>
                  <span className={submission.status === 'ACCEPTED' ? 'text-green-400' : 'text-foreground'}>
                    {submission.testcasesPassed}/{submission.totalTestcases}
                  </span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${submission.status === 'ACCEPTED' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      style={{
                        width: `${(submission.testcasesPassed / submission.totalTestcases) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {submission.executionTimeMs !== null && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{submission.executionTimeMs}ms</span>
                  </div>
                )}
                {submission.memoryUsedMB !== null && (
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    <span>{submission.memoryUsedMB}MB</span>
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(submission.submittedAt)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
