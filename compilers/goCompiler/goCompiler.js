const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeGo = async (filepath, input = "") => {
  try {
    const codebasePath = path.join(__dirname, "../../codebase");
    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    const jobId = path.basename(filepath).split(".")[0];
    const binaryPath = path.join(codebasePath, jobId);

    await execPromise(`go build -o ${binaryPath} ${filepath}`);

    const executionResult = await runWithInput(binaryPath, input);
    return { stdout: executionResult.stdout, stderr: executionResult.stderr };
  } catch (error) {
    throw new Error(`Go Compilation or Execution Error: ${error.message || error}`);
  }
};

const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr || error.message));
      }
      resolve({ stdout, stderr });
    });
  });

const runWithInput = (binaryPath, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn(binaryPath, [], { stdio: ["pipe", "pipe", "pipe"] });

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
        return reject(new Error(`Process exited with code ${code}, stderr: ${stderr}`));
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

module.exports = {
  executeGo,
};
