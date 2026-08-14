# Switchboard

An internal console for managing the AI/LLM API providers a company uses across its products — compare providers, configure routing and failover, track spend and uptime, and stay notified when providers change. Built as a design-system-driven dashboard with synthetic data throughout.

## Stack

- React + TypeScript + Vite
- Tailwind CSS (custom design tokens — ink ladder, brand ramp, type scale)
- React Router
- Nivo (gradient charts) + ECharts (Sankey)
- Deterministic seeded synthetic data (`src/data`)

## Getting started

```bash
npm install
npm run dev
```

## Structure

- `src/data` — fixed catalog (providers, models, products, people) + seeded generator for operational metrics
- `src/context` — role switching (`RoleContext`) and demo-data seeding (`SeedContext`)
- `src/components/ui` — shared primitives (StatCard, Badge, DataGrid pagination, etc.)
- `src/components/ai` — SwitchAI, the pre-baked/mocked insight surfaces
- `src/pages` — the seven built pages plus tasteful placeholders for the rest of the nav
