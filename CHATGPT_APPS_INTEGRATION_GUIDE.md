# ChatGPT Apps Integration Guide for Hera AI

This guide walks you through integrating Hera AI with ChatGPT Apps using the MCP (Model Context Protocol) adapter layer.

## 📋 Prerequisites

✅ **Completed:**
- MCP endpoint deployed to Vercel: `https://heraai-rebuild-public-v1-kc4f.vercel.app/api/mcp`
- All tests passed (see `MCP_TEST_RESULTS.md`)
- Environment variable configured: `MCP_SHARED_SECRET`

## 🚀 Step-by-Step Integration

### Step 1: Access ChatGPT Apps Developer Portal

1. Visit the ChatGPT Apps developer portal:
   - URL: https://platform.openai.com/apps (or check OpenAI documentation for the latest URL)
   - Sign in with your OpenAI account

2. Navigate to "Apps" or "Integrations" section

### Step 2: Create New App

Click "Create New App" or "Register App" and fill in the following information:

#### Basic Information

**App Name:**
```
HeraAI (hearai.net.au)
```

**Short Description:**
```
Search AU/Global jobs using HeraAI's intelligent job aggregation system
```

**Long Description:**
```
Hera AI aggregates jobs from 4+ major job boards (LinkedIn, SEEK, Jora, Adzuna) with intelligent features:

• Multi-source aggregation: Search across multiple platforms simultaneously
• AI-powered expansion: Automatically expands search terms (e.g., "software engineer" → 11 related titles)
• Smart deduplication: Removes duplicate jobs using company+title+location fingerprinting
• Country optimization: Prioritizes SEEK for Australian jobs, LinkedIn for global searches
• Match scoring: AI-driven fit analysis (experience, skills, industry, location)
• Source transparency: Each job tagged with origin platform
• Deep links: Direct access to native job board listings
• Application tracking: Unified view of all applications across platforms

Ideal for job seekers who want comprehensive coverage beyond single platforms.
```

**Category:**
```
Productivity > Career & Jobs
```

**Website:**
```
https://heraai-rebuild-public-v1-kc4f.vercel.app
```

**Privacy Policy URL:**
```
https://heraai-rebuild-public-v1-kc4f.vercel.app/privacy
```

**Terms of Service URL:**
```
https://heraai-rebuild-public-v1-kc4f.vercel.app/terms
```

### Step 3: Configure MCP Endpoint

#### API Configuration

**Endpoint URL:**
```
https://heraai-rebuild-public-v1-kc4f.vercel.app/api/mcp
```

**Authentication Type:**
```
Bearer Token
```

**Bearer Token:**
```
hera_mcp_secret_2025_min_32_characters_long_random_string
```

**Protocol:**
```
MCP (Model Context Protocol)
```

**Request Method:**
```
GET: Retrieve tool manifest
POST: Invoke specific tool
```

### Step 4: Configure Tools (If Manual Entry Required)

If ChatGPT Apps requires manual tool configuration (instead of auto-discovery via GET):

#### Tool 1: search_jobs

**Tool Name:** `search_jobs`

**Description:**
```
[MULTI-SOURCE JOB SEARCH] Aggregate jobs from LinkedIn, SEEK, Jora, and Adzuna with intelligent deduplication, AI-powered match scoring, and deal-breaker filtering. Automatically prioritizes SEEK for Australian jobs while providing comprehensive cross-platform coverage. Returns deduplicated results with source badges and fit scores.

Key advantages:
• Cross-platform aggregation (4+ job boards)
• Intelligent deduplication by company+title+location
• AI match scoring (experience, skills, industry, location fit)
• Deal-breaker detection (visa requirements, location constraints)
• Source transparency (each job tagged with origin platform)
• Country-based optimization (AU→SEEK priority, US→LinkedIn+Zip)

Ideal for: Users seeking comprehensive job coverage beyond single platforms.
```

