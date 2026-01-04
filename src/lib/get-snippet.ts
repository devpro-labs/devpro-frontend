type EditorLib = {
  value: string
  label: string
  language: string
  snippet: string
}

export const EDITOR_LIBS: EditorLib[] = [
  {
    value: "express-js",
    label: "Express JS - JavaScript",
    language: "javascript",
    snippet: `import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello Express" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
  },
  {
    value: "express-ts",
    label: "Express TS - TypeScript",
    language: "typescript",
    snippet: `import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello Express TS" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
  },
  {
    value: "fastapi",
    label: "FastAPI - Python",
    language: "python",
    snippet: `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}`,
  },
]
