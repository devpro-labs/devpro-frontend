

const getFileName = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return 'index.py';
    case 'javascript':
      return 'index.js';
    case 'typescript':
      return 'index.ts';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

const getFileExtension = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return '.py';
    case 'javascript':
      return '.js';
    case 'typescript':
      return '.ts';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

const getImageName = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return 'fastapi-py';
    case 'javascript':
      return 'express-js';
    case 'typescript':
      return 'express-ts';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

const getLibOrFramework = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return 'py-fastapi';
    case 'javascript':
      return 'js-express';
    case 'typescript':
      return 'ts-express';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

export { getFileName, getImageName, getLibOrFramework, getFileExtension };