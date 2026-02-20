const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const LEADS_FILE = path.join(__dirname, 'leads.json');

app.post('/submit', (req, res) => {
  const lead = req.body || {};
  lead.id = Date.now();
  lead.receivedAt = new Date().toISOString();
  lead.score = computeScore(lead);

  const leads = readLeads();
  leads.push(lead);
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    res.json({ ok: true, id: lead.id, score: lead.score });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/leads', (req, res) => {
  res.json(readLeads());
});

app.get('/health', (req, res) => res.send('ok'));

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE));
  } catch (e) {
    return [];
  }
}

function computeScore(lead) {
  let s = 0;
  if (lead.userType === 'Parent') {
    s += 10; // baseline interest
    const age = Number(lead.childAge || 0);
    if (age > 0) {
      // target ages 5-12 higher
      if (age >= 5 && age <= 12) s += 10;
      else if (age >= 3 && age <= 4) s += 5;
    }
    if (lead.budget === 'High') s += 10;
    else if (lead.budget === 'Medium') s += 5;
  }
  if (lead.userType === 'School') {
    s += 15; // stronger baseline
    const students = Number(lead.students || 0);
    if (students >= 300) s += 15;
    else if (students >= 100) s += 8;
    if (lead.partnerInterest === 'Yes') s += 10;
  }
  // presence of contact details boosts score
  if (lead.email) s += 5;
  if (lead.phone) s += 5;
  return s;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
