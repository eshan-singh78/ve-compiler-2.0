const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJava = async (filepath) => {
  try {
    const jobId = "Main"; //path.basename(filepath).split(".")[0];
    const codebasePath = path.join(__dirname, "../../codebase");
    console.log("CodebasePath:", codebasePath);
    const outFilePath = path.join(codebasePath, `${jobId}`);
    console.log("OutFilePath:", outFilePath);
    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    const compilationCommand = `javac ${filepath} `;

    await execPromise(compilationCommand);

    const executionCommand = `java -cp ${codebasePath} ${jobId}`;
    const { stdout, stderr } = await execPromise(executionCommand);
    console.log(stdout);

    return { outFilePath, stdout }; // Return stdout along with outFilePath
  } catch (error) {
    console.log("Error", error);
    throw error; // Re-throw error to handle it in the caller
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
  executeJava,
};
