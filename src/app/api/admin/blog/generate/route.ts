import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, category } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const categoryLabel: Record<string, string> = {
      gradovi: 'Cities',
      atrakcije: 'Attractions',
      rute: 'Routes',
      prakticno: 'Travel Tips',
      sezonski: 'Seasonal',
    };

    const prompt = `You are a travel writer for Shams Al Bosnia, a premium travel agency in Bosnia & Herzegovina.

Write a compelling travel blog post about: "${topic}"
Category: ${categoryLabel[category] || 'Travel'}

Return ONLY a valid JSON object with these exact fields:
{
  "title": "SEO-friendly, engaging title (max 70 chars)",
  "excerpt": "2-3 sentence hook that makes the reader want to read more (max 200 chars)",
  "content": "Full blog post in HTML format. Use <h2>, <h3>, <p>, <ul>, <li> tags. Write 500-800 words. Include practical travel tips, what to see, best time to visit, how to get there. Write from the perspective of a knowledgeable local guide. Make it engaging and SEO-friendly.",
  "reading_time": <number of minutes to read, integer>,
  "image_search": "Best Wikipedia search term to find a cover image for this topic (1-3 words, English)"
}

Write in English. Be specific, include real facts about Bosnia & Herzegovina. Do not add any text outside the JSON.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const generated = JSON.parse(jsonMatch[0]);

    // Try to fetch Wikipedia image for the topic
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
