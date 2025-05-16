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

    if (match) {
      // Replace existing class name with the safe one
      code = code.replace(classRegex, `public class ${className}`);
    } else {
      throw new Error("Java code must contain a public class.");
    }

    const newFilePath = path.join(codebasePath, `${className}.java`);
    fs.writeFileSync(newFilePath, code);

    await execPromise(`javac ${newFilePath}`);

    const execJavaProcess = () =>
      new Promise((resolve, reject) => {
        const child = spawn("java", ["-cp", codebasePath, className]);

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("error", (err) => {
          reject(err);
        });

        child.on("close", (code) => {
          if (code !== 0) {
            reject(new Error(`Process exited with code ${code}, stderr: ${stderr}`));
          } else {
            resolve({ stdout, stderr });
          }
        });

        if (input) {
          child.stdin.write(input.endsWith("\n") ? input : input + "\n");
        }
        child.stdin.end();
      });

    const { stdout, stderr } = await execJavaProcess();
    return { stdout, stderr };

  } catch (error) {
    throw new Error(`Compilation or execution error: ${error.message || error}`);
  }
};

const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });

module.exports = { executeJava };
