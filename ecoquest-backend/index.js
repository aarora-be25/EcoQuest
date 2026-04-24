const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── PUT YOUR KEY HERE (never commit this file) ────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /verify-photo
 * Body: { photoUrl: string, taskName: string }
 * Returns: { passed: boolean, reason: string }
 */
app.post('/verify-photo', async (req, res) => {
  const { photoUrl, taskName } = req.body;

  if (!photoUrl || !taskName) {
    return res.status(400).json({ error: 'photoUrl and taskName are required.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'url', url: photoUrl },
              },
              {
                type: 'text',
                text: `Does this photo show someone doing this sustainability task: "${taskName}"?
Reply with only YES or NO followed by one short reason.
Example: "YES - shows waste in recycling bin" or "NO - no bin visible"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic error:', data.error);
      return res.status(502).json({ error: data.error.message });
    }

    const reply  = data.content?.[0]?.text || '';
    const passed = reply.trim().toUpperCase().startsWith('YES');

    return res.json({ passed, reason: reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => res.json({ status: 'EcoQuest backend running ✅' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));