

const getFileName = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return 'main.py';
    case 'javascript':
      return 'server.js';
    case 'typescript':
      return 'server.ts';
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
      return 'runner-python-fastapi';
    case 'javascript':
      return 'express-js-core';
    case 'typescript':
      return 'runner-typescript-express';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

const getLibOrFramework = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return 'fastapi';
    case 'javascript':
      return 'express';
    case 'typescript':
      return 'express';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

export { getFileName, getImageName, getLibOrFramework, getFileExtension };