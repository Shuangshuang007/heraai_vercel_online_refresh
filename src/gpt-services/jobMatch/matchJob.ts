import OpenAI from 'openai';
import { getLocationWeight } from '../../utils/greaterAreaMap';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});

interface JobMatchRequest {
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string[];
  jobLocation: string;
  userProfile: {
    jobTitles: string[];
    skills: string[];
    city: string;
    seniority: string;
    openToRelocate: boolean;
    careerPriorities?: string[];
    expectedSalary?: string;
    currentPosition?: string;
    expectedPosition?: string;
    employmentHistory?: Array<{
      company: string;
      position: string;
    }>;
  };
}

// 判断用户类型
function determineUserType(userProfile: JobMatchRequest['userProfile']): 'opportunity' | 'fit' | 'neutral' {
  const careerPriorities = userProfile.careerPriorities || [];
  
  // 检查是否选择了机会型选项
  const opportunityPriorities = ['Company Reputation', 'Higher Compensation', 'Clear Promotion Pathways'];
  const hasOpportunityPriority = opportunityPriorities.some(priority => 
    careerPriorities.includes(priority)
  );
  
  // 检查是否选择了匹配型选项
  const fitPriorities = ['Work-Life Balance', 'Industry Fit', 'Functional Fit'];
  const hasFitPriority = fitPriorities.some(priority => 
    careerPriorities.includes(priority)
  );
  
  // 检查其他条件
  const isSeniorWithHighSalary = userProfile.seniority === 'Senior' && 
    userProfile.expectedSalary === 'Highest';
  
  const hasSignificantPositionJump = userProfile.currentPosition && 
    userProfile.expectedPosition &&
    ['Director', 'VP', 'C-level'].includes(userProfile.expectedPosition) &&
    ['Manager', 'Senior Manager'].includes(userProfile.currentPosition);
  
  // 判断用户类型
  if (hasOpportunityPriority || 
      (isSeniorWithHighSalary) || 
      (userProfile.openToRelocate && hasOpportunityPriority) ||
      hasSignificantPositionJump) {
    return 'opportunity';
  }
  
  if (careerPriorities.includes('Work-Life Balance') ||
      (careerPriorities.includes('Industry Fit') && careerPriorities.includes('Functional Fit')) ||
      (!hasOpportunityPriority && !userProfile.openToRelocate)) {
    return 'fit';
  }
  
  return 'neutral';
}

