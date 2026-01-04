"use client"
import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface FileItem {
  id: string
  name: string
  content: string
  isFolder: boolean
  isMainFile?: boolean
  children?: FileItem[]
  parentId?: string
}

interface FileExplorerProps {
  files: FileItem[]
  selectedFileId: string | null
  onSelectFile: (id: string) => void
  onCreateFile: (name: string, parentId?: string) => void
  onCreateFolder: (name: string, parentId?: string) => void
  onDeleteFile: (id: string) => void
  onRenameFile: (id: string, newName: string) => void
  language: string
}

export function FileExplorer({
  files,
  selectedFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
  language,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [creatingIn, setCreatingIn] = useState<string | null>(null)
  const [createMode, setCreateMode] = useState<"file" | "folder" | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFolders(newExpanded)
  }

  const handleRename = (id: string, currentName: string) => {
    setRenamingId(id)
    setRenameValue(currentName)
  }

  const confirmRename = (id: string) => {
    if (renameValue.trim() && renameValue !== "") {
      onRenameFile(id, renameValue)
      setRenamingId(null)
      setRenameValue("")
    }
  }

  const handleCreateItem = () => {
    if (newItemName.trim()) {
      if (createMode === "file") {
        onCreateFile(newItemName, creatingIn)
      } else if (createMode === "folder") {
        onCreateFolder(newItemName, creatingIn)
      }
      setNewItemName("")
      setCreateMode(null)
      setCreatingIn(null)
    }
  }

  const renderFileItem = (item: FileItem, depth: number) => {
    const isExpanded = expandedFolders.has(item.id)
    const isSelected = selectedFileId === item.id

    return (
      <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        {/* File/Folder Row */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-all text-sm group",
            isSelected ? "bg-blue-600/40 text-blue-100" : "hover:bg-white/10 text-gray-300",
            !item.isFolder && "text-gray-400",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* Folder Expand Arrow */}
          {item.isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(item.id)
              }}
              className="p-0.5 hover:bg-white/20 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}

          {/* Icon */}
          <div className="flex-shrink-0">
            {item.isFolder ? (
              <Folder className="w-4 h-4 text-yellow-500" />
            ) : (
              <FileText className="w-4 h-4 text-blue-400" />
            )}
          </div>

          {/* Rename Input or Name */}
          {renamingId === item.id ? (
            <Input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmRename(item.id)
                if (e.key === "Escape") setRenamingId(null)
              }}
              className="h-6 px-2 py-1 text-xs flex-1 bg-zinc-800 border-zinc-700 text-white"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate" onClick={() => !item.isFolder && onSelectFile(item.id)}>
              {item.name}
            </span>
          )}

          {/* Action Buttons */}
          {renamingId === item.id ? (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  confirmRename(item.id)
                }}
                className="p-1 hover:bg-green-600/40 rounded transition-colors"
              >
                <Check className="w-3 h-3 text-green-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setRenamingId(null)
                }}
                className="p-1 hover:bg-red-600/40 rounded transition-colors"
              >
                <X className="w-3 h-3 text-red-400" />
              </button>
            </div>
          ) : (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.isFolder && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCreatingIn(item.id)
                      setCreateMode("file")
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="New file"
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCreatingIn(item.id)
                      setCreateMode("folder")
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="New folder"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                </>
              )}
              {!item.isMainFile && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRename(item.id, item.name)
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteFile(item.id)
                    }}
                    className="p-1 hover:bg-red-600/40 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Create New Item Input */}
        {creatingIn === item.id && createMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 px-2 py-1"
            style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
          >
            <div className="flex-shrink-0">
              {createMode === "folder" ? (
                <Folder className="w-4 h-4 text-yellow-500" />
              ) : (
                <FileText className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <Input
              autoFocus
              placeholder={createMode === "folder" ? "Folder name" : "File name"}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateItem()
                if (e.key === "Escape") {
                  setCreateMode(null)
                  setCreatingIn(null)
                  setNewItemName("")
                }
              }}
              className="h-6 px-2 py-1 text-xs flex-1 bg-zinc-800 border-zinc-700 text-white"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => handleCreateItem()} className="p-1 hover:bg-green-600/40 rounded transition-colors">
              <Check className="w-3 h-3 text-green-400" />
            </button>
            <button
              onClick={() => {
                setCreateMode(null)
                setCreatingIn(null)
                setNewItemName("")
              }}
              className="p-1 hover:bg-red-600/40 rounded transition-colors"
            >
              <X className="w-3 h-3 text-red-400" />
            </button>
          </motion.div>
        )}

        {/* Render Children */}
        {item.isFolder && isExpanded && item.children && (
          <div>{item.children.map((child) => renderFileItem(child, depth + 1))}</div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-black text-gray-100 font-mono">
      {/* Header */}
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-zinc-800 transition-colors"
            onClick={() => {
              setCreatingIn(null)
              setCreateMode("file")
            }}
            title="New file"
          >
            <FilePlus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-zinc-800 transition-colors"
            onClick={() => {
              setCreatingIn(null)
              setCreateMode("folder")
            }}
            title="New folder"
          >
            <FolderPlus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Root Create Input */}
      {creatingIn === null && createMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1 px-2 py-1 border-b border-zinc-800"
        >
          <div className="flex-shrink-0">
            {createMode === "folder" ? (
              <Folder className="w-4 h-4 text-yellow-500" />
            ) : (
              <FileText className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <Input
            autoFocus
            placeholder={createMode === "folder" ? "Folder name" : "File name"}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateItem()
              if (e.key === "Escape") {
                setCreateMode(null)
                setNewItemName("")
              }
            }}
            className="h-6 px-2 py-1 text-xs flex-1 bg-zinc-800 border-zinc-700 text-white"
          />
          <button onClick={() => handleCreateItem()} className="p-1 hover:bg-green-600/40 rounded transition-colors">
            <Check className="w-3 h-3 text-green-400" />
          </button>
          <button
            onClick={() => {
              setCreateMode(null)
              setNewItemName("")
            }}
            className="p-1 hover:bg-red-600/40 rounded transition-colors"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </motion.div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">{files.map((file) => renderFileItem(file, 0))}</div>
    </div>
  )
}
