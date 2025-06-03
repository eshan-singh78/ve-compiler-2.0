const { CompileFile } = require("../index");

const testInputs = ["abc", "def", "ghi", "racecar", "python"];

const runTests = async () => {
  try {
    // ---------------- Python ----------------
    console.log("\n🔹 Testing Python...");
    const pyCode = `
def solve(input):
    return input[::-1]

inputs = [input().strip() for _ in range(5)]
for line in inputs:
    print(solve(line))
    `.trim();
    console.log("✅ Python Output:\n", (await CompileFile("py", pyCode, testInputs)).stdout.trim());

    // ---------------- JavaScript ----------------
    console.log("\n🔹 Testing JavaScript...");
    const jsCode = `
function solve(input) {
  return input.split("").reverse().join("");
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
let lines = [];

rl.on("line", function (line) {
  lines.push(line.trim());
  if (lines.length === 5) {
    lines.forEach(input => console.log(solve(input)));
    rl.close();
  }
});
    `.trim();
    console.log("✅ JS Output:\n", (await CompileFile("js", jsCode, testInputs)).stdout.trim());

    // ---------------- C ----------------
    console.log("\n🔹 Testing C...");
    const cCode = `
#include <stdio.h>
#include <string.h>

char* solve(char* input) {
    static char reversed[1001];
    int len = strlen(input);
    for (int i = 0; i < len; i++) {
        reversed[i] = input[len - i - 1];
    }
    reversed[len] = '\\0';
    return reversed;
}

int main() {
    char input[1001];
    for (int i = 0; i < 5; i++) {
        fgets(input, sizeof(input), stdin);
        input[strcspn(input, "\\n")] = 0;
        printf("%s\\n", solve(input));
    }
    return 0;
}
    `.trim();
    console.log("✅ C Output:\n", (await CompileFile("c", cCode, testInputs)).stdout.trim());

    // ---------------- C++ ----------------
    console.log("\n🔹 Testing C++...");
    const cppCode = `
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

string solve(string input) {
    reverse(input.begin(), input.end());
    return input;
}

int main() {
    string input;
    for (int i = 0; i < 5; ++i) {
        getline(cin, input);
        cout << solve(input) << endl;
    }
    return 0;
}
    `.trim();
    console.log("✅ C++ Output:\n", (await CompileFile("cpp", cppCode, testInputs)).stdout.trim());

    // ---------------- Java ----------------
    console.log("\n🔹 Testing Java...");
    const javaCode = `
import java.util.*;

public class YourClassName {
    public static String solve(String input) {
        return new StringBuilder(input).reverse().toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < 5; i++) {
            String input = sc.nextLine().trim();
            System.out.println(solve(input));
        }
    }
}
    `.trim();
    console.log("✅ Java Output:\n", (await CompileFile("java", javaCode, testInputs)).stdout.trim());

    // ---------------- Go ----------------
    console.log("\n🔹 Testing Go...");
    const goCode = `
package main

import (
  "bufio"
  "fmt"
  "os"
)

func solve(input string) string {
  runes := []rune(input)
  for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
    runes[i], runes[j] = runes[j], runes[i]
  }
  return string(runes)
}

func main() {
  scanner := bufio.NewScanner(os.Stdin)
  for i := 0; i < 5; i++ {
    scanner.Scan()
    fmt.Println(solve(scanner.Text()))
  }
}
    `.trim();
    console.log("✅ Go Output:\n", (await CompileFile("go", goCode, testInputs)).stdout.trim());

    // ---------------- Lua ----------------
    console.log("\n🔹 Testing Lua...");
    const luaCode = `
function solve(input)
  return input:reverse()
end

for i = 1, 5 do
  local line = io.read()
  print(solve(line))
end
    `.trim();
    console.log("✅ Lua Output:\n", (await CompileFile("lua", luaCode, testInputs)).stdout.trim());

    // ---------------- Rust ----------------
    console.log("\n🔹 Testing Rust...");
    const rustCode = `
use std::io::{self, BufRead};

fn solve(input: &str) -> String {
    input.chars().rev().collect()
}

fn main() {
    let stdin = io::stdin();
    for line in stdin.lock().lines().take(5) {
        if let Ok(l) = line {
            println!("{}", solve(&l));
        }
    }
}
    `.trim();
    console.log("✅ Rust Output:\n", (await CompileFile("rs", rustCode, testInputs)).stdout.trim());

  } catch (error) {
    console.error("❌ Error during tests:", error.message);
  }
};

runTests();
