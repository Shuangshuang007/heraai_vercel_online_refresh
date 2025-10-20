import React from 'react';
import { Job } from '@/types/job';
import { LinkedInAutoApply } from '@/components/LinkedInAutoApply';
import { buildSearchUrl } from '@/utils/platformMapping';
import { deduplicateJobTitle } from '@/utils/titleDeduplicator';

interface JobDetailPanelProps {
  job: Job | null;
  language: 'en' | 'zh';
  compact?: boolean;
}

// 计算距离今天的天数
function getDaysAgo(dateStr?: string): number | null {
  if (!dateStr) return null;
  // 兼容 "27d ago"、"27 days ago"、"Posted 27 days ago"
  const match = dateStr.match(/(\d+)\s*d(?:ays)?\s*ago/i);
  if (match) return parseInt(match[1], 10);
  // 标准日期格式
  const parsed = Date.parse(dateStr.replace(/\./g, '-').replace(/\//g, '-'));
  if (!isNaN(parsed)) {
    const now = new Date();
    const diff = now.getTime() - parsed;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  return null;
}

export function JobDetailPanel({ job, language, compact }: JobDetailPanelProps) {
  if (!job) {
    return (
      <div className={`h-full flex items-center justify-center bg-white rounded-lg border border-gray-200 ${compact ? 'p-2' : 'p-8'}`}>
        <div className="text-center">
          <h3 className={`text-lg font-medium text-gray-900 mb-2 ${compact ? 'mb-1' : 'mb-2'}`}>{language === 'zh' ? '选择一个职位查看详情' : 'Select a job to view details'}</h3>
          <p className="text-gray-500 text-sm">{language === 'zh' ? '从左侧列表中选择一个职位，查看完整的职位描述和要求。' : 'Choose a job from the list to view its full description and requirements.'}</p>
        </div>
      </div>
    );
  }

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === 'string'
      ? (job.requirements as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [];

  return (
    <div className={`h-full bg-white rounded-lg border border-gray-200 overflow-y-auto ${compact ? 'p-2' : 'p-6'}`} style={compact ? { fontSize: '14px', lineHeight: '1.4' } : {}}>
      <div className={compact ? 'mb-2' : 'mb-4'}>
        <div className="flex justify-between items-center">
          <h2 className={`font-bold text-gray-900 dark:text-white ${compact ? 'text-base' : 'text-2xl'}`}>{deduplicateJobTitle(job.title)}</h2>
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gray-100 text-blue-700 font-bold rounded-lg hover:bg-gray-200 transition-colors ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
              style={{ display: 'inline-block', textAlign: 'center' }}
            >
              {language === 'zh' ? '申请' : 'Apply'}
            </a>
          ) : (
            <button
              className={`bg-gray-100 text-blue-700 font-bold rounded-lg hover:bg-gray-200 transition-colors ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
              disabled
            >
              {language === 'zh' ? '申请' : 'Apply'}
            </button>
          )}
        </div>
        <h3 className={`font-semibold text-gray-800 dark:text-gray-200 ${compact ? 'text-sm mt-1' : 'text-xl'}`}>{job.company}</h3>
      </div>
      <div className={`flex flex-wrap gap-2 text-xs text-gray-500 ${compact ? 'mt-2' : 'mt-4'}`}> {/* 位置、薪资、发布时间 */}
        <span>{job.location}</span>
        {job.salary && <span>• {job.salary}</span>}
        {job.postedDate && (
          (() => {
            const daysAgo = getDaysAgo(job.postedDate);
            if (daysAgo !== null && daysAgo > 24) {
              return <span>• {language === 'zh' ? '即将过期' : 'Expiring soon'}</span>;
            } else if (daysAgo !== null && daysAgo >= 0) {
              return <span>• {language === 'zh' ? `发布于${daysAgo}天前` : `Posted ${daysAgo} days ago`}</span>;
            } else {
              return <span>• {language === 'zh' ? '发布于' : 'Posted'} {job.postedDate}</span>;
            }
          })()
        )}
      </div>
      {/* Job Summary */}
      <div className={compact ? 'mb-2' : 'mb-6'}>
        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm mb-1' : 'text-base mb-3'}`}>{language === 'zh' ? '职位概要' : 'Job Summary'}</h3>
        <div className={compact ? 'space-y-1' : 'space-y-4'}>
          {/* Who we are */}
          <div>
            <span className="text-xs font-medium text-gray-800">{language === 'zh' ? '公司介绍' : 'Who we are'}: </span>
            <span className="text-xs text-gray-600 ml-1">{(job.detailedSummary?.split('\n\n')[0] || job.summary || '').replace(/^Who we are:\s*/i, '').replace(/^公司介绍:\s*/i, '')}</span>
          </div>
          {/* Who we are looking for */}
          <div>
            <span className="text-xs font-medium text-gray-800">{language === 'zh' ? '理想候选人' : 'Who we are looking for'}: </span>
            <span className="text-xs text-gray-600 ml-1">{(job.detailedSummary?.split('\n\n')[1] || '').replace(/^Who we are looking for:\s*/i, '').replace(/^理想候选人:\s*/i, '')}</span>
          </div>
          {/* Benefits and Offerings */}
          <div>
            <span className="text-xs font-medium text-gray-800">{language === 'zh' ? '福利待遇' : 'Benefits and Offerings'}: </span>
            <span className="text-xs text-gray-600 ml-1">{(job.detailedSummary?.split('\n\n')[2] || '').replace(/^Benefits and Offerings:\s*/i, '').replace(/^福利待遇:\s*/i, '')}</span>
          </div>
        </div>
      </div>
      {/* Matching Summary Section */}
      {(job.matchScore !== undefined || job.matchAnalysis) && (
        <div className={compact ? 'mt-2 mb-2' : 'mt-6 mb-6'}>
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm mb-1' : 'text-base mb-3'}`}>{language === 'zh' ? '匹配分析' : 'Matching Summary'}</h3>
          <div className={`bg-gray-50 rounded-lg ${compact ? 'p-2' : 'p-4'}`}>
            {job.matchScore !== undefined && (
              <div className="text-xs font-semibold text-blue-700 mb-1">
                {language === 'zh' ? '匹配分数' : 'Match Score'}: {job.matchScore}
              </div>
            )}
            {job.matchAnalysis && (
              <div className={compact ? 'space-y-1' : 'space-y-2'}>
                {job.matchAnalysis.split('\n\n').map((section, index) => {
                  const [title, ...content] = section.split('\n');
                  return (
                    <div key={index}>
                      <span className="text-xs font-medium text-gray-800">{title}</span>
                      <span className="text-xs text-gray-700"> {content.join(' ')}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 