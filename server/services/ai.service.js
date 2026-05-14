const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI content for product promotion
 */
async function generateProductContent({ name, category, targetAudience }) {
  try {
    const prompt = `You are an SEO and social media expert helping influencers promote products.

Product Name: ${name}
Category: ${category}
Target Audience: ${targetAudience || 'General audience'}

Generate the following content:
1. SEO product description (100-150 words, optimized for search engines)
2. 10 relevant hashtags (include trending and niche-specific)
3. Instagram caption (2-3 sentences, engaging and authentic)
4. Facebook post (3-4 sentences, conversational and shareable)

Return ONLY valid JSON in this exact format:
{
  "seoDescription": "...",
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "instagramCaption": "...",
  "facebookPost": "..."
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('Failed to generate AI content');
  }
}

module.exports = { generateProductContent };
