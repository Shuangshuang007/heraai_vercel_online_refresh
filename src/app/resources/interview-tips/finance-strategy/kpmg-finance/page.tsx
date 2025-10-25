import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP4. Top 10 Interview Questions & Tips for Finance/Accounting Roles with KPMG Australia 2025 | Héra AI Career Guide',
  description: '🇦🇺 Master KPMG Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
  keywords: 'KPMG Finance jobs Australia, KPMG Accounting interview tips, KPMG Finance roles, Australian Finance jobs, KPMG interview preparation, Finance interview questions Australia, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP4. Top 10 Interview Questions & Tips for Finance/Accounting Roles with KPMG Australia 2025 | Héra AI Career Guide',
    description: '🇦🇺 Master KPMG Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/finance-strategy/kpmg-finance',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'KPMG Finance Interview Questions Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP4. Top 10 Interview Questions & Tips for Finance/Accounting Roles with KPMG Australia 2025 | Héra AI Career Guide',
    description: '🇦🇺 Master KPMG Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
    images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/finance-strategy/kpmg-finance',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KPMGFinancePage() {
const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP4. Top 10 Interview Questions & Tips for Finance/Accounting Roles with KPMG Australia 2025 | Héra AI Career Guide",
    "description": "Master KPMG Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.",
    "author": {
      "@type": "Organization",
      "name": "Héra AI",
      "url": "https://www.heraai.net.au",
      "description": "Leading AI Agent for candidates providing tailored interview tips and career insights"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Héra AI",
      "url": "https://www.heraai.net.au",
      "description": "The AI Career Agent Trusted by Jobseekers in Australia and Beyond",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.heraai.net.au/logo.png"
      }
    },
    "keywords": ["KPMG Finance jobs Australia", "KPMG Accounting interview tips", "KPMG Finance roles", "Australian Finance jobs", "KPMG interview preparation", "Finance interview questions Australia", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-25",
    "dateModified": "2025-10-25",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.heraai.net.au/resources/interview-tips/finance-strategy/kpmg-finance"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "width": 1200,
      "height": 630,
      "alt": "KPMG Finance Interview Questions Australia 2025"
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 shadow-sm h-[56px]">
          <nav className="flex justify-between items-center px-6 h-[56px]">
            <div className="flex space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Héra AI</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/profile" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Profile</Link>
                <Link href="/jobs" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Jobs</Link>
                <Link href="/applications" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Applications</Link>
                <Link href="/resources" className="border-b-2 border-blue-500 h-[56px] flex items-center text-[18px] font-medium text-blue-600">Resources</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* AccountSettingIcon or other user-related components */}
            </div>
          </nav>
        </div>
        <div className="mt-14 pt-4 px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/resources" className="hover:text-gray-700">Resources</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips" className="hover:text-gray-700">Interview Tips</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips/finance-strategy" className="hover:text-gray-700">Finance & Strategy</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">KPMG Finance</span>
          </nav>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="p-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP4. Top 10 Interview Questions & Tips for Finance/Accounting Roles with KPMG
            </h1>
            <p className="text-xl text-gray-600 mb-6">
                Master KPMG Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Published: October 25, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Updated: October 25, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>By: Héra AI Career Team</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">KPMG Finance</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Accounting</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Financial Analysis</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Interview Tips</span>
            </div>
          </div>

            {/* Featured Image */}
            <div className="aspect-video bg-gray-100 relative">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="KPMG Finance Interview Questions Australia 2025"
                className="w-full h-full object-cover"
            />
          </div>

            {/* Article Content */}
            <div className="p-8">
          <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top 10 KPMG Finance Interview Questions & Expert Tips</h2>
                  
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Interview Overview</h3>
                    <p className="text-gray-700 mb-4">
                      KPMG's Finance and Accounting interview process is designed to assess your technical skills, analytical thinking, and cultural fit. 
                      These questions are based on real interviews reported by candidates and include expert tips from Héra AI Career Team.
                    </p>
                    <p className="text-gray-700">
                      Each question includes specific Do's and Don'ts to help you prepare effectively and stand out from other candidates.
              </p>
            </div>

                  {/* Question 1 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Briefly introduce your education, relevant experience and key skills such as financial analysis and modelling, highlighting achievements that show initiative or leadership.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Keep it professional and concise; summarise your education, experience and key achievements relevant to the finance role</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Highlight specific financial analysis and modelling skills with concrete examples</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Quantify your achievements where possible (e.g., "improved efficiency by 20%")</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Share personal life stories or unrelated details; keep your answer focused on your career progression</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Rambling or including irrelevant information that doesn't relate to the finance role</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 2 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Explain what attracts you to the company, mentioning its reputation, culture and how its clients or projects align with your career goals.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Research the company's mission and values; mention specific aspects that attract you and align your skills with the role</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Connect KPMG's client base and projects to your career aspirations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Show knowledge of KPMG's recent achievements or initiatives</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Give generic or vague answers; employers may reject candidates who show little understanding of the company</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Focus only on salary or benefits without mentioning the company's culture or values</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 3 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Discuss strengths like analytical skills or teamwork and acknowledge a genuine weakness you're addressing.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Select strengths that match the job description and back them up with examples</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Choose a genuine weakness you're improving and explain the steps you're taking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use the STAR method (Situation, Task, Action, Result) for your strength examples</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Use clichés like perfectionism or claim to have no weaknesses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Avoid oversharing weaknesses that could undermine your suitability for the role</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 4 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Use the STAR method to describe a team project or challenge, emphasising how you organised the work and met a tight deadline.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use the STAR method (Situation, Task, Action, Result) to structure your answer</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Keep it concise and quantify the outcome</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Focus on your specific contribution and leadership skills</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Ramble or include irrelevant details; focus on your contribution and the positive result</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Blame team members or focus on what went wrong rather than how you solved it</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 5 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Describe how you simplify complex financial information for non-financial audiences using plain language, visuals and analogies.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use plain English, avoid jargon and use analogies to make the data relatable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Provide context for the numbers and focus on the big picture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use visual aids like charts, graphs, or simple diagrams when appropriate</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Overwhelm the audience with data; limit details and focus on the big picture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Use technical jargon without explanation or assume prior knowledge</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 6 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Walk through a discounted cash-flow (DCF) valuation: forecast cash flows, choose an appropriate discount rate and calculate terminal value.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Give a high-level overview: project unlevered free cash flows, determine WACC, calculate terminal value and discount to present value</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Explain the rationale behind each step and key assumptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention sensitivity analysis and key risks to consider</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Simply list steps without context; explain the rationale behind each step and avoid unnecessary detail</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Get bogged down in complex calculations during the interview</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 7 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Share details of a past experience, such as building a financial model or working on a transaction, explaining adjustments you made and the outcomes.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Choose a relevant project, describe the situation, actions and results, and quantify the impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Explain the specific adjustments you made and why they were necessary</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Highlight what you learned from the experience</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Criticize previous employers or colleagues; stay positive and focus on what you learned and achieved</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Choose examples that don't relate to finance or accounting</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 8 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Explain how you prioritise tasks, use tools and communicate to manage multiple deadlines and maintain quality under pressure.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Show that you're comfortable with deadlines and describe how you prioritise tasks, use tools and communicate to stay on track</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention specific tools you use (Excel, project management software, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Give examples of how you've successfully managed competing priorities</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Admit discomfort with deadlines or give vague responses; don't imply you rush and compromise quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Focus only on individual work without mentioning team collaboration</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 9 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Discuss your knowledge of the company's values and industry risks and how you keep informed through news, reports and professional development.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Research the company's values, mission and industry risks and explain how your values align</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Stay informed through news and professional development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention specific industry publications, conferences, or courses you follow</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Arrive unprepared or rely on generic statements; failing to demonstrate company knowledge can cost you the job</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Make up information about the company or industry</span>
                        </li>
                      </ul>
                </div>
              </div>

              {/* Question 10 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Mention a unique fact about the company or recount one of your proudest professional achievements that relates to the role.</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                  <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Share a unique fact about the company (e.g., community initiatives) or a professional achievement that aligns with the role</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use a narrative and quantify results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Connect your achievement to how it would benefit KPMG</span>
                        </li>
                  </ul>
                </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                  <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Pick achievements unrelated to the job or share purely personal stories</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Make up facts about the company or exaggerate your achievements</span>
                        </li>
                  </ul>
                </div>
              </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔗 Apply Now</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Apply via <Link href="https://www.heraai.net.au" className="text-blue-600 hover:underline">HeraAI.net.au</Link>
                  </p>
                </section>

                {/* Newsletter Signup */}
                <section className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stay Updated with Héra AI — The AI Career Agent Trusted by Jobseekers in Australia and Beyond</h2>
                  <p className="text-gray-700 mb-6">
                    Héra AI provides tailored interview tips, career insights, and job opportunities for students and professionals across Australia — and beyond.
                    <br/><br/>
                    Get weekly updates packed with actionable advice, career growth tools, and hiring trends.
                    <br/><br/>
                    Join thousands of ambitious jobseekers building their future with Héra AI.
              </p>
              <div className="space-y-4">
                    <form className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Subscribe Now
                      </button>
                    </form>
                    <div className="flex justify-center">
                <Link
                        href="/resources"
                        className="text-gray-600 hover:text-gray-800 font-medium underline"
                      >
                        Explore More Career Resources
                </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

