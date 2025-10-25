# Career Switch MCP Integration Summary

## 🎯 Overview

Adding 3 new MCP tools to Heraai for Career Transition Intelligence:
1. `career_transition_advice`
2. `career_path_explorer`  
3. `career_skill_gap_analysis`

## 📝 Files to Modify

### 1. `/src/app/api/mcp/route.ts`

**Changes:**
- Add 3 career tools to `GET` handler tools manifest (line ~147)
- Add 3 career tools to JSON-RPC tools list (line ~365)
- Add 3 career tool handlers in `POST` switch statement (line ~490)
- Add 3 handler functions (after existing handlers)

## 🛠️ Implementation Details

### Tool 1: career_transition_advice

**Description:** Provides personalized career transition recommendations based on current job, experience, and the career graph.

**Input Schema:**
```typescript
{
  current_job: string,
  experience_years: number,
  skills?: string[],
  industry?: string,
  location?: string
}
```

**Handler:**
```typescript
async function handleCareerTransitionAdvice(args: any) {
  const apiUrl = process.env.CAREER_SWITCH_API_URL || 'http://149.28.175.142:3009';
  
  const response = await fetch(`${apiUrl}/api/career/advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentJob: args.current_job,
      experience: args.experience_years,
      skills: args.skills,
      industry: args.industry,
      location: args.location
    })
  });
  
  const data = await response.json();
  return NextResponse.json({ content: data });
}
```

### Tool 2: career_path_explorer

**Description:** Explores all possible career paths from a given job title with similarity filtering.

**Input Schema:**
```typescript
{
  from_job: string,
  min_similarity?: number (default: 0.5),
  limit?: number (default: 20)
}
```

**Handler:**
```typescript
async function handleCareerPathExplorer(args: any) {
  const apiUrl = process.env.CAREER_SWITCH_API_URL || 'http://149.28.175.142:3009';
  const { from_job, min_similarity = 0.5, limit = 20 } = args;
  
  const response = await fetch(
    `${apiUrl}/api/career/transitions/${encodeURIComponent(from_job)}?minSimilarity=${min_similarity}&limit=${limit}`
  );
  
  const data = await response.json();
  return NextResponse.json({ content: data });
}
```

### Tool 3: career_skill_gap_analysis

**Description:** Analyzes the skill gap between two job roles.

**Input Schema:**
```typescript
{
  from_job: string,
  to_job: string
}
```

**Handler:**
```typescript
async function handleCareerSkillGapAnalysis(args: any) {
  const apiUrl = process.env.CAREER_SWITCH_API_URL || 'http://149.28.175.142:3009';
  const { from_job, to_job } = args;
  
  const response = await fetch(
    `${apiUrl}/api/career/skill-gap/${encodeURIComponent(from_job)}/${encodeURIComponent(to_job)}`
  );
  
  const data = await response.json();
  return NextResponse.json({ content: data });
}
```

## 🔧 Environment Variables

**Add to `.env` and Vercel:**
```bash
CAREER_SWITCH_API_URL=http://149.28.175.142:3009
```

## ✅ Testing

### 1. Local Testing
```bash
# Test career advice
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer <MCP_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "career_transition_advice",
    "arguments": {
      "current_job": "software engineer",
      "experience_years": 3
    }
  }'

# Test path explorer
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer <MCP_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "career_path_explorer",
    "arguments": {
      "from_job": "software engineer",
      "min_similarity": 0.6,
      "limit": 10
    }
  }'

# Test skill gap
curl -X POST http://localhost:3002/api/mcp \
  -H "Authorization: Bearer <MCP_SECRET>" \
  -H "Content-Type": application/json" \
  -d '{
    "name": "career_skill_gap_analysis",
    "arguments": {
      "from_job": "software engineer",
      "to_job": "data analyst"
    }
  }'
```

### 2. ChatGPT Testing

**Prompt examples:**
- "I'm a software engineer with 3 years experience in Melbourne. What career transitions should I consider?"
- "Show me all possible career paths from Product Manager"
- "What's the skill gap between Data Analyst and Business Analyst?"

## 📦 Deployment Steps

1. ✅ JobDirectSearchAPI deployed to Vultr:3009
2. ⏳ Add career tools to Heraai MCP route
3. ⏳ Configure CAREER_SWITCH_API_URL in Vercel
4. ⏳ Deploy to Vercel
5. ⏳ Test in ChatGPT Apps

---

**Status:** Ready to implement  
**Estimated Time:** 30-45 minutes  
**Risk:** Low (isolated changes, follows existing pattern)

