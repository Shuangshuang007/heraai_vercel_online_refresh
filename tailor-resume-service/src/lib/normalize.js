function toBulletArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map(x => (typeof x === 'string' ? x : String(x || '')))
      .map(s => s.replace(/^[•*\-\u2022]\s*/,'').trim())
      .filter(Boolean);
  }
  return String(v)
    .split('\n')
    .map(s => s.replace(/^[•*\-\u2022]\s*/,'').trim())
    .filter(Boolean);
}

// ⚠️ 这里的键名/层级必须与 Profile 导出一致
function toPdfResumeInput(form) {
  // 安全检查：确保 form 存在
  if (!form || typeof form !== 'object') {
    console.log('⚠️ form 参数无效，使用默认值');
    form = {};
  }

  // 添加调试信息
  console.log('🔍 前端传递的form数据:');
  console.log('workingRightsAU:', form.workingRightsAU);
  console.log('education:', form.education);
  console.log('skills:', form.skills);
  console.log('languages:', form.languages);
  
  // 添加这些缺失的调试信息：
  console.log('form.name:', form.name);
  console.log('form.title:', form.title);
  console.log('form.summary:', form.summary);
  console.log('form.contact:', form.contact);
  console.log('form.experiences:', form.experiences);

  const profile = {
    // 优先使用新字段结构，兼容旧字段结构
    name: form.name || `${form.firstName || ''} ${form.lastName || ''}`.trim(),
    email: form.contact?.email || form.email || '',
    phone: form.contact?.phone || form.phone || '',
    location: form.contact?.location || (form.city ? `${form.city}, ${form.country || ''}` : (form.country || ''))
  };
  
  // 调试：打印接收到的所有字段
  console.log('🔍 接收到的所有字段:');
  console.log('form.name:', form.name);
  console.log('form.title:', form.title);
  console.log('form.summary:', form.summary);
  console.log('form.contact:', form.contact);
  console.log('form.experiences:', form.experiences);

  // ✅ Skills：直接使用前端传递的skills数组
  const skills = Array.isArray(form.skills)
    ? form.skills
        .map(s => {
          if (typeof s === 'string') return s;
          if (s && typeof s === 'object') return s.name || s.label || '';
          return '';
        })
        .map(s => s.trim())
        .filter(Boolean)
    : [];

  // ✅ Work Rights：直接使用前端传递的workingRightsAU，不要过滤
  const workRights = form.workingRightsAU || '';

  const experience = (form.employment || []).map(j => ({
    title: j.position || j.title || '',
    company: j.company || '',
    location: j.location || '',
    startDate: j.startDate || '',
    endDate: j.endDate || 'Present',
    description: toBulletArray(j.description)
  }));

  const education = (form.education || []).map(e => ({
    degree: e.degree || '',
    institution: e.school || e.institution || '',  // 前端使用school字段，不要过滤
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    description: toBulletArray(e.field || e.summary || e.description)  // 前端使用field或summary字段
  }));

  const languages = Array.isArray(form.languages)
    ? form.languages
        .map(l => {
          if (typeof l === 'string') return l;
          if (l && typeof l === 'object') return l.language || l.name || l.label || '';
          return '';
        })
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .filter((value, index, self) => self.indexOf(value) === index)  // 简单去重
    : [];

  // ⚠️ 返回结构与 resume-pdf-service 期望一致
  return {
    // 基本信息 - 直接对应 resume-pdf-service 期望的顶级字段
    name: form.name || profile.name || '',
    title: form.title || form.jobTitle || '',
    contact: {
      email: form.contact?.email || profile.email || '',
      phone: form.contact?.phone || profile.phone || '',
      location: form.contact?.location || profile.location || ''
    },
    summary: form.summary || form.about || '',
    experiences: experience,                // 直接使用 experience 数组
    
    // 兼容字段 - 保持向后兼容
    profile,
    personalHighlights: toBulletArray(form.about),
    experience,                            // 保持原有字段名
    education,
    skills,
    languages,
    workingRightsAU: workRights,
    workingRightsOther: form.workingRightsOther || '',
    linkedin: form.linkedin || '',
    
    // 关键词映射
    keywordMappings: form.keywordMappings || []
  };
}

module.exports = { toPdfResumeInput };
