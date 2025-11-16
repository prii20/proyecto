const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. /api/suggest will fail without it.');
}

app.post('/api/suggest', async (req, res) => {
  const { design } = req.body || {};
  const prompt = `Eres un asistente que sugiere mejoras y descripciones para una lámpara.
  Recibiste: base=${design?.base}, shade=${design?.shade}, bulb=${design?.bulb}, price=${design?.price}.
  Devuelve 2-3 sugerencias concisas y una breve descripción para mostrar al cliente.`;

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      }),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return res.status(502).json({ error: 'OpenAI error', detail: text });
    }

    const json = await apiRes.json();
    const suggestion = json.choices?.[0]?.message?.content || '';
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
