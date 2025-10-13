# MCP FAST Mode - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Run migration (MUST DO FIRST!)
cd heraai_rebuild_public_v1
node scripts/add-sortdate-and-indexes.js

# 2. Deploy to Vercel
git push origin main

# 3. Test (GPT's validation command)
curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":2,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content | {mode,total,j0:.jobs[0]}'
```

**Success = Response in 1-3s with `mode:"fast"` and clickable URLs**

---

## 📊 Mode Comparison

| Feature | FAST Mode | FULL Mode |
|---------|-----------|-----------|
| **Response Time** | 1-3s | 18-35s |
| **Results/Page** | 20 (max 50) | Up to 25 |
| **Pagination** | ✅ Yes | ❌ No |
| **GPT Analysis** | ❌ No | ✅ Yes |
| **Scoring** | ❌ No | ✅ Yes |
| **Fields** | Basic (7) | Rich (12+) |
| **Use Case** | Quick browse | Deep match |

---

## 🔑 API Examples

### Basic Search (Page 1)
```bash
curl -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":1,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}'
```

### Next Page (Page 2)
```bash
# Just change "page":1 to "page":2
"arguments":{"job_title":"software engineer","city":"Melbourne","page":2,"page_size":20}
```

### Last 7 Days
```bash
"arguments":{"job_title":"data scientist","city":"Sydney","page":1,"page_size":20,"posted_within_days":7}
```

### Specific Platforms
```bash
"arguments":{"job_title":"product manager","city":"Brisbane","page":1,"page_size":20,"platforms":["seek","linkedin"]}
```

### Force FULL Mode
```bash
"arguments":{"job_title":"software engineer","city":"Melbourne","mode":"full"}
```

---

## 📝 Parameters

| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| `job_title` | string | ✅ | - | - | e.g., "software engineer" |
| `city` | string | ✅ | - | - | e.g., "Melbourne" |
| `page` | int | ❌ | 1 | - | Page number (1, 2, 3...) |
| `page_size` | int | ❌ | 20 | 50 | Results per page |
| `posted_within_days` | int | ❌ | - | - | e.g., 7, 14, 30 |
| `platforms` | array | ❌ | - | - | ["seek", "linkedin", ...] |
| `mode` | string | ❌ | env | - | "fast" or "full" |

---

## 🎯 Response Format

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
          "elapsed_ms": 1234,
          "timestamp": "2025-10-13T..."
        }
      }
    }],
    "isError": false
  }
}
```

---

## ⚡ Performance Expectations

### FAST Mode
- ✅ 1-3 seconds typical
- ✅ 3-5 seconds under load
- ✅ 5-8 seconds max (timeout fallback)

### Database Indexes (6 total)
```javascript
{ sortDate: -1 }
{ title: 1 }
{ location: 1 }
{ is_active: 1 }
{ title: 1, location: 1, sortDate: -1 }  // compound
{ postedDateISO: -1 }
```

---

## 🐛 Common Issues

### Empty Results
```bash
# Check database
mongo $MONGODB_URI --eval "db.jobs.countDocuments({is_active:{$ne:false}})"

# If 0, need to populate database
# If > 0, check search terms are correct
```

### Slow Queries
```bash
# Verify indexes exist
mongo $MONGODB_URI --eval "db.jobs.getIndexes()"

# If missing, run migration
node scripts/add-sortdate-and-indexes.js
```

### 424 Errors
- Fixed! All errors now return HTTP 200
- Check `result.content[0].data.content.note` for error type

---

## 📋 Migration Checklist

- [ ] Run `node scripts/add-sortdate-and-indexes.js`
- [ ] See "✓ Migration completed successfully!"
- [ ] Verify `sortDate` field exists
- [ ] Verify 6 indexes created
- [ ] Test query < 3s response
- [ ] Deploy to Vercel
- [ ] Test production endpoint
- [ ] Test in ChatGPT

---

## 🎉 Success Validation

**One Command Test:**
```bash
time curl -s -X POST https://www.heraai.net.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":2,
       "params":{"name":"search_jobs",
                 "arguments":{"job_title":"software engineer","city":"Melbourne","page":1,"page_size":20}}}' \
  | jq '.result.content[0].data.content | {mode,total,jobs_count:(.jobs|length),first_url:.jobs[0].url}'
```

**Expected:**
```json
{
  "mode": "fast",
  "total": 543,
  "jobs_count": 20,
  "first_url": "https://www.seek.com.au/job/..."
}

real    0m1.234s  ← MUST BE < 3s
```

---

## 📚 Full Documentation

- **README**: `MCP_FAST_MODE_README.md` (comprehensive guide)
- **Testing**: `MCP_TESTING_GUIDE.md` (12 test cases)
- **Integration**: `CHATGPT_APPS_INTEGRATION_GUIDE.md` (ChatGPT setup)
- **Migration**: `scripts/add-sortdate-and-indexes.js` (database script)

---

## 🆘 Support

**If stuck:**
1. Check Vercel logs: https://vercel.com/dashboard
2. Run migration script again
3. Verify MONGODB_URI in environment
4. Test locally: `curl http://localhost:3002/api/mcp ...`
5. Check `MCP_TESTING_GUIDE.md` for specific test case

---

**Last Updated:** October 13, 2025  
**Version:** 2.0.0 (FAST Mode)


