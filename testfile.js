const { CompileFile } = require("./index");

const testCompile = async () => {
  try {
    console.log("Testing C++ Compilation...");
    const cppCode = `#include <iostream>
    int main() {
      std::cout << "Hello from C++" << std::endl;
      return 0;
    }`;
    const cppResult = await CompileFile("cpp", cppCode);
    console.log("C++ Compilation Output:", cppResult);

    console.log("Testing Java Compilation...");
    const javaCode = `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello from Java");
      }
    }`;
    const javaResult = await CompileFile("java", javaCode);
    console.log("Java Compilation Output:", javaResult);

    console.log("Testing JavaScript Compilation...");
    const jsCode = `console.log("Hello from JavaScript");`;
    const jsResult = await CompileFile("js", jsCode);
    console.log("JavaScript Compilation Output:", jsResult);

    console.log("Testing Python Compilation...");
    const pythonCode = `print("Hello from Python")`;
    const pythonResult = await CompileFile("py", pythonCode);
    console.log("Python Compilation Output:", pythonResult);

    console.log("Testing C Compilation...");
    const cCode = `#include <stdio.h>
    int main() {
      printf("Hello from C");
      return 0;
    }`;
    const cResult = await CompileFile("c", cCode);
    console.log("C Compilation Output:", cResult);
    
  } catch (error) {
    console.error("Error during compilation:", error.message);
  }
};

testCompile();
