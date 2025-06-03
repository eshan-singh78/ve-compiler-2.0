const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeRust = async (filepath, input = "") => {
  try {
    const jobId = path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    const outFilePath = path.join(codebasePath, `${jobId}`);
    const compilationCommand = `rustc ${filepath} -o ${outFilePath}`;
    await execPromise(compilationCommand);

    const { stdout, stderr } = await runExecutableWithInput(outFilePath, input);
    return { outFilePath, stdout, stderr };
  } catch (error) {
    throw new Error(`Compilation or execution error: ${error}`);
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Compilation failed: ${stderr || error.message}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

const runExecutableWithInput = (executablePath, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn(executablePath, []);

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
        return reject(new Error(`Rust program exited with code ${code}, stderr: ${stderr}`));
      }
      resolve({ stdout, stderr });
    });


    if (input) {
      const lines = Array.isArray(input) ? input : [input];
      for (const line of lines) {
        process.stdin.write(line + "\n");
      }
    }

    process.stdin.end();
  });
};

module.exports = {
  executeRust,
};
