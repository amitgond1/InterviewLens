import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const analyzeJobDescription = async (jobDescription) => {
  const systemPrompt = `You are an expert technical interviewer and career coach with 15+ years of experience at top tech companies. You specialize in analyzing job descriptions and creating targeted interview preparation materials.`;

  const userPrompt = `Analyze the following job description and return ONLY valid JSON (no markdown, no explanation, raw JSON only).

Job Description:
"""
${jobDescription}
"""

Return this exact JSON structure:
{
  "role": "extracted job title",
  "company": "company name if explicitly mentioned, otherwise null",
  "experience_level": "Junior/Mid/Senior/Lead/Staff",
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"]
  },
  "keyTechnologies": ["tech1", "tech2"],
  "dsaQuestions": [
    {
      "question": "full question text",
      "topic": "Arrays/Strings/Trees/Graphs/DP/Sorting/Hashing/Linked Lists/Stacks/Queues/Heaps/Recursion/Backtracking",
      "difficulty": "Easy/Medium/Hard",
      "hint": "brief 1-2 sentence approach hint",
      "leetcode_similar": "most similar LeetCode problem name"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "full behavioral question text",
      "category": "Leadership/Conflict Resolution/Achievement/Teamwork/Problem Solving/Adaptability/Communication",
      "starTip": "specific advice on what to emphasize in the STAR answer for this role"
    }
  ],
  "prepChecklist": [
    {
      "task": "specific actionable task description",
      "category": "DSA/System Design/Tech Stack/Behavioral/Projects/Research",
      "priority": "High/Medium/Low",
      "estimatedHours": 2
    }
  ],
  "systemDesignTopics": ["topic1", "topic2"],
  "resumeKeywords": ["keyword1", "keyword2"],
  "interviewTips": [
    {
      "tip": "specific actionable interview tip for this exact role",
      "category": "Technical/Behavioral/Company Research/Preparation/Mindset"
    }
  ],
  "salaryRange": {
    "min": 90000,
    "max": 130000,
    "currency": "USD",
    "note": "Estimated based on role, level, and typical market rates"
  }
}

Requirements:
- Generate exactly 8 DSA questions highly relevant to this role and tech stack (2 Easy, 4 Medium, 2 Hard)
- Generate exactly 6 behavioral questions tailored to the seniority level
- Generate exactly 12 prep checklist items covering all categories
- Generate 4-6 system design topics
- Generate 15-20 high-value ATS resume keywords from the JD (exact phrases employers search for)
- Generate exactly 5 actionable interview tips specific to this role/company
- Estimate salary range if enough context is provided, otherwise use reasonable market estimates
- Be specific — reference the actual technologies and responsibilities from the JD`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 5000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const text = response.content[0].text.trim();
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Claude returned invalid JSON — could not parse response');
  }
};
