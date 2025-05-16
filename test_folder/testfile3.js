const { CompileFile } = require("../index");

const testCompile = async () => {
  try {
    console.log("Testing C++ Compilation without input...");
    const cppCode = `#include <iostream>
int main() {
  std::cout << "Hello from C++" << std::endl;
  return 0;
}`;
    const cppResult = await CompileFile("cpp", cppCode);
    console.log("C++ Output:", cppResult);

    console.log("Testing C++ Compilation with input...");
    const cppCodeWithInput = `#include <iostream>
#include <string>
int main() {
  std::string input;
  std::getline(std::cin, input);
  std::cout << "Received: " << input << std::endl;
  return 0;
}`;
    const cppResultWithInput = await CompileFile("cpp", cppCodeWithInput, "Test Input");
    console.log("C++ Output with Input:", cppResultWithInput);

    console.log("Testing Java Compilation without input...");
    const javaCode = `public class World {
  public static void main(String[] args) {
    System.out.println("Hello from Java");
  }
}`;
    const javaResult = await CompileFile("java", javaCode);
    console.log("Java Output:", javaResult);

    console.log("Testing Java Compilation with input...");
    const javaCodeWithInput = `import java.util.Scanner;

public class YourClassName {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    try {
      String input = sc.nextLine();  // no hasNextLine()
      System.out.println("Received: " + input);
    } catch (Exception e) {
      System.out.println("No input received");
    } finally {
      sc.close();
    }
  }
}

`;
    const javaResultWithInput = await CompileFile("java", javaCodeWithInput, "Hello Java Input");
    console.log("Java Output with Input:", javaResultWithInput);

    console.log("Testing JavaScript Compilation without input...");
    const jsCode = `console.log("Hello from JavaScript");`;
    const jsResult = await CompileFile("js", jsCode);
    console.log("JavaScript Output:", jsResult);

    // JavaScript input example (reading from stdin)
    console.log("Testing JavaScript Compilation with input...");
    const jsCodeWithInput = `
      process.stdin.on('data', function(data) {
        console.log("Received:", data.toString().trim());
      });
    `;
    const jsResultWithInput = await CompileFile("js", jsCodeWithInput, "JS input test");
    console.log("JavaScript Output with Input:", jsResultWithInput);

    console.log("Testing Python Compilation without input...");
    const pythonCode = `print("Hello from Python")`;
    const pythonResult = await CompileFile("py", pythonCode);
    console.log("Python Output:", pythonResult);

    console.log("Testing Python Compilation with input...");
    const pythonCodeWithInput = `
input_str = input()
print("Received:", input_str)
`;
    const pythonResultWithInput = await CompileFile("py", pythonCodeWithInput, "Python input test");
    console.log("Python Output with Input:", pythonResultWithInput);

    console.log("Testing C Compilation without input...");
    const cCode = `#include <stdio.h>
int main() {
  printf("Hello from C");
  return 0;
}`;
    const cResult = await CompileFile("c", cCode);
    console.log("C Output:", cResult);

    console.log("Testing C Compilation with input...");
    const cCodeWithInput = `#include <stdio.h>
int main() {
  char input[100];
  fgets(input, sizeof(input), stdin);
  printf("Received: %s", input);
  return 0;
}`;
    const cResultWithInput = await CompileFile("c", cCodeWithInput, "C input test\n");
    console.log("C Output with Input:", cResultWithInput);

    console.log("Testing Rust Compilation without input...");
    const rustCode = `fn main() {
  println!("Hello from Rust");
}`;
    const rustResult = await CompileFile("rs", rustCode);
    console.log("Rust Output:", rustResult);

    console.log("Testing Rust Compilation with input...");
    const rustCodeWithInput = `use std::io::{self, BufRead};
fn main() {
    let stdin = io::stdin();
    let line = stdin.lock().lines().next().unwrap().unwrap();
    println!("Received: {}", line);
}`;
    const rustResultWithInput = await CompileFile("rs", rustCodeWithInput, "Rust input test");
    console.log("Rust Output with Input:", rustResultWithInput);

    console.log("Testing Lua Compilation without input...");
    const luaCode = `print("Hello from Lua")`;
    const luaResult = await CompileFile("lua", luaCode);
    console.log("Lua Output:", luaResult);

    console.log("Testing Lua Compilation with input...");
    const luaCodeWithInput = `
local input = io.read()
print("Received: " .. input)
`;
    const luaResultWithInput = await CompileFile("lua", luaCodeWithInput, "Lua input test");
    console.log("Lua Output with Input:", luaResultWithInput);

    console.log("Testing Go Compilation without input...");
    const goCode = `package main
import "fmt"
func main() {
    fmt.Println("Hello from Go")
}`;
    const goResult = await CompileFile("go", goCode);
    console.log("Go Output:", goResult);

console.log("Testing Go Compilation with input...");
const goCodeWithInput = `package main

import (
  "bufio"
  "fmt"
  "os"
)

func main() {
  fmt.Print("Enter input: ")
  reader := bufio.NewReader(os.Stdin)
  input, _ := reader.ReadString('\\n')
  fmt.Printf("Received: %s", input)
}`;

const goResultWithInput = await CompileFile("go", goCodeWithInput, "Go input test\n");
console.log("Go Output with Input:", goResultWithInput);


  } catch (error) {
    console.error("Error during compilation:", error.message);
  }
};

testCompile();
