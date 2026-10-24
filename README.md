# BrightPath Learning — adaptive learning prototype

A responsive React/Vite prototype for a school-focused learning platform. It demonstrates sample lessons, multiple-choice quizzes, local progress reporting, country/curriculum selection, and transparent rule-based learning recommendations.

> **Prototype only:** do not enter real student records. There is no production authentication, server-side authorization, school tenancy, backend database, verified curriculum mapping, or live AI service.

## Current project layout

This archive intentionally keeps application and test files at the repository root to match the current `brightpath-learning` GitHub repository layout and avoid the folder-flattening issue encountered during browser uploads.

- `App.jsx` — React user interface
- `main.jsx` — application entry point
- `styles.css` — responsive styles
- `data.js` — demo lessons, grade choices, country/curriculum options
- `adaptive.js` — quiz scoring and rule-based recommendations
- `progress.js` — validation/normalization of browser-stored progress
- `adaptive.test.js` — Node.js built-in automated tests
- `index.html`, `package.json`, `vite.config.js` — Vite app configuration
- `deploy.yml` — reference copy of the GitHub Actions workflow
- `.github/workflows/deploy.yml` — workflow at the required path inside this archive

GitHub only discovers Actions workflow files under `.github/workflows/`. A `deploy.yml` file at the repository root is **not** a runnable workflow.

## Requirements and local commands

- Node.js 20 or newer (Node.js 22 recommended)
- npm

From this folder:

```sh
npm install
npm test
npm run build
npm run preview
```

`npm test` uses Node's built-in test runner and can run without installing frontend dependencies. `npm run build` requires Vite and the React dependencies to be installed.

## Demo behaviour

- Sample Mathematics, English, and Basic Science lessons
- Multiple-choice quizzes with answer explanations
- Scores and progress saved in browser `localStorage`
- A simple rule-based recommendation: below 50% suggests guided review, 50–79% suggests more practice, and 80%+ suggests review before progression
- A topic is not marked mastered based on one high-scoring attempt alone
- Country/curriculum selector examples for Nigeria, the UK, the US, Ghana, South Africa, Kenya, India, and Canada
- Student/parent/teacher/school-admin role preview (not a security boundary)

The country/curriculum list is illustrative only. Sample lessons have not been validated against each listed national curriculum.

## Uploading this version to the existing GitHub repository

Repository: <https://github.com/IkechukwuOsea/brightpath-learning>

The existing repository currently shows the app files at the root (`App.jsx`, `adaptive.js`, `data.js`, `main.jsx`, `progress.js`, `styles.css`, and `adaptive.test.js`). This archive preserves that layout intentionally.

1. Download and extract the ZIP.
2. In GitHub, open **Code → Add file → Upload files**.
3. Upload/replace the root files from this archive: `App.jsx`, `adaptive.js`, `adaptive.test.js`, `data.js`, `index.html`, `main.jsx`, `package.json`, `progress.js`, `styles.css`, `vite.config.js`, `.gitignore`, and `README.md`.
4. Do not rely on uploading the root `deploy.yml` to activate Actions; the workflow must be created at the nested path below.
5. In GitHub, select **Add file → Create new file**. In the filename field, enter exactly `.github/workflows/deploy.yml`.
6. Open the archive's `deploy.yml`, copy its entire contents into the GitHub editor, and commit the new file to `main`.
7. After confirming `.github/workflows/deploy.yml` exists, remove any obsolete malformed `.github/workflows/main.yml` if it is present. Do not delete `deploy.yml` before the nested workflow is committed.
8. Open **Settings → Pages** and set the source to **GitHub Actions**.
9. Open **Actions** and inspect the latest run. A past failed run can remain in the history after a workflow file is removed; judge success using the newest run.

## GitHub Actions troubleshooting

- **`No event triggers defined in 'on'`:** check the actual file at `.github/workflows/deploy.yml`; ensure it contains the quoted `'on':` key and both `push` to `main` and `workflow_dispatch` triggers.
- **No workflow appears:** a YAML file at the repository root is not enough. It must be committed under `.github/workflows/` on the default branch.
- **Missing module or import error:** confirm all seven root application/test files listed above were uploaded and their filenames/capitalization match.
- **Dependency install fails:** inspect the last lines of the `Install dependencies` step. Registry/DNS errors indicate network access problems, not automatically an application defect.
- **Pages deployment rejected:** choose GitHub Actions under **Settings → Pages** and inspect the deploy job log.

The workflow uses `npm install` because a lockfile has not yet been generated successfully in this environment. For reproducible dependency resolution, commit a verified `package-lock.json` once npm registry access works.

## Suggested production architecture (not part of Phase 1)

For a real school deployment, plan for a server API, PostgreSQL database, managed authentication, server-enforced roles and school-level tenant isolation, versioned curriculum standards, educator-reviewed content, audit logging, backups, monitoring, and child privacy/safeguarding workflows. Any future AI tutor should call its provider from the server, use approved curriculum material, and apply age-appropriate safety checks. These are future production considerations; this prototype does not implement them.

## Validation snapshot — 24 October 2026

- `npm test`: **16/16 tests passed** with Node.js 22.16.0.
- `node --check`: passed for `adaptive.js`, `data.js`, `progress.js`, `adaptive.test.js`, and `vite.config.js`.
- JSX syntax/transpile check: passed for `App.jsx` and `main.jsx` using the locally available TypeScript parser.
- Workflow YAML: parsed successfully with PyYAML; `push` and `workflow_dispatch` triggers and the `jobs` section were confirmed.
- `npm install --no-audit --no-fund`: attempted again in the current environment but timed out. A subsequent `npm run build` attempt stopped with `vite: not found`, because dependencies could not be installed; the production build is therefore **not verified**.
- Public repository inspection: the files are currently flat at the root, including `deploy.yml`; the nested `.github/workflows/deploy.yml` path must be created/committed in GitHub.
- GitHub Actions deployment and live browser verification: **not verified**.

## Phase 1 exit criteria

- [x] Core demo lessons, quiz scoring, progress handling, curriculum selector, and responsive interface are included in the archive.
- [x] Automated tests cover scoring, recommendation thresholds, malformed questions, own-property answer handling, repeated-attempt mastery, and saved-progress normalization.
- [x] Deployment workflow definition includes push/manual triggers, test, build, artifact upload, and Pages deployment jobs.
- [ ] npm dependencies install successfully and the Vite production build completes.
- [ ] Corrected root files and nested workflow are committed to GitHub.
- [ ] Latest GitHub Actions build and Pages deployment succeed.
- [ ] Published URL is opened in a browser and core flows are manually checked.

Phase 1 remains open until the unchecked items are verified. Phase 2 must not begin before then.
