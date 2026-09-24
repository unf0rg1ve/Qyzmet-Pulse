# Test Plan

## Demo Smoke Test

1. Open the app.
2. Run a scenario from `Тесты`.
3. Confirm KPI counters change.
4. Confirm the matching cluster count increases.
5. Open `Flow` and move a case to `В работе`.
6. Open `Исполнитель` and mark a task as done.
7. Open `Гражданин` and switch RU/KK.
8. Open `Штаб` and verify forecast/resource cards render.
9. Export the report.

## Edge Cases

- Empty appeal text.
- Unknown district.
- Duplicate appeal id.
- CSV row with missing fields.
- Long official text.
- No high-risk clusters.

## Build Check

```bash
npm run build
```
