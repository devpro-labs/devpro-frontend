type EditorLib = {
  value: string
  label: string
  language: string
  tags: string[] // used for filtering
  snippet: string
}

export const EDITOR_LIBS: EditorLib[] = [
  {
    value: "express-js",
    label: "Express JS - JavaScript",
    language: "javascript",
    tags: ["express"],
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
    tags: ["express"],
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
    tags: ["fastapi", "python"],
    snippet: `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}`,
  },
  {
    value: "springboot",
    label: "Spring Boot - Java",
    language: "java",
    tags: ["spring", "java", "spring boot", "springboot"],
    snippet: `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/")
    public String hello() {
        return "Hello Spring Boot";
    }
}
`,
  },
]
