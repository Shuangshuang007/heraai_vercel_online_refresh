/**
 * Hot Jobs 配置
 * 定义热门职位和城市组合，这些组合将优先从MongoDB获取数据
 */

// Hot Jobs 配置
export const HOT_JOBS_CONFIG = {
  // 支持的城市
  supportedCities: ['sydney', 'melbourne'],
  
  // 精确匹配的热门职位
  exactMatches: [
    'Software Engineer',
    'Data Scientist', 
    'Business Analyst',
    'Project Manager',
    'Marketing Manager',
    'Sales Representative',
    'Accountant',
    'Financial Analyst',
    'Human Resources Manager',
    'Operations Manager',
    'Product Manager',
    'UX Designer',
    'Graphic Designer',
    'Content Writer',
    'Social Media Manager',
    'Digital Marketing Specialist',
    'IT Support Specialist',
    'Network Administrator',
    'Database Administrator',
    'DevOps Engineer',
    'Quality Assurance Engineer',
    'Business Development Manager',
    'Legal Counsel',
    'Administrative Assistant',
    'Executive Assistant',
    'Office Manager',
    'Supply Chain Manager',
    'Logistics Coordinator',
    'Retail Manager',
    'Store Manager',
    'Event Planner',
    'Public Relations Specialist',
    'Communications Manager',
    'Research Scientist',
    'Environmental Scientist',
    'Real Estate Agent',
    'Insurance Broker',
    'Compliance Officer',
    'Investment Banker',
    'Financial Advisor',
    'Customer Success Manager',
    'Technical Support Engineer',
    'Systems Administrator',
    'Security Engineer',
    'Cloud Architect',
    'Machine Learning Engineer',
    'AI Research Scientist',
    'Blockchain Developer',
    'Mobile App Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Game Developer',
    'UI Designer',
    'Product Designer',
    'Construction Manager',
    'Environmental Engineer',
    'Chemical Engineer',
    'Aerospace Engineer',
    'Robotics Engineer',
    'Network Engineer',
    'Security Analyst',
    'Data Analyst',
    'Business Intelligence Analyst',
    'Market Research Analyst',
    'Management Consultant',
    'Strategy Consultant',
    'IT Consultant',
    'Talent Acquisition Specialist',
    'Recruiter',
    'Financial Controller',
    'Chief Financial Officer',
    'Chief Technology Officer',
    'Chief Information Officer',
    'Chief Operating Officer',
    'Chief Executive Officer',
    'Creative Director',
    'University Professor',
    'Lecturer',
    'Psychologist',
    'Therapist',
    'Social Worker'
  ],
  
  // 模糊匹配关键词
  fuzzyMatchKeywords: [
    'engineer',
    'developer', 
    'manager',
    'analyst',
    'specialist',
    'consultant',
    'director',
    'officer',
    'coordinator',
    'assistant',
    'scientist',
    'designer',
    'architect',
    'administrator',
    'support',
    'advisor',
    'planner',
    'supervisor',
    'lead',
    'service',
    'representative',
    'agent',
    'broker',
    'counselor',
    'therapist',
    'teacher',
    'lecturer',
    'professor',
    'nurse',
    'doctor',
    'dentist',
    'lawyer',
    'accountant',
    'banker',
    'trader',
    'investor',
    'marketer',
    'sales',
    'recruiter',
    'hr',
    'human',
    'resources',
    'operations',
    'logistics',
    'supply',
    'chain',
    'retail',
    'store',
    'restaurant',
    'hotel',
    'event',
    'public',
    'relations',
    'communications',
    'research',
    'laboratory',
    'environmental',
    'sustainability',
    'real',
    'estate',
    'property',
    'insurance',
    'claims',
    'risk',
    'compliance',
    'audit',
    'tax',
    'investment',
    'financial',
    'fund',
    'portfolio',
    'credit',
    'loan',
    'mortgage',
    'bank',
    'branch',
    'customer',
    'success',
    'technical',
    'systems',
    'security',
    'cloud',
    'machine',
    'learning',
    'ai',
    'artificial',
    'intelligence',
    'blockchain',
    'mobile',
    'app',
    'frontend',
    'backend',
    'full',
    'stack',
    'game',
    'ui',
    'product',
    'industrial',
    'fashion',
    'interior',
    'landscape',
    'urban',
    'construction',
    'site',
    'quantity',
    'surveyor',
    'building',
    'inspector',
    'safety',
    'environmental',
    'chemical',
    'mining',
    'petroleum',
    'aerospace',
    'automotive',
    'robotics',
    'control',
    'telecommunications',
    'network',
    'penetration',
    'tester',
    'forensic',
    'data',
    'business',
    'intelligence',
    'market',
    'actuary',
    'statistician',
    'economist',
    'policy',
    'management',
    'strategy',
    'it',
    'information',
    'technology',
    'talent',
    'acquisition',
    'recruitment',
    'compensation',
    'benefits',
    'payroll',
    'chief',
    'executive',
    'creative',
    'art',
    'music',
    'film',
    'theatre',
    'museum',
    'gallery',
    'library',
    'school',
    'university',
    'college',
    'academic',
    'teaching',
    'tutor',
    'educational',
    'curriculum',
    'instructional',
    'e-learning',
    'education',
    'student',
    'admissions',
    'career',
    'guidance',
    'psychologist',
    'psychiatrist',
    'social',
    'worker',
    'child',
    'care',
    'elderly',
    'disability',
    'mental',
    'health',
    'community',
    'public',
    'health',
    'promotion',
    'occupational',
    'food',
    'quality',
    'control'
  ],
  
  // MongoDB查询限制
  maxJobsPerQuery: 600,
  
  // 是否启用模糊匹配
  enableFuzzyMatch: true,
  
  // 模糊匹配的相似度阈值
  fuzzyMatchThreshold: 0.7
};

