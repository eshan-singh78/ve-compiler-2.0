const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeLua = async (filepath) => {
  try {
    const jobId = path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");
    console.log("CodebasePath:", codebasePath);

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    const executionCommand = `lua ${filepath}`; 
    const { stdout, stderr } = await execPromise(executionCommand);

    console.log("Lua Output:", stdout);
    return { stdout, stderr }; 
  } catch (error) {
    throw new Error(`Execution error: ${error}`);
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Execution Error:", error);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = {
  executeLua,
};