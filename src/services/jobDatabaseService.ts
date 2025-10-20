import { MongoClient } from 'mongodb';
import { getHotJobsQuery } from '../constants/hotJobs';

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'hera_jobs';
const COLLECTION_NAME = 'hera_jobs.jobs';

let client: MongoClient | null = null;
let db: any = null;

// 数据提取和转换函数
function extractRequirementsAndSkills(text: string): {
  requirements: string[];
  skills: string[];
  benefits: string[];
  experienceTag?: string;
} {
  const requirements: string[] = [];
  const skills: string[] = [];
  const benefits: string[] = [];
  let experienceTag = '';
  
  if (!text) return { requirements, skills, benefits, experienceTag };
  
  const lowerText = text.toLowerCase();
  
  // 提取技能要求
  const skillPatterns = [
    /(?:required|must have|essential|proficient in|experience with|knowledge of|familiarity with|expertise in)\s*:?:?\s*([^.\n]+)/gi,
    /(?:skills|technologies|tools|frameworks|languages)\s*:?:?\s*([^.\n]+)/gi,
    /(?:experience|background|proficiency)\s+(?:in|with)\s+([^.\n]+)/gi
  ];
  
  skillPatterns.forEach(pattern => {
    const matches = lowerText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const skillMatch = match.match(/:?:?\s*([^.\n]+)/);
        if (skillMatch) {
          const skillsList = skillMatch[1].split(/[,;&|]/).map(s => s.trim()).filter(s => s.length > 2);
          skills.push(...skillsList);
        }
      });
    }
  });
  
  // 提取福利
  const benefitPatterns = [
    /(?:benefits|perks|advantages|what we offer|we offer|we provide)\s*:?:?\s*([^.\n]+)/gi,
    /(?:flexible|remote|work from home|hybrid|health|dental|vision|insurance|pension|superannuation|bonus|equity|stock|options)/gi
  ];
  
  benefitPatterns.forEach(pattern => {
    const matches = lowerText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 3) {
          benefits.push(match);
        }
      });
    }
  });

  // 年限正则全覆盖
  const experienceRegexList = [
    /\b\d{1,2}\+?\s+years?\s+(of\s+)?experience\b/i,
    /\b\d{1,2}\s*[\-–]\s*\d{1,2}\s+years?\b/i,                     // 3–5 years
    /\b\d{1,2}\+?\s+years?\b/i,                                   // 5+ years
    /\b\d{1,2}\s*yrs\b/i,                                         // 5 yrs
    /\b\d{1,2}\+?\s*yrs\b/i,                                      // 5+ yrs
    /\b\d{1,2}\s+years’? experience\b/i,                          // 5 years' experience
    /\bexperience\s+(of\s+)?(more than|at least)\s+\d{1,2}\s+years?/i,
    /\b\d{1,2}\+?\s+years?\s+in\s+[a-z ]+/i,                     // 8+ years in software engineering
  ];
  for (const regex of experienceRegexList) {
    const match = lowerText.match(regex);
    if (match) {
      const numMatch = match[0].match(/\d{1,2}(\s*[\-–]\s*\d{1,2})?/);
      if (numMatch) {
        let tag = numMatch[0].replace(/\s+/g, '').replace('–', '-').replace('--', '-');
        if (tag.includes('-')) {
          experienceTag = `${tag}y experience`;
        } else {
          experienceTag = `+${tag.replace('+', '')}y experience`;
        }
        break;
      }
    }
  }
  if (!experienceTag) {
    // fallback: senior/mid/junior/lead/experienced
    if (/junior-to-middle level|junior to middle level|junior[- ]?mid(dle)? level/.test(lowerText)) {
      experienceTag = 'Junior-to-middle level';
    } else if (/junior/.test(lowerText)) {
      experienceTag = 'Junior level';
    } else if (/mid[- ]?level|middle level|midlevel/.test(lowerText)) {
      experienceTag = 'Mid level';
    } else if (/senior/.test(lowerText)) {
      experienceTag = 'Senior level';
    } else if (/lead/.test(lowerText)) {
      experienceTag = 'Lead';
    } else if (/experienced/.test(lowerText)) {
      experienceTag = 'Experienced';
    }
  }
  if (!experienceTag) {
    // 兜底：只要有 experience 字样
    if (/experience required|must have experience|with experience in|prior experience|relevant experience/i.test(lowerText)) {
      experienceTag = 'Experience required';
    }
  }
  // 日志调试
  // console.log({ experienceTag, lowerText });

  // 提取要求
  const requirementPatterns = [
    /(?:requirements|qualifications|what you need|you need|you must have|minimum requirements)\s*:?:?\s*([^.\n]+)/gi,
    /(?:degree|bachelor|master|phd|certification|license|experience|years|background)/gi
  ];
  
  requirementPatterns.forEach(pattern => {
    const matches = lowerText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 3) {
          requirements.push(match);
        }
      });
    }
  });
  
  return { requirements, skills, benefits, experienceTag };
}

