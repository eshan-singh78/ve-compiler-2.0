const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJava = async (filepath, jobId) => {
  try {
    const codebasePath = path.join(__dirname, "../../codebase");
    const outFilePath = path.join(codebasePath, `${jobId}.out`);

    if (!fs.existsSync(codebasePath)) {
      fs.mkdirSync(codebasePath, { recursive: true });
    }

    let code = fs.readFileSync(filepath, "utf8");

    const classNameMatch = code.match(/class\s+(\w+)/);

    let className = jobId.replace(/-/g, '');

    if (/^\d/.test(className)) {
      className = "Class_" + className;
    }

    if (classNameMatch) {
      code = code.replace(new RegExp(`class\\s+${classNameMatch[1]}`), `class ${className}`);
    } else {
      code = `public class ${className} {\n` + code.substring(code.indexOf("{"));
    }

    const newFilePath = path.join(codebasePath, `${jobId}.java`);
    fs.writeFileSync(newFilePath, code);
    filepath = newFilePath;

    const compilationCommand = `javac ${filepath}`;
    await execPromise(compilationCommand);

    const executionCommand = `java -cp ${codebasePath} ${className}`;
    const { stdout, stderr } = await execPromise(executionCommand);

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
