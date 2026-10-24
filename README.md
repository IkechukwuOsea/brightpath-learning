# BrightPath Learning — adaptive learning prototype

A responsive, mobile-friendly web prototype for a school-focused learning platform. It demonstrates student learning, quizzes, progress reporting, country/curriculum selection, and simple adaptive recommendations. Current archive version: `0.3.0`.

## What is included
- React + Vite frontend
- Responsive layout for desktop, tablet and mobile browsers
- Demo student, parent, teacher and school-admin role preview
- Sample lessons in Mathematics, English and Basic Science
- Multiple-choice assessments with explanations
- Transparent rule-based adaptation based on quiz performance
- Topic mastery/progress stored in browser `localStorage`
- Curriculum country selector with sample country/curriculum options
- No API key or backend required to run the prototype

## Important prototype limitations
This is **not yet a production school platform**:
- No real authentication, server-side authorization, school tenancy or backend database
- Role switch is a UI preview, not a security control
- Progress is local to one browser/device and can be cleared by the user
- Curriculum choices are placeholders; the sample lessons are not verified against each listed national curriculum
- Adaptation is a transparent rules engine, not a trained AI model
- No real AI service is connected
- No child account, consent, retention, safeguarding or school policy workflows are implemented

Do not put real student records into this prototype. Before deployment to schools, add the production checklist below.

## Requirements
- Node.js 20 or newer (Node.js 22 LTS recommended)
- npm

## Run locally
1. Extract the ZIP.
2. Open a terminal in the `adaptive-learning-platform` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed by Vite, usually `http://localhost:5173`.

Run the automated adaptation-rule tests and test a production build:
```bash
npm test
npm run build
npm run preview
```

The tests use Node.js's built-in test runner, so `npm test` does not need the frontend dependencies installed. They cover quiz scoring, recommendations, repeated-attempt mastery, malformed saved-progress normalization, lesson-content answer-key integrity, malformed question data, and invalid progress inputs. The production build does require the dependencies to be installed successfully.

## Cloud deployment (frontend prototype)
The simplest options are Vercel, Netlify or Cloudflare Pages:
1. Push this folder to a private Git repository.
2. Import the repository in your hosting provider.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

The deployed version is still a client-side prototype; deploying it does not add authentication, shared data or a backend.

## Suggested production architecture
- **Web/PWA client:** React/TypeScript, responsive UI, optional installable PWA.
- **API:** Node.js/TypeScript (Fastify or NestJS) with versioned REST endpoints.
- **Identity and access:** managed authentication (e.g. Auth0, Clerk, or Supabase Auth), with server-enforced roles and school-level tenant isolation.
- **Database:** PostgreSQL. Use school, user, student profile, guardian relationship, class, enrolment, curriculum, curriculum standard, lesson, assessment, attempt, mastery snapshot, consent and audit tables.
- **Content service:** curriculum content mapped to country, authority, grade, subject, standard ID, source URL, licence, version and reviewer.
- **Adaptive service:** start with explainable mastery rules and spaced repetition; only introduce predictive models after collecting appropriately consented, high-quality learning data.
- **AI tutor (later):** call an AI provider from the server only. Keep API keys in server environment variables, ground responses in approved curriculum content, add age-appropriate safety filtering, and log minimal data.
- **Hosting:** frontend on Vercel/Cloudflare Pages; API and PostgreSQL on a managed provider. Use HTTPS, backups, monitoring and a separate staging environment.

## Production implementation plan
1. **Product and curriculum discovery:** choose launch countries, school levels, official curriculum sources, subjects, languages, licences and review process.
2. **Backend foundation:** create API, PostgreSQL schema, migrations, environment configuration and tests.
3. **Identity and permissions:** implement student, parent/guardian, teacher, school admin and platform admin roles; enforce all permissions server-side.
4. **Curriculum content:** import verified standards and teacher-reviewed lessons. Keep content versioned and attributable to sources.
5. **Learning engine:** save attempts on the server; calculate mastery by objective using repeated evidence, not one quiz; schedule review and remediation.
6. **School workflows:** class setup, enrolment, assignments, teacher dashboards, guardian linking and reporting.
7. **AI tutor integration:** server-side provider integration, retrieval from approved content, moderation, limits and fallback behaviour.
8. **Child privacy and safeguarding:** age-appropriate design, guardian/school consent where required, data minimisation, retention/deletion, incident response and regional legal review.
9. **QA and pilot:** automated tests, accessibility review, device testing, teacher validation and a small supervised pilot.
10. **Launch operations:** monitoring, backups, support process, curriculum update workflow and security review.

## Initial API design (production target)
- `POST /v1/auth/session`
- `GET /v1/curricula?country=NG&grade=Primary%204`
- `GET /v1/lessons/:lessonId`
- `POST /v1/attempts`
- `GET /v1/students/:studentId/progress`
- `POST /v1/classes`
- `POST /v1/classes/:classId/enrolments`
- `POST /v1/ai/tutor` (server-only AI provider; policy checks required)

These endpoints are an architecture plan, not implemented in this frontend-only prototype.

