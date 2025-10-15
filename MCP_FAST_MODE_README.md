# Hera AI MCP - FAST Mode Implementation

## 📋 Overview

This document describes the **FAST Mode** implementation for Hera AI's MCP (Model Context Protocol) integration with ChatGPT Apps.

### Dual Mode Architecture

- **FAST Mode** (default): Lightweight, paginated database search with 1-3s response time
- **FULL Mode**: Deep analysis with GPT scoring and matching (18-35s response time)

---

## 🚀 Quick Start

### 1. Set Environment Variable (Optional)

```bash
# In your .env.local or Vercel environment
HERA_MCP_MODE=fast    # default: fast | alternative: full
```

### 2. Run Database Migration

**IMPORTANT**: Before using FAST mode in production, add the `sortDate` field and indexes:

```bash
cd heraai_rebuild_public_v1
node scripts/add-sortdate-and-indexes.js
```

This script will:
- ✅ Add `sortDate` field to all job documents (`sortDate = postedDateISO || createdAt || updatedAt`)
- ✅ Create optimized indexes for title, location, sortDate, and compound queries
- ✅ Verify data integrity and run a performance test

**Expected output:**
```
=== MongoDB Migration: Add sortDate and Indexes ===

✓ Connected successfully
✓ Updated 123456 documents with sortDate
✓ Created all necessary indexes
✓ Test query completed in 45ms
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "feat: Add FAST mode with pagination and sortDate optimization"
git push origin main
```

Vercel will automatically deploy the changes.

---

## 🔧 API Usage

### FAST Mode Example (Default)

```bash
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "id": 1,
    "params": {
      "name": "search_jobs",
      "arguments": {
        "job_title": "software engineer",
        "city": "Melbourne",
        "page": 1,
        "page_size": 20
      }
    }
  }'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "json",
      "data": {
        "content": {
          "mode": "fast",
          "jobs": [
            {
              "id": "abc123",
              "title": "Senior Software Engineer",
              "company": "Tech Corp",
              "location": "Melbourne, VIC",
              "employmentType": "Full-time",
              "postDate": "2025-10-10T08:30:00.000Z",
              "url": "https://www.seek.com.au/job/...",
              "platform": "SEEK"
            }
            // ... up to 20 jobs
          ],
          "total": 543,
          "page": 1,
          "page_size": 20,
          "has_more": true,
          "query": "software engineer in Melbourne",
          "note": "completed",
          "elapsed_ms": 1234
        }
      }
    }],
    "isError": false
  }
}
```

### Advanced Filters

```bash
# Filter by posted date and platforms
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "id": 2,
    "params": {
      "name": "search_jobs",
      "arguments": {
        "job_title": "data scientist",
        "city": "Sydney",
        "page": 1,
        "page_size": 20,
        "posted_within_days": 7,
        "platforms": ["seek", "linkedin"]
      }
    }
  }'
```

### Override Mode Per Request

```bash
# Force FULL mode for a specific request
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "id": 3,
    "params": {
      "name": "search_jobs",
      "arguments": {
        "job_title": "product manager",
        "city": "Brisbane",
        "mode": "full"
      }
    }
  }'
```

---

## 📊 Input Schema

### `search_jobs` Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `job_title` | string | ✅ Yes | - | Job title to search (e.g., "software engineer") |
| `city` | string | ✅ Yes | - | City name (e.g., "Melbourne") |
| `page` | integer | ❌ No | 1 | Page number for pagination (min: 1) |
| `page_size` | integer | ❌ No | 20 | Results per page (min: 1, max: 50) |
| `posted_within_days` | integer | ❌ No | - | Filter jobs posted within X days (e.g., 7) |
| `platforms` | array | ❌ No | - | Filter by platforms: ["seek", "linkedin", "jora", etc.] |
| `mode` | string | ❌ No | env var | Override mode: "fast" or "full" |

---

## 🎯 Performance Expectations

### FAST Mode
- ✅ Response time: **1-3 seconds**
- ✅ Results per page: **20 (max 50)**
- ✅ Total results: **Hundreds to thousands**
- ✅ Pagination: **Supported via `page` parameter**
- ✅ Fields: **Basic info only** (title, company, location, url, postDate, employmentType)
- ✅ Sorting: **By `sortDate` descending** (newest first)

### FULL Mode
- ⏱️ Response time: **18-35 seconds**
- 📊 Results: **Up to 25 jobs** (deduplicated, scored)
- 🧠 Analysis: **GPT matching and scoring**
- 📈 Fields: **Rich data** (matchScore, matchAnalysis, etc.)

---

