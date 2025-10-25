import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP8. Deloitte Australia Vacationer Program Interview Tips Australia 2025 | Héra AI Career Guide',
  description: '🏢 Master Deloitte Australia Vacationer Program interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Audit & Assurance roles in Australia.',
  keywords: 'Deloitte jobs Australia, Vacationer Program, graduate interview tips, Australian graduate jobs, Deloitte interview tips, audit internship Australia, assurance internship Australia, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP8. Deloitte Australia Vacationer Program Interview Tips Australia 2025 | Héra AI Career Guide',
    description: '🏢 Master Deloitte Australia Vacationer Program interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Audit & Assurance roles in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/graduate-interns/deloitte',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Deloitte Australia Vacationer Program Interview Tips Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP8. Deloitte Australia Vacationer Program Interview Tips Australia 2025 | Héra AI Career Guide',
    description: '🏢 Master Deloitte Australia Vacationer Program interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Audit & Assurance roles in Australia.',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/graduate-interns/deloitte',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DeloittePage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP8. Deloitte Australia Vacationer Program Interview Tips Australia 2025 | Héra AI Career Guide",
    "description": "Master Deloitte Australia Vacationer Program interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Audit & Assurance roles in Australia.",
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
    "keywords": ["Deloitte jobs Australia", "Vacationer Program", "graduate interview tips", "Australian graduate jobs", "Deloitte interview tips", "audit internship Australia", "assurance internship Australia", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-30",
    "dateModified": "2025-10-30",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.heraai.net.au/resources/interview-tips/graduate-interns/deloitte"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "width": 1200,
      "height": 630,
      "alt": "Deloitte Australia Vacationer Program Interview Tips Australia 2025"
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
            <Link href="/resources/interview-tips/graduate-interns" className="hover:text-gray-700">Graduate & Interns</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Deloitte</span>
          </nav>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="p-8 border-b border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                EP8. Deloitte Australia Vacationer Program Interview Tips
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Ready to kickstart your career in professional services? Deloitte Australia's Vacationer Program offers 4-8 weeks of paid, in-person experience across national offices, giving you hands-on exposure to real client engagements and cutting-edge audit tools.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Published: October 30, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Updated: October 30, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>By: Héra AI Career Team</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Deloitte jobs</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Vacationer Program</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">audit internship</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">assurance internship</span>
              </div>
            </div>

            {/* Featured Video */}
            <div className="aspect-video bg-gray-100 relative">
              <iframe
                src="https://customer-ls2bua2ezo6y6x3g.cloudflarestream.com/0faaca2c1c74716c7099ec5a7a25fac6/iframe"
                className="w-full h-full border-0 rounded-lg"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Deloitte Australia Vacationer Program Interview Tips"
              ></iframe>
            </div>

            {/* Article Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">📅 Application Timeline</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Rolling applications (typically February/March and July/August)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Locations: National offices across Australia</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🎓 Eligibility</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Currently studying a relevant degree, planning to graduate mid to late 2026</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Australian work rights required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>International students accepted if legally residing in Australia and studying for at least 2 years</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🏢 Track A — Audit & Assurance (incl. Tech Controls)</h2>
                  
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What to expect:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Application window: rolling; roles listed by office (e.g., Perth/Melbourne)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Program length: typically 4–8 weeks full-time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Work: client engagements, controls/testing, exposure to digital audit tools</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rounds & assessments:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>R1 – Immersive / game-based online test (situational + numerical/verbal/logical mini-tasks)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>R2 – Video interview (motivation + behavioral)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>AC – Group case + 1:1 interview; some teams add a partner interview</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample questions (reported):</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>"Describe a time you received critical feedback and how you reacted."</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>"Tell me about a time you managed tight deadlines / conflicting priorities."</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips to stand out:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Quantify impact (e.g., process, accuracy, or stakeholder outcomes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Show controls mindset + comfort with data-enabled audit tools</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Typical Hiring Flow</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      Online application → game-based / immersive online assessment → video (HireVue-style) interview → assessment centre (group case + behavioral/technical) → team/partner interview
                    </p>
                    <p className="text-sm text-gray-600">
                      <em>Note: Process varies by team and location</em>
                    </p>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔗 Apply Now</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Apply via <Link href="https://www.heraai.net.au" className="text-blue-600 hover:underline">HeraAI.net.au</Link> or the official <Link href="https://www.deloitte.com/au/en/careers/students/summer-vacation-program-careers.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Deloitte Australia Careers Portal</Link>
                  </p>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">💡 Final Advice</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Deloitte looks for analytical thinkers who can work with data, understand business processes, and communicate complex information clearly. 
                    Show your attention to detail, your ability to work in teams, and your interest in how businesses operate and manage risk.
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

