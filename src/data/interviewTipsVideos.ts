export interface VideoData {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  subcategory: string;
  createdAt: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export const interviewTipsVideos: VideoData[] = [
  // Christmas Casuals
  {
    id: '1',
    slug: 'how-to-ace-christmas-casual-interviews',
    title: 'Lululemon Christmas Casual Job Interview Tips',
    description: '🎄 Straight from students who just got the offer! Real interview Q&As, what they said that worked, and the hottest openings right now.',
    content: 'Master Christmas Casual job interviews with expert preparation strategies. Learn how to research companies, practice common retail questions, and demonstrate customer service skills. This comprehensive guide covers everything from dressing appropriately to following up after interviews.',
    thumbnail: 'https://customer-ls2bua2ezo6y6x3g.cloudflare.com/a819eba9c520db4ac51c4e72e5975d12/thumbnails/thumbnail.jpg?time=0s',
    videoUrl: 'https://iframe.cloudflarestream.com/a819eba9c520db4ac51c4e72e5975d12',
    category: 'interview-tips',
    subcategory: 'christmas-casuals',
    createdAt: '2024-01-15',
    duration: '5:30',
    difficulty: 'beginner',
    tags: ['Lululemon jobs', 'Christmas casual', 'retail interview', 'holiday jobs'],
    seoData: {
      metaTitle: 'Lululemon Christmas Casual Job Interview Tips - Real Q&As | Hera AI',
      metaDescription: '🎄 Lululemon Christmas Casual interview tips straight from students who got the offer! Real Q&As, what worked, and hottest openings right now.',
      keywords: ['Lululemon jobs', 'Christmas Casual jobs', 'retail interview tips', 'holiday employment', 'Lululemon interview']
    }
  },
  {
    id: '2',
    slug: 'retail-interview-questions-answers',
    title: 'Retail Interview Questions & Answers',
    description: 'Common retail interview questions and how to answer them effectively. Perfect for Christmas casual positions.',
    content: 'Prepare for retail job interviews with proven strategies for answering common questions. Learn how to handle customer service scenarios, demonstrate product knowledge, and show enthusiasm for retail work.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video2',
    category: 'interview-tips',
    subcategory: 'christmas-casuals',
    createdAt: '2024-01-12',
    duration: '4:45',
    difficulty: 'beginner',
    tags: ['retail interview', 'customer service', 'holiday jobs', 'interview questions'],
    seoData: {
      metaTitle: 'Retail Interview Questions & Answers - Christmas Casual Jobs | Hera AI',
      metaDescription: 'Master retail interview questions with expert answers. Perfect preparation for Christmas casual positions and customer service roles.',
      keywords: ['retail interview questions', 'customer service interview', 'christmas casual', 'retail job tips']
    }
  },
  {
    id: '3',
    slug: 'customer-service-skills-for-retail',
    title: 'Customer Service Skills for Retail',
    description: 'Essential customer service skills that will help you excel in retail positions during the busy Christmas period.',
    content: 'Develop essential customer service skills for retail success. Learn communication techniques, problem-solving strategies, and how to handle difficult customers during busy periods.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video3',
    category: 'interview-tips',
    subcategory: 'christmas-casuals',
    createdAt: '2024-01-10',
    duration: '6:15',
    difficulty: 'beginner',
    tags: ['customer service', 'retail skills', 'communication', 'problem solving'],
    seoData: {
      metaTitle: 'Customer Service Skills for Retail Jobs - Interview Tips | Hera AI',
      metaDescription: 'Master customer service skills for retail positions. Learn communication techniques and problem-solving strategies for busy periods.',
      keywords: ['customer service skills', 'retail communication', 'problem solving', 'retail job skills']
    }
  },
  {
    id: '4',
    slug: 'dressing-for-retail-interviews',
    title: 'Dressing for Retail Interviews',
    description: 'Professional attire guidelines for retail job interviews. Make a great first impression.',
    content: 'Learn how to dress professionally for retail job interviews. Get tips on appropriate attire, grooming, and making a positive first impression that shows you understand retail professionalism.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video4',
    category: 'interview-tips',
    subcategory: 'christmas-casuals',
    createdAt: '2024-01-08',
    duration: '3:20',
    difficulty: 'beginner',
    tags: ['interview attire', 'professional dress', 'first impression', 'retail interview'],
    seoData: {
      metaTitle: 'Dressing for Retail Interviews - Professional Attire Guide | Hera AI',
      metaDescription: 'Learn how to dress professionally for retail job interviews. Get expert tips on appropriate attire and making a great first impression.',
      keywords: ['interview attire', 'professional dress', 'retail interview dress', 'first impression']
    }
  },
  // Graduate & Interns
  {
    id: '5',
    slug: 'graduate-program-interview-tips',
    title: 'Graduate Program Interview Tips',
    description: 'Comprehensive guide to graduate program interviews. Learn how to stand out from other candidates.',
    content: 'Master graduate program interviews with comprehensive preparation strategies. Learn how to research companies, prepare for behavioral questions, and demonstrate your potential for leadership roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video5',
    category: 'interview-tips',
    subcategory: 'graduate-interns',
    createdAt: '2024-01-20',
    duration: '7:45',
    difficulty: 'intermediate',
    tags: ['graduate program', 'leadership', 'behavioral interview', 'career development'],
    seoData: {
      metaTitle: 'Graduate Program Interview Tips - Leadership Development | Hera AI',
      metaDescription: 'Master graduate program interviews with expert preparation strategies. Learn how to stand out and demonstrate leadership potential.',
      keywords: ['graduate program interview', 'leadership development', 'behavioral questions', 'career preparation']
    }
  },
  {
    id: '6',
    slug: 'behavioral-interview-questions',
    title: 'Behavioral Interview Questions',
    description: 'Master behavioral interview questions using the STAR method. Perfect for graduate and intern positions.',
    content: 'Master behavioral interview questions using the proven STAR method. Learn how to structure your answers with Situation, Task, Action, and Result examples that demonstrate your skills.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video6',
    category: 'interview-tips',
    subcategory: 'graduate-interns',
    createdAt: '2024-01-18',
    duration: '8:30',
    difficulty: 'intermediate',
    tags: ['behavioral interview', 'STAR method', 'interview preparation', 'graduate jobs'],
    seoData: {
      metaTitle: 'Behavioral Interview Questions - STAR Method Guide | Hera AI',
      metaDescription: 'Master behavioral interview questions using the STAR method. Perfect preparation for graduate and intern positions.',
      keywords: ['behavioral interview questions', 'STAR method', 'interview preparation', 'graduate jobs']
    }
  },
  {
    id: '7',
    slug: 'technical-interview-preparation',
    title: 'Technical Interview Preparation',
    description: 'How to prepare for technical interviews in graduate programs. Coding challenges and problem-solving strategies.',
    content: 'Prepare for technical interviews in graduate programs with comprehensive strategies. Learn coding challenges, problem-solving approaches, and how to demonstrate technical skills effectively.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video7',
    category: 'interview-tips',
    subcategory: 'graduate-interns',
    createdAt: '2024-01-16',
    duration: '9:15',
    difficulty: 'advanced',
    tags: ['technical interview', 'coding challenges', 'problem solving', 'graduate program'],
    seoData: {
      metaTitle: 'Technical Interview Preparation - Graduate Programs | Hera AI',
      metaDescription: 'Master technical interviews for graduate programs. Learn coding challenges and problem-solving strategies.',
      keywords: ['technical interview', 'coding challenges', 'graduate program', 'problem solving']
    }
  },
  {
    id: '8',
    slug: 'internship-interview-success',
    title: 'Internship Interview Success',
    description: 'Tips for acing internship interviews. From research to follow-up, everything you need to know.',
    content: 'Ace internship interviews with comprehensive preparation strategies. Learn how to research companies, prepare for common questions, and follow up effectively to secure your dream internship.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video8',
    category: 'interview-tips',
    subcategory: 'graduate-interns',
    createdAt: '2024-01-14',
    duration: '6:00',
    difficulty: 'beginner',
    tags: ['internship interview', 'career preparation', 'student jobs', 'interview success'],
    seoData: {
      metaTitle: 'Internship Interview Success - Student Career Guide | Hera AI',
      metaDescription: 'Master internship interviews with expert tips. Learn preparation strategies and follow-up techniques for student success.',
      keywords: ['internship interview', 'student career', 'interview preparation', 'career success']
    }
  },
  // Data Analytics
  {
    id: '9',
    slug: 'data-analyst-interview-questions',
    title: 'Data Analyst Interview Questions',
    description: 'Common data analyst interview questions and how to answer them. SQL, Python, and analytical thinking.',
    content: 'Master data analyst interview questions with comprehensive preparation. Learn SQL queries, Python analysis, and how to demonstrate analytical thinking skills.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video9',
    category: 'interview-tips',
    subcategory: 'data-analytics',
    createdAt: '2024-01-25',
    duration: '10:30',
    difficulty: 'intermediate',
    tags: ['data analyst', 'SQL interview', 'Python analysis', 'analytical thinking'],
    seoData: {
      metaTitle: 'Data Analyst Interview Questions - SQL & Python Guide | Hera AI',
      metaDescription: 'Master data analyst interview questions. Learn SQL, Python, and analytical thinking skills for data science careers.',
      keywords: ['data analyst interview', 'SQL interview questions', 'Python analysis', 'data science career']
    }
  },
  {
    id: '10',
    slug: 'sql-interview-challenges',
    title: 'SQL Interview Challenges',
    description: 'Practice SQL interview questions and challenges. From basic queries to complex data analysis.',
    content: 'Master SQL interview challenges with practical examples. Learn basic queries, complex joins, and advanced data analysis techniques.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video10',
    category: 'interview-tips',
    subcategory: 'data-analytics',
    createdAt: '2024-01-23',
    duration: '12:15',
    difficulty: 'intermediate',
    tags: ['SQL interview', 'database queries', 'data analysis', 'interview challenges'],
    seoData: {
      metaTitle: 'SQL Interview Challenges - Database Query Practice | Hera AI',
      metaDescription: 'Master SQL interview challenges with practical examples. Learn basic queries to complex data analysis techniques.',
      keywords: ['SQL interview', 'database queries', 'data analysis', 'SQL challenges']
    }
  },
  {
    id: '11',
    slug: 'python-for-data-analysis',
    title: 'Python for Data Analysis',
    description: 'Python skills needed for data analyst interviews. Pandas, NumPy, and data visualization.',
    content: 'Master Python skills for data analyst interviews. Learn Pandas, NumPy, and data visualization techniques essential for data science roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video11',
    category: 'interview-tips',
    subcategory: 'data-analytics',
    createdAt: '2024-01-21',
    duration: '11:45',
    difficulty: 'intermediate',
    tags: ['Python analysis', 'Pandas', 'NumPy', 'data visualization'],
    seoData: {
      metaTitle: 'Python for Data Analysis - Pandas & NumPy Guide | Hera AI',
      metaDescription: 'Master Python skills for data analyst interviews. Learn Pandas, NumPy, and data visualization techniques.',
      keywords: ['Python data analysis', 'Pandas tutorial', 'NumPy skills', 'data visualization']
    }
  },
  {
    id: '12',
    slug: 'case-study-interviews',
    title: 'Case Study Interviews',
    description: 'How to approach data analytics case study interviews. Problem-solving frameworks and examples.',
    content: 'Master data analytics case study interviews with proven frameworks. Learn problem-solving approaches and how to structure your analysis effectively.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video12',
    category: 'interview-tips',
    subcategory: 'data-analytics',
    createdAt: '2024-01-19',
    duration: '9:30',
    difficulty: 'advanced',
    tags: ['case study interview', 'problem solving', 'data analysis', 'interview frameworks'],
    seoData: {
      metaTitle: 'Case Study Interviews - Data Analytics Framework | Hera AI',
      metaDescription: 'Master data analytics case study interviews with proven problem-solving frameworks and examples.',
      keywords: ['case study interview', 'data analytics', 'problem solving', 'interview frameworks']
    }
  },
  // Finance & Strategy
  {
    id: '13',
    slug: 'investment-banking-interview-tips',
    title: 'Investment Banking Interview Tips',
    description: 'Essential tips for investment banking interviews. Technical questions, behavioral scenarios, and market knowledge.',
    content: 'Master investment banking interviews with comprehensive preparation. Learn technical questions, behavioral scenarios, and how to demonstrate market knowledge.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video13',
    category: 'interview-tips',
    subcategory: 'finance-strategy',
    createdAt: '2024-01-30',
    duration: '13:20',
    difficulty: 'advanced',
    tags: ['investment banking', 'finance interview', 'market knowledge', 'technical questions'],
    seoData: {
      metaTitle: 'Investment Banking Interview Tips - Finance Career Guide | Hera AI',
      metaDescription: 'Master investment banking interviews with expert tips. Learn technical questions and behavioral scenarios.',
      keywords: ['investment banking interview', 'finance career', 'market knowledge', 'banking tips']
    }
  },
  {
    id: '14',
    slug: 'financial-modeling-interview',
    title: 'Financial Modeling Interview',
    description: 'How to excel in financial modeling interviews. Excel skills, DCF models, and valuation techniques.',
    content: 'Excel in financial modeling interviews with comprehensive preparation. Learn Excel skills, DCF models, and valuation techniques essential for finance roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video14',
    category: 'interview-tips',
    subcategory: 'finance-strategy',
    createdAt: '2024-01-28',
    duration: '14:15',
    difficulty: 'advanced',
    tags: ['financial modeling', 'DCF models', 'valuation', 'Excel skills'],
    seoData: {
      metaTitle: 'Financial Modeling Interview - DCF & Valuation Guide | Hera AI',
      metaDescription: 'Master financial modeling interviews with Excel skills, DCF models, and valuation techniques.',
      keywords: ['financial modeling', 'DCF models', 'valuation techniques', 'Excel skills']
    }
  },
  {
    id: '15',
    slug: 'strategy-consulting-case-studies',
    title: 'Strategy Consulting Case Studies',
    description: 'Master strategy consulting case study interviews. Framework thinking and problem-solving approaches.',
    content: 'Master strategy consulting case study interviews with proven frameworks. Learn problem-solving approaches and how to structure your analysis effectively.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video15',
    category: 'interview-tips',
    subcategory: 'finance-strategy',
    createdAt: '2024-01-26',
    duration: '15:30',
    difficulty: 'advanced',
    tags: ['strategy consulting', 'case study', 'framework thinking', 'problem solving'],
    seoData: {
      metaTitle: 'Strategy Consulting Case Studies - Framework Guide | Hera AI',
      metaDescription: 'Master strategy consulting case study interviews with proven frameworks and problem-solving approaches.',
      keywords: ['strategy consulting', 'case study interview', 'framework thinking', 'consulting tips']
    }
  },
  {
    id: '16',
    slug: 'corporate-finance-interview-prep',
    title: 'Corporate Finance Interview Prep',
    description: 'Prepare for corporate finance interviews. Capital structure, valuation, and financial analysis.',
    content: 'Prepare for corporate finance interviews with comprehensive strategies. Learn capital structure, valuation, and financial analysis techniques.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video16',
    category: 'interview-tips',
    subcategory: 'finance-strategy',
    createdAt: '2024-01-24',
    duration: '12:45',
    difficulty: 'intermediate',
    tags: ['corporate finance', 'capital structure', 'valuation', 'financial analysis'],
    seoData: {
      metaTitle: 'Corporate Finance Interview Prep - Valuation Guide | Hera AI',
      metaDescription: 'Master corporate finance interviews with capital structure, valuation, and financial analysis techniques.',
      keywords: ['corporate finance', 'capital structure', 'valuation', 'financial analysis']
    }
  },
  // Software Engineering
  {
    id: '17',
    slug: 'coding-interview-mastery',
    title: 'Coding Interview Mastery',
    description: 'Master coding interviews with data structures, algorithms, and problem-solving strategies.',
    content: 'Master coding interviews with comprehensive preparation. Learn data structures, algorithms, and problem-solving strategies essential for software engineering roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video17',
    category: 'interview-tips',
    subcategory: 'software-engineering',
    createdAt: '2024-02-02',
    duration: '16:20',
    difficulty: 'advanced',
    tags: ['coding interview', 'data structures', 'algorithms', 'problem solving'],
    seoData: {
      metaTitle: 'Coding Interview Mastery - Data Structures & Algorithms | Hera AI',
      metaDescription: 'Master coding interviews with data structures, algorithms, and problem-solving strategies for software engineering.',
      keywords: ['coding interview', 'data structures', 'algorithms', 'software engineering']
    }
  },
  {
    id: '18',
    slug: 'system-design-interview-guide',
    title: 'System Design Interview Guide',
    description: 'Comprehensive guide to system design interviews. Scalability, databases, and architecture patterns.',
    content: 'Master system design interviews with comprehensive preparation. Learn scalability concepts, database design, and architecture patterns.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video18',
    category: 'interview-tips',
    subcategory: 'software-engineering',
    createdAt: '2024-01-31',
    duration: '18:15',
    difficulty: 'advanced',
    tags: ['system design', 'scalability', 'database design', 'architecture'],
    seoData: {
      metaTitle: 'System Design Interview Guide - Scalability & Architecture | Hera AI',
      metaDescription: 'Master system design interviews with scalability concepts, database design, and architecture patterns.',
      keywords: ['system design interview', 'scalability', 'database design', 'architecture patterns']
    }
  },
  {
    id: '19',
    slug: 'frontend-interview-questions',
    title: 'Frontend Interview Questions',
    description: 'Frontend development interview questions. React, JavaScript, CSS, and web technologies.',
    content: 'Master frontend development interview questions. Learn React, JavaScript, CSS, and web technologies essential for frontend roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video19',
    category: 'interview-tips',
    subcategory: 'software-engineering',
    createdAt: '2024-01-29',
    duration: '14:30',
    difficulty: 'intermediate',
    tags: ['frontend interview', 'React', 'JavaScript', 'CSS'],
    seoData: {
      metaTitle: 'Frontend Interview Questions - React & JavaScript Guide | Hera AI',
      metaDescription: 'Master frontend development interview questions with React, JavaScript, CSS, and web technologies.',
      keywords: ['frontend interview', 'React interview', 'JavaScript questions', 'CSS skills']
    }
  },
  {
    id: '20',
    slug: 'backend-development-interviews',
    title: 'Backend Development Interviews',
    description: 'Backend engineering interview preparation. APIs, databases, microservices, and cloud technologies.',
    content: 'Master backend engineering interview preparation. Learn APIs, databases, microservices, and cloud technologies essential for backend roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video20',
    category: 'interview-tips',
    subcategory: 'software-engineering',
    createdAt: '2024-01-27',
    duration: '15:45',
    difficulty: 'intermediate',
    tags: ['backend interview', 'APIs', 'databases', 'microservices'],
    seoData: {
      metaTitle: 'Backend Development Interviews - APIs & Databases Guide | Hera AI',
      metaDescription: 'Master backend engineering interviews with APIs, databases, microservices, and cloud technologies.',
      keywords: ['backend interview', 'API development', 'database design', 'microservices']
    }
  },
  // Product Design
  {
    id: '21',
    slug: 'ux-design-interview-portfolio',
    title: 'UX Design Interview Portfolio',
    description: 'How to present your UX design portfolio in interviews. Case studies, process, and storytelling.',
    content: 'Master UX design portfolio presentations in interviews. Learn how to showcase case studies, design process, and storytelling techniques.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video21',
    category: 'interview-tips',
    subcategory: 'product-design',
    createdAt: '2024-02-05',
    duration: '11:20',
    difficulty: 'intermediate',
    tags: ['UX design', 'portfolio presentation', 'case studies', 'design process'],
    seoData: {
      metaTitle: 'UX Design Interview Portfolio - Case Studies Guide | Hera AI',
      metaDescription: 'Master UX design portfolio presentations with case studies, design process, and storytelling techniques.',
      keywords: ['UX design portfolio', 'design interview', 'case studies', 'design process']
    }
  },
  {
    id: '22',
    slug: 'design-thinking-challenges',
    title: 'Design Thinking Challenges',
    description: 'Master design thinking challenges in interviews. User research, ideation, and prototyping.',
    content: 'Master design thinking challenges in interviews. Learn user research, ideation, and prototyping techniques essential for design roles.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video22',
    category: 'interview-tips',
    subcategory: 'product-design',
    createdAt: '2024-02-03',
    duration: '10:15',
    difficulty: 'intermediate',
    tags: ['design thinking', 'user research', 'ideation', 'prototyping'],
    seoData: {
      metaTitle: 'Design Thinking Challenges - User Research Guide | Hera AI',
      metaDescription: 'Master design thinking challenges with user research, ideation, and prototyping techniques.',
      keywords: ['design thinking', 'user research', 'ideation', 'prototyping']
    }
  },
  {
    id: '23',
    slug: 'ui-design-interview-questions',
    title: 'UI Design Interview Questions',
    description: 'Common UI design interview questions. Visual design, interaction design, and design systems.',
    content: 'Master UI design interview questions with comprehensive preparation. Learn visual design, interaction design, and design systems.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video23',
    category: 'interview-tips',
    subcategory: 'product-design',
    createdAt: '2024-02-01',
    duration: '9:45',
    difficulty: 'intermediate',
    tags: ['UI design', 'visual design', 'interaction design', 'design systems'],
    seoData: {
      metaTitle: 'UI Design Interview Questions - Visual Design Guide | Hera AI',
      metaDescription: 'Master UI design interview questions with visual design, interaction design, and design systems.',
      keywords: ['UI design interview', 'visual design', 'interaction design', 'design systems']
    }
  },
  {
    id: '24',
    slug: 'product-management-interviews',
    title: 'Product Management Interviews',
    description: 'Product management interview preparation. Strategy, metrics, and cross-functional collaboration.',
    content: 'Master product management interview preparation. Learn strategy, metrics, and cross-functional collaboration techniques.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video24',
    category: 'interview-tips',
    subcategory: 'product-design',
    createdAt: '2024-01-30',
    duration: '13:30',
    difficulty: 'advanced',
    tags: ['product management', 'strategy', 'metrics', 'collaboration'],
    seoData: {
      metaTitle: 'Product Management Interviews - Strategy & Metrics Guide | Hera AI',
      metaDescription: 'Master product management interviews with strategy, metrics, and cross-functional collaboration techniques.',
      keywords: ['product management interview', 'strategy', 'metrics', 'cross-functional collaboration']
    }
  },
  // Others
  {
    id: '25',
    slug: 'general-interview-best-practices',
    title: 'General Interview Best Practices',
    description: 'Universal interview tips that apply to any industry. Preparation, communication, and follow-up strategies.',
    content: 'Master universal interview best practices that apply to any industry. Learn preparation strategies, communication techniques, and follow-up methods.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video25',
    category: 'interview-tips',
    subcategory: 'others',
    createdAt: '2024-02-08',
    duration: '8:30',
    difficulty: 'beginner',
    tags: ['interview tips', 'preparation', 'communication', 'follow-up'],
    seoData: {
      metaTitle: 'General Interview Best Practices - Universal Tips | Hera AI',
      metaDescription: 'Master universal interview best practices for any industry. Learn preparation, communication, and follow-up strategies.',
      keywords: ['interview best practices', 'interview preparation', 'communication skills', 'interview follow-up']
    }
  },
  {
    id: '26',
    slug: 'salary-negotiation-masterclass',
    title: 'Salary Negotiation Masterclass',
    description: 'How to negotiate salary and benefits effectively. Research, timing, and communication techniques.',
    content: 'Master salary negotiation with comprehensive strategies. Learn research techniques, timing, and communication methods for successful negotiations.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video26',
    category: 'interview-tips',
    subcategory: 'others',
    createdAt: '2024-02-06',
    duration: '12:15',
    difficulty: 'intermediate',
    tags: ['salary negotiation', 'benefits', 'research', 'communication'],
    seoData: {
      metaTitle: 'Salary Negotiation Masterclass - Career Success Guide | Hera AI',
      metaDescription: 'Master salary negotiation with research techniques, timing, and communication methods for successful negotiations.',
      keywords: ['salary negotiation', 'benefits negotiation', 'career success', 'negotiation skills']
    }
  },
  {
    id: '27',
    slug: 'remote-work-interview-tips',
    title: 'Remote Work Interview Tips',
    description: 'Excel in remote work interviews. Virtual presence, communication skills, and remote collaboration.',
    content: 'Excel in remote work interviews with specialized preparation. Learn virtual presence, communication skills, and remote collaboration techniques.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video27',
    category: 'interview-tips',
    subcategory: 'others',
    createdAt: '2024-02-04',
    duration: '7:45',
    difficulty: 'beginner',
    tags: ['remote work', 'virtual interview', 'communication', 'collaboration'],
    seoData: {
      metaTitle: 'Remote Work Interview Tips - Virtual Presence Guide | Hera AI',
      metaDescription: 'Excel in remote work interviews with virtual presence, communication skills, and remote collaboration techniques.',
      keywords: ['remote work interview', 'virtual interview', 'remote communication', 'virtual presence']
    }
  },
  {
    id: '28',
    slug: 'career-transition-strategies',
    title: 'Career Transition Strategies',
    description: 'How to successfully transition between careers. Skills transfer, networking, and positioning yourself.',
    content: 'Master career transition strategies with comprehensive approaches. Learn skills transfer, networking, and positioning techniques for successful career changes.',
    thumbnail: '/api/placeholder/300/200',
    videoUrl: 'https://example.com/video28',
    category: 'interview-tips',
    subcategory: 'others',
    createdAt: '2024-02-02',
    duration: '10:30',
    difficulty: 'intermediate',
    tags: ['career transition', 'skills transfer', 'networking', 'career change'],
    seoData: {
      metaTitle: 'Career Transition Strategies - Skills Transfer Guide | Hera AI',
      metaDescription: 'Master career transition strategies with skills transfer, networking, and positioning techniques for successful career changes.',
      keywords: ['career transition', 'skills transfer', 'career change', 'networking strategies']
    }
  }
];

// Helper function to get video by slug
export const getVideoBySlug = (slug: string): VideoData | undefined => {
  return interviewTipsVideos.find(video => video.slug === slug);
};

// Helper function to get videos by subcategory
export const getVideosBySubcategory = (subcategory: string): VideoData[] => {
  return interviewTipsVideos.filter(video => video.subcategory === subcategory);
};

// Helper function to get all subcategories
export const getSubcategories = (): string[] => {
  return [...new Set(interviewTipsVideos.map(video => video.subcategory))];
};
