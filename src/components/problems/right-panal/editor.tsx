"use client"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import type React from "react"

import { FileExplorer, type FileItem } from "./file-explorer"
import { FileTreeManager } from "./file-tree-manager"
import { useAuth } from "@clerk/nextjs"
import { EDITOR_LIBS } from "@/lib/get-snippet"
import { getFileName, getLibOrFramework, getImageName, getFileExtension } from "./helper"
import { getReadOnlyFilesForFramework } from "@/lib/genrateFiles"
import { useProblemSafe } from "@/components/problems/Problem-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FilePlus, FolderPlus, Minimize2, Maximize2, Play, Send, FileText, X, Lock } from "lucide-react"
import Editor from "@monaco-editor/react"
import { runCode, submitCode } from "../api"
import type { Response } from "@/lib/const/response"
import { useMutation } from "@tanstack/react-query"
import Loader from "@/components/ui/Loader"
import { useCodeDraftStore } from "@/store/use-code-draft-store"

interface CodeEditorProps {
  tags?: string[]
  theme?: string
  problemId?: string
  runCodeResponse?: Response | null
  setRunCodeResponse?: (response: Response | null) => void
  isRunning?: boolean
  setIsRunning?: (isRunning: boolean) => void
  userId?: string
  onExecutionStart?: (executionId: string) => void
}

