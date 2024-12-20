const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJava = async (filepath, jobId) => {
  try {
    const codebasePath = path.join(__dirname, "../../codebase");
    const outFilePath = path.join(codebasePath, `${jobId}.out`);
    console.log("CodebasePath:", codebasePath);
    console.log("OutFilePath:", outFilePath);

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    let code = fs.readFileSync(filepath, "utf8");

    if (code.includes("public class")) {
      code = code.replace(/public class /, `class ${jobId}`);
      fs.writeFileSync(filepath, code);
    }

    const compilationCommand = `javac ${filepath}`;
    await execPromise(compilationCommand);

    const executionCommand = `java -cp ${codebasePath} ${jobId}`;
    const { stdout, stderr } = await execPromise(executionCommand);
    console.log(stdout);

    return { outFilePath, stdout };
  } catch (error) {
    console.error("Error during compilation:", error);
    throw error;
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, error);
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
