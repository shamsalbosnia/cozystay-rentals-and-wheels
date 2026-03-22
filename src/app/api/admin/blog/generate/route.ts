import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const categoryLabel: Record<string, string> = {
  gradovi: 'Cities',
  atrakcije: 'Attractions',
  rute: 'Routes',
  prakticno: 'Travel Tips',
  sezonski: 'Seasonal',
};

export async function POST(req: NextRequest) {
  try {
    const { topic, category } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    if (!GROQ_API_KEY) return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });

    const prompt = `You are a travel writer for Shams Al Bosnia, a premium travel agency in Bosnia & Herzegovina.

Write a compelling travel blog post about: "${topic}"
Category: ${categoryLabel[category] || 'Travel'}

Return ONLY a valid JSON object with these exact fields, no extra text:
{
  "title": "SEO-friendly, engaging title (max 70 chars)",
  "excerpt": "2-3 sentence hook that makes the reader want to read more (max 200 chars)",
  "content": "Full blog post in HTML. Use <h2>, <h3>, <p>, <ul>, <li> tags. Write 500-800 words. Include: what to see, practical tips, best time to visit, how to get there. Be specific with real facts about Bosnia & Herzegovina.",
  "reading_time": 5,
  "image_search": "Best Wikipedia search term for a cover image (1-3 English words)"
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      throw new Error(`Groq error: ${err}`);
    }

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const generated = JSON.parse(jsonMatch[0]);

    // Fetch Wikipedia cover image
    let image_url = '';
    try {
      const wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(generated.image_search || topic)}`,
        { headers: { 'User-Agent': 'ShamsAlBosnia/1.0 (info@shamsalbosnia.com)' } }
      );
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        image_url = wikiData.thumbnail?.source?.replace(/\/\d+px-/, '/800px-') || '';
      }
    } catch { /* image optional */ }

    return NextResponse.json({
      title: generated.title || '',
      excerpt: generated.excerpt || '',
      content: generated.content || '',
      reading_time: generated.reading_time || 5,
      image_url,
    });
  } catch (err: any) {
    console.error('Blog generate error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
