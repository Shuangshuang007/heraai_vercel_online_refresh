import { useState } from 'react';
import type { Job } from '@/types/job';

interface UseTailorResumeProps {
  userProfile: any;
  language: 'en' | 'zh';
}

export function useTailorResume({ userProfile, language }: UseTailorResumeProps) {
  const [showTailorPreview, setShowTailorPreview] = useState(false);
  const [tailorJob, setTailorJob] = useState<Job | null>(null);

  const handleTailorResumeClick = async (job: Job) => {
    // 检查 Working Rights
    const wr =
      userProfile?.workingRightsAU ||
      userProfile?.workRights ||
      userProfile?.workingRights ||
      userProfile?.rightToWork ||
      userProfile?.visaStatus ||
      '';

    if (!wr.trim()) {
      console.error('Please fill Working Rights in Profile');
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(language === 'zh' ? '请在个人资料中填写工作权限' : 'Please fill Working Rights in Profile', 'error');
      } else {
        alert(language === 'zh' ? '请在个人资料中填写工作权限' : 'Please fill Working Rights in Profile');
      }
      return;
    }

    // 自动保存Job到MongoDB（如果用户没有保存过）
    if (userProfile?.email) {
      try {
        await fetch('/api/profile/upsert-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userProfile.email,
            jobId: job.id,
            jobSave: {
              title: job.title,
              company: job.company
            }
          })
        });
        console.log(`✓ Job "${job.title}" at ${job.company} auto-saved to MongoDB for Tailor Resume`);
      } catch (error) {
        console.warn('⚠ Failed to auto-save job to MongoDB');
        console.warn('Auto-save error:', error);
      }
    }

    // 显示 Tailor Resume 预览
    setTailorJob(job);
    setShowTailorPreview(true);
  };

  const handleCloseTailorPreview = () => {
    setShowTailorPreview(false);
    setTailorJob(null);
  };

  const handleTailorResumeGenerate = async (previewData: any) => {
    try {
      // 使用环境变量控制是否使用基础简历
      // 如果没有设置环境变量，默认使用基础简历模式（更稳定）
      const useBaseResume = process.env.NEXT_PUBLIC_TAILOR_USE_BASE_RESUME === 'true' || true;
      
      let resumeData;
      let payload;
      let res; // 声明 res 变量

      if (useBaseResume) {
        // 方案A：调用generator前先规范化languages数据
        const normalizedPreviewData = {
          ...previewData,
          languages: (previewData.languages || []).map((lang: any) => {
            // 规则1：如果是对象，格式化为 "Language (Level)"
            if (typeof lang === 'object' && lang) {
              const languageName = lang.language || lang.name || lang.label || 'Unknown';
              const level = lang.level || lang.proficiency || lang.value || 'Basic';
              
              // 映射到标准文案
              const standardLevel = (() => {
                const levelLower = String(level).toLowerCase();
                if (levelLower.includes('native') || levelLower.includes('母语')) return 'Native';
                if (levelLower.includes('fluent') || levelLower.includes('流利')) return 'Fluent';
                if (levelLower.includes('conversational') || levelLower.includes('日常')) return 'Conversational';
                if (levelLower.includes('basic') || levelLower.includes('基础')) return 'Basic';
                return level;
              })();
              
              return `${languageName} (${standardLevel})`;
            }
            
            // 规则2：如果是字符串，原样保留
            if (typeof lang === 'string') {
              return lang;
            }
            
            // 规则3：空或脏数据，丢弃并记日志
            console.warn('Invalid language data:', lang);
            return null;
          }).filter(Boolean) // 过滤掉null值
        };
        
        console.log('Tailor → 规范化后的languages:', normalizedPreviewData.languages);
        
        resumeData = normalizedPreviewData;
        payload = {
          resumeData,
          format: 'pdf'
        };
        
        // 调用 /api/tailor-resume
        res = await fetch('/api/tailor-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // 方案B：使用原有的 /api/tailor 接口
        resumeData = previewData;
        payload = {
          resumeJson: previewData,
          jobUrl: tailorJob?.url || tailorJob?.id || '',
          highlights: [], // 这里可以添加从job中提取的highlights
          requiredList: [] // 这里可以添加从job中提取的requiredList
        };
        
        // 调用 /api/tailor
        res = await fetch('/api/tailor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Tailor Resume API error:', res.status, errorText);
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      // 处理PDF响应
      const pdfBlob = await res.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `tailored_resume_${tailorJob?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'job'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      URL.revokeObjectURL(pdfUrl);
      
      console.log('✅ Tailor Resume generated and downloaded successfully');
      
      // 不自动关闭预览，让用户手动关闭
      // setShowTailorPreview(false);
      // setTailorJob(null);
    } catch (error) {
      console.error('Error generating tailored resume:', error);
      // 使用toast显示错误
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(language === 'zh' ? '生成定制简历失败' : 'Failed to generate tailored resume', 'error');
      } else {
        // 兜底方案
        alert(language === 'zh' ? '生成定制简历失败' : 'Failed to generate tailored resume');
      }
    }
  };

  return {
    showTailorPreview,
    tailorJob,
    handleTailorResumeClick,
    handleCloseTailorPreview,
    handleTailorResumeGenerate
  };
}



