# ve-compiler-2.0

> An upgraded and actively maintained version of the original [ve-compiler](https://www.npmjs.com/package/ve-compiler).

`ve-compiler-2.0` is a versatile JavaScript package that allows you to compile and execute code snippets in multiple programming languages using a simple, unified API. It supports runtime inputs, error handling, and cleanup of temporary files for efficient execution.

---

## ✅ Features

- **Multi-language support**: C, C++, Java, JavaScript, Python, Rust, Go, and Lua
- **Runtime input support**: Pass custom input to your program during execution
- **Error handling**: Detailed stderr feedback on compilation or runtime errors
- **Temp file cleanup**: Enable or disable file cleanup after execution
- **Cross-platform**: Works on Windows, macOS, and Linux

---

## 📦 Installation

```bash
npm install ve-compiler-2.0
````

---

## 🚀 Usage

```js
const { CompileFile } = require('ve-compiler-2.0');

(async () => {
  try {
    const result = await CompileFile("cpp", `
      #include <iostream>
      using namespace std;
      int main() {
        string input;
        getline(cin, input);
        cout << "Received: " << input << endl;
        return 0;
      }
    `, "Hello World");

    console.log(result.stdout); // Received: Hello World
  } catch (err) {
    console.error(err.message);
  }
})();
```

---

## 🌐 Supported Language Codes

| Language   | Code   |
| ---------- | ------ |
| C          | `c`    |
| C++        | `cpp`  |
| Java       | `java` |
| JavaScript | `js`   |
| Python     | `py`   |
| Rust       | `rs`   |
| Go         | `go`   |
| Lua        | `lua`  |

---

## 🧹 Cleanup Option

To keep the `codebase` directory empty after execution:

```js
await CompileFile("py", `print("Hello")`, "", true); // cleanup = true
```

To retain generated files for debugging, pass `false` as the fourth argument.

---

## 🛠️ Contributing

Issues and pull requests are welcome! Help us improve and extend this compiler.

---

## 🔔 Note

The **Input handling bug** has been resolved in version `2.0`. The compiler now supports standard input for all supported languages.

---

