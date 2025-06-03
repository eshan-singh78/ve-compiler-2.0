const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeC = async (filepath, input = "") => {
  try {
    const jobId = path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");
    const outFilePath = path.join(codebasePath, `${jobId}.out`);

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    const compilationCommand = `gcc ${filepath} -o ${outFilePath}`;
    await execPromise(compilationCommand);

    const executionResult = await runWithInput(outFilePath, input);
    return { outFilePath, stdout: executionResult.stdout };
  } catch (error) {
    throw new Error(`C Compilation or Execution Error: ${error.message}`);
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`GCC Error: ${stderr || error.message}`));
      }
      resolve({ stdout, stderr });
    });
  });
};

const runWithInput = (commandPath, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn(commandPath, []);

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
      resolve({ stdout });
    });


    const lines = Array.isArray(input) ? input : [input];
    for (const line of lines) {
      process.stdin.write(line + "\n");
    }

    process.stdin.end();
  });
};

module.exports = {
  executeC,
};
