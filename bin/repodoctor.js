#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { analyzeProject, formatText, formatMarkdown } = require("../src/analyzer");

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const target = args.target || process.cwd();
const report = analyzeProject(target);

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else if (args.markdown) {
  const markdown = formatMarkdown(report);
  if (args.output) {
    fs.writeFileSync(path.resolve(process.cwd(), args.output), markdown);
    console.log(`RepoDoctor wrote ${args.output}`);
  } else {
    console.log(markdown);
  }
} else {
  console.log("");
  console.log(formatText(report));
  console.log("");
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const item = values[index];
    if (item === "--help" || item === "-h") parsed.help = true;
    else if (item === "--json") parsed.json = true;
    else if (item === "--markdown") parsed.markdown = true;
    else if (item === "--output" || item === "-o") parsed.output = values[++index];
    else if (!item.startsWith("-") && !parsed.target) parsed.target = item;
  }
  return parsed;
}

function printHelp() {
  console.log("RepoDoctor");
  console.log("");
  console.log("Usage:");
  console.log("  repodoctor");
  console.log("  repodoctor C:\\Path\\To\\Project");
  console.log("  repodoctor --json");
  console.log("  repodoctor --markdown --output repo-health-report.md");
  console.log("");
  console.log("Install from GitHub:");
  console.log("  npm install -g https://github.com/Alfredo-ctrl/repodoctor/archive/refs/heads/main.tar.gz");
}
