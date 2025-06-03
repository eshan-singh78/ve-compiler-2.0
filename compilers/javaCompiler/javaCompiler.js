const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJava = async (filepath, jobId, input = "") => {
  try {
    const codebasePath = path.join(__dirname, "../../codebase");
    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    let code = fs.readFileSync(filepath, "utf8");


    let className = jobId.replace(/-/g, "");
    if (/^\d/.test(className)) {
      className = "Class_" + className;
    }


    const classRegex = /public\s+class\s+(\w+)/;
    const match = code.match(classRegex);
    if (!match) {
      throw new Error("Java code must contain a public class.");
    }

    code = code.replace(classRegex, `public class ${className}`);
    const newFilePath = path.join(codebasePath, `${className}.java`);
    fs.writeFileSync(newFilePath, code);


    await execPromise(`javac ${newFilePath}`);


    const result = await runWithInput(codebasePath, className, input);
    return { stdout: result.stdout, stderr: result.stderr };

  } catch (error) {
    throw new Error(`Java Compilation or Execution Error: ${error.message}`);
  }
};

const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr || error.message));
      resolve({ stdout, stderr });
    });
  });

const runWithInput = (codebasePath, className, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn("java", ["-cp", codebasePath, className], {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("error", reject);

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Java program exited with code ${code}, stderr: ${stderr}`));
      }
      resolve({ stdout, stderr });
    });

    const lines = Array.isArray(input) ? input : [input];
    for (const line of lines) {
      process.stdin.write(line + "\n");
    }
    process.stdin.end();
  });
};

module.exports = { executeJava };