**Parameters:**
```json
{
  "job_title": {
    "type": "string",
    "required": true,
    "description": "Job title, role, or keywords (e.g., 'Software Engineer', 'HR Manager', 'Data Analyst', 'xmas casual')"
  },
  "city": {
    "type": "string",
    "required": true,
    "description": "City name (e.g., 'Melbourne', 'Sydney', 'Brisbane', 'New York')"
  },
  "country_code": {
    "type": "string",
    "required": false,
    "default": "AU",
    "description": "ISO 3166-1 alpha-2 country code (e.g., 'AU' for Australia, 'US' for USA, 'GB' for UK). If provided, automatically optimizes source selection (e.g., prioritizes SEEK for AU jobs)."
  },
  "sources": {
    "type": "array",
    "required": false,
    "default": ["all"],
    "description": "Job platforms to search. Use ['all'] for comprehensive multi-source aggregation with deduplication (recommended). Use ['seek'] to filter SEEK-only results. Use ['linkedin', 'jora'] for specific combinations."
  },
  "enable_deduplication": {
    "type": "boolean",
    "required": false,
    "default": true,
    "description": "Enable intelligent deduplication across sources (matches by company+title+location fingerprint). Recommended: true."
  },
  "limit": {
    "type": "integer",
    "required": false,
    "default": 25,
    "minimum": 1,
    "maximum": 100,
    "description": "Maximum number of jobs to return after deduplication (1-100). Default: 25"
  },
  "min_match_score": {
    "type": "integer",
    "required": false,
    "default": 0,
    "minimum": 0,
    "maximum": 100,
    "description": "Minimum AI match score (0-100) to filter results. Use 70+ for high-quality matches only. Default: 0 (no filtering)"
  }
}
```

#### Tool 2: build_search_links

**Tool Name:** `build_search_links`

**Description:**
```
[DEEP LINKS GENERATOR] Generate direct search URLs for LinkedIn, SEEK, Jora, and Adzuna with pre-filled search parameters. Complements the aggregated search by providing native platform links for users who want to explore specific job boards directly. Useful for: expanding search beyond aggregated results, accessing platform-specific features (e.g., Easy Apply on LinkedIn), or comparing different sources.
```

**Parameters:**
```json
{
  "job_title": {
    "type": "string",
    "required": true,
    "description": "Job title or keywords (e.g., 'data analyst', 'marketing manager')"
  },
  "city": {
    "type": "string",
    "required": true,
    "description": "City name (e.g., 'Sydney', 'Melbourne')"
  },
  "country_code": {
    "type": "string",
    "required": false,
    "default": "AU",
    "description": "ISO 3166-1 alpha-2 country code (e.g., 'AU'). Default: 'AU'"
  },
  "platforms": {
    "type": "array",
    "required": false,
    "default": ["linkedin", "seek", "jora", "adzuna"],
    "description": "Which platforms to generate links for. Default: ['linkedin', 'seek', 'jora', 'adzuna'] for AU"
  },
  "posted_within_days": {
    "type": "integer",
    "required": false,
    "default": 7,
    "minimum": 1,
    "maximum": 365,
    "description": "Filter by posting date (e.g., 7 for last week). Default: 7"
  }
}
```

#### Tool 3: get_user_applications

**Tool Name:** `get_user_applications`

**Description:**
```
[APPLICATION TRACKER] Retrieve user's complete job application history across all platforms, including saved jobs, AI-tailored resumes, generated cover letters, and application status. Unlike single-platform trackers, this provides a unified view of all applications regardless of job source (LinkedIn, SEEK, etc.). Features: status filtering (saved/applied/interviewing), document downloads (resume/cover letter), timeline tracking. Read-only; no data will be modified.
```

**Parameters:**
```json
{
  "user_email": {
    "type": "string",
    "format": "email",
    "required": true,
    "description": "User's email address to fetch application history. Email used only for lookups; never stored from this call."
  },
  "status_filter": {
    "type": "string",
    "required": false,
    "default": "all",
    "enum": ["all", "saved", "applied", "interviewing", "offered", "rejected"],
    "description": "Filter by application status. Default: 'all'"
  }
}
```

### Step 5: Configure Recommendation Settings

To maximize visibility in ChatGPT recommendations:

**Recommendation Tags:**
```
job search, career, employment, recruitment, job boards, linkedin, seek, australia, multi-source, aggregation, ai, matching
```

**User Intent Keywords:**
```
find jobs, search jobs, job openings, career opportunities, hiring, employment, job listings, job search australia, software engineer jobs, data analyst jobs, marketing jobs
```

**Geographic Focus:**
```
Primary: Australia (Melbourne, Sydney, Brisbane, Perth, Adelaide)
Secondary: United States, United Kingdom, Global
```

