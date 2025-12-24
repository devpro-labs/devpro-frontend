"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import HeadingPanal from '../heading'
import Editor from "@monaco-editor/react"
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Send } from 'lucide-react'
import { EDITOR_LIBS } from '@/lib/get-snippet'
import { useMutation } from '@tanstack/react-query'
import { getFileName, getImageName, getLibOrFramework } from './helper'
import { useAuth } from '@clerk/nextjs'
import { runCode } from '../api'
import { Response } from '@/lib/const/response'

interface CodeEditorProps {
  tags?: string[];
  theme?: string;
  problemId?: string;
  runCodeResponse?: Response | null;
  setRunCodeResponse?: (response: Response | null) => void;
  isRunning?: boolean;
  setIsRunning?: (isRunning: boolean) => void;
}

const CodeEditor = ({
  tags = [],
  theme = 'vs-dark',
  problemId = "",
  runCodeResponse = null,
  isRunning = false,
  setIsRunning = () => {},
  setRunCodeResponse = () => {}
}: CodeEditorProps) => {
  const [lib, setLib] = useState("")
  const [selectedLan, setSelectedLan] = useState("javascript")
  const [code, setCode] = useState("")
  const [image, setImage] = useState("")
  const [file, setFile] = useState("")
  const [libOrFramework, setLibOrFramework] = useState("")
  const {getToken} = useAuth();

  const codeRunnerMutation = useMutation({
    mutationKey: ['runCode'],
    mutationFn: async () => {
      setIsRunning(true);
      const token = await getToken({template: "devpro-jwt"});
      return await runCode(
        token ?? "",
        problemId,
        code,
        image,
        file,
        libOrFramework
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      console.log("Code run successfully:", data);
      setRunCodeResponse(data);
      setIsRunning(false);
    },
    onError(error, variables, context) {
      console.error("Error running code:", error);
      setIsRunning(false);
    }
    
  })

  const availableLibs = useMemo(() => {
    if (tags.length === 0) {
      return EDITOR_LIBS;
    }

    const lowerTags = tags.map(t => t.toLowerCase());

    const filtered = EDITOR_LIBS.filter(lib =>
      lib.tags.some(tag => lowerTags.includes(tag.toLowerCase()))
    );

    return filtered.length > 0 ? filtered : EDITOR_LIBS;
  }, [tags]);

  useEffect(() => {
    if (availableLibs.length > 0) {
      const first = availableLibs[0];
      setLib(first.value);
      setSelectedLan(first.language);
      setCode(first.snippet);
    }
  }, [availableLibs]);

  const onLibChange = (value: string) => {
    setLib(value);
    const selectedLib = availableLibs.find(l => l.value === value);
    if (selectedLib) {
      setSelectedLan(selectedLib.language);
      setCode(selectedLib.snippet);
     
      setLibOrFramework(getLibOrFramework(selectedLib.language));
      setFile(getFileName(selectedLib.language));
      setImage(getImageName(selectedLib.language));
    }
  }

  const handleRun = () => {
    console.log("Running code:", code, "Language:", selectedLan);
    const data =  codeRunnerMutation.mutate();
    console.log("Run code response:", data);

  }

  const handleSubmit = () => {
    console.log("Submitting code:", code, "Language:", selectedLan);
    
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex flex-col h-full">

      <motion.div
        className="flex items-center gap-3 p-3 border-b bg-background"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Select value={lib} onValueChange={onLibChange}>
          <SelectTrigger className="w-70">
            <SelectValue placeholder="Select library" />
          </SelectTrigger>

          <SelectContent>
            {availableLibs.map((libOption) => (
              <SelectItem key={libOption.value} value={libOption.value}>
                {libOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={handleRun}
            variant="outline"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
            Submit
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Editor
          height="100%"
          theme={theme}
          language={selectedLan}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </motion.div>
    </div>
  )
}

export default CodeEditor