"use client"

import { FileItem } from "./file-explorer"


export class FileTreeManager {
  private files: FileItem[]
  private nextId = 0

  constructor(initialFiles: FileItem[] = []) {
    this.files = initialFiles
    this.updateIds()
  }

  private updateIds() {
    const allIds = this.files.flatMap((f) => this.getAllItemIds(f))
    const numericIds = allIds
      .map((id) => {
        const match = id.match(/^item-(\d+)$/)
        return match ? parseInt(match[1], 10) : -1
      })
      .filter((n) => n >= 0)
    this.nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 0
  }

  private getAllItemIds(item: FileItem): string[] {
    const ids = [item.id]
    if (item.children) {
      item.children.forEach((child) => {
        ids.push(...this.getAllItemIds(child))
      })
    }
    return ids
  }

  private generateId(): string {
    return `item-${this.nextId++}`
  }

  private findItemById(id: string, items: FileItem[] = this.files): FileItem | null {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = this.findItemById(id, item.children)
        if (found) return found
      }
    }
    return null
  }

  private findParentAndIndex(
    id: string,
    items: FileItem[] = this.files,
  ): { parent: FileItem | null; items: FileItem[]; index: number } | null {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        return { parent: null, items, index: i }
      }
      if (items[i].children) {
        const result = this.findParentAndIndex(id, items[i].children)
        if (result) return result
        if (items[i].id === id) {
          return { parent: items[i], items: items[i].children || [], index: -1 }
        }
      }
    }
    return null
  }

  addFile(name: string, parentId?: string): FileItem {
    const newFile: FileItem = {
      id: this.generateId(),
      name,
      content: "",
      isFolder: false,
      parentId,
    }

    if (parentId) {
      const parent = this.findItemById(parentId)
      if (parent && parent.isFolder) {
        if (!parent.children) parent.children = []
        parent.children.push(newFile)
      }
    } else {
      this.files.push(newFile)
    }

    return newFile
  }

  addFolder(name: string, parentId?: string): FileItem {
    const newFolder: FileItem = {
      id: this.generateId(),
      name,
      content: "",
      isFolder: true,
      children: [],
      parentId,
    }

    if (parentId) {
      const parent = this.findItemById(parentId)
      if (parent && parent.isFolder) {
        if (!parent.children) parent.children = []
        parent.children.push(newFolder)
      }
    } else {
      this.files.push(newFolder)
    }

    return newFolder
  }

  deleteItem(id: string): boolean {
    const result = this.findParentAndIndex(id)
    if (!result) return false

    if (result.parent === null) {
      this.files.splice(result.index, 1)
    } else {
      result.parent.children?.splice(result.index, 1)
    }
    return true
  }

  renameItem(id: string, newName: string): boolean {
    const item = this.findItemById(id)
    if (!item) return false
    item.name = newName
    return true
  }

  getFileById(id: string): FileItem | null {
    return this.findItemById(id)
  }

  getFiles(): FileItem[] {
    return this.files
  }

  // Get only editable files (filter out readonly)
  getEditableFiles(): FileItem[] {
    return this.filterReadOnlyFiles(this.files)
  }

  private filterReadOnlyFiles(files: FileItem[]): FileItem[] {
    return files
      .filter(file => !file.isReadOnly)
      .map(file => ({
        ...file,
        children: file.children ? this.filterReadOnlyFiles(file.children) : undefined
      }))
  }

  // Add a readonly file with sequential ID
  addReadOnlyFile(name: string, content: string, parentId?: string): FileItem {
    const newFile: FileItem = {
      id: this.generateId(),
      name,
      content,
      isFolder: false,
      isReadOnly: true,
      parentId,
    }

    if (parentId) {
      const parent = this.findItemById(parentId)
      if (parent && parent.isFolder) {
        if (!parent.children) parent.children = []
        parent.children.push(newFile)
      }
    } else {
      this.files.push(newFile)
    }

    return newFile
  }

  // Clear and add new readonly files (keeps editable files)
  setReadOnlyFiles(readOnlyData: { name: string; content: string }[]): void {
    // Remove existing readonly files
    this.files = this.filterReadOnlyFiles(this.files)
    // Recalculate nextId based on remaining files to avoid duplicate IDs
    this.updateIds()
    // Add new readonly files with sequential IDs
    readOnlyData.forEach(({ name, content }) => {
      this.addReadOnlyFile(name, content)
    })
  }

  updateFileContent(id: string, content: string): boolean {
    console.log("Updating content for file ID:", id)
    console.log("content:", content)
    const item = this.findItemById(id)
    if (!item || item.isFolder) return false
    item.content = content
    return true
  }
}
