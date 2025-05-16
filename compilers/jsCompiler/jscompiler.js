const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJavaScript = async (filepath, input = "") => {
  try {
    const jobId = path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");
    const outFilePath = path.join(codebasePath, `${jobId}.out.js`);

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    fs.copyFileSync(filepath, outFilePath);

    const { stdout, stderr } = await runJSWithInput(outFilePath, input);
    return { outFilePath, stdout, stderr };
  } catch (error) {
    throw new Error(`Execution error: ${error}`);
  }
};

const runJSWithInput = (filepath, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn("node", [filepath]);

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

    if (input) {
      process.stdin.write(input);
    }

    process.stdin.end();
  });
};

module.exports = {
  executeJavaScript,
};
