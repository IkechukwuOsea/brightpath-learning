# BrightPath Learning — adaptive learning prototype

A responsive, mobile-friendly web prototype for a school-focused learning platform. It demonstrates student learning, quizzes, progress reporting, country/curriculum selection, and simple adaptive recommendations.

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

The tests use Node.js's built-in test runner, so `npm test` does not need the frontend dependencies installed. They cover quiz scoring, recommendations, repeated-attempt mastery, normalization of malformed saved progress, and lesson-content answer-key integrity. The production build does require the dependencies to be installed successfully.

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

The repository includes `.github/workflows/deploy.yml`. A push to `main` runs the adaptive-learning tests, builds the app, and deploys it to GitHub Pages; you can also run it manually from the Actions tab.

1. Sign in to GitHub and create a **new repository** (for example `brightpath-learning`). For a school project, use a private repository unless you intend the source code to be public. Note: GitHub Pages hosting is generally intended for public repositories on GitHub Free; private-repository Pages availability depends on the plan and repository settings.
2. Upload the extracted project files to the repository. Ensure `.github/workflows/deploy.yml` is included.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Open the **Actions** tab. If prompted, enable workflows. The `Build and deploy BrightPath Learning` workflow should run after a push to `main`.
5. When the workflow completes successfully, open **Settings → Pages** to see the published URL. It will usually be `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
6. To publish updates, commit/push changes to `main`; the workflow builds and deploys automatically.

### GitHub Actions troubleshooting
- **`No event triggers defined in 'on'`:** confirm `.github/workflows/deploy.yml` contains both the `push` trigger for `main` and `workflow_dispatch`. Do not leave the `on:` section empty or create an empty workflow file.
- **Build reports missing `src/main.jsx` or `src/App.jsx`:** the repository upload is incomplete. Upload the entire project folder, including the `src/` directory (`App.jsx`, `adaptive.js`, `data.js`, `main.jsx`, and `styles.css`), not only the root configuration files.
- **Pages deployment is rejected:** in repository **Settings → Pages**, choose **GitHub Actions** as the source.
- **A build fails after dependency installation:** open the failed Actions run, expand the failed step, and inspect the final error lines before changing code.

The workflow uses `npm install` because this project archive does not include a generated lockfile. For repeatable dependency resolution, a lockfile should be added once dependency installation is available and verified.

The workflow uses Node.js 22 and builds the app with Vite. The Vite base path is configured for GitHub's repository Pages URL. This publishes the frontend prototype only; it does not add authentication, a shared backend, or real AI.


## Validation snapshot — 22 October 2026

- `npm test`: 9 tests passed using Node.js 22.16.0.
- `node --check`: passed for the non-JSX JavaScript modules and test file.
- Workflow trigger/configuration: YAML parsed and the `push` (`main`) and `workflow_dispatch` triggers were present.
- `npm install --no-audit --no-fund`: timed out in the current execution environment. The Vite production build therefore remains unverified; no deployment success is claimed.
- Repository inspection: the public GitHub repository currently shows only root configuration/documentation files and `.github/workflows`; the `src/` and `test/` directories from this archive still need to be uploaded.

## Phase 1 completion checklist

Phase 1 remains in progress until all of the following are verified:
- [x] Core lesson, quiz, local progress, curriculum-selector, and responsive prototype are present in the project archive.
- [x] Automated unit tests cover scoring, recommendations, invalid quiz input, repeated-attempt mastery, malformed saved-progress normalization, and lesson-content answer-key integrity.
- [x] GitHub Actions workflow has explicit push/manual triggers and runs tests before building.
- [ ] Dependencies install successfully and the Vite production build completes (blocked in the current environment by npm install timeout).
- [ ] The complete project source is present in the GitHub repository.
- [ ] GitHub Actions build and GitHub Pages deployment succeed, and the published site is checked in a browser.

Do not treat the prototype as production-ready for real child records until authentication, server-side permissions, backend storage, privacy/safeguarding workflows, and curriculum validation are implemented and reviewed.
