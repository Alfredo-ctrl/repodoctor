<p align="center">
  <img src="assets/readme-hero.svg" alt="RepoDoctor Audit CLI Architectural Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/DOMAIN-DEVELOPER%20TOOLING-0F172A?style=flat-square&labelColor=05080F&color=0284C7" alt="DOMAIN: DEVELOPER TOOLING" />
  <img src="https://img.shields.io/badge/SURFACE-TERMINAL%20CLI-0F172A?style=flat-square&labelColor=05080F&color=1E293B" alt="SURFACE: TERMINAL CLI" />
  <img src="https://img.shields.io/badge/CHECKS-DOCS%20%26%20SECURITY-0F172A?style=flat-square&labelColor=05080F&color=1E293B" alt="CHECKS: DOCS & SECURITY" />
  <img src="https://img.shields.io/badge/RUNTIME-NODE.JS-0F172A?style=flat-square&labelColor=05080F&color=1E293B" alt="RUNTIME: NODE.JS" />
</p>

---

# RepoDoctor

RepoDoctor is a small CLI that audits a project folder and tells you what would make the repository feel more complete, safe, and portfolio-ready.

It is useful before publishing a GitHub project, sharing work on LinkedIn, or turning a school/demo project into something that looks professional.

![RepoDoctor terminal preview](assets/terminal-preview.svg)

## What It Checks

- Git repository status.
- README presence and run instructions.
- Screenshots or visual assets.
- License and `.gitignore`.
- Project metadata such as `package.json` or `requirements.txt`.
- Test/check scripts.
- Obvious secrets or risky environment files.

## Install From GitHub

```bash
npm install -g https://github.com/Alfredo-ctrl/repodoctor/archive/refs/heads/main.tar.gz
```

## Usage

Audit the current folder:

```bash
repodoctor
```

Audit another project:

```bash
repodoctor C:\Path\To\Project
```

Export JSON:

```bash
repodoctor --json
```

Write a Markdown report:

```bash
repodoctor --markdown --output repo-health-report.md
```

## Example Output

```text
RepoDoctor

Score: 78/100
Status: healthy

Checks
OK   README
WARN Screenshots
WARN License
OK   Git ignore
```

## Why It Helps

A good portfolio repo is not just code. It needs clear instructions, proof that it runs, visual context, and no accidental sensitive files. RepoDoctor gives a fast checklist before pushing.

## Author

Alfredo Oliva
