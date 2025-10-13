# MCP FAST Mode - Testing & Deployment Guide

## 🎯 Pre-Deployment Checklist

Before testing the FAST mode in production, complete these steps:

### ✅ Step 1: Run Database Migration

**CRITICAL**: This must be done before the new code can work properly!

```bash
cd heraai_rebuild_public_v1
node scripts/add-sortdate-and-indexes.js
```

**Expected Output:**
```
=== MongoDB Migration: Add sortDate and Indexes ===

Connecting to MongoDB...
✓ Connected successfully

Step 1: Adding sortDate field to documents...
Found 123456 documents without sortDate
✓ Updated 123456 documents with sortDate

Step 2: Creating indexes...
Existing indexes: _id_
Creating index: sortDate_-1...
✓ Created sortDate index
Creating index: title_1...
✓ Created title index
Creating index: location_1...
✓ Created location index
Creating index: is_active_1...
✓ Created is_active index
Creating compound index: title_1_location_1_sortDate_-1...
✓ Created compound index for FAST search
Creating index: postedDateISO_-1...
✓ Created postedDateISO index

Step 3: Verification...
Total documents: 123456
Documents with sortDate: 123456 (100.00%)

Step 4: Running performance test query...
✓ Test query completed in 45ms
  Found 20 results
  Latest job: Senior Software Engineer (2025-10-13T08:30:00.000Z)

✓ Migration completed successfully!
```

**If you see errors:**
- Check MONGODB_URI environment variable
- Verify network access to MongoDB
- Check MongoDB logs for issues

---

## 🧪 Testing Plan

### Test 1: Health Check (GET)

```bash
curl -X GET https://www.heraai.net.au/api/mcp
```

**Expected Response:**
```json
{
  "tools": [
    {
      "name": "search_jobs",
      "description": "Search jobs (mode: fast)"
    },
    {
      "name": "build_search_links",
      "description": "Generate direct search URLs for job platforms"
    },
    {
      "name": "get_user_applications",
      "description": "Retrieve user job application history"
    }
  ],
  "mode": "fast",
  "status": "healthy",
  "timestamp": "2025-10-13T..."
}
```

**✅ Success Criteria:**
- HTTP 200 status
- `mode` is "fast"
- `status` is "healthy"
- Response time < 500ms

---

### Test 2: Initialize Protocol

```bash
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1}'
```

**Expected Response:**
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
    "capabilities": {
      "tools": {}
    }
  }
}
```

**✅ Success Criteria:**
- HTTP 200 status
- `protocolVersion` is "2025-06-18"
- `serverInfo.mode` is "fast"

---

### Test 3: List Tools

```bash
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":2}'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "search_jobs",
        "description": "FAST: Lightweight search by title+city, newest first, paginated.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "job_title": { "type": "string", "minLength": 1, "description": "e.g., 'software engineer'" },
            "city": { "type": "string", "minLength": 1, "description": "e.g., 'Melbourne'" },
            "page": { "type": "integer", "default": 1, "minimum": 1, "description": "Page number for pagination" },
            "page_size": { "type": "integer", "default": 20, "minimum": 1, "maximum": 50, "description": "Results per page (max 50)" },
            "posted_within_days": { "type": "integer", "minimum": 1, "description": "Filter jobs posted within X days (optional)" },
            "platforms": { "type": "array", "items": { "type": "string" }, "description": "Filter by platforms: seek, linkedin, jora, adzuna, etc. (optional)" },
            "mode": { "type": "string", "enum": ["fast", "full"], "description": "Override default mode for this request (optional)" }
          },
          "required": ["job_title", "city"],
          "additionalProperties": false
        }
      }
      // ... other tools
    ]
  }
}
```

**✅ Success Criteria:**
- HTTP 200 status
- `search_jobs` tool has `page`, `page_size`, `posted_within_days`, `platforms` parameters
- `inputSchema` is valid JSON Schema

---

### Test 4: FAST Search - Basic (MAIN TEST)

**This is the test GPT specified!**

```bash
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":3,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content | {mode,total,j0:.jobs[0]}'
```

**Expected Output:**
```json
{
  "mode": "fast",
  "total": 543,
  "j0": {
    "id": "abc123",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Melbourne, VIC",
    "employmentType": "Full-time",
    "postDate": "2025-10-10T08:30:00.000Z",
    "url": "https://www.seek.com.au/job/...",
    "platform": "SEEK"
  }
}
```

**✅ Success Criteria (GPT's requirement):**
- ✅ Response time: **1-3 seconds** (check with `time curl ...`)
- ✅ `mode` is "fast"
- ✅ `total` > 0
- ✅ `jobs` array has ≤ 20 items
- ✅ `j0.url` is clickable (starts with `http`)
- ✅ HTTP 200 status

---

### Test 5: FAST Search - Full Response

```bash
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":4,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"data scientist","city":"Sydney","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content'
```

**Expected Fields:**
```json
{
  "mode": "fast",
  "jobs": [ /* array of 0-20 jobs */ ],
  "total": 234,
  "page": 1,
  "page_size": 20,
  "has_more": true,
  "query": "data scientist in Sydney",
  "note": "completed",
  "elapsed_ms": 1234,
  "timestamp": "2025-10-13T..."
}
```

**✅ Success Criteria:**
- All fields present
- `has_more` is boolean
- `elapsed_ms` < 3000
- `jobs[0].url` is valid URL

---

### Test 6: Pagination

```bash
# Page 1
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":5,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":10}}}' \
  | jq '.result.content[0].data.content | {page, page_size, has_more, jobs_count:(.jobs|length), first_job_id:.jobs[0].id}'

