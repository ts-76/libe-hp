import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";
const miseCandidates = isWindows
  ? ["mise.exe"]
  : ["mise", `${process.env.HOME}/.local/bin/mise`];
const gitCandidates = isWindows
  ? ["git.exe"]
  : ["git", "/opt/homebrew/bin/git", "/usr/local/bin/git"];
const ghCandidates = isWindows
  ? ["gh.exe"]
  : ["gh", "/opt/homebrew/bin/gh", "/usr/local/bin/gh"];
const brewCandidates = [
  "brew",
  "/opt/homebrew/bin/brew",
  "/usr/local/bin/brew",
];
const wingetCommand = isWindows ? "winget.exe" : "winget";
const requiredNode = [24, 0, 0];
const requiredNodeText = "24";
const checks = [];
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
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });
}

function runNpm(args) {
  if (isWindows && existsSync(npmCliPath)) {
    return run(process.execPath, [npmCliPath, ...args]);
  }

  return run("npm", args);
}

function pass(name, detail = "") {
  checks.push({ status: "pass", name, detail });
}

function warn(name, detail) {
  checks.push({ status: "warn", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "fail", name, detail });
}

function commandVersion(name, command, args) {
  const result = run(command, args);

  if (result.error || result.status !== 0) {
    fail(name, "Not found. Install it, then run npm run doctor again.");
    return;
  }

  pass(name, result.stdout.trim() || result.stderr.trim());
}

function commandVersionFromCandidates(name, candidates, args) {
  for (const command of candidates) {
    if (command.includes("/") && !existsSync(command)) {
      continue;
    }

    const result = run(command, args);
    if (!result.error && result.status === 0) {
      pass(name, result.stdout.trim() || result.stderr.trim());
      return command;
    }
  }

  fail(name, "Not found. Run global-tools-setup first.");
  return null;
}

function versionAtLeastText(text, required) {
  const current = text.trim().replace(/^v/, "").split(".").map(Number);
  return versionAtLeast(current, required);
}

function fileExists(name, path) {
  if (existsSync(path)) {
    pass(name, path);
  } else {
    fail(name, `${path} is missing.`);
  }
}

console.log("Project doctor started.");
console.log("");

const currentNode = process.versions.node.split(".").map(Number);
if (versionAtLeast(currentNode, requiredNode)) {
  pass("Node.js", process.versions.node);
} else {
  fail(
    "Node.js",
    `${process.versions.node} is too old. Install Node.js 24 LTS or newer.`,
  );
}

const npmVersion = runNpm(["--version"]);
if (npmVersion.error || npmVersion.status !== 0) {
  fail("npm", "Not found. Install Node.js, then run npm run doctor again.");
} else {
  pass("npm", npmVersion.stdout.trim() || npmVersion.stderr.trim());
}
if (isMac) {
  commandVersionFromCandidates("Homebrew", brewCandidates, ["--version"]);
}
if (isWindows) {
  commandVersion("winget", wingetCommand, ["--version"]);
}
const mise = commandVersionFromCandidates("mise", miseCandidates, [
  "--version",
]);
if (mise) {
  const miseNode = run(mise, [
    "exec",
    `node@${requiredNodeText}`,
    "--",
    "node",
    "-v",
  ]);
  if (
    !miseNode.error &&
    miseNode.status === 0 &&
    versionAtLeastText(miseNode.stdout, requiredNode)
  ) {
    pass("mise Node.js", miseNode.stdout.trim());
  } else {
    fail("mise Node.js", "Node.js 24 LTS is not installed with mise.");
  }
}
commandVersionFromCandidates("Git", gitCandidates, ["--version"]);
const gh = commandVersionFromCandidates("GitHub CLI", ghCandidates, [
  "--version",
]);

const ghAuth = gh ? run(gh, ["auth", "status"]) : null;
if (!ghAuth || ghAuth.error || ghAuth.status !== 0) {
  fail("GitHub CLI auth", "Not authenticated. Run global-tools-setup first.");
} else {
  pass("GitHub CLI auth", "authenticated");
}

fileExists("package.json", "package.json");
fileExists("mise config", "mise.toml");
fileExists("Astro config", "astro.config.mjs");
fileExists("Biome config", "biome.json");
fileExists("secretlint config", ".secretlintrc.json");
fileExists("prek config", "prek.toml");
fileExists("Claude rules", "CLAUDE.md");

const requiredBins = ["astro", "biome", "prek", "secretlint"];
const binExt = isWindows ? ".cmd" : "";

if (!existsSync("node_modules")) {
  warn("npm packages", "node_modules is missing. Run npm run setup.");
} else {
  pass("npm packages", "node_modules exists.");
}

for (const bin of requiredBins) {
  const path = `node_modules/.bin/${bin}${binExt}`;
  if (existsSync(path)) {
    pass(`${bin} command`, path);
  } else {
    warn(`${bin} command`, `${path} is missing. Run npm install.`);
  }
}

const projectRules = runNpm(["run", "check:project-rules"]);
if (projectRules.status === 0) {
  pass("Project safety rules", "passed");
} else {
  fail(
    "Project safety rules",
    (projectRules.stderr || projectRules.stdout || "failed").trim(),
  );
}

console.log("");
for (const check of checks) {
  const mark =
    check.status === "pass"
      ? "[OK]"
      : check.status === "warn"
        ? "[WARN]"
        : "[NG]";
  console.log(
    `${mark} ${check.name}${check.detail ? `: ${check.detail}` : ""}`,
  );
}

const failures = checks.filter((check) => check.status === "fail");
const warnings = checks.filter((check) => check.status === "warn");

console.log("");
if (failures.length > 0) {
  console.error("Doctor found problems that must be fixed.");
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(
    "Doctor finished with warnings. Run npm run setup if commands are missing.",
  );
  process.exit(0);
}

console.log("Doctor finished. This project is ready to run.");
