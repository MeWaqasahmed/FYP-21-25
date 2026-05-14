const { OpenAI } = require('openai');

async function generateProductContent({ name, category, targetAudience }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('AI feature not configured');
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `You are an SEO and social media expert. Product: ${name} Category: ${category} Target Audience: ${targetAudience} Generate: 1. SEO product description (100-150 words) 2. 10 relevant hashtags 3. Instagram caption (2-3 sentences) 4. Facebook post (3-4 sentences) Return as JSON: { seoDescription, hashtags, instagramCaption, facebookPost }`;
  
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(res.choices[0].message.content);
}

module.exports = { generateProductContent };
