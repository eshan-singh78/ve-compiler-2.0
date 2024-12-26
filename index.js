const path = require("path");
const fs = require("fs");
const { executeCpp } = require("./compilers/cppCompiler/cppCompiler");
const { executeJava } = require("./compilers/javaCompiler/javaCompiler");
const { executeJavaScript } = require("./compilers/jsCompiler/jscompiler");
const { executePython } = require("./compilers/pyCompiler/pythonCompiler");
const { executeGo } = require("./compilers/goCompiler/goCompiler");
const { executeLua } = require("./compilers/luaCompiler/luaCompiler");
const { executeRust } = require("./compilers/rsCompiler/rustCompiler");
const { v4: uuid } = require("uuid");
const { executeC } = require("./compilers/cCompiler/cCompiler");

const dirCodes = path.join(__dirname, "codeBase");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const safePath = (filepath) => {
  const normalizedPath = path.normalize(filepath);
  if (!normalizedPath.startsWith(dirCodes)) {
    throw new Error("Invalid file path detected.");
  }
  return normalizedPath;
};

const CompileFile = async (language, code) => {
  const supportedLanguages = ["cpp", "java", "js", "py", "c", "go", "lua", "rs"];

  if (!supportedLanguages.includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  if (typeof code !== "string") {
    throw new Error("Invalid code input: Code must be a string.");
  }

  let jobId;
  let filename;
  let filepath;

  try {
    jobId = uuid();
    switch (language) {
      case "cpp":
        filename = `${jobId}.cpp`;
        break;
      case "java":
        filename = `${jobId}.java`;
        break;
      case "js":
        filename = `${jobId}.js`;
        break;
      case "py":
        filename = `${jobId}.py`;
        break;
      case "c":
        filename = `${jobId}.c`;
        break;
      case "go":
        filename = `${jobId}.go`;
        break;
      case "lua":
        filename = `${jobId}.lua`;
        break;
      case "rs":
        filename = `${jobId}.rs`;
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    filepath = path.join(dirCodes, filename);
    const safeFilepath = safePath(filepath);

    fs.writeFileSync(safeFilepath, code);

    if (language === "cpp") {
      return await executeCpp(safeFilepath);
    } else if (language === "java") {
      const sanitizedJobId = `Class_${jobId.replace(/-/g, '')}`;
      return await executeJava(safeFilepath, sanitizedJobId);
    } else if (language === "js") {
      return await executeJavaScript(safeFilepath);
    } else if (language === "py") {
      return await executePython(safeFilepath);
    } else if (language === "c") {
      return await executeC(safeFilepath);
    } else if (language === "go") {
      return await executeGo(safeFilepath);
    } else if (language === "lua") {
      return await executeLua(safeFilepath);
    } else if (language === "rs") {
      return await executeRust(safeFilepath);
    }
  } catch (error) {
    throw new Error(`Compilation failed: ${error.message}`);
  }
};

module.exports = {
  CompileFile
};