const CodeEditor = ({
  tags = [],
  theme = "vs-dark",
  problemId = "",
  runCodeResponse = null,
  isRunning = false,
  setIsRunning = () => { },
  setRunCodeResponse = () => { },
  userId = "", onExecutionStart, }: CodeEditorProps) => {

  //conditional states for saving code editor data
  const MAX_CODE_LEN = 100 //100 characters
  const LAST_TIME = 15 //15 sec

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
  const [isCurrentFileReadOnly, setIsCurrentFileReadOnly] = useState(false)
  const { getToken } = useAuth()
  const { services, keys } = useProblemSafe()

  // Ref to track current selected file ID (avoids stale closure issues)
  const selectedFileIdRef = useRef<string | null>(null)
  // Ref to skip onChange during programmatic code changes
  const isSettingCodeRef = useRef(false)

  // Zustand store for code drafts
  const { saveDraft, getDraft } = useCodeDraftStore()
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasLoadedDraft = useRef(false)
  const loadedDraftKeyRef = useRef<string | null>(null)

  const codeRunnerMutation = useMutation({
    mutationKey: ["runCode"],
    mutationFn: async () => {
      setIsRunning(true)
      const token = await getToken({ template: "devpro" })
      return await runCode(token ?? "", problemId, code, image, file, libOrFramework, fileTreeManager!.getFiles())
    },
    onSuccess(data) {
      setRunCodeResponse(data)

      // If response contains executionId, connect to WebSocket
      if (data?.DATA?.executionId && onExecutionStart) {
        onExecutionStart(data.DATA.executionId)
      } else {
        // No executionId means we got direct result, stop running
        setIsRunning(false)
      }
    },
    onError() {
      setIsRunning(false)
    },
  })

  const codeSubmitMutation = useMutation({
    mutationKey: ["runCode"],
    mutationFn: async () => {
      setIsRunning(true)
      const token = await getToken({ template: "devpro" })
      return await submitCode(token ?? "", problemId, code, image, file, libOrFramework, fileTreeManager!.getFiles())
    },
    onSuccess(data) {
      setRunCodeResponse(data)

      // If response contains executionId, connect to WebSocket
      if (data?.DATA?.executionId && onExecutionStart) {
        onExecutionStart(data.DATA.executionId)
      } else {
        // No executionId means we got direct result, stop running
        setIsRunning(false)
      }
    },
    onError() {
      console.error("Error running code")
      setIsRunning(false)
    },
  })

  const availableLibs = useMemo(() => {
    return EDITOR_LIBS
  }, [tags])

  // Helper to get current readonly file data based on current lib/services/keys
  const getReadOnlyFileData = useCallback((framework: string) => {
    return getReadOnlyFilesForFramework(
      framework as "express-js" | "express-ts" | "fastapi",
      services,
      keys
    )
  }, [services, keys])

  const getRuntimeEntryFileName = useCallback((language: string, framework: string) => {
    const baseFileName = getFileName(language)
    const image = getImageName(language)
    if (image === "express-js" || image === "express-ts" || image === "fastapi-py") {
      return `src/${baseFileName}`
    }
    return baseFileName
  }, [])

  const createInitialFileTree = useCallback((language: string, snippet: string, framework: string) => {
    const manager = new FileTreeManager()
    const mainFileName = getFileName(language)

    const shouldUseSrcFolder = framework === "express-js" || framework === "express-ts" || framework === "fastapi"

    let mainFile: FileItem
    if (shouldUseSrcFolder) {
      const srcFolder = manager.addFolder("src")
      srcFolder.isMainFile = true
      mainFile = manager.addFile(mainFileName, srcFolder.id)
    } else {
      mainFile = manager.addFile(mainFileName)
    }

    mainFile.isMainFile = true
    mainFile.content = snippet

    const readOnlyData = getReadOnlyFileData(framework)
    manager.setReadOnlyFiles(readOnlyData)

    return { manager, mainFile }
  }, [getReadOnlyFileData])

  useEffect(() => {
    const defaultLib = EDITOR_LIBS.find((l) => l.language === "javascript" && l.value.includes("express"))

    if (!defaultLib) return

    setLib(defaultLib.value)
    setSelectedLan(defaultLib.language)
    setCode(defaultLib.snippet)

    const defaultFileName = getRuntimeEntryFileName(defaultLib.language, defaultLib.value)
    setFile(defaultFileName)

    setLibOrFramework(getLibOrFramework(defaultLib.language))
    setImage(getImageName(defaultLib.language))

    const { manager, mainFile } = createInitialFileTree(
      defaultLib.language,
      defaultLib.snippet,
      defaultLib.value
    )

    setFileTree(manager.getFiles())
    setFileTreeManager(manager)
    setSelectedFileId(mainFile.id)
    selectedFileIdRef.current = mainFile.id
    setOpenTabs([mainFile.id])
  }, [createInitialFileTree, getRuntimeEntryFileName])

  // Regenerate readonly files when services/keys change (after problem data loads)
  useEffect(() => {
    if (!fileTreeManager || !lib) return
    // Only regenerate if we have meaningful data
    if (services.length === 0 && Object.keys(keys).length === 0) return

    const currentLib = EDITOR_LIBS.find((l) => l.value === lib)
    if (!currentLib) return

    const readOnlyData = getReadOnlyFileData(currentLib.value)

    // Update readonly files in manager (keeps editable files, replaces readonly)
    fileTreeManager.setReadOnlyFiles(readOnlyData)
    console.log("Services or keys changed, updated readonly files:", fileTreeManager.getFiles())
    setFileTree(fileTreeManager.getFiles())
  }, [services, keys, lib, fileTreeManager, getReadOnlyFileData])

  const onLibChange = (value: string) => {
    setLib(value)

    const selectedLib = EDITOR_LIBS.find((l) => l.value === value)
    if (!selectedLib) return

    setSelectedLan(selectedLib.language)
    isSettingCodeRef.current = true
    setCode(selectedLib.snippet)

    const newFileName = getRuntimeEntryFileName(selectedLib.language, selectedLib.value)
    setFile(newFileName)

    setLibOrFramework(getLibOrFramework(selectedLib.language))
    setImage(getImageName(selectedLib.language))

    const { manager, mainFile } = createInitialFileTree(
      selectedLib.language,
      selectedLib.snippet,
      selectedLib.value
    )

    setFileTree(manager.getFiles())
    setFileTreeManager(manager)
    setSelectedFileId(mainFile.id)
    selectedFileIdRef.current = mainFile.id
    setOpenTabs([mainFile.id])
    setTimeout(() => {
      isSettingCodeRef.current = false
    }, 0)
  }

  const handleRun = () => {

    codeRunnerMutation.mutate()
  }

  const handleSubmit = () => {
    codeSubmitMutation.mutate()
  }

  const handleCreateFile = (name: string, parentId?: string) => {
    if (!fileTreeManager) return
    const ext = getFileExtension(selectedLan)
    const fileName = name.endsWith(ext) ? name : `${name}${ext}`
    fileTreeManager.addFile(fileName, parentId)
    setFileTree(fileTreeManager.getFiles())
  }

  const handleCreateFolder = (name: string, parentId?: string) => {
    if (!fileTreeManager) return
    fileTreeManager.addFolder(name, parentId)
    setFileTree(fileTreeManager.getFiles())
  }

  const handleDeleteFile = (id: string) => {
    if (!fileTreeManager) return
    const item = fileTreeManager.getFileById(id)
    if (item?.isMainFile || item?.isReadOnly) return
    fileTreeManager.deleteItem(id)
    if (selectedFileIdRef.current === id) {
      setSelectedFileId(null)
      selectedFileIdRef.current = null
      setCode("")
    }
    setFileTree(fileTreeManager.getFiles())
  }

  const handleRenameFile = (id: string, newName: string) => {
    if (!fileTreeManager) return
    const item = fileTreeManager.getFileById(id)
    if (item?.isMainFile || item?.isReadOnly) return
    fileTreeManager.renameItem(id, newName)
    setFileTree(fileTreeManager.getFiles())
  }

  const handleSelectFile = (id: string) => {
    // Save current file content before switching (only if not readonly)
    console.log("Selecting file with ID:", id)
    console.log("Current selected file ID:", selectedFileIdRef.current, "isCurrentFileReadOnly:", isCurrentFileReadOnly)
    const item = fileTreeManager?.getFileById(id)
    if (selectedFileIdRef.current && fileTreeManager && !isCurrentFileReadOnly) {
      console.log("Saving content of file ID:", selectedFileIdRef.current)
      fileTreeManager.updateFileContent(selectedFileIdRef.current, code)
    }


    // // All files (including readonly) are in fileTreeManager now
    if (!fileTreeManager) return
    if (item && !item.isFolder) {
      console.log("File item found:", item)
      // Mark that we're programmatically setting code
      isSettingCodeRef.current = true
      setSelectedFileId(id)
      selectedFileIdRef.current = id
      setCode(item.content)
      setIsCurrentFileReadOnly(!!item.isReadOnly)
      // Reset flag after state updates
      setTimeout(() => {
        isSettingCodeRef.current = false
      }, 0)
      if (!openTabs.includes(id)) {
        setOpenTabs([...openTabs, id])
      }
    }
  }

  const handleCloseTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const newTabs = openTabs.filter((tabId) => tabId !== id)
    setOpenTabs(newTabs)

    if (selectedFileIdRef.current === id && newTabs.length > 0) {
      // Save current file content before switching (only if not readonly)
      if (fileTreeManager && !isCurrentFileReadOnly && selectedFileIdRef.current) {
        fileTreeManager.updateFileContent(selectedFileIdRef.current, code)
      }

      const newSelectedId = newTabs[newTabs.length - 1]
      // All files (including readonly) are in fileTreeManager now
      const item = fileTreeManager?.getFileById(newSelectedId)
      if (item) {
        isSettingCodeRef.current = true
        setSelectedFileId(newSelectedId)
        selectedFileIdRef.current = newSelectedId
        setCode(item.content)
        setIsCurrentFileReadOnly(!!item.isReadOnly)
        setTimeout(() => {
          isSettingCodeRef.current = false
        }, 0)
      }
    } else if (newTabs.length === 0) {
      setSelectedFileId(null)
      selectedFileIdRef.current = null
      setCode("")
      setIsCurrentFileReadOnly(false)
    }
  }

  const handleCodeChange = (id: string, newCode: string) => {
    // Skip if we're programmatically setting code (during file switch)
    if (isSettingCodeRef.current) return
    // Don't update readonly files
    if (isCurrentFileReadOnly) return

    const item = fileTreeManager?.getFileById(id)
    if (!item) return

    if (item.isReadOnly) {
      console.warn("Attempted to change content of readonly file:", item.name)
      return
    }

    setCode(newCode)
    if (fileTreeManager) {
      fileTreeManager.updateFileContent(id, newCode)
    }
  }

  // Auto-save to zustand store with debounce
  const saveToStore = useCallback(() => {
    if (!fileTreeManager || !problemId || !libOrFramework) return

    // Find the last selected editable file ID (not readonly)
    const editableSelectedId = !isCurrentFileReadOnly
      ? selectedFileId
      : openTabs.find((tabId) => {
        const item = fileTreeManager.getFileById(tabId)
        return item ? !item.isReadOnly : false
      }) || null

    const editableOpenTabs = openTabs.filter((tabId) => {
      const item = fileTreeManager.getFileById(tabId)
      return item ? !item.isReadOnly : false
    })

    saveDraft(problemId, libOrFramework, {
      fileTree: fileTreeManager.getEditableFiles(), // Only save editable files
      selectedFileId: editableSelectedId,
      openTabs: editableOpenTabs,
      code: "", // Don't save code separately - it's in fileTree
    })
  }, [fileTreeManager, problemId, libOrFramework, selectedFileId, openTabs, isCurrentFileReadOnly, saveDraft])

  useEffect(() => {
    // Don't save until initial load is complete
    if (!hasLoadedDraft.current) return
    if (!problemId || !libOrFramework) return

    // Debounce save - wait 1 second after last change
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToStore()
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [code, openTabs, selectedFileId, problemId, libOrFramework, saveToStore])

  // Load saved draft when framework changes
  useEffect(() => {
    if (!problemId || !libOrFramework || !fileTreeManager) return

    const draftKey = `${problemId}:${libOrFramework}`
    if (loadedDraftKeyRef.current === draftKey) return

    const draft = getDraft(problemId, libOrFramework)
    if (draft && draft.fileTree.length > 0) {
      const restoreTreeRecursively = (
        manager: FileTreeManager,
        items: FileItem[],
        parentId?: string
      ) => {
        items.forEach((item) => {
          if (item.isFolder) {
            const folder = manager.addFolder(item.name, parentId)
            folder.id = item.id
            folder.isMainFile = item.isMainFile
            folder.isReadOnly = item.isReadOnly
            if (item.children && item.children.length > 0) {
              restoreTreeRecursively(manager, item.children, folder.id)
            }
            return
          }

          const file = manager.addFile(item.name, parentId)
          file.id = item.id
          file.content = item.content
          file.isMainFile = item.isMainFile
          file.isReadOnly = item.isReadOnly
        })
      }

      // Restore from saved draft
      const manager = new FileTreeManager()
      restoreTreeRecursively(manager, draft.fileTree)

      // Add readonly files when restoring draft
      const currentLib = EDITOR_LIBS.find((l) => getLibOrFramework(l.language) === libOrFramework)
      if (currentLib) {
        const readOnlyData = getReadOnlyFileData(currentLib.value)
        console.log("Restoring draft, adding readonly files:", readOnlyData)
        manager.setReadOnlyFiles(readOnlyData)
      }

      setFileTreeManager(manager)
      setFileTree(manager.getFiles())
      const validOpenTabs = draft.openTabs.filter((tabId) => !!manager.getFileById(tabId))
      const validSelectedFileId = draft.selectedFileId && manager.getFileById(draft.selectedFileId)
        ? draft.selectedFileId
        : validOpenTabs[0] ?? null

      setSelectedFileId(validSelectedFileId)
      selectedFileIdRef.current = validSelectedFileId
      setOpenTabs(validOpenTabs)
      // Load code from the selected file content, not from draft.code
      if (validSelectedFileId) {
        const selectedFile = manager.getFileById(validSelectedFileId)
        console.log("Selected file from draft:", selectedFile)
        if (selectedFile) {
          isSettingCodeRef.current = true
          setCode(selectedFile.content)
          setIsCurrentFileReadOnly(!!selectedFile.isReadOnly)
          setTimeout(() => {
            isSettingCodeRef.current = false
          }, 0)
        }
      }
    } else {
      const editableTree = fileTreeManager.getEditableFiles()

      const getFirstEditableFileId = (items: FileItem[]): string | null => {
        for (const item of items) {
          if (item.isFolder && item.children?.length) {
            const nestedId = getFirstEditableFileId(item.children)
            if (nestedId) return nestedId
          }

          if (!item.isFolder) {
            return item.id
          }
        }

        return null
      }

      const fallbackSelectedFileId = getFirstEditableFileId(editableTree)

      saveDraft(problemId, libOrFramework, {
        fileTree: editableTree,
        selectedFileId: fallbackSelectedFileId,
        openTabs: fallbackSelectedFileId ? [fallbackSelectedFileId] : [],
        code: "",
      })
    }

    loadedDraftKeyRef.current = draftKey
    hasLoadedDraft.current = true
  }, [problemId, libOrFramework, fileTreeManager, getDraft, getReadOnlyFileData, saveDraft])

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }



  return (
    <div className="flex flex-col h-full bg-black">
      {isRunning && (
        <Loader />
      )}
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
          {openTabs.length > 0 && (
            <div className="flex items-center gap-1 px-2 h-10 min-h-10 border-b border-zinc-800 bg-zinc-950 overflow-x-auto">
              {openTabs.map((tabId) => {
                // All files (including readonly) are in fileTreeManager
                const tabItem = fileTreeManager?.getFileById(tabId)
                if (!tabItem) return null
                const isActive = selectedFileId === tabId

                return (
                  <div
                    key={tabId}
                    onClick={() => handleSelectFile(tabId)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all group ${isActive
                      ? "bg-zinc-800 border border-zinc-700 text-gray-100"
                      : "bg-black hover:bg-zinc-900 text-gray-400"
                      }`}
                  >
                    <FileText className={`w-4 h-4 shrink-0 ${tabItem.isReadOnly ? "text-gray-500" : ""}`} />
                    <span className="text-sm font-medium whitespace-nowrap">{tabItem.name}</span>
                    {tabItem.isReadOnly && <Lock className="w-3 h-3 text-gray-500" />}
                    {!tabItem.isMainFile && !tabItem.isReadOnly && (
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
            onChange={(value) => !isCurrentFileReadOnly && handleCodeChange(selectedFileId ?? "", value ?? "")}
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
              readOnly: isCurrentFileReadOnly,
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default CodeEditor