import { generateJobPlanFromGPT, UserProfile } from '../gpt-services/JobPlan/generateJobPlan';
import { buildAndExecuteQuery } from '../lib/dbsearchqueryBuilder';
import { greaterAreaMap } from '../utils/greaterAreaMap';

/**
 * 新版 Hot Jobs 查询：GPT推荐+MongoDB统一模糊查询
 * @param profile 用户Profile（需包含targetTitle, city等）
 * @returns { jobs, summary }
 */
export async function getHotJobsQuery(profile: UserProfile) {
  // 1. 调用GPT推荐服务
  const gptResult = await generateJobPlanFromGPT(profile);
  const titles = [...gptResult.primaryTitles, ...gptResult.secondaryTitles];
  const city = profile.city;

  // 2. 构建扩展搜索组合
  const locationList = greaterAreaMap[city] 
    ? [...greaterAreaMap[city].core, ...greaterAreaMap[city].fringe]
    : [city];
  
  // 构建搜索组合：每个职位标题 × 每个位置
  const searchPairs = titles.flatMap(title =>
    locationList.map(loc => ({
      title,
      location: loc
    }))
  );

  // 3. 构建并执行MongoDB查询（使用扩展位置查询）
  const jobs = await buildAndExecuteQuery(titles, city);

  // 4. 返回结果和GPT推荐摘要
  return {
    jobs,
    summary: gptResult.summarySentences,
    reasoning: gptResult.reasoning,
    searchStrategy: gptResult.searchStrategy,
    searchPairs // 新增：返回搜索组合信息
  };
}

/**
 * 判断是否为Hot Job
 * @param jobTitle 职位名称
 * @param city 城市
 * @returns 是否为Hot Job
 */
export function isHotJob(jobTitle: string, city: string): boolean {
  // 宽松城市判断：只要city字符串包含sydney或melbourne都算hot city
  const cityStr = city.toLowerCase();
  const isHotCity = /sydney/.test(cityStr) || /melbourne/.test(cityStr);

  if (!isHotCity) {
    return false;
  }
  
  // 检查精确匹配
  const normalizedJobTitle = jobTitle.toLowerCase();
  const exactMatch = HOT_JOBS_CONFIG.exactMatches.some(
    hotJob => hotJob.toLowerCase() === normalizedJobTitle
  );
  
  if (exactMatch) {
    return true;
  }
  
  // 检查关键词匹配
  if (HOT_JOBS_CONFIG.enableFuzzyMatch) {
    const keywordMatch = HOT_JOBS_CONFIG.fuzzyMatchKeywords.some(
      keyword => normalizedJobTitle.includes(keyword.toLowerCase())
    );
    if (keywordMatch) {
      return true;
    }
  }
  return false;
} 