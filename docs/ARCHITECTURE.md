# Qyzmet OS Architecture

## Layers

- `Data Sources`: e-Otinish, call-center CRM, akimat website, Telegram bot, CSV/Excel.
- `Ingestion`: webhook/API adapters, CSV import, deduplication by external id.
- `Analytics Core`: categorization, clustering, risk scoring, SLA calculation, hidden service detection.
- `Workflow`: kanban, executor desk, status changes, assignment draft, audit trail.
- `Public Layer`: anonymized citizen status page and bilingual notices.
- `Command Center`: forecasts, resource planning, escalation matrix, policy simulator.

## Production Backend Shape

- `POST /api/appeals/ingest`
- `GET /api/clusters`
- `PATCH /api/cases/:id/status`
- `GET /api/public/cases/:id`
- `GET /api/reports/operational`

## Security

- Mask personal identifiers before public display.
- Role-based access for analyst, manager, executor, citizen.
- Audit every status change, export and assignment.
- Validate webhook signatures for external integrations.
