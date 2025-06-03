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


    const execGoProcess = () =>
      new Promise((resolve, reject) => {
        const child = spawn(binaryPath);

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

    const { stdout, stderr } = await execGoProcess();

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

module.exports = { executeGo };
