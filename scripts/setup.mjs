import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";

const requiredNode = [24, 0, 0];
const isWindows = process.platform === "win32";
const npmCliPath = join(
  dirname(process.execPath),
  "node_modules",
  "npm",
  "bin",
  "npm-cli.js",
);

function versionAtLeast(current, required) {
  for (let index = 0; index < required.length; index += 1) {
    if ((current[index] ?? 0) > required[index]) {
      return true;
    }
    if ((current[index] ?? 0) < required[index]) {
      return false;
    }
  }

  return true;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNpm(args) {
  if (isWindows && existsSync(npmCliPath)) {
    run(process.execPath, [npmCliPath, ...args]);
    return;
  }

  run("npm", args);
}

console.log("Project setup started.");

const currentNode = process.versions.node.split(".").map(Number);

if (!versionAtLeast(currentNode, requiredNode)) {
  console.error(
    `Node.js ${process.versions.node} is too old for this project.`,
  );
  console.error(
    "Run the global-tools-setup project first, then run npm run setup again.",
  );
  process.exit(1);
}

console.log("Installing npm packages...");
runNpm(["install"]);

console.log("Installing Git pre-commit hook with prek...");
runNpm(["run", "hooks:install"]);

console.log("Running project safety rules...");
runNpm(["run", "check:project-rules"]);

console.log("Running Git hook checks once...");
runNpm(["run", "hooks:run"]);

console.log("Setup complete. Start the site with: npm run dev");
