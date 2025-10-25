import { NextRequest, NextResponse } from 'next/server';

// 技能别名映射表
const skillAliases: Record<string, string[]> = {
  'react': ['react.js', 'reactjs', 'reactjs'],
  'javascript': ['js', 'ecmascript'],
  '.net': ['dotnet', 'dot net', 'asp.net'],
  'aws': ['amazon web services', 'amazon aws'],
  'sql': ['sql databases', 'database', 'rdbms'],
  'agile': ['scrum', 'kanban', 'lean'],
  'devops': ['ci/cd', 'continuous integration', 'deployment'],
  'power bi': ['powerbi', 'power bi', 'microsoft power bi'],
  'stakeholder management': ['stakeholder mgmt', 'stakeholder', 'stakeholders']
};

// 标准化技能名称
const normalizeSkill = (skill: string): string => {
  return skill
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // 移除标点符号
    .replace(/\s+/g, ' ')    // 统一空格
    .trim();
};

// 检查技能是否被覆盖
const isSkillCovered = (jdSkill: string, resumeSkills: string[], resumeText: string): boolean => {
  const normalizedJD = normalizeSkill(jdSkill);
  
  // 1. 完全匹配
  if (resumeSkills.some(skill => normalizeSkill(skill) === normalizedJD)) {
    return true;
  }
  
  // 2. 别名匹配
  for (const [key, aliases] of Object.entries(skillAliases)) {
    if (aliases.includes(normalizedJD) || normalizedJD === key) {
      if (resumeSkills.some(skill => 
        aliases.includes(normalizeSkill(skill)) || normalizeSkill(skill) === key
      )) {
        return true;
      }
    }
  }
  
  // 3. 部分匹配（如 "AWS Cloud" 匹配 "AWS"）
  if (resumeSkills.some(skill => 
    normalizedJD.includes(normalizeSkill(skill)) || 
    normalizeSkill(skill).includes(normalizedJD)
  )) {
    return true;
  }
  
  // 4. 在简历文本中查找（包括 experience bullets, summary 等）
  const normalizedResumeText = normalizeSkill(resumeText);
  if (normalizedResumeText.includes(normalizedJD)) {
    return true;
  }
  
  // 5. 检查别名在文本中的出现
  for (const [key, aliases] of Object.entries(skillAliases)) {
    if (aliases.includes(normalizedJD) || normalizedJD === key) {
      if (aliases.some(alias => normalizedResumeText.includes(alias)) || 
          normalizedResumeText.includes(key)) {
        return true;
      }
    }
  }
  
  return false;
};

export async function POST(request: NextRequest) {
  try {
    const { resumeJson, jobRequirements } = await request.json();
    
    if (!resumeJson || !jobRequirements) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { required, niceToHave, jdSummary } = jobRequirements;
    
    // 构建简历文本用于搜索
    const resumeText = [
      resumeJson.summary || '',
      ...(resumeJson.experience || []).map((exp: any) => 
        (exp.bullets || []).join(' ')
      ).join(' '),
      ...(resumeJson.education || []).map((edu: any) => 
        [edu.degree, edu.field, edu.description].filter(Boolean).join(' ')
      ).join(' '),
      (resumeJson.skills || []).join(' ')
    ].join(' ');

    // 检查 required skills 覆盖情况
    const requiredCovered: string[] = [];
    const requiredMissing: string[] = [];
    
    (required || []).forEach((skill: string) => {
      if (isSkillCovered(skill, resumeJson.skills || [], resumeText)) {
        requiredCovered.push(skill);
      } else {
        requiredMissing.push(skill);
      }
    });

    // 检查 nice-to-have skills 覆盖情况
    const niceCovered: string[] = [];
    const niceMissing: string[] = [];
    
    (niceToHave || []).forEach((skill: string) => {
      if (isSkillCovered(skill, resumeJson.skills || [], resumeText)) {
        niceCovered.push(skill);
      } else {
        niceMissing.push(skill);
      }
    });

    const review = {
      required: {
        covered: requiredCovered,
        missing: requiredMissing,
        total: required.length,
        covered_count: requiredCovered.length
      },
      nice_to_have: {
        covered: niceCovered,
        missing: niceMissing
      }
    };

    console.log('🔍 Required Check Result:', review);

    return NextResponse.json({ review });

  } catch (error) {
    console.error('Required check failed:', error);
    return NextResponse.json(
      { error: 'Required check failed' },
      { status: 500 }
    );
  }
}