// 过滤公司历史年限，避免误提公司历史作为候选人经验
function isCompanyHistory(text: string): boolean {
  const companyHistoryPatterns = [
    /(our|we('|')?ve|company|organization|history|years of service|established in)\s+(over\s+)?\d{1,3}\s*(years|yrs|y)/i,
    /(over our|our \d{1,3}|for over \d{1,3}|we've been|established in)\s+\d{1,3}\s*(years|yrs|y)/i,
    /(company|organization|firm|business)\s+(with|of|having)\s+\d{1,3}\s*(years|yrs|y)/i,
    /(since|founded in|established in)\s+\d{4}/i,
    /(celebrating|marking)\s+\d{1,3}\s*(years|yrs|y)/i
  ];
  
  return companyHistoryPatterns.some(pattern => pattern.test(text));
}

// 过滤无效key requirement的工具函数
const INVALID_KEYWORDS = [
  'melbourne', 'sydney', 'australia', 'vic', 'nsw', 'location', 'experience',
  'team player', 'communication skills', 'customer care', 'multitasking', 'focus', 'commitment',
  'empathy', 'positive attitude', 'attitude', 'work ethic', 'adaptability', 'flexibility', 'problem solving', 'initiative', 'motivation', 'collaboration', 'interpersonal', 'punctuality', 'reliability', 'dependability', 'organization', 'organisational', 'time management', 'attention to detail', 'detail oriented', 'self-motivated', 'self starter', 'leadership', 'responsibility', 'creativity', 'critical thinking', 'willingness to learn', 'fast learner', 'passion', 'dedication', 'drive', 'energy', 'enthusiasm', 'integrity', 'trustworthy', 'respect', 'patience', 'work independently', 'work under pressure', 'work as part', 'work as a team', 'work collaboratively', 'work well with others', 'good attitude', 'good communication', 'good listener', 'good team player', 'good work ethic', 'good organizational', 'good organisational', 'good time management', 'good attention to detail', 'good problem solving', 'good initiative', 'good motivation', 'good collaboration', 'good interpersonal', 'good punctuality', 'good reliability', 'good dependability', 'good organization', 'good organisational', 'good self-motivation', 'good self starter', 'good leadership', 'good responsibility', 'good creativity', 'good critical thinking', 'good willingness to learn', 'good fast learner', 'good passion', 'good dedication', 'good drive', 'good energy', 'good enthusiasm', 'good integrity', 'good trustworthy', 'good respect', 'good patience', 'good work independently', 'good work under pressure', 'good work as part', 'good work as a team', 'good work collaboratively', 'good work well with others'
];
function filterKeyRequirements(raw: string[]): string[] {
  return raw
    .map(req => req.trim())
    .filter(req =>
      req.length > 0 &&
      req.split(/\s+/).length <= 3 &&
      !INVALID_KEYWORDS.some(keyword => req.toLowerCase().includes(keyword))
    );
}

// 计算职位匹配分数
export async function calculateMatchScore(
  userType: 'opportunity' | 'fit' | 'neutral',
  jobData: Omit<JobMatchRequest, 'userProfile'> & { platform?: string },
  userProfile: JobMatchRequest['userProfile']
): Promise<{ 
  score: number; 
  subScores: { experience: number; industry: number; skills: number; other: number };
  highlights: string[]; 
  listSummary: string; 
  detailedSummary: string; 
  keyRequirements: string[]; 
  analysis: string 
}> {
  const prompt = `
    As a professional career advisor, analyze how well I match this job position based on my profile.
    
    User Type: ${userType === 'opportunity' ? 'Good Opportunity Seeker' : 
                userType === 'fit' ? 'Good Fit Seeker' : 'Neutral Seeker'}
    
    Job Details:
    - Title: ${jobData.jobTitle}
    - Description: ${jobData.jobDescription}
    - Location: ${jobData.jobLocation}
    - Required Skills: ${jobData.jobRequirements.join(', ')}
    
    My Profile:
    - Skills: ${userProfile.skills.join(', ') || 'Not specified'}
    - Location: ${userProfile.city}
    - Seniority Level: ${userProfile.seniority}
    - Open to Relocation: ${userProfile.openToRelocate ? 'Yes' : 'No'}
    - Career Priorities: ${userProfile.careerPriorities?.join(', ') || 'Not specified'}
    - Expected Position: ${userProfile.expectedPosition || 'Not specified'}
    - Current Position: ${userProfile.currentPosition || 'Not specified'}
    
    Please provide:
    1. 生成四个分数，全部为65-95之间的整数，且每项分数需细致分布（如每1分或2分一个档位）：
       - Experience Score（65-95）
       - Industry Score（65-95）
       - Skills Score（65-90，最高不能超过90）
       - Other Score（65-95，综合文化契合、亮点等）
    2. Match Score = 0.3*Experience + 0.35*Skills + 0.2*Industry + 0.15*Other，四舍五入为整数。
       - 如果职位为Corporate Direct，Match Score不变；
       - 否则Match Score乘0.95，最大不超过95。
       - Match Score必须严格等于上述加权结果，不能随意主观调整。
       - 所有分数必须看上去合理，不能出现主分低于所有子分的情况。
    3. 至少有两项分数不同，不能全部相同或过于接近。
    4. 只输出如下格式，不输出任何解释或理由：
Experience: [整数]
Industry: [整数]
Skills: [整数]
Other: [整数]
Score: [整数]

    5. A match score between 65-95 based on my profile and the job requirements
    2. Provide 3-4 structured highlights, each as a single sentence:
       1) State the industry/major business, department or team, and the experience level required (e.g., "A global software company (product team) seeking a senior engineer with 8+ years experience")
       2) Clearly state the core responsibilities using strong action verbs and nouns (e.g., "Lead .NET solution development and modernise legacy platforms", "Develop and maintain React components, ensure UI/UX quality, and collaborate across teams")
       3) List the key skills or qualifications required (e.g., "Requires .NET, SQL, JavaScript, Agile/CI-CD; Azure/cloud a plus")
       4) State any special requirements or unique benefits, such as citizenship, PR, visa, working rights, or notable perks. Do NOT mention location or city. If there are no special requirements or unique benefits, leave this blank (do NOT output any default or placeholder text such as 'No special requirements or unique benefits mentioned').
    3. A brief job list summary (1 sentence, max 20 words) that includes:
       - Company industry/type/scale
       - Core job responsibilities or key requirements
       - Location (city name only)
       Format: "[Company Info] seeking [Position] in [City]"
    4. A detailed job summary divided into three sections for the job detail panel:
       - Who we are: Brief company introduction and culture
       - Who we are looking for: Key requirements and ideal candidate profile
       - Benefits and Offerings: What makes this position attractive
    5. Key Requirements (2-4 most important hard requirements):
       Only include technical skills, certifications, licenses, or hard credentials.
       Do NOT include location, years of experience, soft skills, or generic terms (e.g., do NOT include "Melbourne", "Experience", "Team player", "Communication skills", etc).
       IMPORTANT: When extracting experience requirements, carefully distinguish between:
       - Candidate experience requirements (e.g., "5+ years experience", "senior level")
       - Company history descriptions (e.g., "Over our 24 years", "Our 55-year history", "We've been established for 30 years")
       If the text mentions company history, organization tenure, or establishment dates, DO NOT extract those as candidate experience requirements.
       Each requirement must be 3 words or less.
       Return as a comma-separated list, e.g.: "CPA, React, AWS, ASP Level 2".
       If none, return empty.
    6. A comprehensive matching analysis written in paragraphs:

       a) Overview (1-2 paragraphs):
          Provide a holistic assessment of how well I match this position, considering both technical and cultural fit.
          Include key factors that influenced the match score.

       b) Strengths to Stand Out (1 paragraph):
          Highlight my strongest matching points and competitive advantages for this position.
          Focus on direct matches in skills, experience, and qualifications.

       c) Potential Improvement Areas (1 paragraph):
          Address gaps in my required skills or experience.
          Provide specific suggestions for my application process (focus only on application-stage advice).
          Note any immediate steps that could strengthen my application.

       d) Transferable Advantages (1 paragraph):
          Discuss my relevant skills and experiences that, while not direct matches, could add value.
          Explain how these transferable skills apply to the role.

       e) Other Considerations (optional, 1 paragraph):
          Include any additional factors worth noting (e.g., my international experience, industry transitions).
          Mention any unique circumstances that could influence my application.
    
    For Good Opportunity Seekers, prioritize:
    - Company reputation and funding status
    - Competitive compensation mentions
    - Position level vs my expected position
    - Required qualifications and experience
    
    For Good Fit Seekers, prioritize:
    - Career priorities alignment
    - Work-life balance mentions
    - Industry and functional fit
    - Required qualifications and experience
    
    Consider location compatibility and highlight any significant location differences.
    
    Format your response as:
    Score: [number]
    
    Highlights:
    • [point 1]
    • [point 2]
    • [point 3]
    
    List Summary:
    [1 sentence summary]
    
    Detailed Summary:
    Who we are:
    [paragraph]
    
    Who we are looking for:
    [paragraph]
    
    Benefits and Offerings:
    [paragraph]
    
    Key Requirements:
    [requirement1, requirement2, requirement3, requirement4]
    
    Analysis:
    Overview:
    [1-2 paragraphs assessing overall match quality]

    Strengths to Stand Out:
    [1 paragraph highlighting key matching points]

    Potential Improvement Areas:
    [1 paragraph addressing gaps and application advice]

    Transferable Advantages:
    [1 paragraph discussing relevant indirect matches]

    Other Considerations:
    [1 paragraph on additional factors, if applicable]
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You are a professional career advisor providing detailed job match analysis and scoring."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content || '';
  
  // 解析子分数
  const experienceMatch = response.match(/Experience:\s*(\d+)/i);
  const industryMatch = response.match(/Industry:\s*(\d+)/i);
  const skillsMatch = response.match(/Skills:\s*(\d+)/i);
  const otherMatch = response.match(/Other:\s*(\d+)/i);
  
  const subScores = {
    experience: experienceMatch ? Math.min(Math.max(parseInt(experienceMatch[1]), 60), 95) : 75,
    industry: industryMatch ? Math.min(Math.max(parseInt(industryMatch[1]), 60), 95) : 75,
    skills: skillsMatch ? Math.min(Math.max(parseInt(skillsMatch[1]), 60), 90) : 75,
    other: otherMatch ? Math.min(Math.max(parseInt(otherMatch[1]), 60), 95) : 75
  };

  // 应用平台权重和位置权重到子分数
  const platformWeight = (jobData.platform || '').toLowerCase() === 'corporatedirect' ? 1.0 : 0.95;
  const locationWeight = getLocationWeight(jobData.jobLocation, userProfile.city);
  const totalWeight = platformWeight * locationWeight;
  
  const adjustedSubScores = {
    experience: Math.round(subScores.experience * totalWeight),
    skills: Math.round(subScores.skills * totalWeight),
    industry: Math.round(subScores.industry * totalWeight),
    other: Math.round(subScores.other * totalWeight)
  };

  // 使用调整后的子分数计算总分
  const calculatedScore = Math.round(
    0.3 * adjustedSubScores.experience + 
    0.35 * adjustedSubScores.skills + 
    0.2 * adjustedSubScores.industry + 
    0.15 * adjustedSubScores.other
  );

  let score = Math.min(calculatedScore, 95);
  
  // 提取 highlights
  const highlightsMatch = response.match(/Highlights:\n((?:•[^\n]+\n?)+)/);
  const highlights = highlightsMatch 
    ? highlightsMatch[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim().substring(1).trim())
    : [];
  
  // 提取 list summary
  const listSummaryMatch = response.match(/List Summary:\n([\s\S]*?)(?=\n\nDetailed Summary:)/);
  const listSummary = listSummaryMatch ? listSummaryMatch[1].trim() : '';
  
  // 提取 detailed summary
  const detailedSummaryMatch = response.match(/Detailed Summary:\n([\s\S]*?)(?=\n\nAnalysis:)/);
  const detailedSummary = detailedSummaryMatch ? detailedSummaryMatch[1].trim() : '';
  
  // 提取 key requirements
  const keyRequirementsMatch = response.match(/Key Requirements:\n([\s\S]*?)(?=\n\nAnalysis:)/);
  const keyRequirementsRaw = keyRequirementsMatch 
    ? keyRequirementsMatch[1].trim().split(',').map(req => req.trim()).filter(req => req.length > 0)
    : [];
  const keyRequirements = filterKeyRequirements(keyRequirementsRaw);
  
  // 提取详细分析
  const analysisMatch = response.match(/Analysis:\n([\s\S]*?)$/);
  const analysis = analysisMatch ? analysisMatch[1].trim() : '';
  
  return {
    score: Math.min(Math.max(score, 65), 95),
    subScores,
    highlights,
    listSummary,
    detailedSummary,
    keyRequirements,
    analysis
  };
}

// 导出主函数
export async function matchJobWithGPT(data: JobMatchRequest) {
  try {
    // 确定用户类型
    const userType = determineUserType(data.userProfile);
    
    // 计算匹配分数和分析
    const result = await calculateMatchScore(userType, data, data.userProfile);
    
    return {
      ...result,
      userType
    };
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw new Error('Failed to analyze job match');
  }
} 