## Curriculum data model (recommended)
- `curriculum_authorities(id, country_code, name, version, source_url, licence)`
- `standards(id, authority_id, grade, subject, code, title, description)`
- `lessons(id, standard_id, title, content, language, version, reviewer_id, status)`
- `assessment_items(id, lesson_id, prompt, options, answer_key, explanation, difficulty)`
- `attempts(id, student_id, lesson_id, score, responses, created_at)`
- `mastery_snapshots(student_id, standard_id, mastery_score, evidence_count, updated_at)`
- `schools`, `users`, `roles`, `classes`, `enrolments`, `guardian_links`, `consents`, `audit_events`

## Adaptive logic in this demo
- 80%+ quiz score: suggest review and consider progression
- 50–79%: recommend more practice
- Below 50%: recommend revisiting guided examples

These thresholds are illustrative. Production thresholds should be calibrated with educators, multiple attempts and objective-level evidence.

## Child safety and privacy
Treat child learning records as sensitive. Do not add behavioural advertising. Do not expose student data across schools. Apply least-privilege access, guardian/educator workflows, encryption in transit and at rest, retention limits and deletion procedures. Obtain local legal and safeguarding review for every launch country.

## Curriculum sources
The country list is only a selector demonstration. Obtain current official standards and permission/licensing for content before representing the platform as curriculum-aligned. Store the source, version and review date for each mapping.


## GitHub repository and automatic GitHub Pages deployment

The archive contains `.github/workflows/deploy.yml`. It is configured to run on pushes to `main` and on manual dispatch. The workflow runs the Node.js unit tests, installs frontend dependencies, builds the app, and deploys the `dist/` folder to GitHub Pages.

### Upload the complete project to the existing repository

1. Download and extract this ZIP. Open the `adaptive-learning-platform` folder.
2. In the GitHub repository, use **Add file → Upload files** and upload the *contents* of that folder to the repository root. Do not upload only the ZIP or nest the whole folder inside the repository.
3. Ensure `src/`, `test/`, `.github/workflows/deploy.yml`, `package.json`, `index.html`, `vite.config.js`, `.gitignore`, and `README.md` are present at the repository root.
4. If GitHub's browser uploader does not upload the hidden `.github` folder, create `.github/workflows/deploy.yml` directly in GitHub and copy the workflow from this archive.
5. Remove the old malformed `.github/workflows/main.yml` after `deploy.yml` is safely committed. Keep one active deployment workflow to avoid duplicate runs.
6. Open **Settings → Pages** and select **GitHub Actions** as the source.
7. Open **Actions** and inspect the latest run. Do not assume the website is published unless both build and deployment jobs succeed.

The expected published URL is usually `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. The Vite base path uses the repository name when the workflow runs in GitHub Actions.

### GitHub Actions troubleshooting

- **`No event triggers defined in 'on'`:** replace the old workflow with this archive's `.github/workflows/deploy.yml`. Its event key is quoted (`'on':`) to avoid YAML 1.1 parsers treating `on` as a boolean. Confirm the file is not empty and is located under `.github/workflows/`.
- **`Cannot find package` / `src/main.jsx` missing:** the upload is incomplete. Confirm the entire `src/` directory is in the repository.
- **`npm test` cannot find a module or test:** confirm the `test/` directory and `src/` modules were uploaded.
- **Dependency installation fails:** inspect the last lines of the install step. A registry/DNS timeout is an environment or network blocker; it is not proof that the app code itself is broken.
- **Pages deployment is rejected:** open **Settings → Pages** and select **GitHub Actions** as the source.

There is no committed `package-lock.json` because dependency installation could not be completed in the current environment. Once npm registry access works, generate and commit a lockfile so dependency resolution is reproducible.

The workflow uses Node.js 22. This deploys the frontend prototype only; it does not add authentication, a shared backend, verified curriculum mapping, or a real AI service.

## Validation snapshot — 23 October 2026

- `npm test`: 12 tests passed using Node.js 22.16.0.
- `node --check`: passed for the non-JSX JavaScript modules and test file.
- Workflow trigger configuration: the workflow explicitly defines `push` to `main` and `workflow_dispatch`; the `on` key is quoted.
- ZIP integrity: checked after creating the archive.
- `npm install --no-audit --no-fund`: timed out in the current execution environment. The Vite production build therefore remains unverified; no deployment success is claimed.
- Public repository inspection: the root currently lists `.gitignore`, `README.md`, `index.html`, `package.json`, `vite.config.js`, and `.github/workflows`, but does not list `src/` or `test/`. The complete project still needs to be uploaded to GitHub.

## Phase 1 completion checklist

Phase 1 remains in progress until all of the following are verified:
- [x] Core lesson, quiz, local progress, curriculum-selector, and responsive prototype are present in the project archive.
- [x] Automated unit tests cover scoring, recommendations, invalid quiz input, repeated-attempt mastery, malformed saved-progress normalization, lesson-content answer-key integrity, malformed question data, and invalid progress inputs.
- [x] Archive workflow has explicit push/manual triggers, runs tests before dependency installation, and builds before deployment.
- [ ] Dependencies install successfully and the Vite production build completes (blocked in this environment by npm install timeout).
- [ ] The complete project source (`src/` and `test/`) is present in the GitHub repository.
- [ ] GitHub Actions build and GitHub Pages deployment succeed, and the published site is checked in a browser.

Do not treat the prototype as production-ready for real child records until authentication, server-side permissions, backend storage, privacy/safeguarding workflows, and curriculum validation are implemented and reviewed.
