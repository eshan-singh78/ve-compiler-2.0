const { CompileFile } = require("../index");

const testPython = async () => {
  try {
    console.log("🔹 Testing Python Compilation without input...");
    const simplePythonCode = `print("Hello from Python")`;
    const simpleResult = await CompileFile("py", simplePythonCode);
    console.log("✅ Output:", simpleResult.stdout.trim());

    console.log("\n🔹 Testing Python Compilation with multiple test case inputs...");
    const userCode = `
def solve(input):
    return input[::-1]

inputs = [input().strip() for _ in range(5)]
for line in inputs:
    print(solve(line))
    `.trim();

    const testInputs = ["abc", "def", "ghi", "racecar", "python"];
    const result = await CompileFile("py", userCode, testInputs);

    console.log("✅ Output:");
    console.log(result.stdout.trim());
  } catch (error) {
    console.error("❌ Compilation error:", error.message);
  }
};

testPython();
