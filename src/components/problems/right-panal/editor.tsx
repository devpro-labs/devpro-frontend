"use client"
import { useState, useEffect, useMemo } from "react"
import type React from "react"

import { FileExplorer, type FileItem } from "./file-explorer"
import { FileTreeManager } from "./file-tree-manager"
import { useAuth } from "@clerk/nextjs"
import { EDITOR_LIBS } from "@/lib/get-snippet"
import { getFileName, getLibOrFramework, getImageName, getFileExtension } from "./helper"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FilePlus, FolderPlus, Minimize2, Maximize2, Play, Send, FileText, X } from "lucide-react"
import Editor from "@monaco-editor/react"
import { runCode } from "../api"
import type { Response } from "@/lib/const/response"
import { useMutation } from "@tanstack/react-query"

interface CodeEditorProps {
  tags?: string[]
  theme?: string
  problemId?: string
  runCodeResponse?: Response | null
  setRunCodeResponse?: (response: Response | null) => void
  isRunning?: boolean
  setIsRunning?: (isRunning: boolean) => void
}

const CodeEditor = ({
  tags = [],
  theme = "vs-dark",
  problemId = "",
  runCodeResponse = null,
  isRunning = false,
  setIsRunning = () => {},
  setRunCodeResponse = () => {},
}: CodeEditorProps) => {
  const [lib, setLib] = useState("")
  const [selectedLan, setSelectedLan] = useState("javascript")
  const [code, setCode] = useState("")
  const [image, setImage] = useState("")
  const [file, setFile] = useState("")
  const [libOrFramework, setLibOrFramework] = useState("")
  const [fileTree, setFileTree] = useState<FileItem[]>([])
  const [fileTreeManager, setFileTreeManager] = useState<FileTreeManager | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [explorerOpen, setExplorerOpen] = useState(true)
  const { getToken } = useAuth()

  const codeRunnerMutation = useMutation({
    mutationKey: ["runCode"],
    mutationFn: async () => {
      setIsRunning(true)
      const token = await getToken({ template: "devpro-jwt" })
      return await runCode(token ?? "", problemId, code, image, file, libOrFramework, fileTreeManager!.getFiles())
    },
    onSuccess(data) {
      console.log("Code run successfully:", data)
      setRunCodeResponse(data)
      setIsRunning(false)
    },
    onError() {
      console.error("Error running code")
      setIsRunning(false)
    },
  })

  const availableLibs = useMemo(() => {
    return EDITOR_LIBS
  }, [tags])

  useEffect(() => {
    const defaultLib = EDITOR_LIBS.find((l) => l.language === "javascript" && l.value.includes("express"))

    if (!defaultLib) return

    setLib(defaultLib.value)
    setSelectedLan(defaultLib.language)
    setCode(defaultLib.snippet)

    const defaultFileName = getFileName(defaultLib.language)
    setFile(defaultFileName)

    setLibOrFramework(getLibOrFramework(defaultLib.language))
    setImage(getImageName(defaultLib.language))

    const manager = new FileTreeManager()
    const mainFile = manager.addFile(defaultFileName)
    mainFile.isMainFile = true
    mainFile.content = defaultLib.snippet
    setFileTree(manager.getFiles())
    setFileTreeManager(manager)
    setSelectedFileId(mainFile.id)
    setOpenTabs([mainFile.id])

    console.log("✅ Default Express JS loaded", {
      lib: defaultLib.value,
      language: defaultLib.language,
      image: getImageName(defaultLib.language),
      file: defaultFileName,
      framework: getLibOrFramework(defaultLib.language),
    })
  }, [])

  const onLibChange = (value: string) => {
    setLib(value)

    const selectedLib = EDITOR_LIBS.find((l) => l.value === value)
    if (!selectedLib) return

    setSelectedLan(selectedLib.language)
    setCode(selectedLib.snippet)

    const newFileName = getFileName(selectedLib.language)
    setFile(newFileName)

    setLibOrFramework(getLibOrFramework(selectedLib.language))
    setImage(getImageName(selectedLib.language))

    const manager = new FileTreeManager()
    const mainFile = manager.addFile(newFileName)
    mainFile.isMainFile = true
    mainFile.content = selectedLib.snippet
    setFileTree(manager.getFiles())
    setFileTreeManager(manager)
    setSelectedFileId(mainFile.id)
    setOpenTabs([mainFile.id])

    console.log("🔁 Library changed:", {
      lib: selectedLib.value,
      language: selectedLib.language,
      image: getImageName(selectedLib.language),
      file: newFileName,
      framework: getLibOrFramework(selectedLib.language),
    })
  }

  const handleRun = () => {
    console.log("Running code:", code, "Language:", selectedLan)
    console.log("Using image:", image, "and file:", file)
    codeRunnerMutation.mutate()
  }

  const handleSubmit = () => {
    console.log("Submitting code:", code, "Language:", selectedLan)
  }

  const handleCreateFile = (name: string, parentId?: string) => {
    if (!fileTreeManager) return
    const ext = getFileExtension(selectedLan)
    const fileName = name.endsWith(ext) ? name : `${name}${ext}`
    fileTreeManager.addFile(fileName, parentId)
    setFileTree([...fileTreeManager.getFiles()])
  }

  const handleCreateFolder = (name: string, parentId?: string) => {
    if (!fileTreeManager) return
    fileTreeManager.addFolder(name, parentId)
    setFileTree([...fileTreeManager.getFiles()])
  }

  const handleDeleteFile = (id: string) => {
    if (!fileTreeManager) return
    const item = fileTreeManager.getFileById(id)
    if (item?.isMainFile) return
    fileTreeManager.deleteItem(id)
    if (selectedFileId === id) {
      setSelectedFileId(null)
      setCode("")
    }
    setFileTree([...fileTreeManager.getFiles()])
  }

  const handleRenameFile = (id: string, newName: string) => {
    if (!fileTreeManager) return
    fileTreeManager.renameItem(id, newName)
    setFileTree([...fileTreeManager.getFiles()])
  }

  const handleSelectFile = (id: string) => {
    if (!fileTreeManager) return
    const item = fileTreeManager.getFileById(id)
    if (item && !item.isFolder) {
      setSelectedFileId(id)
      setCode(item.content)
      if (!openTabs.includes(id)) {
        setOpenTabs([...openTabs, id])
      }
    }
  }

  const handleCloseTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const newTabs = openTabs.filter((tabId) => tabId !== id)
    setOpenTabs(newTabs)

    if (selectedFileId === id && newTabs.length > 0) {
      const newSelectedId = newTabs[newTabs.length - 1]
      const item = fileTreeManager?.getFileById(newSelectedId)
      if (item) {
        setSelectedFileId(newSelectedId)
        setCode(item.content)
      }
    } else if (newTabs.length === 0) {
      setSelectedFileId(null)
      setCode("")
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    if (selectedFileId && fileTreeManager) {
      fileTreeManager.updateFileContent(selectedFileId, newCode)
    }
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <motion.div
        className="flex items-center gap-4 p-4 px-5 border-b border-zinc-800 bg-zinc-950 min-h-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleCreateFile(`file${getFileExtension(selectedLan)}`)}
            variant="ghost"
            size="sm"
            title="Add new file"
            className="hover:bg-zinc-800 transition-colors"
          >
            <FilePlus className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => handleCreateFolder("NewFolder")}
            variant="ghost"
            size="sm"
            title="Add new folder"
            className="hover:bg-zinc-800 transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
          </Button>

          <div className="border-l border-zinc-700 mx-2 h-6" />

          <Button
            onClick={() => setExplorerOpen(!explorerOpen)}
            variant="ghost"
            size="sm"
            title={explorerOpen ? "Hide Explorer" : "Show Explorer"}
            className="hover:bg-zinc-800 transition-colors"
          >
            {explorerOpen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex-1 flex justify-center">
          <Select value={lib} onValueChange={onLibChange}>
            <SelectTrigger className="w-80">
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
        </div>

        <div className="flex items-center gap-2">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              onClick={handleRun}
              variant="outline"
              className="gap-2 bg-transparent border-zinc-700 hover:bg-zinc-800"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button onClick={handleSubmit} className="gap-2 bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
              Submit
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {explorerOpen && (
          <motion.div
            className="border-r border-zinc-800 w-60 overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FileExplorer
              files={fileTree}
              selectedFileId={selectedFileId}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              language={selectedLan}
            />
          </motion.div>
        )}

        <motion.div
          className="flex-1 flex flex-col overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* File Tabs Bar */}
          {openTabs.length > 0 && fileTreeManager && (
            <div className="flex items-center gap-1 px-2 py-2 border-b border-zinc-800 bg-zinc-950 overflow-x-auto">
              {openTabs.map((tabId) => {
                const tabItem = fileTreeManager.getFileById(tabId)
                if (!tabItem) return null
                const isActive = selectedFileId === tabId

                return (
                  <div
                    key={tabId}
                    onClick={() => handleSelectFile(tabId)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all group ${
                      isActive
                        ? "bg-zinc-800 border border-zinc-700 text-gray-100"
                        : "bg-black hover:bg-zinc-900 text-gray-400"
                    }`}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium whitespace-nowrap">{tabItem.name}</span>
                    {!tabItem.isMainFile && (
                      <button
                      title="Close tab"
                        onClick={(e) => handleCloseTab(tabId, e)}
                        className="ml-1 p-0.5 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <Editor
            height="100%"
            theme={theme}
            language={selectedLan}
            value={code}
            onChange={(value) => handleCodeChange(value || "")}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default CodeEditor
