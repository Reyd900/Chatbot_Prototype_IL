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

Deployment

- You can deploy to Vercel or Render. For Vercel, run `vercel` in the project root and follow prompts. The `server.js` will be used as a Node server.

What to submit
- Live chatbot link (hosted URL)
- Short explanation: flow logic, conversion strategy, metrics to track, prompts used.

Notes
- This is a prototype; for AI-powered replies, integrate an LLM (OpenAI/others) in `/submit` or a `/chat` endpoint. Keep API keys server-side.
