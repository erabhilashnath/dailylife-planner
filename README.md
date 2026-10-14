# Daily Life Planner

A calendar-style personal daily planner.

- `client/` — React + Vite frontend (month calendar, click a day to add/edit/delete events)
- `server/` — Node + Express + SQLite backend (`server/planner.db` is created automatically)

## Run it

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

Then open http://localhost:5173. The client expects the API at http://localhost:4000 (see `client/src/api.js`).
