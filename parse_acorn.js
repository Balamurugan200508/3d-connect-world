const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('downloaded.js', 'utf8');

try {
  acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
  console.log("Acorn parsed successfully!");
} catch (e) {
  console.error(`Syntax Error found by Acorn: ${e.message} at line ${e.loc?.line}, column ${e.loc?.column}`);
  // Extract a snippet around the error
  if (e.pos) {
    const start = Math.max(0, e.pos - 50);
    const end = Math.min(code.length, e.pos + 50);
    console.log(`Snippet around error: ${code.substring(start, end)}`);
  }
}
