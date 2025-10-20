'use client';

import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { type Job } from '@/types/job';  // Import Job type from types directory
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { handleBatchLinkedInApply } from '@/utils/jobSearch';
import { generateSearchUrls } from '@/utils/platformMapping';
import { JobSummaryCard } from '@/components/JobSummaryCard';
import { JobDetailModal } from '@/components/JobDetailModal';
import { JobAssistant, Preferences, JobAssistantRef } from '@/components/JobAssistant';
import { useSearchParams, useRouter } from 'next/navigation';
import { HeraComputer } from '@/components/HeraComputer';
import { JobDetailPanel } from '@/components/JobDetailPanel';
import { StorageManager } from '@/utils/storage';
import { JobTitleSelector } from '@/components/JobTitleSelector';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { fetchJobs } from '@/services/jobFetchService';
import { normalizeEmploymentType, parseWorkMode } from '@/utils/employmentUtils';
import { Checkbox } from '@/components/ui/Checkbox';

interface JobResult {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

interface LinkedInJob {
  title: string;
  company: string;
  location: string;
  link: string;
  description: string;
}

// Add cache-related constants and types
const CACHE_KEY = 'job_search_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours expiry

interface CacheData {
  jobs: Job[];
  timestamp: number;
  searchParams: {
    jobTitle: string;
    city: string;
    skills: string[];
  };
}

// Cache utility functions
const cacheUtils = {
  getCache: (): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: CacheData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - data.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  },
  
