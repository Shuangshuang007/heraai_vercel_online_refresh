"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { AccountSettingIcon } from '@/components/AccountSettingIcon';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function ResourcesPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [activeTab, setActiveTab] = useState<string>('interview-tips');
  
  // 使用Premium状态hook
  const premiumStatus = usePremiumStatus();

  // 定义标签页
  const tabs = [
    { id: 'interview-tips', label: language === 'zh' ? '面试技巧' : 'Interview Tips' },
    { id: 'resume-tips', label: language === 'zh' ? '简历技巧' : 'Resume Tips' },
    { id: 'cheat-sheets', label: language === 'zh' ? '速查表' : 'Cheat Sheets' },
    { id: 'career-advice', label: language === 'zh' ? '职业建议' : 'Career Advice' },
    { id: 'work-meme', label: language === 'zh' ? '工作梗图' : 'Work Meme' }
  ];

  // Mock数据 - Interview Tips分类
  const interviewTipsData = {
    categories: [
      {
        name: 'Christmas Casuals',
        videos: [
          {
            id: '1',
            title: 'How to Ace Christmas Casual Interviews',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-15',
            description: 'Learn the essential tips and strategies to succeed in Christmas casual job interviews. From preparation to follow-up, we cover everything you need to know.',
            url: 'https://example.com/video1'
          },
          {
            id: '2',
            title: 'Retail Interview Questions & Answers',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-12',
            description: 'Common retail interview questions and how to answer them effectively. Perfect for Christmas casual positions.',
            url: 'https://example.com/video2'
          },
          {
            id: '3',
            title: 'Customer Service Skills for Retail',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-10',
            description: 'Essential customer service skills that will help you excel in retail positions during the busy Christmas period.',
            url: 'https://example.com/video3'
          },
          {
            id: '4',
            title: 'Dressing for Retail Interviews',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-08',
            description: 'Professional attire guidelines for retail job interviews. Make a great first impression.',
            url: 'https://example.com/video4'
          }
        ],
        totalCount: 8,
        showAll: true
      },
      {
        name: 'Graduate & Interns',
        videos: [
          {
            id: '5',
            title: 'Graduate Program Interview Tips',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-20',
            description: 'Comprehensive guide to graduate program interviews. Learn how to stand out from other candidates.',
            url: 'https://example.com/video5'
          },
          {
            id: '6',
            title: 'Behavioral Interview Questions',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-18',
            description: 'Master behavioral interview questions using the STAR method. Perfect for graduate and intern positions.',
            url: 'https://example.com/video6'
          },
          {
            id: '7',
            title: 'Technical Interview Preparation',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-16',
            description: 'How to prepare for technical interviews in graduate programs. Coding challenges and problem-solving strategies.',
            url: 'https://example.com/video7'
          },
          {
            id: '8',
            title: 'Internship Interview Success',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-14',
            description: 'Tips for acing internship interviews. From research to follow-up, everything you need to know.',
            url: 'https://example.com/video8'
          }
        ],
        totalCount: 4,
        showAll: false
      },
      {
        name: 'Data Analytics',
        videos: [
          {
            id: '9',
            title: 'Data Analyst Interview Questions',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-25',
            description: 'Common data analyst interview questions and how to answer them. SQL, Python, and analytical thinking.',
            url: 'https://example.com/video9'
          },
          {
            id: '10',
            title: 'SQL Interview Challenges',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-23',
            description: 'Practice SQL interview questions and challenges. From basic queries to complex data analysis.',
            url: 'https://example.com/video10'
          },
          {
            id: '11',
            title: 'Python for Data Analysis',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-21',
            description: 'Python skills needed for data analyst interviews. Pandas, NumPy, and data visualization.',
            url: 'https://example.com/video11'
          },
          {
            id: '12',
            title: 'Case Study Interviews',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-19',
            description: 'How to approach data analytics case study interviews. Problem-solving frameworks and examples.',
            url: 'https://example.com/video12'
          }
        ],
        totalCount: 6,
        showAll: true
      },
      {
        name: 'Finance & Strategy',
        videos: [
          {
            id: '13',
            title: 'Investment Banking Interview Tips',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-30',
            description: 'Essential tips for investment banking interviews. Technical questions, behavioral scenarios, and market knowledge.',
            url: 'https://example.com/video13'
          },
          {
            id: '14',
            title: 'Financial Modeling Interview',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-28',
            description: 'How to excel in financial modeling interviews. Excel skills, DCF models, and valuation techniques.',
            url: 'https://example.com/video14'
          },
          {
            id: '15',
            title: 'Strategy Consulting Case Studies',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-26',
            description: 'Master strategy consulting case study interviews. Framework thinking and problem-solving approaches.',
            url: 'https://example.com/video15'
          },
          {
            id: '16',
            title: 'Corporate Finance Interview Prep',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-24',
            description: 'Prepare for corporate finance interviews. Capital structure, valuation, and financial analysis.',
            url: 'https://example.com/video16'
          }
        ],
        totalCount: 5,
        showAll: true
      },
      {
        name: 'Software Engineering',
        videos: [
          {
            id: '17',
            title: 'Coding Interview Mastery',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-02',
            description: 'Master coding interviews with data structures, algorithms, and problem-solving strategies.',
            url: 'https://example.com/video17'
          },
          {
            id: '18',
            title: 'System Design Interview Guide',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-31',
            description: 'Comprehensive guide to system design interviews. Scalability, databases, and architecture patterns.',
            url: 'https://example.com/video18'
          },
          {
            id: '19',
            title: 'Frontend Interview Questions',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-29',
            description: 'Frontend development interview questions. React, JavaScript, CSS, and web technologies.',
            url: 'https://example.com/video19'
          },
          {
            id: '20',
            title: 'Backend Development Interviews',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-27',
            description: 'Backend engineering interview preparation. APIs, databases, microservices, and cloud technologies.',
            url: 'https://example.com/video20'
          }
        ],
        totalCount: 7,
        showAll: true
      },
      {
        name: 'Product Design',
        videos: [
          {
            id: '21',
            title: 'UX Design Interview Portfolio',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-05',
            description: 'How to present your UX design portfolio in interviews. Case studies, process, and storytelling.',
            url: 'https://example.com/video21'
          },
          {
            id: '22',
            title: 'Design Thinking Challenges',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-03',
            description: 'Master design thinking challenges in interviews. User research, ideation, and prototyping.',
            url: 'https://example.com/video22'
          },
          {
            id: '23',
            title: 'UI Design Interview Questions',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-01',
            description: 'Common UI design interview questions. Visual design, interaction design, and design systems.',
            url: 'https://example.com/video23'
          },
          {
            id: '24',
            title: 'Product Management Interviews',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-30',
            description: 'Product management interview preparation. Strategy, metrics, and cross-functional collaboration.',
            url: 'https://example.com/video24'
          }
        ],
        totalCount: 4,
        showAll: false
      },
      {
        name: 'Others',
        videos: [
          {
            id: '25',
            title: 'General Interview Best Practices',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-08',
            description: 'Universal interview tips that apply to any industry. Preparation, communication, and follow-up strategies.',
            url: 'https://example.com/video25'
          },
          {
            id: '26',
            title: 'Salary Negotiation Masterclass',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-06',
            description: 'How to negotiate salary and benefits effectively. Research, timing, and communication techniques.',
            url: 'https://example.com/video26'
          },
          {
            id: '27',
            title: 'Remote Work Interview Tips',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-04',
            description: 'Excel in remote work interviews. Virtual presence, communication skills, and remote collaboration.',
            url: 'https://example.com/video27'
          },
          {
            id: '28',
            title: 'Career Transition Strategies',
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-02',
            description: 'How to successfully transition between careers. Skills transfer, networking, and positioning yourself.',
            url: 'https://example.com/video28'
          }
        ],
        totalCount: 6,
        showAll: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 shadow-sm h-[56px]">
        <nav className="flex justify-between items-center px-6 h-[56px]">
          <div className="flex space-x-6">
            <Logo />
            <div className="hidden md:flex space-x-6">
              <Link href="/profile" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Profile
              </Link>
              <Link href="/jobs" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Jobs
              </Link>
              <Link href="/applications" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Applications
              </Link>
              <Link href="/resources" className="border-b-2 border-blue-500 h-[56px] flex items-center text-[18px] font-medium text-blue-600">
                Resources
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AccountSettingIcon 
              isPremium={premiumStatus.isPremium}
              className="ml-8"
              expiresAt={premiumStatus.expiresAt}
              expiresAtAEST={premiumStatus.expiresAtAEST}
            />
            {/* 语言栏暂时注释掉 - 这一版本不上线中文
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-9"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            */}
          </div>
        </nav>
      </div>

      <div className="mt-14 w-full max-w-[1440px] mx-auto px-4 lg:px-3">
        {/* 主要内容区域 */}
        <div className="w-full">
          <div className="bg-white">
            <div className="w-full">
              <div className="sticky top-0 bg-white z-10 p-3 border-b border-gray-200">
                {/* 标签页导航 - 参考Jobs页面样式 */}
                <div className="flex items-center gap-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`font-semibold hover:underline ${
                        activeTab === tab.id
                          ? 'text-gray-800'
                          : 'text-gray-500'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 内容区域 - 根据选中的标签页显示不同内容 */}
              <div className="p-4">
                {activeTab === 'interview-tips' && (
                  <div className="space-y-6">
                    {interviewTipsData.categories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="space-y-3">
                        {/* 分类标题 */}
                        <h3 className="text-base font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        
                        {/* 视频网格 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {category.videos.map((video) => (
                            <div
                              key={video.id}
                              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              {/* 视频缩略图 */}
                              <div className="aspect-video bg-gray-100 relative">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                {/* 播放按钮覆盖层 */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all">
                                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              
                              {/* 视频信息 */}
                              <div className="p-3 space-y-2">
                                {/* 标题和创建时间 */}
                                <div className="space-y-1">
                                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                    {video.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    📅 {video.createdAt}
                                  </p>
                                </div>
                                
                                {/* 简介 */}
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {video.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Show All 按钮 */}
                        {category.showAll && (
                          <div className="flex justify-end mt-0.5">
                            <button className="text-sm text-gray-600 font-medium hover:underline">
                              Show All ({category.totalCount})
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'resume-tips' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {language === 'zh' ? '简历技巧视频即将上线...' : 'Resume Tips videos coming soon...'}
                    </p>
                  </div>
                )}
                
                {activeTab === 'cheat-sheets' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {language === 'zh' ? '速查表资源即将上线...' : 'Cheat Sheets resources coming soon...'}
                    </p>
                  </div>
                )}
                
                {activeTab === 'career-advice' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {language === 'zh' ? '职业建议视频即将上线...' : 'Career Advice videos coming soon...'}
                    </p>
                  </div>
                )}
                
                {activeTab === 'work-meme' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {language === 'zh' ? '工作梗图内容即将上线...' : 'Work Meme content coming soon...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
