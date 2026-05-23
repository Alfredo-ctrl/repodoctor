const fs = require("fs");
const path = require("path");

const secretPatterns = [
  /api[_-]?key\s*[:=]\s*['"]?[a-z0-9_\-]{16,}/i,
  /secret\s*[:=]\s*['"]?[a-z0-9_\-]{16,}/i,
  /password\s*[:=]\s*['"]?.{8,}/i,
  /token\s*[:=]\s*['"]?[a-z0-9_\-.]{20,}/i,
  /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/
];

const ignoredDirs = new Set([".git", "node_modules", "__pycache__", "dist", "build", ".next", ".venv", "venv"]);

function analyzeProject(targetDir) {
  const root = path.resolve(targetDir || process.cwd());
  const files = listFiles(root);
  const names = new Set(files.map(file => normalize(file.relative)));
  const readme = findFirst(names, ["readme.md", "readme.txt"]);
  const packageJson = findFirst(names, ["package.json"]);
  const pyProject = findFirst(names, ["pyproject.toml", "requirements.txt", "setup.py"]);
  const license = findFirst(names, ["license", "license.md", "license.txt"]);
  const gitignore = findFirst(names, [".gitignore"]);
  const screenshots = files.filter(file => {
    const relative = normalize(file.relative);
    return /(^|\/)(assets|screenshots|images)\//i.test(relative) && /\.(png|jpe?g|webp|gif|svg)$/i.test(relative);
  });
  const sourceFiles = files.filter(file => /\.(js|ts|jsx|tsx|py|html|css|json|md)$/i.test(file.relative));
  const secretHits = scanForSecrets(root, sourceFiles);
  const scripts = packageJson ? readPackageScripts(path.join(root, packageJson)) : {};
  const readmeText = readme ? safeRead(path.join(root, readme)) : "";
  const checks = [];

  add(checks, "Git repository", fs.existsSync(path.join(root, ".git")), "Initialize git so history and remotes are visible.");
  add(checks, "README", Boolean(readme), "Add a README with what it does, why it helps, and how to run it.");
  add(checks, "Run instructions", /run|install|usage|start|python|npm|node/i.test(readmeText), "Add a clear local run section to the README.");
  add(checks, "Screenshots", screenshots.length > 0, "Add at least one screenshot under assets/ or screenshots/.");
  add(checks, "License", Boolean(license), "Add a LICENSE file so people know how they can use the project.");
  add(checks, "Git ignore", Boolean(gitignore), "Add .gitignore to keep caches, secrets, and generated files out of Git.");
  add(checks, "Project metadata", Boolean(packageJson || pyProject), "Add package.json, pyproject.toml, requirements.txt, or similar metadata.");
  add(checks, "Check script", Boolean(scripts.check || scripts.test || pyProject), "Add a repeatable check or test command.");
  add(checks, "No obvious secrets", secretHits.length === 0, "Remove secrets from tracked files and provide .env.example instead.");

  const score = Math.round(checks.reduce((sum, check) => sum + (check.ok ? check.weight : 0), 0) / checks.reduce((sum, check) => sum + check.weight, 0) * 100);
  const status = score >= 90 ? "excellent" : score >= 75 ? "healthy" : score >= 55 ? "needs polish" : "risky";
  const suggestions = checks.filter(check => !check.ok).map(check => check.fix);

  return {
    root,
    score,
    status,
    summary: {
      files: files.length,
      sourceFiles: sourceFiles.length,
      screenshots: screenshots.length,
      scripts: Object.keys(scripts)
    },
    checks,
    secretHits,
    suggestions
  };
}

function add(checks, name, ok, fix, weight = 1) {
  checks.push({ name, ok: Boolean(ok), fix, weight });
}

function listFiles(root) {
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ignoredDirs.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const relative = path.relative(root, full);
      if (entry.isDirectory()) walk(full);
      else out.push({ full, relative });
    }
  }
  walk(root);
  return out;
}

function scanForSecrets(root, files) {
  const hits = [];
  files.forEach(file => {
    if (file.relative.toLowerCase().includes(".env")) {
      hits.push({ file: file.relative, reason: "environment file" });
      return;
    }
    const text = safeRead(path.join(root, file.relative));
    if (!text || text.length > 500000) return;
    secretPatterns.forEach(pattern => {
      if (pattern.test(text)) hits.push({ file: file.relative, reason: pattern.source });
    });
  });
  return hits.slice(0, 25);
}

function readPackageScripts(packagePath) {
  try {
    return JSON.parse(fs.readFileSync(packagePath, "utf8")).scripts || {};
  } catch {
    return {};
  }
}

function findFirst(names, candidates) {
  return candidates.find(candidate => names.has(candidate)) || null;
}

function normalize(value) {
  return value.replace(/\\/g, "/").toLowerCase();
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function formatText(report) {
  const lines = [];
  lines.push("RepoDoctor");
  lines.push("");
  lines.push(`Project: ${report.root}`);
  lines.push(`Score: ${report.score}/100`);
  lines.push(`Status: ${report.status}`);
  lines.push("");
  lines.push("Checks");
  report.checks.forEach(check => {
    lines.push(`${check.ok ? "OK  " : "WARN"} ${check.name}`);
  });
  if (report.secretHits.length) {
    lines.push("");
    lines.push("Potential secret/data risks");
    report.secretHits.forEach(hit => lines.push(`WARN ${hit.file} - ${hit.reason}`));
  }
  lines.push("");
  lines.push("Suggested fixes");
  if (!report.suggestions.length) lines.push("1. Keep building. This repo already has a strong baseline.");
  else report.suggestions.forEach((item, index) => lines.push(`${index + 1}. ${item}`));
  return lines.join("\n");
}

function formatMarkdown(report) {
  const lines = [];
  lines.push("# Repo Health Report");
  lines.push("");
  lines.push(`**Project:** \`${report.root}\``);
  lines.push(`**Score:** ${report.score}/100`);
  lines.push(`**Status:** ${report.status}`);
  lines.push("");
  lines.push("## Checks");
  report.checks.forEach(check => lines.push(`- ${check.ok ? "[x]" : "[ ]"} ${check.name}`));
  if (report.secretHits.length) {
    lines.push("");
    lines.push("## Potential Secret/Data Risks");
    report.secretHits.forEach(hit => lines.push(`- \`${hit.file}\` - ${hit.reason}`));
  }
  lines.push("");
  lines.push("## Suggested Fixes");
  if (!report.suggestions.length) lines.push("- Keep building. This repo already has a strong baseline.");
  else report.suggestions.forEach(item => lines.push(`- ${item}`));
  return lines.join("\n");
}

module.exports = { analyzeProject, formatText, formatMarkdown };