  setCache: (jobs: Job[], searchParams: { jobTitle: string; city: string; skills: string[] }) => {
    try {
      const cacheData: CacheData = {
        jobs,
        timestamp: Date.now(),
        searchParams
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },
  
  clearCache: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};

// Scroll following logic (with type declaration)
function useSmartAutoScroll(ref: React.RefObject<HTMLDivElement>, dep: any[]) {
  const [isAuto, setIsAuto] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isAuto) {
      el.scrollTop = el.scrollHeight;
    }
    const onScroll = () => {
      // Distance from bottom less than 30px to auto scroll, otherwise user manually scroll
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) {
        setIsAuto(true);
      } else {
        setIsAuto(false);
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [ref, dep, isAuto]);
  useEffect(() => {
    if (isAuto && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep, isAuto, ref]);
}

const fetchLinkedInJobs = async (keywords: string, location: string, appendToTerminal: (message: string) => void, limit: number = 60) => {
  appendToTerminal('Fetching LinkedIn jobs data...');
  try {
    const response = await fetch(`/api/job-fetch-router/linkedin?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    appendToTerminal(`Successfully fetched ${data.jobs.length} LinkedIn jobs`);
    return data;
  } catch (error: any) {
    appendToTerminal(`✗ Failed to fetch LinkedIn jobs: ${error.message}`);
    throw error;
  }
};

const PROFILE_KEYWORDS = [
  // English expressions
  'find job', 'new job', 'change city', 'change industry', 'change salary', 'relocate', 'search new jobs', 'recommend jobs', 'apply jobs', 'switch role', 'change company',
  // Chinese expressions (keeping these for user interface)
  '找工作', '换工作', '换城市', '换行业', '换薪资', '调动', '搜新工作', '推荐职位', '投职位', '换岗位', '换公司',
  // Field names in English
  'first name', 'last name', 'email', 'phone', 'country', 'city', 'job title', 'seniority', 'open for relocation', 'expected salary', 'education', 'employment history', 'career priorities',
  // Field names in Chinese (keeping these for user interface)
  '姓名', '名字', '姓氏', '邮箱', '电话', '国家', '城市', '职位', '级别', '意向城市', '薪资', '学历', '教育', '工作经历', '就业经历', '职业偏好', '公司声誉', '薪酬', '地点', '平衡', '混合办公', '晋升', '价值观', '行业匹配', '职能匹配', '文化匹配'
];

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function JobsPageContent() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [pagedJobs, setPagedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchUrls, setSearchUrls] = useState<Array<{platform: string, url: string}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showCorporateDirectOnly, setShowCorporateDirectOnly] = useState(false);
  const jobsPerPage = 15;
  const apiLimitForMongoDB = 600; // MongoDB数据最多600个
  const apiLimitForPlatforms = 500; // 平台数据最多500个
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJobRef, setSelectedJobRef] = useState<HTMLElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showScreenshotStream, setShowScreenshotStream] = useState(false);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const screenshotRef = useRef<HTMLImageElement>(null);
  let wsRef = useRef<WebSocket | null>(null);
  const jobAssistantRef = useRef<JobAssistantRef>(null);

  // Get user configuration after component mounts
  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
      try {
        const profile = JSON.parse(userProfileStr);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  // Add terminal output function
  const appendToTerminal = useCallback((message: string) => {
    // If message is compilation related, keep original format
    if (message.includes('Compiling') || message.includes('Compiled')) {
      setTerminalOutput(prev => [...prev, message]);
      return;
    }

    // If message is API call parameter, format JSON
    if (typeof message === 'string' && message.includes('API called with:')) {
      try {
        const [prefix, paramsStr] = message.split('API called with:');
        const params = JSON.parse(paramsStr);
        const formattedParams = JSON.stringify(params, null, 2);
        setTerminalOutput(prev => [...prev, `${prefix}API called with:\n${formattedParams}`]);
        return;
      } catch (e) {
        // If parsing fails, use original message
        setTerminalOutput(prev => [...prev, message]);
        return;
      }
    }

    // Other messages are added directly
    setTerminalOutput(prev => [...prev, message]);
  }, []);

  // Listen for compilation messages
  useEffect(() => {
    const handleCompilationMessage = (event: MessageEvent) => {
      if (event.data.type === 'compilation') {
        appendToTerminal(event.data.message);
      }
    };

    window.addEventListener('message', handleCompilationMessage);
    return () => window.removeEventListener('message', handleCompilationMessage);
  }, [appendToTerminal]);

  // Get jobs after user configuration loads
  useEffect(() => {
    if (!userProfile) return;

    const fetchJobsOld = async () => {
      jobAssistantRef.current?.addOrReplaceHeraMessage(
        "Hi, I'm Hera – your AI career assistant. I am matching your profile to the most relevant roles, prioritising Corporate Direct channels. This may take up to 40 seconds — thank you for waiting.",
        true
      );
      setIsLoading(true);
      appendToTerminal("Starting fetchJobs process...");
      
      try {
        const jobTitle = userProfile?.jobTitle?.[0];
        const city = userProfile?.city;
        const skillsStr = localStorage.getItem('skills');
        const skillsArray = skillsStr ? JSON.parse(skillsStr) : [];
        const skills = skillsArray.map((skill: any) => 
          typeof skill === 'object' ? skill.name : skill
        );
        const seniority = userProfile?.seniority || '';
        const openToRelocate = userProfile?.openForRelocation === 'yes';
        
        // Save search record
        if (jobTitle && city) {
          StorageManager.saveLastSearch(jobTitle, city);
        }
        
        // Check cache
        const cachedData = cacheUtils.getCache();
        if (cachedData && 
            cachedData.searchParams.jobTitle === jobTitle &&
            cachedData.searchParams.city === city &&
            JSON.stringify(cachedData.searchParams.skills) === JSON.stringify(skills)) {
          appendToTerminal('✓ Using cached job data');
          setAllJobs(cachedData.jobs);
          setTotalJobs(cachedData.jobs.length);
          setTotalPages(Math.ceil(cachedData.jobs.length / jobsPerPage));
          setPagedJobs(cachedData.jobs.slice(0, jobsPerPage));
          if (cachedData.jobs.length > 0) {
            setSelectedJob(cachedData.jobs[0]);
          }
          setIsLoading(false);
          return;
        }
        
        // If no cache or cache expired, continue with original fetch logic
        appendToTerminal('○ No valid cache found, fetching fresh data...');
        
        appendToTerminal('○ Sending API request to fetch jobs...');
        appendToTerminal('> Request payload:');
        appendToTerminal(JSON.stringify({ jobTitle, city, skills, seniority, openToRelocate }, null, 2));
        
        console.log('Parsed data:', { jobTitle, city, skills, seniority, openToRelocate });
        appendToTerminal('> Profile data: ' + jobTitle + ' in ' + city);
        appendToTerminal('> Skills: ' + (skills.length ? skills.join(', ') : 'None specified'));
        appendToTerminal('> Level: ' + seniority + ', Relocation: ' + (openToRelocate ? 'Yes' : 'No'));
        
        if (jobTitle && city) {
          // Replace with API call - 使用动态limit
          const response = await fetch(`/api/job-fetch-service?jobTitle=${encodeURIComponent(jobTitle || '')}&city=${encodeURIComponent(city || '')}&limit=${apiLimitForPlatforms}&page=${currentPage}`);
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          const result = await response.json();
          
          // Set all state variables correctly
          const validJobs = (result.jobs || []).map((job: any) => ({
            ...job,
            jobType: job.jobType || 'Full-time',
            employmentType: normalizeEmploymentType(job.employmentType || job.jobType || 'Full time'),
            workMode: parseWorkMode(job.workMode, job.description),
            tags: job.tags || [],
            description: job.description || 'No description provided.',
            matchScore: job.platform === 'Adzuna' ? 30 : 75,
            matchAnalysis: 'Unable to analyze match'
          })) as Job[];
          
          // Get match score for each job
          appendToTerminal('○ Analyzing job matches...');
          const jobsWithScores = await Promise.all(
            validJobs.map(async (job) => {
              try {
                const startTime = performance.now();
                appendToTerminal(`○ Analyzing match for "${job.title}"`);
                
                const matchResponse = await fetch('/api/gpt-services/jobMatch', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    jobTitle: job.title,
                    jobDescription: job.description,
                    jobRequirements: job.requirements || [],
                    jobLocation: job.location,
                    userProfile: {
                      jobTitles: [job.title],
                      skills: job.skills || [],
                      city: job.location,
                      seniority: job.experience,
                      openToRelocate: job.experience?.toLowerCase().includes('senior'),
                      careerPriorities: userProfile?.careerPriorities || []
                    }
                  }),
                });
                
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                
                appendToTerminal(`✓ Match analysis completed in ${duration}ms`);
                
                const matchData = await matchResponse.json();
                return {
                  ...job,
                  matchScore: matchData.score,
                  subScores: matchData.subScores,
                  matchAnalysis: matchData.analysis,
                  matchHighlights: matchData.highlights,
                  summary: matchData.listSummary,
                  detailedSummary: matchData.detailedSummary,
                  keyRequirements: matchData.keyRequirements
                };
              } catch (error) {
                console.error('Error getting match score:', error);
                appendToTerminal(`✗ Match analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                  ...job,
                  matchScore: 75,
                  matchAnalysis: 'Unable to analyze match',
                  matchHighlights: [
                    `Location match: ${job.location}`,
                    `Required skills match: ${job.requirements?.join(', ') || 'Not specified'}`,
                    'Mid-level seniority alignment'
                  ],
                  summary: 'Unable to generate job summary',
                  detailedSummary: 'Unable to generate detailed job summary'
                };
              }
            })
          );
          
          appendToTerminal('✓ Jobs sorted by match score');
          
          // Sort by match score
          const sortedJobs = jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
          
          setAllJobs(sortedJobs);
          setTotalJobs(sortedJobs.length);
          setTotalPages(Math.ceil(sortedJobs.length / jobsPerPage));
          setPagedJobs(sortedJobs.slice(0, jobsPerPage));
          if (sortedJobs.length > 0) {
            setSelectedJob(sortedJobs[0]);
            appendToTerminal(`✓ Job search completed successfully, ${sortedJobs.length} jobs in total`);
            jobAssistantRef.current?.addOrReplaceHeraMessage(
              "Matching complete — click ‘Chat Job’ to explore any role you're curious about."
            );
          }
          
          // Update cache after getting new data
          if (sortedJobs.length > 0) {
            cacheUtils.setCache(sortedJobs, { jobTitle, city, skills });
            appendToTerminal('✓ Job data cached for future use');
          }
          
          // Save search record
          try {
            const searchRecord = {
              jobTitle: jobTitle || '',
              city: city || '',
              skills: skills || [],
              timestamp: new Date().toISOString(),
              resultsCount: sortedJobs.length,
              userProfile: userProfile
            };
            
            const saveResponse = await fetch('/api/job-fetch-router', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'saveSearchRecord',
                data: searchRecord
              }),
            });
            
            if (saveResponse.ok) {
              appendToTerminal('✓ Search record saved');
            } else {
              console.warn('Failed to save search record');
            }
          } catch (error) {
            console.warn('Error saving search record:', error);
          }
          
          console.log('Final total:', sortedJobs.length);
          appendToTerminal(`Final total: ${sortedJobs.length}`);
          jobAssistantRef.current?.addOrReplaceHeraMessage(
            "Matching complete — click ‘Chat Job’ to explore any role you're curious about."
          );
        } else {
          console.log('Missing required data:', { 
            hasJobTitle: !!jobTitle, 
            hasCity: !!city 
          });
          appendToTerminal('✗ Error: Missing required profile information');
          appendToTerminal('Please complete your profile to start job search');
        }
      } catch (error) {
        console.error('Error in fetchJobs:', error);
        appendToTerminal(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsOld();
  }, [userProfile, appendToTerminal]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    setPagedJobs(allJobs.slice(startIndex, endIndex));
  }, [allJobs, currentPage, jobsPerPage]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleViewDetails = (job: Job, rect?: DOMRect, ref?: HTMLElement) => {
    setSelectedJob(job);
    setShowDetailModal(true);
    setSelectedJobRef(ref || null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedJobRef(null);
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === allJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(allJobs.map(job => job.id));
    }
  };

  const handleBatchApply = async () => {
    try {
      const jobsToApply = allJobs.filter(job => selectedJobs.includes(job.id));
      await handleBatchLinkedInApply(jobsToApply);
      setSelectedJobs([]);
    } catch (error) {
      console.error('Error applying to jobs:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const fetchJobsWithProfile = async (profile: any) => {
    setIsLoading(true);
    setCurrentPage(1);
    
    try {
      const skillsStr = localStorage.getItem('skills');
      const skillsArray = skillsStr ? JSON.parse(skillsStr) : [];
      const skills = skillsArray.map((skill: any) => 
        typeof skill === 'object' ? skill.name : skill
      );
      
      // 直接调用统一的API - 使用动态limit
      const response = await fetch(`/api/mirror-jobs?jobTitle=${encodeURIComponent(profile.jobTitle?.[0] || '')}&city=${encodeURIComponent(profile.city || '')}&page=${currentPage}&limit=${apiLimitForPlatforms}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
    const result = await response.json();
      
      const validJobs = (result.jobs || []).map((job: any) => ({
        ...job,
        jobType: job.jobType || 'Full-time',
        tags: job.tags || [],
        description: job.description || 'No description provided.',
        matchScore: job.platform === 'Adzuna' ? 30 : 75,
        matchAnalysis: 'Unable to analyze match'
      })) as Job[];
      
      setAllJobs(validJobs);
      setTotalJobs(result.total || 0);
      setTotalPages(result.totalPages || 1);
      setPagedJobs(validJobs.slice(0, jobsPerPage));
      
      if (validJobs.length > 0) {
        setSelectedJob(validJobs[0]);
        appendToTerminal(`✓ Job search completed successfully, ${validJobs.length} jobs in total`);
      }
      
      // Update cache after getting new data
      if (validJobs.length > 0) {
        cacheUtils.setCache(validJobs, { jobTitle: profile.jobTitle?.[0] || '', city: profile.city || '', skills });
        appendToTerminal('✓ Job data cached for future use');
      }
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      appendToTerminal(`✗ Error while fetching jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = (preferences: Preferences) => {
    cacheUtils.clearCache();
    const updatedSearchParams = new URLSearchParams();
    Object.entries(preferences).forEach(([key, value]) => {
      if (value) {
        updatedSearchParams.set(key, value as string);
      }
    });
    router.push(`/jobs?${updatedSearchParams.toString()}`);
    const updatedProfile = { ...userProfile, ...preferences };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setIsLoading(true);
    setCurrentPage(1);
    fetchJobsWithProfile(updatedProfile); // 只用 updatedProfile
  };

  // 监听job ad是否在可视区域
  useEffect(() => {
    if (!showDetailModal || !selectedJobRef) return;
    const checkVisibility = () => {
      const rect = selectedJobRef.getBoundingClientRect();
      if (
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) {
        setShowDetailModal(false);
        setSelectedJobRef(null);
      }
    };
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [showDetailModal, selectedJobRef]);

  // 自动滚动到最底部
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  useSmartAutoScroll(terminalRef, terminalOutput);

  // 新增保存到localStorage的函数
  const saveSelectedJobs = async () => {
    const jobsToSave = allJobs.filter(job => selectedJobs.includes(job.id));
    const existing = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    // 合并去重
    const merged = [...existing, ...jobsToSave].reduce((acc, job) => {
      if (!acc.find((j: any) => j.id === job.id)) acc.push(job);
      return acc;
    }, []);
    localStorage.setItem('savedJobs', JSON.stringify(merged));

    // 通过API保存到数据库
    const userId = 1; // 临时测试用户ID
    for (const job of jobsToSave) {
      try {
        await fetch('/api/save-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, jobId: job.id, status: 'saved' }),
        });
        console.log('[DB] Job saved:', job.id);
      } catch (error) {
        console.error('[DB] Error saving job:', error);
      }
    }
  };

  const handleSearch = async () => {
    const jobTitle = userProfile?.jobTitle?.[0];
    const city = userProfile?.city;
    
    if (!jobTitle || !city) {
      appendToTerminal('✗ Error: Please select a job title and city');
      return;
    }
    setIsLoading(true);
    setCurrentPage(1);
    
    try {
      const skillsStr = localStorage.getItem('skills');
      const skillsArray = skillsStr ? JSON.parse(skillsStr) : [];
      const skills = skillsArray.map((skill: any) => 
        typeof skill === 'object' ? skill.name : skill
      );
      
      // 直接调用统一的API - 使用动态limit
      const response = await fetch(`/api/mirror-jobs?jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(city)}&page=${currentPage}&limit=${apiLimitForPlatforms}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const result = await response.json();
      
      const validJobs = (result.jobs || []).map((job: any) => ({
        ...job,
        jobType: job.jobType || 'Full-time',
        tags: job.tags || [],
        description: job.description || 'No description provided.',
        matchScore: job.platform === 'Adzuna' ? 30 : 75,
        matchAnalysis: 'Unable to analyze match'
      })) as Job[];
      
      setAllJobs(validJobs);
      setTotalJobs(result.total || 0);
      setTotalPages(result.totalPages || 1);
      setPagedJobs(validJobs.slice(0, jobsPerPage));
      
      if (validJobs.length > 0) {
        setSelectedJob(validJobs[0]);
        appendToTerminal(`✓ Job search completed successfully, ${validJobs.length} jobs in total`);
      }
      
      // Update cache after getting new data
      if (validJobs.length > 0) {
        cacheUtils.setCache(validJobs, { jobTitle, city, skills });
        appendToTerminal('✓ Job data cached for future use');
      }
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      appendToTerminal(`✗ Error while fetching jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 如果正在加载用户配置，显示加载状态
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </h2>
          <p className="text-gray-500">
            {language === 'zh' 
              ? '正在获取您的个人资料...' 
              : 'Fetching your profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 顶部导航栏 */}
      <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 shadow-sm h-[56px]">
        <nav className="flex justify-between items-center px-6 h-[56px]">
          <div className="flex space-x-6">
            <Logo className="h-8 w-auto" />
            <div className="hidden md:flex space-x-6">
              <Link href="/profile" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Profile
              </Link>
              <Link href="/jobs" className="border-b-2 border-blue-500 h-[56px] flex items-center text-[18px] font-medium text-blue-600">
                Jobs
              </Link>
              <Link href="/applications" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Applications
              </Link>
            </div>
          </div>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-9"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </nav>
      </div>

      <div className="min-h-screen bg-white">
        <div className="mt-14 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-4 lg:px-3 gap-4">
          {/* 左侧：保证最小宽度，为Chatbot留出空间 */}
          <div className="flex-1 lg:flex-[1.4] min-w-0 overflow-y-auto min-h-[calc(100vh-64px)]">
            <div className="bg-white">
              {/* 职位列表部分 */}
              <div className="w-full">
                <div className="sticky top-0 bg-white z-10 p-3 border-b border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {language === 'zh' ? '推荐职位' : 'Recommended Jobs'}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {totalJobs} {language === 'zh' ? '个职位' : 'jobs'}
                      </span>
                    </div>
                    
                    {/* 控制栏 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-blue-700 font-semibold hover:underline"
                          onClick={handleSelectAll}
                        >
                          {selectedJobs.length === allJobs.length 
                            ? (language === 'zh' ? '取消全选' : 'Unsave All') 
                            : (language === 'zh' ? '全选' : 'Save All')}
                        </button>
                        <button
                          className={`text-blue-500 font-semibold hover:underline ${selectedJobs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={saveSelectedJobs}
                          disabled={selectedJobs.length === 0}
                        >
                          Save Selected ({selectedJobs.length})
                        </button>
                        <Checkbox
                          checked={showCorporateDirectOnly}
                          onCheckedChange={() => setShowCorporateDirectOnly(v => !v)}
                          label={showCorporateDirectOnly ? 'Show All Jobs' : 'Show Corporate Direct Only'}
                          className="ml-4"
                          // 统一文案样式
                          labelClassName="text-blue-700 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {language === 'zh' ? '加载中...' : 'Loading jobs...'}
                    </p>
                  </div>
                ) : allJobs.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-200">
                      {(showCorporateDirectOnly ? pagedJobs.filter(job => job.platform === 'CorporateDirect') : pagedJobs).map((job, index) => (
                        <JobSummaryCard
                          key={job.id}
                          job={job}
                          language={language}
                          isSelected={selectedJobs.includes(job.id)}
                          onSelect={() => handleJobSelect(job.id)}
                          onViewDetails={(job, _rect, cardRef) => {
                            handleViewDetails(job, undefined, cardRef?.current || undefined);
                          }}
                          userProfile={{
                            jobTitles: userProfile.jobTitle || [],
                            skills: userProfile.skills?.map((skill: any) =>
                              typeof skill === 'object' ? skill.name : skill
                            ) || [],
                            city: userProfile.city || '',
                            seniority: userProfile.seniority || '',
                            openToRelocate: userProfile.openForRelocation === 'yes'
                          }}
                          cardId={`job-card-${index}`}
                        />
                      ))}
                    </div>
                    
                    {/* 分页控件 */}
                    <div className="flex justify-center items-center space-x-2 py-4 border-t border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {language === 'zh' ? '上一页' : 'Previous'}
                      </button>
                      <span className="text-sm text-gray-600">
                        {language === 'zh' ? '第' : 'Page'} {currentPage} {language === 'zh' ? '页，共' : 'of'} {totalPages} {language === 'zh' ? '页' : 'pages'}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {language === 'zh' ? '下一页' : 'Next'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 px-4">
                    <p className="text-gray-500">
                      {language === 'zh' 
                        ? '暂无推荐职位。请在个人资料页面完善您的求职意向。' 
                        : 'No recommended jobs yet. Please complete your job preferences in the Profile page.'}
                    </p>
                    <Link
                      href="/profile"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {language === 'zh' ? '完善个人资料' : 'Complete Profile'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 右侧：固定宽度，考虑Chatbot */}
          <div className="hidden lg:block lg:flex-[0.6] max-w-[420px] shrink-0 h-screen sticky top-0 border-l border-gray-200 overflow-y-auto">
            <div className="h-screen sticky top-0">
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Héra Computer</h2>
                {showScreenshotStream && screenshotData ? (
                  <img ref={screenshotRef} src={screenshotData} alt="LinkedIn Screenshot" style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
                ) : (
                  <div
                    ref={terminalRef}
                    className="font-mono text-sm leading-[20px] whitespace-pre-wrap bg-white rounded-lg p-4 border border-gray-200 overflow-y-auto w-full max-w-full"
                    id="hera-computer-terminal"
                    style={{ 
                      height: '800px',
                      overflowY: 'scroll',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#94A3B8 transparent',
                      fontFamily: 'Menlo, Monaco, \"Courier New\", monospace',
                      fontSize: '12px',
                      lineHeight: '20px',
                      backgroundColor: '#ffffff',
                      color: '#374151'
                    }}
                  >
                    <div className="space-y-1">
                      {terminalOutput.map((line, index) => {
                        const processedLine = line.replace(/🔍/g, '○')
                                               .replace(/📋/g, '○')
                                               .replace(/📊/g, '○')
                                               .replace(/🔗/g, '○')
                                               .replace(/✨/g, '○')
                                               .replace(/🎉/g, '○')
                                               .replace(/❌/g, '✗')
                                               .replace(/✅/g, '✓')
                                               .replace(/📍/g, '○')
                                               .replace(/📅/g, '○')
                                               .replace(/📈/g, '○')
                                               .replace(/📉/g, '○')
                                               .replace(/📌/g, '○')
                                               .replace(/🔑/g, '○')
                                               .replace(/📝/g, '○')
                                               .replace(/📎/g, '○')
                                               .replace(/🔄/g, '○');

                        if (line.includes('Using cached job data')) {
                          return (
                            <div key={index} className="text-green-600">
                              {processedLine}
                              <br />
                              <span style={{ color: '#16a34a', fontWeight: 500 }}>
                                Jobs refresh every 24h — type "Refresh Jobs" to update.
                              </span>
                            </div>
                          );
                        }
                        if (line.startsWith('○ Compiling')) {
                          return <div key={index} className="text-gray-500">{processedLine}</div>;
                        }
                        if (line.startsWith('✓ Compiled') || line.startsWith('✓')) {
                          return <div key={index} className="text-green-600">{processedLine}</div>;
                        }
                        if (line.startsWith('❌')) {
                          return <div key={index} className="text-red-600">{processedLine}</div>;
                        }
                        if (line.startsWith('○')) {
                          return <div key={index} className="text-gray-500">{processedLine}</div>;
                        }
                        if (line.includes('API called with:') || line.includes('Raw response:')) {
                          const [prefix, data] = line.split(/:\s(.+)/);
                          return (
                            <div key={index}>
                              <span className="text-gray-600">{prefix}:</span>
                              <pre className="text-gray-800 ml-2 whitespace-pre-wrap">{data}</pre>
                            </div>
                          );
                        }
                        if (line.match(/^(GET|POST|PUT|DELETE)/)) {
                          const parts = line.split(' ');
                          return (
                            <div key={index}>
                              <span className="text-blue-600">{parts[0]}</span>
                              <span className="text-gray-600"> {parts.slice(1).join(' ')}</span>
                            </div>
                          );
                        }
                        return <div key={index} className="text-gray-600">{processedLine}</div>;
                      })}
                    </div>
                    <div ref={terminalEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 职位详情悬浮窗口 */}
        {showDetailModal && (
          <div
            className="fixed z-50 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col"
            style={{
              right: 32,
              top: 120,
              width: 400,
              height: Math.floor(window.innerHeight / 3),
            }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-900">
                {language === 'zh' ? '职位详情' : 'Job Details'}
              </h2>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-3 text-sm">
              <JobDetailPanel job={selectedJob} language={language} compact />
            </div>
          </div>
        )}

        <JobAssistant ref={jobAssistantRef} onUpdatePreferences={handleUpdatePreferences} language={language} />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSearch}
            disabled={isLoading || !userProfile?.jobTitle?.[0] || !userProfile?.city}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'zh' ? '搜索中...' : 'Searching...'}
              </div>
            ) : (
              language === 'zh' ? '搜索' : 'Search'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
} 