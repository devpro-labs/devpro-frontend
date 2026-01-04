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
    this.nextId = Math.max(...this.files.flatMap((f) => this.getAllItemIds(f)).map((id) => Number.parseInt(id)), 0) + 1
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

  updateFileContent(id: string, content: string): boolean {
    const item = this.findItemById(id)
    if (!item || item.isFolder) return false
    item.content = content
    return true
  }
}
