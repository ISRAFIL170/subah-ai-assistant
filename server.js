import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const cleanMessages = (messages=[]) => messages
  .filter(m => m && typeof m.content === 'string')
  .slice(-12)
  .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content.slice(0, 12000) }));

async function googleSearch(q) {
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CX) {
    return { enabled:false, items:[], note:'Google Search API এখনো server-এ কনফিগার করা হয়নি।' };
  }
  const u = new URL('https://www.googleapis.com/customsearch/v1');
  u.searchParams.set('key', process.env.GOOGLE_API_KEY);
  u.searchParams.set('cx', process.env.GOOGLE_CX);
  u.searchParams.set('q', q);
  u.searchParams.set('num', '5');
  const r = await fetch(u);
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || 'Google Search API error');
  return {
    enabled:true,
    items:(data.items || []).map(x => ({ title:x.title, snippet:x.snippet, link:x.link }))
  };
}

app.get('/api/health', (req,res) => {
  res.json({ ok:true, providers:{ deepseek:!!process.env.DEEPSEEK_API_KEY, claude:!!process.env.ANTHROPIC_API_KEY, google:!!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_CX) } });
});

app.get('/api/search', async (req,res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error:'Search query required' });
    res.json(await googleSearch(q));
  } catch (e) { res.status(500).json({ error:e.message }); }
});

app.post('/api/chat', async (req,res) => {
  try {
    const { provider='deepseek', messages=[], system='', useWeb=false } = req.body || {};
    const clean = cleanMessages(messages);
    if (!clean.length) return res.status(400).json({ error:'Message required' });
    const lastUser = [...clean].reverse().find(m => m.role==='user')?.content || '';
    let web = { enabled:false, items:[] };
    if (useWeb && lastUser) web = await googleSearch(lastUser);
    const webText = web.items?.length ? '\n\nওয়েব সার্চের ফলাফল (এগুলোকে তথ্যসূত্র হিসেবে ব্যবহার করো, কিন্তু হুবহু কপি করো না):\n' + web.items.map((x,i)=>`${i+1}. ${x.title}\n${x.snippet}\n${x.link}`).join('\n\n') : '';
    const finalSystem = `${system || 'তুমি সুবাহ, একজন সহায়ক বাংলা personal AI assistant।'}${webText}`;

    if (provider === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error:'Server-এ ANTHROPIC_API_KEY সেট করা হয়নি।' });
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({ model:process.env.CLAUDE_MODEL || 'claude-opus-4-6', max_tokens:1400, system:finalSystem, messages:clean })
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({ error:data?.error?.message || 'Claude API error' });
      return res.json({ provider:'claude', text:(data.content||[]).map(x=>x.text||'').join(''), web:web.items||[] });
    }

    if (!process.env.DEEPSEEK_API_KEY) return res.status(503).json({ error:'Server-এ DEEPSEEK_API_KEY সেট করা হয়নি।' });
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.DEEPSEEK_API_KEY}`},
      body:JSON.stringify({ model:process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash', messages:[{role:'system',content:finalSystem}, ...clean], thinking:{type:'disabled'}, max_tokens:1400, stream:false })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error:data?.error?.message || 'DeepSeek API error' });
    res.json({ provider:'deepseek', text:data?.choices?.[0]?.message?.content || 'উত্তর পাওয়া যায়নি।', web:web.items||[] });
  } catch (e) { res.status(500).json({ error:e.message }); }
});

app.get('*', (req,res) => res.sendFile(new URL('./public/index.html', import.meta.url).pathname));
app.listen(PORT, () => console.log(`Subah AI v4 running: http://localhost:${PORT}`));
