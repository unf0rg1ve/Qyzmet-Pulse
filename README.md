# Qyzmet Pulse

Qyzmet Pulse is a GovTech MVP for fast analysis and operational handling of citizen appeals. The product is designed for hackathon/demo scenarios where a government team needs to see not only a list of requests, but also priorities, risks, responsible departments, SLA status, public transparency, and management analytics.

## What The Product Solves

Qyzmet Pulse helps government bodies and akimats turn fragmented citizen appeals into a structured operating workflow.

The system solves these problems:

- collects and simulates appeals from different channels, including manual input and CSV import;
- groups similar appeals into problem clusters, so repeated issues are visible as one systemic problem;
- calculates priority and risk level for each appeal;
- routes appeals to responsible departments;
- tracks status, SLA, overdue cases, and execution flow;
- shows a Kanban-style operational board for employees;
- provides district-level analytics and heatmap-style summaries;
- gives managers a command center with forecasts, load, risks, and recommendations;
- checks draft responses for weak formal replies through the Anti-Otpiska module;
- shows a public anonymized citizen status card in Russian and Kazakh;
- includes demo scenarios and a QA checklist for quick verification.

The core idea is not to replace existing government platforms, but to act as an analytical and operational layer above appeal intake systems.

## How To Run

Requirements:

- Node.js 20+ recommended;
- npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Technologies Used

- React 19;
- TypeScript;
- Vite;
- Lucide React icons;
- CSS modules/style structure through `src/styles.css`;
- mock domain services for scoring, analytics, reporting, and appeal processing.

Project structure:

- `src/App.tsx` - main application shell and navigation;
- `src/views/` - product screens;
- `src/components/` - reusable UI components;
- `src/data/` - demo data and constants;
- `src/services/` - appeal, risk, and report logic;
- `src/lib/` - API contract and security model;
- `src/types/` - shared domain types;
- `docs/` - architecture, test plan, and project structure notes.

## How To Verify The Solution

1. Install dependencies with `npm install`.
2. Run `npm run build` and make sure the TypeScript and Vite build finishes successfully.
3. Start the app with `npm run dev`.
4. Open `http://localhost:5173`.
5. Check the main dashboard: appeals, clusters, risk indicators, department load, and event log should be visible.
6. Open the `Подключение` section and add a new appeal manually.
7. Import or review demo appeals and confirm that new appeals appear in the operational flow.
8. Open `Flow` and verify that appeals are grouped by work status.
9. Open `Исполнитель` and check executor workflow, checklist, SLA, and notification blocks.
10. Open `Штаб` and review forecasts, escalations, and management recommendations.
11. Open `Data Hub` and verify source health and data quality indicators.
12. Open `Регламенты` and check SLA/regulation matching.
13. Open `Анти-отписка` and test response quality scoring.
14. Open `Гражданин` and verify the public anonymized status card.
15. Open `Тесты` and go through the prepared demo scenarios and QA checklist.

## Demo Focus

For a short hackathon presentation, the recommended flow is:

1. Show the dashboard and explain the problem.
2. Add or import a citizen appeal.
3. Show automatic prioritization, clustering, and routing.
4. Move the case through the Flow board.
5. Show the manager view in `Штаб`.
6. Show transparency through the `Гражданин` public card.
7. Finish with `Анти-отписка`, proving that the system helps improve the quality of government responses.

## Product Name

Full name:

```text
Qyzmet Pulse: information and analytics system for citizen appeal management
```

Short name:

```text
Qyzmet Pulse
```