// MongoDB数据转换为前端格式
export function transformMongoDBJobToFrontendFormat(mongoJob: any): any | null {
  if (!mongoJob.id) return null;
  const { requirements, skills, benefits, experienceTag } = extractRequirementsAndSkills(
    mongoJob.description || mongoJob.summary || ''
  );
  
  // 根据sourceType决定platform显示内容
  let platformDisplay: string;
  if (mongoJob.sourceType === 'CorporateDirect') {
    platformDisplay = 'CorporateDirect';
  } else if (mongoJob.sourceType === 'PublicSector') {
    platformDisplay = 'PublicSector';
  } else {
    // 没有sourceType或PlatformJob情况，显示原始平台名称（如LinkedIn、Seek等）
    platformDisplay = Array.isArray(mongoJob.source) ? mongoJob.source[0] : mongoJob.source || 'Unknown';
  }
  
  return {
    id: mongoJob.id,
    title: mongoJob.title || '',
    company: mongoJob.company || mongoJob.organisation || '',
    location: mongoJob.location || '',
    description: mongoJob.description || mongoJob.summary || '',
    salary: mongoJob.salary || '',
    requirements,
    benefits,
    jobType: mongoJob.employmentType || '',
    experience: mongoJob.experience || '',
    postedDate: mongoJob.postedDateRaw || mongoJob.postedDate || '',
    platform: platformDisplay,
    url: mongoJob.jobUrl || mongoJob.url || '',
    tags: [
      ...(mongoJob.tags || []),
      ...(experienceTag ? [experienceTag] : [])
    ],
    skills,
    sourceType: mongoJob.sourceType,
    summary: mongoJob.summary || '',
    detailedSummary: mongoJob.detailedSummary || '',
    matchScore: mongoJob.matchScore,
    matchAnalysis: mongoJob.matchAnalysis || '',
  };
}

// 连接MongoDB
export async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return { client, db };
}

// 通用查询函数
export async function queryJobsFromDatabase(jobTitle: string, city: string, limit: number = 600): Promise<any[]> {
  try {
    const { db } = await connectToMongoDB();
    const collection = db.collection(COLLECTION_NAME);
    const query: any = { is_active: { $ne: false } };
    
    if (jobTitle) {
      query.$or = [
        { title: { $regex: jobTitle, $options: 'i' } },
        { summary: { $regex: jobTitle, $options: 'i' } }
      ];
    }
    if (city) {
      query.location = { $regex: city, $options: 'i' };
    }
    
    const jobs = await collection
      .find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
    
    // 在数据库层面去重，按job.id去重
    const jobMap = new Map();
    for (const job of jobs) {
      const key = job.id;
      if (key && !jobMap.has(key)) {
        jobMap.set(key, job);
      }
    }
    const uniqueJobs = Array.from(jobMap.values());
    
    console.log(`[JobDatabaseService] Found ${uniqueJobs.length} jobs for "${jobTitle}" in "${city}" from MongoDB`);
    return uniqueJobs;
  } catch (error) {
    console.error('[JobDatabaseService] MongoDB query error:', error);
    return [];
  }
}

// Hot Jobs查询函数
export async function queryHotJobsFromDatabase(jobTitle: string, city: string, limit: number = 600): Promise<any[]> {
  try {
    // 新版：直接用getHotJobsQuery返回的jobs
    const { jobs } = await getHotJobsQuery({ targetTitle: jobTitle, city });
    // limit处理（如有需要）
    return jobs.slice(0, limit);
  } catch (error) {
    console.error('[JobDatabaseService-HotJobs] MongoDB query error:', error);
    return [];
  }
}

// 关闭MongoDB连接
export async function closeMongoDBConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// 清理MongoDB连接
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit(0);
}); 