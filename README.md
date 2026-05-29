<!-- portfolio:start -->
<p align="center">
  <img src="assets/readme-hero.svg" alt="RepoDoctor banner" width="100%" />
</p>

<h1 align="center">RepoDoctor</h1>

<p align="center"><strong>A CLI clinic that checks whether a GitHub project is ready to be shown.</strong></p>

<p align="center">
<img alt="focus: repo audit" src="https://img.shields.io/badge/focus-repo%20audit-ffb703?style=for-the-badge&labelColor=80ffdb" />
  <img alt="interface: CLI" src="https://img.shields.io/badge/interface-CLI-ffb703?style=for-the-badge&labelColor=80ffdb" />
  <img alt="output: readiness report" src="https://img.shields.io/badge/output-readiness%20report-ffb703?style=for-the-badge&labelColor=80ffdb" />
</p>

## Clinic Identity

RepoDoctor treats each repository like a patient: docs, safety, screenshots, structure, and portfolio polish get checked in one pass.

## Best Use

Run it before publishing a new project or before sharing a repo on LinkedIn.

## Command Line

`npm install -g github:Alfredo-ctrl/repodoctor` then run `repodoctor <repo-path>`.

## Portfolio Note

This repository has its own visual identity inside the portfolio. The goal is that every project feels like a different product, not another copy of the same template.
<!-- portfolio:end -->

---

## Existing Project Notes

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