# Page 2
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":6,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":2,"page_size":10}}}' \
  | jq '.result.content[0].data.content | {page, page_size, has_more, jobs_count:(.jobs|length), first_job_id:.jobs[0].id}'
```

**✅ Success Criteria:**
- Page 1 has `page: 1`, Page 2 has `page: 2`
- Both pages have `page_size: 10`
- `jobs_count` ≤ 10 for both
- `first_job_id` is different between pages (different jobs)
- If Page 1 has `has_more: true`, Page 2 should have jobs

---

### Test 7: Posted Within Days Filter

```bash
# Last 7 days
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":7,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20,"posted_within_days":7}}}' \
  | jq '.result.content[0].data.content | {total, jobs_count:(.jobs|length), latest_post_date:.jobs[0].postDate}'
```

**✅ Success Criteria:**
- All jobs have `postDate` within the last 7 days
- `latest_post_date` is recent (within 7 days from now)

---

### Test 8: Platform Filter

```bash
# Only SEEK and LinkedIn
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":8,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20,"platforms":["seek","linkedin"]}}}' \
  | jq '.result.content[0].data.content | {total, platforms:(.jobs|map(.platform)|unique)}'
```

**✅ Success Criteria:**
- `platforms` array only contains "seek", "linkedin", or variations
- No other platforms in results

---

### Test 9: Missing Parameters

```bash
# Missing city
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":9,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer"}}}' \
  | jq '.result.content[0].data.content'
```

**Expected Response:**
```json
{
  "jobs": [],
  "total": 0,
  "note": "missing_params",
  "message": "job_title and city are required"
}
```

**✅ Success Criteria:**
- HTTP 200 status (NOT 400!)
- `isError: false`
- `note` is "missing_params"
- Clear error message

---

### Test 10: No Results

```bash
# Nonsense query
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":10,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"xyzabc123nonexistent","city":"Melbourne","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content'
```

**Expected Response:**
```json
{
  "mode": "fast",
  "jobs": [],
  "total": 0,
  "page": 1,
  "page_size": 20,
  "has_more": false,
  "query": "xyzabc123nonexistent in Melbourne",
  "note": "completed",
  "elapsed_ms": 123
}
```

**✅ Success Criteria:**
- HTTP 200 status
- `isError: false`
- `jobs` is empty array
- `total` is 0
- `has_more` is false

---

### Test 11: FULL Mode Override

```bash
# Force FULL mode
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":11,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","mode":"full"}}}' \
  | jq '.result.content[0].data.content | {mode, total, elapsed_ms}'
