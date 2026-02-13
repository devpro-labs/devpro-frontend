"use client"
import { Problem, ProblemDetail, TestCase } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";

interface ProblemDetailsProps {
  problem: Problem;
  testcases: TestCase[];
}

const ProblemDetailsPanel = ({ problem, testcases }: ProblemDetailsProps) => {

  if (problem === undefined) {
    return <div>No problem data available.</div>;
  }

  if (testcases === undefined) {
    return <div>No test case data available.</div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTechColor = (tech: string) => {
    switch (tech) {
      case "Express.js":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "FastAPI":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      case "Spring Boot":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15
      }
    }
  };

  const testCaseVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    })
  };

  return (
    <ScrollArea className="h-full">
      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <motion.h1
            className="text-2xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {problem.title}
          </motion.h1>

          <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
            <motion.div variants={badgeVariants}>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </motion.div>
            {/* <motion.div variants={badgeVariants}>
              <Badge className={getTechColor(problem.tech)}>
                {problem.tech}
              </Badge>
            </motion.div> */}
            <motion.div variants={badgeVariants}>
              <Badge variant="outline">{problem.category}</Badge>
            </motion.div>
          </motion.div>

          {problem.tags && problem.tags.length > 0 && (
            <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
              {problem.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  variants={badgeVariants}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Tabs for Description and Examples */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-4">
              {/* Problem Statement */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-semibold">Problem Statement</h2>
                <motion.div
                  className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {problem.description}
                </motion.div>
              </motion.div>

              {/* Detailed Explanation */}
              {/* {problem.detailedExplanation && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-lg font-semibold">Detailed Explanation</h2>
                  <motion.div
                    className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {details.detailedExplanation}
                  </motion.div>
                </motion.div>
              )} */}
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 mt-4">
              {/* Sample Test Cases */}
              {testcases.map((testCase, index) => (
                <motion.div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 bg-muted/30"
                  custom={index}
                  variants={testCaseVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Example {index + 1}
                    </span>

                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {testCase.method}
                      </Badge>
                      <Badge variant="outline">
                        {testCase.expectedStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Endpoint */}
                  <div className="text-xs">
                    <span className="text-muted-foreground font-semibold">
                      Endpoint:
                    </span>
                    <code className="ml-2 bg-background border px-2 py-1 rounded">
                      {testCase.endpoint}
                    </code>
                  </div>

                  {/* Input */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Input JSON
                    </div>
                    <pre className="bg-background border rounded p-3 text-xs overflow-x-auto">
                      <code>{JSON.stringify(testCase.inputJson, null, 2)}</code>
                    </pre>
                  </div>

                  {/* Expected Output */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Expected Output
                    </div>
                    <pre className="bg-background border rounded p-3 text-xs overflow-x-auto">
                      <code>{JSON.stringify(testCase.expectedOutputJson, null, 2)}</code>
                    </pre>
                  </div>
                </motion.div>
              ))}


              {/* Hidden Test Cases Info
              {testcases && testcases.length > 0 && (
                <motion.div
                  className="border rounded-lg p-4 bg-muted/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="text-sm text-muted-foreground">
                    💡 <span className="font-semibold">Note:</span> There are {testcases.length} additional hidden test case(s) that will be used to evaluate your solution.
                  </div>
                </motion.div>
              )} */}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </ScrollArea>
  );
};

export default ProblemDetailsPanel;