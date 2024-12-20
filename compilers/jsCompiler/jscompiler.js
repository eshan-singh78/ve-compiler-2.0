
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJavaScript = async (filepath) => {
  try {
    const jobId = path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");
    console.log("CodebasePath:", codebasePath);
    const outFilePath = path.join(codebasePath, `${jobId}.out`);
    console.log("OutFilePath:", outFilePath);
    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    fs.copyFileSync(filepath, outFilePath);

    const executionCommand = `node ${outFilePath}`;
    const { stdout, stderr } = await execPromise(executionCommand);
    console.log(stdout);

    return { outFilePath, stdout }; // Return both outFilePath and stdout
  } catch (error) {
    throw new Error(`Execution error: ${error}`);
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = {
  executeJavaScript,
};