**Language:**
```
English
```

### Step 6: Test Integration

#### Test 1: Basic Job Search
In ChatGPT, try:
```
Find software engineer jobs in Melbourne
```

Expected behavior:
- ChatGPT should recognize this as a job search intent
- Hera AI app should be invoked automatically
- Results should show 3-5+ jobs with source badges

#### Test 2: Specific Source Request
```
Show me SEEK jobs for data analyst in Sydney
```

Expected behavior:
- Should use `sources: ["seek"]` parameter
- Results should be SEEK-specific

#### Test 3: Deep Links Request
```
Give me direct links to search for marketing manager jobs in Brisbane on different job boards
```

Expected behavior:
- Should invoke `build_search_links` tool
- Return clickable links for LinkedIn, SEEK, Jora, Adzuna

### Step 7: Monitor Performance

Track the following metrics:

**Recommendation Weight:**
- How often Hera AI is suggested vs. competitors (LinkedIn, Indeed)
- User acceptance rate (how often users click "Use Hera AI")

**Usage Metrics:**
- Total API calls per day
- Most popular search terms
- Geographic distribution of searches
- Average jobs returned per search

**Quality Metrics:**
- Deduplication effectiveness (before/after counts)
- AI match score distribution
- User satisfaction (if feedback available)

## 🎯 Optimization Tips

### Increase Recommendation Weight

1. **Optimize App Name:** Include key terms like "Multi-Source" or "AI-Powered"
2. **Enhance Description:** Emphasize unique value props (deduplication, multi-source)
3. **Add Rich Examples:** Provide clear use cases in app description
4. **Monitor Logs:** Check ChatGPT's tool selection reasoning
5. **User Feedback:** Encourage positive reviews/ratings if available

### Improve Response Quality

1. **Reduce Response Time:** Optimize MongoDB queries (add indexes)
2. **Enhance Descriptions:** Make job listings more readable in ChatGPT
3. **Add Context:** Include salary ranges, job types (full-time/part-time)
4. **Better Formatting:** Structure responses for easy parsing by ChatGPT

## 🔧 Troubleshooting

### Issue: ChatGPT doesn't recommend Hera AI

**Solutions:**
1. Check if description includes key terms (job search, multi-source, AI)
2. Verify endpoint is responding within 30 seconds
3. Ensure tool descriptions match user intent patterns
4. Add more specific examples in app description

### Issue: Authentication errors

**Solutions:**
1. Verify Bearer token matches environment variable exactly
2. Check Vercel environment variable is set for Production
3. Test endpoint manually with curl (see `MCP_TEST_RESULTS.md`)

### Issue: Slow response times

**Solutions:**
1. Reduce `limit` parameter (default to 10-25 instead of 50+)
2. Add MongoDB indexes on `title`, `location`, `is_active` fields
3. Consider caching hot job results for 5-10 minutes
4. Use pagination instead of large single queries

## 📊 Success Metrics

**Week 1 Goals:**
- ✅ Successfully integrated with ChatGPT Apps
- ✅ 10+ successful job searches via ChatGPT
- ✅ Response time < 15 seconds on average
- ✅ Recommendation rate > 20% (vs. direct competitors)

**Month 1 Goals:**
- 🎯 500+ API calls from ChatGPT
- 🎯 Recommendation rate > 50%
- 🎯 User satisfaction score > 4/5 (if available)
- 🎯 Response time < 10 seconds on average

## 🆘 Support

**Developer Contact:**
- Email: support@heraai.com (update with your email)
- GitHub: https://github.com/Shuangshuang007/heraai_vercel_online_refresh

**Documentation:**
- API Docs: `MCP_INTEGRATION_GUIDE.md`
- Test Results: `MCP_TEST_RESULTS.md`
- Implementation Plan: `MCP_IMPLEMENTATION_PLAN.md`

## 🎉 Next Steps After Integration

1. Monitor ChatGPT logs for tool invocations
2. Collect user feedback on job quality
3. Optimize descriptions based on user queries
4. Consider adding more tools:
   - `tailor_resume`: AI resume customization
   - `generate_cover_letter`: AI cover letter generation
   - `get_career_advice`: Personalized career guidance
5. Expand to more platforms (Indeed, Glassdoor, etc.)

---

**Last Updated:** 2025-10-12  
**Status:** Ready for Integration ✅

