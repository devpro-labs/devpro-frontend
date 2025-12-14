
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import HeadingPanal from '../heading'
import Editor from "@monaco-editor/react"
import { useState } from 'react'
const CodeEditor = (
  {
    language = 'javascript',
    theme = 'vs-dark',
  }: {
    language?: string,
    theme?: string,
  }
) => {
  const [lib, setlib] = useState("express-js")
  const [selectedLan, setselectedLan] = useState(language)
  const onLibChange = (str:string) => {
    setlib(str);
    switch (str) {
      case "express-js":
        setselectedLan("javascript");
        break;
      case "express-ts":
        setselectedLan("typescript");
         break;
      case "fastapi":
        setselectedLan("python");
         break;
      case "springboot":
        setselectedLan("java");
        break;
    }
  }
  return (
    <div>
      <HeadingPanal title="Code Editor" />
      <Select value={lib} onValueChange={(value) => onLibChange(value)} >
        <SelectTrigger className="w-full">
          <SelectValue  placeholder="lib" />
        </SelectTrigger>

        <SelectContent defaultValue={"express-js"}>
          <SelectItem value="express-js">Express js - javascript</SelectItem>
          <SelectItem value="express-ts">Express ts - typescript</SelectItem>
          <SelectItem value="fastapi">FastAPI - python</SelectItem>
          <SelectItem value="springboot">Spring Boot - java</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Editor
          height="70vh"
          defaultLanguage={language}
          theme={theme}
          language={selectedLan}
          defaultValue="// Write your code here"
        />
      </div>

    </div>
  )
}

export default CodeEditor