## 🔍 Database Indexes

The migration script creates the following indexes for optimal performance:

```javascript
// 1. sortDate descending (for time-based sorting)
db.jobs.createIndex({ sortDate: -1 })

// 2. title (for fuzzy search)
db.jobs.createIndex({ title: 1 })

// 3. location (for city filtering)
db.jobs.createIndex({ location: 1 })

// 4. is_active (for filtering active jobs)
db.jobs.createIndex({ is_active: 1 })

// 5. Compound index for FAST queries
db.jobs.createIndex({ title: 1, location: 1, sortDate: -1 })

// 6. postedDateISO (fallback for legacy queries)
db.jobs.createIndex({ postedDateISO: -1 })
```

---

## 🧪 Testing & Validation

### 1. Health Check

```bash
curl -X GET https://www.heraai.net.au/api/mcp | jq
```

Expected:
```json
{
  "tools": [...],
  "mode": "fast",
  "status": "healthy",
  "timestamp": "2025-10-13T..."
}
```

### 2. Initialize Protocol

```bash
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1}' | jq
```

Expected:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "serverInfo": {
      "name": "Hera AI",
      "version": "2.0.0",
      "mode": "fast"
    },
    "capabilities": { "tools": {} }
  }
}
```

### 3. Test FAST Search

```bash
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":2,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content | {mode,total,elapsed_ms,jobs_count:(.jobs|length),first_job:.jobs[0]}'
```

**Success criteria:**
- ✅ `elapsed_ms` < 3000 (under 3 seconds)
- ✅ `mode` == "fast"
- ✅ `jobs_count` <= 20
- ✅ `first_job.url` is clickable (starts with http)

---

## 📝 ChatGPT Integration

In ChatGPT's Custom GPT or ChatGPT Apps:

1. **Add MCP Connector**: `https://www.heraai.net.au/api/mcp`
2. **Test query**: "Search for software engineer jobs in Melbourne"
3. **Pagination**: "Show me more results" or "Page 2"
4. **Filtering**: "Only show jobs from the last 7 days"

ChatGPT will automatically:
- ✅ Parse the FAST mode results
- ✅ Render URLs as clickable links
- ✅ Handle pagination (page parameter)
- ✅ Format the job list for users

---

## 🐛 Troubleshooting

### Issue: `sortDate` field missing

**Solution**: Run the migration script:
```bash
node scripts/add-sortdate-and-indexes.js
```

### Issue: Slow queries (> 5s)

**Possible causes:**
1. Indexes not created → Run migration script
2. Large dataset without pagination → Reduce `page_size`
3. Network latency → Check Vercel function region

**Debug:**
```bash
# Check indexes
mongo <MONGODB_URI> --eval "db.jobs.getIndexes()"

# Check query performance
mongo <MONGODB_URI> --eval "db.jobs.find({title:/software/i,location:/melbourne/i}).sort({sortDate:-1}).limit(20).explain('executionStats')"
```

### Issue: Empty results

**Check:**
1. Database connection: `curl https://www.heraai.net.au/api/mcp`
2. Job data exists: `db.jobs.countDocuments({ is_active: { $ne: false } })`
3. Search parameters: Try broader search terms

---

## 🔄 Migration Checklist

- [ ] Run `node scripts/add-sortdate-and-indexes.js`
- [ ] Verify indexes created: `db.jobs.getIndexes()`
- [ ] Test FAST query locally: `curl http://localhost:3002/api/mcp ...`
- [ ] Set `HERA_MCP_MODE=fast` in Vercel environment
- [ ] Deploy to Vercel: `git push origin main`
- [ ] Test production endpoint: `curl https://www.heraai.net.au/api/mcp ...`
- [ ] Verify response time < 3s
- [ ] Test ChatGPT integration
- [ ] Monitor logs in Vercel dashboard

---

## 📚 Related Files

- **MCP Route**: `src/app/api/mcp/route.ts`
- **Database Service**: `src/services/jobDatabaseService.ts`
- **Migration Script**: `scripts/add-sortdate-and-indexes.js`
- **Integration Guide**: `CHATGPT_APPS_INTEGRATION_GUIDE.md`

---

## 🎉 Success Criteria

The FAST mode is ready when:

✅ Database migration completed successfully
✅ All indexes created (6 indexes)
✅ Test query returns results in < 3s
✅ URL format is correct (external or internal with utm)
✅ Pagination works (has_more, page, page_size)
✅ ChatGPT can render and navigate results
✅ No 424 or 500 errors (always HTTP 200)

---

**Questions?** Check the logs in Vercel dashboard or run the migration script with verbose output.



