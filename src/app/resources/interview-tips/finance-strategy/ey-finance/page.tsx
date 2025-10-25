import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP3. Top 10 Interview Questions & Tips for Finance/Accounting Roles with EY Australia 2025 | Héra AI Career Guide',
  description: '🇦🇺 Master EY Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
  keywords: 'EY Finance jobs Australia, EY Accounting interview tips, EY Finance roles, Australian Finance jobs, EY interview preparation, Finance interview questions Australia, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP3. Top 10 Interview Questions & Tips for Finance/Accounting Roles with EY Australia 2025 | Héra AI Career Guide',
    description: '🇦🇺 Master EY Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/finance-strategy/ey-finance',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'EY Finance Interview Questions Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP3. Top 10 Interview Questions & Tips for Finance/Accounting Roles with EY Australia 2025 | Héra AI Career Guide',
    description: '🇦🇺 Master EY Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.',
    images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/finance-strategy/ey-finance',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EYFinancePage() {
const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP3. Top 10 Interview Questions & Tips for Finance/Accounting Roles with EY Australia 2025 | Héra AI Career Guide",
    "description": "Master EY Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.",
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
    "keywords": ["EY Finance jobs Australia", "EY Accounting interview tips", "EY Finance roles", "Australian Finance jobs", "EY interview preparation", "Finance interview questions Australia", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-25",
    "dateModified": "2025-10-25",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.heraai.net.au/resources/interview-tips/finance-strategy/ey-finance"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "width": 1200,
      "height": 630,
      "alt": "EY Finance Interview Questions Australia 2025"
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
            <span className="text-gray-900">EY Finance</span>
          </nav>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="p-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP3. Top 10 Interview Questions & Tips for Finance/Accounting Roles with EY
            </h1>
            <p className="text-xl text-gray-600 mb-6">
                Master EY Finance and Accounting interviews with expert tips from professionals who got hired. Real Q&As, preparation strategies, and insider advice for Finance roles in Australia.
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
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">EY Finance</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Accounting</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Financial Analysis</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Interview Tips</span>
            </div>
          </div>

            {/* Featured Image */}
            <div className="aspect-video bg-gray-100 relative">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="EY Finance Interview Questions Australia 2025"
                className="w-full h-full object-cover"
            />
          </div>

            {/* Article Content */}
            <div className="p-8">
          <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top 10 EY Finance Interview Questions & Expert Tips</h2>
                  
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Interview Overview</h3>
                    <p className="text-gray-700 mb-4">
                      EY's Finance and Accounting interview process is designed to assess your technical skills, analytical thinking, and cultural fit. 
                      These questions are based on real interviews reported by candidates and include expert tips from Héra AI Career Team.
                    </p>
                    <p className="text-gray-700">
                      Each question includes specific Do's and Don'ts to help you prepare effectively and stand out from other candidates.
              </p>
            </div>

                  {/* Question 1 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">1. "Tell me about yourself."</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Keep your answer under 2 minutes, focusing on education, finance experience, and key achievements.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>End with how your background aligns with EY's values (innovation, integrity, inclusiveness).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Recount your life story or mention irrelevant hobbies.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Speak in a monotone or sound rehearsed.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 2 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">2. "Why do you want to work at EY?"</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Reference EY's purpose "Building a better working world" and its digital transformation in finance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Tie your personal values (growth, teamwork, learning) to EY's culture.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Say "because it's Big 4." That's too generic.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Mention salary or prestige as your main motivation.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 3 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">3. "Walk me through a DCF model."</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Outline the key steps: forecast free cash flows → determine WACC → calculate terminal value → discount back.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Explain the rationale and common pitfalls (e.g., sensitivity to assumptions).</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Recite formulas mechanically.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Skip explaining how you'd sanity-check your valuation.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 4 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">4. "Describe a time you worked under pressure or conflicting deadlines."</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Use the STAR method; show prioritization, communication, and composure.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>End with measurable results (e.g., met reporting deadline, avoided errors).</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Say "I thrive under pressure" without an example.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Blame others for the stress or missed targets.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 5 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">5. "What are your strengths and weaknesses?"</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Choose strengths relevant to finance—accuracy, stakeholder communication, or Excel proficiency.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>For weaknesses, show awareness and improvement steps.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Use fake weaknesses like "I work too hard."</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>List multiple flaws without showing progress.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 6 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">6. "Tell us about a time you faced a difficult stakeholder."</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Choose a professional example (e.g., senior manager disagreement).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Explain how you listened, clarified objectives, and reached alignment.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Speak negatively about the person.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Skip describing the resolution or your learning.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 7 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">7. "How does your educational background add value to the team?"</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Highlight specific coursework (e.g., financial analysis, data analytics) and projects that match EY's work.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention transferable skills like attention to detail or presentation ability.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Merely list your degree.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Downplay its relevance to finance.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 8 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">8. "What's your experience with Excel / financial modelling?"</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Give a concrete example of models you've built (e.g., revenue forecasts, cost analysis).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention functions, pivot tables, and automation experience.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Claim "expert level" without evidence.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Confuse data entry with analytical modelling.</span>
                        </li>
                      </ul>
                  </div>
                  </div>

                  {/* Question 9 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">9. "Tell me about a recent transaction in the industry and why it was good or bad."</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Choose a real transaction EY or its competitors advised on.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Analyse value creation, synergies, or valuation multiples objectively.</span>
                        </li>
                      </ul>
              </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Pick a random deal you can't discuss intelligently.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Give a purely emotional or opinion-based answer.</span>
                        </li>
                      </ul>
                </div>
              </div>

              {/* Question 10 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">10. "Where do you see yourself in 5 years?"</h3>
                    
                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Do's</h4>
                  <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Link your career goals to EY's progression (analyst → senior → manager).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Mention professional certification goals like CPA or CFA.</span>
                        </li>
                  </ul>
                </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Don'ts</h4>
                  <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Indicate you plan to leave the profession or start a business soon.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>Focus only on personal gain instead of professional growth.</span>
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

