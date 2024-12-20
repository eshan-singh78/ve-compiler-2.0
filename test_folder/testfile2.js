const { CompileFile } = require("../index");
const fs = require("fs");
const path = require("path");

const testCompile = async () => {
  try {
    console.log("Testing C++ Compilation...");
    const cppFilePath = path.join(__dirname, "example.cpp");
    const cppCode = fs.readFileSync(cppFilePath, "utf8");
    const cppResult = await CompileFile("cpp", cppCode);
    console.log("C++ Compilation Output:", cppResult);

    console.log("Testing Java Compilation...");
    const javaFilePath = path.join(__dirname, "example.java");
    const javaCode = fs.readFileSync(javaFilePath, "utf8");
    const javaResult = await CompileFile("java", javaCode);
    console.log("Java Compilation Output:", javaResult);

    console.log("Testing JavaScript Compilation...");
    const jsFilePath = path.join(__dirname, "example.js");
    const jsCode = fs.readFileSync(jsFilePath, "utf8");
    const jsResult = await CompileFile("js", jsCode);
    console.log("JavaScript Compilation Output:", jsResult);

    console.log("Testing Python Compilation...");
    const pythonFilePath = path.join(__dirname, "example.py");
    const pythonCode = fs.readFileSync(pythonFilePath, "utf8");
    const pythonResult = await CompileFile("py", pythonCode);
    console.log("Python Compilation Output:", pythonResult);

    console.log("Testing C Compilation...");
    const cFilePath = path.join(__dirname, "example.c");
    const cCode = fs.readFileSync(cFilePath, "utf8");
    const cResult = await CompileFile("c", cCode);
    console.log("C Compilation Output:", cResult);

  } catch (error) {
    console.error("Error during compilation:", error.message);
  }
};

testCompile();