```

**Expected Response:**
```json
{
  "mode": "full",
  "total": 15,
  "elapsed_ms": 23456
}
```

**✅ Success Criteria:**
- `mode` is "full" (not "fast")
- Response time is longer (18-35s expected)
- Jobs may have `matchScore` field

---

### Test 12: Performance Benchmark

```bash
# Run 10 times and measure average
for i in {1..10}; do
  time curl -s -X POST https://www.heraai.net.au/api/mcp \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"tools/call","id":'$i',
         "params":{"name":"search_jobs",
                   "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
    > /dev/null
done
```

**✅ Success Criteria:**
- Average response time < 3 seconds
- No timeouts
- All requests return HTTP 200

---

## 🚨 Common Issues & Solutions

### Issue 1: `sortDate` field not found

**Error:**
```json
{
  "jobs": [],
  "total": 0,
  "note": "completed"
}
```

**Solution:**
```bash
# Run migration
node scripts/add-sortdate-and-indexes.js

# Verify
mongo $MONGODB_URI --eval "db.jobs.findOne({sortDate:{$exists:true}})"
```

---

### Issue 2: Slow queries (> 5s)

**Debug:**
```bash
# Check indexes
mongo $MONGODB_URI --eval "db.jobs.getIndexes()"

# Explain query
mongo $MONGODB_URI --eval "
db.jobs.find({
  title:{$regex:'software',$options:'i'},
  location:{$regex:'melbourne',$options:'i'},
  is_active:{$ne:false}
}).sort({sortDate:-1}).limit(20).explain('executionStats')
"
```

**Look for:**
- `executionStats.totalDocsExamined` should be close to `nReturned`
- `executionStages.stage` should be "IXSCAN" (index scan), not "COLLSCAN" (collection scan)

---

### Issue 3: Empty results despite having data

**Check:**
```bash
# Count active jobs
mongo $MONGODB_URI --eval "db.jobs.countDocuments({is_active:{$ne:false}})"

# Sample jobs
mongo $MONGODB_URI --eval "db.jobs.findOne({is_active:{$ne:false}})"

# Check title/location patterns
mongo $MONGODB_URI --eval "
db.jobs.find({
  title:{$regex:'software',$options:'i'},
  location:{$regex:'melbourne',$options:'i'}
}).limit(5).pretty()
"
```

---

## 📊 Success Metrics

After running all tests, verify:

- [ ] ✅ Health check returns `mode: "fast"`
- [ ] ✅ Initialize returns protocol version `2025-06-18`
- [ ] ✅ Tools list includes all new parameters
- [ ] ✅ Basic FAST search returns results in < 3s
- [ ] ✅ All jobs have clickable URLs
- [ ] ✅ Pagination works (different jobs on different pages)
- [ ] ✅ Filters work (posted_within_days, platforms)
- [ ] ✅ Missing params return HTTP 200 with error note
- [ ] ✅ No results return HTTP 200 with empty array
- [ ] ✅ FULL mode override works
- [ ] ✅ Average response time < 3s over 10 requests

---

## 🎉 Final Validation

**Run GPT's exact test:**

```bash
curl -s -X POST https://www.heraai.net.au/api/mcp \
 -H "Content-Type: application/json" \
 -d '{"jsonrpc":"2.0","method":"tools/call","id":2,
      "params":{"name":"search_jobs",
                "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
 | jq '.result.content[0].data.content | {mode,total,j0:.jobs[0]}'
```

**If you see:**
```json
{
  "mode": "fast",
  "total": <number>,
  "j0": {
    "id": "<id>",
    "title": "<title>",
    "company": "<company>",
    "location": "<location>",
    "employmentType": "<type>",
    "postDate": "<ISO date>",
    "url": "http...",
    "platform": "<platform>"
  }
}
```

**And the response time is 1-3 seconds** → ✅ **FAST mode is ready for production!**

---

## 📝 Next Steps

1. ✅ Run database migration
2. ✅ Run all tests above
3. ✅ Verify success criteria
4. ✅ Test in ChatGPT Custom GPT / ChatGPT Apps
5. ✅ Monitor Vercel logs for errors
6. ✅ Gather user feedback

---

**Questions?** Check `MCP_FAST_MODE_README.md` or Vercel dashboard logs.


