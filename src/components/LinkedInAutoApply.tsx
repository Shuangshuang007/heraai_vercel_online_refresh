import React, { useState } from 'react';
import { Job } from '@/types/job';
import { deduplicateJobTitle } from '../utils/titleDeduplicator';

interface LinkedInAutoApplyProps {
  job: Job;
  onApplyStart?: () => void;
  onApplyComplete?: () => void;
}

// 构建 LinkedIn 搜索 URL
const buildLinkedInSearchUrl = (jobTitle: string, location: string): string => {
  const keywords = encodeURIComponent(jobTitle);
  const locationParam = encodeURIComponent(location);
  return `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${locationParam}`;
};

// 模拟自动申请流程
const handleLinkedInAutoApply = async (job: Job) => {
  // 1. 打开新标签页
  window.open(job.url, '_blank');

  // 2. 显示申请提示
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(`准备申请职位：${deduplicateJobTitle(job.title)}\n\n公司：${job.company}\n地点：${job.location}\n\n请在新打开的标签页中完成申请流程。`);
      resolve(true);
    }, 1000);
  });
};

export const LinkedInAutoApply: React.FC<LinkedInAutoApplyProps> = ({ 
  job, 
  onApplyStart, 
  onApplyComplete 
}) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      onApplyStart?.();
      
      await handleLinkedInAutoApply(job);
      
      onApplyComplete?.();
    } catch (error) {
      console.error('申请过程中出错:', error);
      alert('申请过程中出现错误，请重试。');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleApply}
        disabled={isApplying}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isApplying 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isApplying ? 'Applying...' : 'Auto Apply'}
      </button>
      
      <div className="mt-2 text-sm text-gray-600">
        <a 
          href={buildLinkedInSearchUrl(deduplicateJobTitle(job.title), job.location)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Search Similar Jobs on LinkedIn
        </a>
      </div>
    </div>
  );
}; 