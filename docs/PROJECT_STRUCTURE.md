# Project Structure

```txt
src/
  components/      Reusable UI blocks
  data/            Demo data, dictionaries, tab configuration
  lib/             Static contracts and platform models
  services/        Pure business logic and future backend service layer
  types/           Domain types
  views/           Page-level modules rendered by App
```

## Current View Modules

- `IntegrationsView`
- `SecurityView`
- `QualityView`
- `SimulatorView`

## Next Extraction Targets

- `DashboardView (pending)`
- `FlowView (extracted)`
- `ExecutorView (extracted)`
- `CommandCenterView (extracted)`
- `DataHubView (extracted)`
- `RegulationsView (extracted)`
- `PublicView (extracted)`
- `StrategyView (extracted)`
- `TestsView (extracted)`

## Backend Migration Path

The current frontend service files are written as pure functions. They can later move into NestJS services:

- `appealsService.ts` -> `AppealsService`
- `riskService.ts` -> `RiskService`
- `reportService.ts` -> `ReportsService`
```
