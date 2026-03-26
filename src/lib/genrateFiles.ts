const OPTIONAL_DEPENDENCIES: Record<string, string> = {
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.2.1",
  "pg": "^8.18.0",
  "redis": "^5.10.0"
};

export const getExpressJsPackageJson = ({
  services
}: {
  services: string[]
}) => {

  const dependencies: Record<string, string> = {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "express": "^5.2.1",
  };

  if (services.includes("AUTH")) {
    dependencies["jsonwebtoken"] = OPTIONAL_DEPENDENCIES["jsonwebtoken"];
  }
  if (services.includes("MONGODB")) {
    dependencies["mongoose"] = OPTIONAL_DEPENDENCIES["mongoose"];
  }
  if (services.includes("POSTGRES")) {
    dependencies["pg"] = OPTIONAL_DEPENDENCIES["pg"];
  }
  if (services.includes("REDIS")) {
    dependencies["redis"] = OPTIONAL_DEPENDENCIES["redis"];
  }

  return {
    name: "devpro-express-runtime",
    version: "1.0.0",
    type: "module",
    private: true,
    dependencies
  };
};

export const getExpressTsPackageJson = ({
  services
}: {
  services: string[]
}) => {
  const dependencies: Record<string, string> = {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "express": "^5.2.1",
  };

  if (services.includes("AUTH")) {
    dependencies["jsonwebtoken"] = OPTIONAL_DEPENDENCIES["jsonwebtoken"];
  }
  if (services.includes("MONGODB")) {
    dependencies["mongoose"] = OPTIONAL_DEPENDENCIES["mongoose"];
  }
  if (services.includes("POSTGRES")) {
    dependencies["pg"] = OPTIONAL_DEPENDENCIES["pg"];
  }
  if (services.includes("REDIS")) {
    dependencies["redis"] = OPTIONAL_DEPENDENCIES["redis"];
  }

  return {
    name: "devpro-express-runtime",
    version: "1.0.0",
    type: "module",
    private: true,
    dependencies,
    "devDependencies": {
      "@types/express": "^5.0.6",
      "@types/node": "^20.11.30",
      "typescript": "^5.4.0",
      "ts-node": "^10.9.2"
    },
  };
}

export const getExpressJsTsConfig = () => {
  return {
    "compilerOptions": {
      "target": "ES2022",
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "rootDir": "./src",
      "outDir": "./dist",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true
    },
    "include": ["src"]
  }
};

export const getRequirementsTxt = ({
  services
}: {
  services: string[]
}) => {
  const req = ["fastapi",
    "uvicorn",
    "python-dotenv"
  ];

  if (services.includes("AUTH")) {
    req.push("python-jose[cryptography]");
  }

  if (services.includes("MONGODB")) {
    req.push("motor");
  }

  if (services.includes("POSTGRES")) {
    req.push("asyncpg");
    req.push("psycopg2-binary");
    req.push("SQLAlchemy");
  }

  if (services.includes("REDIS")) {
    req.push("redis");
  }

  return req;
}

export const getEnvFile = ({
  keys
}: {
  keys: Record<string, string | number>;
}) => {
  const warningNote = "# ⚠️ When u run or submit code env is auto-inject so use env variables of .env.example";

  const envLines = Object.entries(keys)
    .map(([name, value]) => `${name}=${value}`)
    .join("\n");

  return `${warningNote}\n${envLines}`;
}

// ReadOnly file data (without ID - ID is assigned by FileTreeManager)
export interface ReadOnlyFileData {
  name: string;
  content: string;
}

// Legacy type for backward compatibility
export interface ReadOnlyFile {
  id: string;
  name: string;
  content: string;
  isFolder: boolean;
  isReadOnly: boolean;
  children?: ReadOnlyFile[];
}

// Generate readonly files based on framework
export const getReadOnlyFilesForFramework = (
  framework: "express-js" | "express-ts" | "fastapi",
  services: string[] = [],
  keys: Record<string, string | number> = {}
): ReadOnlyFileData[] => {
  console.log("Generating readonly files for framework:", framework, "with services:", services);
  switch (framework) {
    case "express-js":
      return getExpressJsReadOnlyFiles(services, keys);
    case "express-ts":
      return getExpressTsReadOnlyFiles(services, keys);
    case "fastapi":
      return getFastApiReadOnlyFiles(services, keys);
    default:
      return [];
  }
};

const getExpressJsReadOnlyFiles = (services: string[], keys: Record<string, string | number>): ReadOnlyFileData[] => {
  const packageJson = getExpressJsPackageJson({ services });
  const envContent = getEnvFile({ keys });

  return [
    {
      name: "package.json",
      content: JSON.stringify(packageJson, null, 2),
    },
    {
      name: ".env.example",
      content: envContent,
    },
  ];
};

const getExpressTsReadOnlyFiles = (services: string[], keys: Record<string, string | number>): ReadOnlyFileData[] => {
  const packageJson = getExpressTsPackageJson({ services });
  const tsConfig = getExpressJsTsConfig();
  const envContent = getEnvFile({ keys });

  return [
    {
      name: "package.json",
      content: JSON.stringify(packageJson, null, 2),
    },
    {
      name: "tsconfig.json",
      content: JSON.stringify(tsConfig, null, 2),
    },
    {
      name: ".env.example",
      content: envContent,
    },
  ];
};

const getFastApiReadOnlyFiles = (services: string[], keys: Record<string, string | number>): ReadOnlyFileData[] => {
  const requirements = getRequirementsTxt({ services });
  const envContent = getEnvFile({ keys });

  return [
    {
      name: "requirements.txt",
      content: requirements.join("\n"),
    },
    {
      name: ".env.example",
      content: envContent,
    },
  ];
}; 