# WizKlub Chatbot Prototype

A minimal chatbot prototype (rule-based) to qualify Parents and Schools, capture leads, and nudge demo bookings.

Features
- Parent and School flows
- Captures: name, phone, email, user type
- Simple lead scoring
- Stores leads to `leads.json`

Run locally

```bash
cd InfinityL_Assignment
npm install
npm start
# Open http://localhost:3000
```

Live demo

- Service URL (paste your Render or other host URL here): https://<your-service>.onrender.com

Submission write-up (concise)

Flow logic:
- Entry greeting: quick choice between `Parent` and `School`.
- Parent flow: capture `name` → `email` → `phone` → `child age` → `budget` → demo CTA.
- School flow: capture `name & role` → `email` → `phone` → `student count` → `partnership interest` → demo CTA.
- Final step: `Book a demo` or `Save & contact me` — both submit a lead to the backend.

Conversion strategy:
- Low-friction entry — single-click options for common answers to avoid typing.
- Early demo CTA after qualification to reduce dropoff.
- Collect both phone and email to enable high-touch follow-up (sales call + email nurture).
- Use lead scoring (stored on submission) to route high-value leads to sales immediately.

Lead scoring (simple rules used in `server.js`):
- Parent baseline + points for target child ages (5–12) and higher budget.
- School baseline higher; extra points for larger student counts and explicit partnership interest.
- Contact presence (email/phone) increases score.

Metrics to track (recommended):
- Conversion rate (visitors → started chat)
- Lead capture rate (started chat → submitted lead)
- Demo booking rate (submitted lead → requested demo)
- Lead quality distribution (score histogram)
- Time-to-first-contact (from submit → outreach)

Prompts & automation notes:
- Bot greeting (used): "Hi 👋 I'm Wiz, the assistant for WizKlub. Are you a Parent or a School representing team?"
- For AI responses (optional): use an LLM with a short system prompt describing target audience, tone (helpful, concise, sales-oriented), and allowed actions (collect contact, book demo).

Testing & QA:
- Run locally (above) and verify both Parent and School flows submit leads.
- Check `leads.json` for stored leads locally; on Render the storage is ephemeral — connect a real DB or CRM integration for production.

Deploy notes for Render (already added `render.yaml`):
- Push to GitHub (done). On Render, connect the repo and Render will auto-create the `wizklub-chatbot` service from `render.yaml`.
- If you prefer manual: create a Web Service, branch `main`, Start Command `npm start`.

What to hand in
- Live chatbot link (paste above)
- This short explanation (flow, conversion strategy, metrics)
- Optional: a link to prompts or a short demo video

If you paste the Render service URL here I will update this README with the live link and a one-line demo note.

---
Files of interest:
- `server.js` — Node/Express backend and scoring logic
- `public/index.html`, `public/chat.js` — frontend chatbot UI and flows
- `render.yaml` — Render service descriptor (auto-deploy)

Thank you — tell me if you want me to also add a simple dashboard or a CSV export endpoint for leads.
