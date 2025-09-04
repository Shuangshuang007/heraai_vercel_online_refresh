import React, { useState } from 'react';

interface EditableResumePreviewProps {
  resumeData: any;
  editableData: any;
  onUpdate: (data: any) => void;
  isEditing: boolean;
  review?: any;
  isCheckMode?: boolean;
}

export function EditableResumePreview({
  resumeData,
  editableData,
  onUpdate,
  isEditing,
  review,
  isCheckMode = false
}: EditableResumePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // 高亮渲染相关函数
  // 安全转义成正则
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 是否是单词（需要词边界）
  const needsWordBoundary = (s: string) => !/\s/.test(s); // 含空格则不加边界

  // 构建别名表（最小可用，后面再扩展）
  const aliasMap: Record<string, string[]> = {
    '.NET': ['dotnet', 'net framework'],
    'Power BI': ['powerbi'],
    'Stakeholder management': ['stakeholder mgmt', 'stakeholder management'],
  };

  // 标准化：小写、trim、合并空格（仅用于比较/去重，不用于切片）
  const norm = (t: string) => t.toLowerCase().replace(/\s+/g, ' ').trim();

  // 组合：原词 + 别名 → 正则 alternation（按长度降序，优先长词/词组，避免部分覆盖）
  const buildPattern = (missingList: string[]) => {
    const variants: string[] = [];
    const seen = new Set<string>();

    for (const raw of missingList || []) {
      if (!raw) continue;
      const canonical = norm(raw);
      if (seen.has(canonical)) continue;
      seen.add(canonical);

      const all = [raw, ...(aliasMap[raw] || [])];
      for (const term of all) {
        const t = term.trim();
        if (!t) continue;
        const esc = escapeRegex(t);
        variants.push(needsWordBoundary(t) ? `\\b${esc}\\b` : esc);
      }
    }

    // 按长度降序，避免 "net" 抢先匹配 ".NET"
    return variants.sort((a, b) => b.length - a.length).join('|');
  };

  // === 关键：在"原字符串"上做一次性正则切分，返回 React 节点数组 ===
  const highlightInline = (text: string, missingList: string[], isCheckMode: boolean): React.ReactNode[] => {
    if (!isCheckMode || !missingList || missingList.length === 0) return [text];

    const pattern = buildPattern(missingList);
    if (!pattern) return [text];

    // 分割成句子（按句号、感叹号、问号分割）
    const sentences = text.split(/(?<=[.!?])\s+/);
    const result: React.ReactNode[] = [];
    
    sentences.forEach((sentence, sentenceIndex) => {
      // 检查这个句子是否包含任何技能词
      const hasSkill = missingList.some(skill => {
        const normalizedSkill = norm(skill);
        const normalizedSentence = norm(sentence);
        return normalizedSentence.includes(normalizedSkill);
      });
      
      if (hasSkill) {
        // 如果句子包含技能词，高亮整个句子，并为missing词语添加红色字体
        const highlightedSentence = highlightMissingWords(sentence, missingList);
        result.push(
          <span key={`sentence-${sentenceIndex}`} className="mr-bad">
            {highlightedSentence}
          </span>
        );
      } else {
        // 如果句子不包含技能词，保持原样
        result.push(sentence);
      }
      
      // 添加空格分隔符（除了最后一个句子）
      if (sentenceIndex < sentences.length - 1) {
        result.push(' ');
      }
    });
    
    return result;
  };

  // 新增：为missing词语添加红色字体样式
  const highlightMissingWords = (text: string, missingList: string[]): React.ReactNode[] => {
    if (!missingList || missingList.length === 0) return [text];

    // 构建更宽泛的匹配模式（支持大小写和连字符）
    const buildWidePattern = (words: string[]) => {
      const variants: string[] = [];
      const seen = new Set<string>();

      for (const word of words) {
        if (!word) continue;
        
        // 标准化：小写、移除连字符
        const normalized = word.toLowerCase().replace(/-/g, '');
        if (seen.has(normalized)) continue;
        seen.add(normalized);

        // 创建多种变体
        const variants_for_word = [
          word, // 原词
          word.toLowerCase(), // 小写
          word.toUpperCase(), // 大写
          word.replace(/-/g, ''), // 移除连字符
          word.replace(/-/g, ' '), // 连字符变空格
          word.replace(/-/g, '_'), // 连字符变下划线
        ];

        for (const variant of variants_for_word) {
          if (variant && !variants.includes(variant)) {
            variants.push(variant);
          }
        }
      }

      // 按长度降序排列
      return variants.sort((a, b) => b.length - a.length);
    };

    const patterns = buildWidePattern(missingList);
    if (patterns.length === 0) return [text];

    // 分割文本并高亮匹配的词语
    let remainingText = text;
    const result: React.ReactNode[] = [];
    let keyIndex = 0;

    while (remainingText.length > 0) {
      let bestMatch = '';
      let bestIndex = -1;

      // 找到最佳匹配（最长匹配优先）
      for (const pattern of patterns) {
        const index = remainingText.toLowerCase().indexOf(pattern.toLowerCase());
        if (index !== -1 && (bestIndex === -1 || index < bestIndex || 
            (index === bestIndex && pattern.length > bestMatch.length))) {
          bestMatch = pattern;
          bestIndex = index;
        }
      }

      if (bestIndex === -1) {
        // 没有匹配，添加剩余文本
        result.push(remainingText);
        break;
      }

      // 添加匹配前的文本
      if (bestIndex > 0) {
        result.push(remainingText.substring(0, bestIndex));
      }

      // 添加高亮的词语（红色字体）
      result.push(
        <span key={`missing-${keyIndex++}`} className="mr-missing-text">
          {remainingText.substring(bestIndex, bestIndex + bestMatch.length)}
        </span>
      );

      // 更新剩余文本
      remainingText = remainingText.substring(bestIndex + bestMatch.length);
    }

    return result;
  };

  // 行级兜底：只要文本里"包含"其中任意（忽略大小写/多空格），就给整行一个淡红底
  const shouldLineHit = (text: string, missingList: string[], isCheckMode: boolean): boolean => {
    if (!isCheckMode || !missingList || missingList.length === 0) return false;
    const T = norm(text);
    return missingList.some(s => T.includes(norm(s)));
  };

  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingField && editValue.trim() !== '') {
      if (editingField.startsWith('skill-')) {
        // 处理技能编辑
        const skillIndex = parseInt(editingField.split('-')[1]);
        const newSkills = [...editableData.skills];
        newSkills[skillIndex] = editValue;
        onUpdate({
          ...editableData,
          skills: newSkills
        });
      } else if (editingField.startsWith('highlight-')) {
        // 处理 Personal Highlights 编辑
        const highlightIndex = parseInt(editingField.split('-')[1]);
        const newHighlights = [...(resumeData.personalHighlights || [])];
        newHighlights[highlightIndex] = editValue;
        onUpdate({
          ...editableData,
          personalHighlights: newHighlights
        });
      } else if (editingField.startsWith('job-')) {
        // 处理工作经验编辑
        const parts = editingField.split('-');
        const jobIndex = parseInt(parts[1]);
        const fieldType = parts[2];
        const bulletIndex = parts[3];
        
        const newExperience = [...(resumeData.experience || [])];
        if (fieldType === 'bullet' && bulletIndex !== undefined) {
          // 编辑工作经验的 bullet points
          if (!newExperience[jobIndex]) newExperience[jobIndex] = {};
          if (!newExperience[jobIndex].bullets) newExperience[jobIndex].bullets = [];
          newExperience[jobIndex].bullets[parseInt(bulletIndex)] = editValue;
        } else {
          // 编辑其他工作信息
          if (!newExperience[jobIndex]) newExperience[jobIndex] = {};
          newExperience[jobIndex][fieldType] = editValue;
        }
        
        onUpdate({
          ...editableData,
          experience: newExperience
        });
      } else if (editingField.startsWith('edu-')) {
        // 处理教育背景编辑
        const parts = editingField.split('-');
        const eduIndex = parseInt(parts[1]);
        const fieldType = parts[2];
        
        const newEducation = [...(resumeData.education || [])];
        newEducation[eduIndex][fieldType] = editValue;
        
        onUpdate({
          ...editableData,
          education: newEducation
        });
      } else {
        // 处理其他字段编辑（如姓名、邮箱等）
        onUpdate({
          ...editableData,
          [editingField]: editValue
        });
      }
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const renderEditableText = (field: string, value: string, className: string = '') => {
    if (editingField === field) {
      return (
        <div className="relative">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className={`w-full p-2 border-2 border-blue-400 rounded bg-blue-50 ${className}`}
            autoFocus
            rows={field === 'summary' ? 3 : 1}
          />
          <div className="absolute top-1 right-1 flex space-x-1">
            <button
              onClick={saveEdit}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 shadow-sm"
            >
              ✓
            </button>
            <button
              onClick={cancelEdit}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 shadow-sm"
            >
              ✕
            </button>
          </div>
        </div>
      );
    }

    // 如果不在编辑模式，检查是否需要高亮
    let displayContent: React.ReactNode = value;
    
    if (isCheckMode && review?.required) {
      const allKeywords = [
        ...(review.required.missing || []),
        ...(review.required.covered || [])
      ];
      
      if (allKeywords.length > 0) {
        displayContent = highlightInline(value, allKeywords, isCheckMode);
      }
    }

    return (
      <span 
        className={`cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 px-1 py-0.5 rounded transition-colors ${className}`}
        onClick={() => startEditing(field, value)}
        title="Click to edit"
      >
        {displayContent}
      </span>
    );
  };

  const renderEditableSkills = () => {
    const skills = editableData.skills || [];
    
    // 构建缺失项和命中项的 Set，用于快速查找
    const toNormSet = (arr?: string[]) => {
      const s = new Set<string>();
      (arr || []).forEach(x => s.add(norm(x)));
      return s;
    };

    const missingSet = toNormSet(review?.required?.missing);
    const coveredSet = toNormSet(review?.required?.covered);
    
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {skills.map((skill: string, index: number) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            {editingField === `skill-${index}` ? (
              <div style={{ position: 'relative' }}>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={saveEdit}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    backgroundColor: '#eff6ff',
                    fontSize: '11px'
                  }}
                  autoFocus
                />
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: '2px 4px',
                      fontSize: '10px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '2px 4px',
                      fontSize: '10px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  backgroundColor: isCheckMode && missingSet.has(norm(skill)) ? '#fef2f2' : 
                    isCheckMode && coveredSet.has(norm(skill)) ? '#f0fdf4' : 
                    '#f3f4f6',
                  color: isCheckMode && missingSet.has(norm(skill)) ? '#dc2626' : 
                    isCheckMode && coveredSet.has(norm(skill)) ? '#16a34a' : 
                    '#374151',
                  border: isCheckMode && missingSet.has(norm(skill)) ? '1px solid #fecaca' : 
                    isCheckMode && coveredSet.has(norm(skill)) ? '1px solid #bbf7d0' : 
                    'none'
                }}
                onClick={() => startEditing(`skill-${index}`, skill)}
                title="Click to edit"
              >
                {skill}
              </span>
            )}
            <button
              onClick={() => {
                const newSkills = skills.filter((_: string, i: number) => i !== index);
                onUpdate({ ...editableData, skills: newSkills });
              }}
              style={{
                marginLeft: '4px',
                color: '#ef4444',
                fontSize: '11px',
                fontWeight: 'bold',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newSkills = [...skills, 'New Skill'];
            onUpdate({ ...editableData, skills: newSkills });
          }}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            color: '#6b7280',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          + Add Skill
        </button>
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '13px',
      lineHeight: '1.4',
      color: '#333',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '6px',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          {renderEditableText('name', resumeData.profile.name)}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#666666',
          marginBottom: '14px',
          textAlign: 'center'
        }}>
          {renderEditableText('location', resumeData.profile.location)} • {renderEditableText('phone', resumeData.profile.phone)} • {renderEditableText('email', resumeData.profile.email)}
          {resumeData.linkedin && ` • LinkedIn: ${renderEditableText('linkedin', resumeData.linkedin)}`}
        </div>
      </div>

      {/* Professional Highlights */}
      {resumeData.summary && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Highlights
          </div>
          <div style={{
            fontSize: '13px',
            color: '#333333',
            lineHeight: '1.5',
            marginBottom: '14px',
            whiteSpace: 'pre-line'
          }}>
            {renderEditableText('summary', resumeData.summary)}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Employment History
          </div>
          <div style={{ marginBottom: '0' }}>
            {resumeData.experience.map((job: any, index: number) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '3px',
                  color: '#1a1a1a'
                }}>
                  {renderEditableText(`job-title-${index}`, job.title)}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: '#666666',
                  marginBottom: '4px'
                }}>
                  <strong>{renderEditableText(`job-company-${index}`, job.company)}</strong>
                  {job.location && typeof job.location === 'string' && job.location.trim() && (
                    <>
                      , <span style={{ fontWeight: 'normal', fontStyle: 'normal' }}>
                        {renderEditableText(`job-location-${index}`, job.location)}
                      </span>
                    </>
                  )}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#888888',
                  marginBottom: '4px'
                }}>
                  {renderEditableText(`job-start-${index}`, job.startDate)} - {renderEditableText(`job-end-${index}`, job.endDate)}
                </div>
                {job.bullets && job.bullets.length > 0 && (
                  <ul style={{
                    margin: '0',
                    paddingLeft: '16px',
                    listStyle: 'disc'
                  }}>
                    {job.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex} style={{
                        margin: '0',
                        padding: '0',
                        marginBottom: '4px',
                        fontSize: '13px',
                        color: '#333333',
                        lineHeight: '1.3'
                      }}>
                        {renderEditableText(`job-bullet-${index}-${bulletIndex}`, bullet)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </div>

          <div style={{ marginBottom: '0' }}>
            {resumeData.education.map((edu: any, index: number) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginBottom: '3px',
                  color: '#1a1a1a'
                }}>
                  {renderEditableText(`edu-degree-${index}`, edu.degree)}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: '#666666',
                  marginBottom: '5px'
                }}>
                  <strong>{renderEditableText(`edu-institution-${index}`, edu.institution)}</strong>
                  {/* 暂时注释掉Education Location的渲染 */}
                  {/* {typeof edu.location === 'string' && edu.location && `, ${renderEditableText(`edu-location-${index}`, edu.location)}`} */}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#888888',
                  marginBottom: '7px'
                }}>
                  {renderEditableText(`edu-start-${index}`, edu.startDate)} - {renderEditableText(`edu-end-${index}`, edu.endDate)}
                </div>
                {edu.field && (
                  <div style={{
                    fontSize: '11px',
                    color: '#333333'
                  }}>
                    {/* {renderEditableText(`edu-field-${index}`, edu.field)} */}
                  </div>
                )}
                {edu.description && Array.isArray(edu.description) && edu.description.length > 0 && (
                  <ul style={{
                    margin: '0',
                    paddingLeft: '16px',
                    listStyle: 'disc'
                  }}>
                    {edu.description.map((desc: string, descIndex: number) => (
                      <li key={descIndex} style={{
                        margin: '0',
                        padding: '0',
                        marginBottom: '4px',
                        fontSize: '13px',
                        color: '#333333'
                      }}>
                        {renderEditableText(`edu-description-${index}-${descIndex}`, desc.replace(/^•\s*/, ''))}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills and Additional Info */}
      {(resumeData.skills || resumeData.languages || resumeData.workingRightsAU) && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Additional Information
          </div>
          
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '0'
              }}>Skills:</div>
              {renderEditableSkills()}
            </div>
          )}

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '0'
              }}>Languages:</div>
              <div style={{
                fontSize: '13px',
                color: '#333333',
                lineHeight: '1.4'
              }}>
                {resumeData.languages.filter((lang: any, index: number, arr: any[]) => {
                  // 去重逻辑：基于 language 和 level 的组合去重
                  if (typeof lang === 'object' && lang.language) {
                    const firstIndex = arr.findIndex(item => 
                      typeof item === 'object' && 
                      item.language === lang.language && 
                      item.level === lang.level
                    );
                    return firstIndex === index;
                  } else if (typeof lang === 'string') {
                    const firstIndex = arr.findIndex(item => item === lang);
                    return firstIndex === index;
                  }
                  return true;
                }).map((lang: any, index: number) => {
                  // 确保 lang 是对象且有正确的属性
                  if (typeof lang === 'object' && lang.language) {
                    return (
                      <span key={index} style={{
                        display: 'inline-block',
                        marginRight: '12px'
                      }}>
                        {lang.language} ({lang.level || 'Basic'})
                      </span>
                    );
                  } else if (typeof lang === 'string') {
                    // 如果 lang 是字符串，直接显示
                    return (
                      <span key={index} style={{
                        display: 'inline-block',
                        marginRight: '12px'
                      }}>
                        {lang}
                      </span>
                    );
                  } else {
                    // 兜底处理
                    return (
                      <span key={index} style={{
                        display: 'inline-block',
                        marginRight: '12px'
                      }}>
                        Unknown Language
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Working Rights */}
          {resumeData.workingRightsAU && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '0'
              }}>Working Rights:</div>
              <div style={{
                fontSize: '13px',
                color: '#333333',
                lineHeight: '1.4'
              }}>{resumeData.workingRightsAU}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
