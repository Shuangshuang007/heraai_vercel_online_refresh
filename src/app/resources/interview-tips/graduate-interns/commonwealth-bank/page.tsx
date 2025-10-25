import React from 'react';
import { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

export const metadata: Metadata = {
  title: 'EP1. Commonwealth Bank Summer Internship Interview Tips Australia 2025 | Héra AI Career Guide',
  description: '🌟 Master Commonwealth Bank Summer Internship interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Finance, Tech, Markets, and Cyber roles in Australia.',
  keywords: 'Commonwealth Bank jobs Australia, Summer Internship jobs, graduate interview tips, Australian graduate jobs, CommBank interview tips, finance internship Australia, tech internship Australia, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP1. Commonwealth Bank Summer Internship Interview Tips Australia 2025 | Héra AI Career Guide',
    description: '🌟 Master Commonwealth Bank Summer Internship interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Finance, Tech, Markets, and Cyber roles in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/graduate-interns/commonwealth-bank',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Commonwealth Bank Summer Internship Interview Tips Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP1. Commonwealth Bank Summer Internship Interview Tips Australia 2025 | Héra AI Career Guide',
    description: '🌟 Master Commonwealth Bank Summer Internship interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Finance, Tech, Markets, and Cyber roles in Australia.',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/graduate-interns/commonwealth-bank',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CommonwealthBankPage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP1. Commonwealth Bank Summer Internship Interview Tips Australia 2025 | Héra AI Career Guide",
    "description": "Master Commonwealth Bank Summer Internship interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Finance, Tech, Markets, and Cyber roles in Australia.",
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
    "keywords": ["Commonwealth Bank jobs Australia", "Summer Internship jobs", "graduate interview tips", "Australian graduate jobs", "CommBank interview tips", "finance internship Australia", "tech internship Australia", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-23",
    "dateModified": "2025-10-23",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/graduate-interns/commonwealth-bank",
    "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Héra AI
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
                <Link href="/applications" className="text-gray-600 hover:text-gray-900">Applications</Link>
                <Link href="/resources" className="text-blue-600 font-medium">Resources</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mt-14 pt-4 px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/resources" className="hover:text-gray-700">Resources</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips" className="hover:text-gray-700">Interview Tips</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips/graduate-interns" className="hover:text-gray-700">Graduate & Interns</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Commonwealth Bank</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="p-8 border-b border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                EP1. Commonwealth Bank Summer Internship Interview Tips
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Thinking of applying for Commonwealth Bank's 2025 Summer Internship Program? Here's everything you need to know — plus key interview insights to help you stand out.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 October 23, 2025</span>
                <span>⏱️ 6 min read</span>
                <span>Level: Intermediate</span>
              </div>
            </div>

            {/* Featured Video */}
            <div className="aspect-video bg-gray-100 relative">
              <iframe
                src="https://customer-ls2bua2ezo6y6x3g.cloudflarestream.com/33811228fa820f07b72dc7b66ec833a8/iframe"
                className="w-full h-full border-0 rounded-lg"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title="Commonwealth Bank Summer Internship Interview Tips"
              ></iframe>
            </div>

            {/* Article Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">📅 Application Timeline</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">🕓 Closes:</h3>
                        <p className="text-gray-700">~26 August 2025</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">📍 Locations:</h3>
                        <p className="text-gray-700">Sydney / Melbourne / Brisbane / Perth</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎓 Eligibility</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Penultimate-year students</li>
                    <li>Australian or New Zealand citizens / permanent residents</li>
                    <li>Some visa holders accepted</li>
                  </ul>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🧠 Stage 1: Online Cognitive Tests (~45 mins)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Format:</h3>
                      <p className="text-gray-700">Numerical, logical, and verbal reasoning questions</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Examples:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Spotting pattern sequences</li>
                        <li>Solving percentage or ratio problems</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">✅ Tips:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Practice with sample cognitive tests (especially pattern and number logic).</li>
                        <li>Manage your time — don't spend too long on one question.</li>
                        <li>Double-check simple calculations to avoid small mistakes.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">💬 Stage 2: Behavioral Interview (~30 mins)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Focus Areas:</h3>
                      <p className="text-gray-700">Teamwork, leadership, problem-solving, adaptability</p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Example Question:</h3>
                      <p className="text-gray-700 italic">"Tell me about a time you failed. What did you learn?"</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">✅ Tips:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Use the STAR method (Situation, Task, Action, Result).</li>
                        <li>Prepare examples that show initiative, resilience, and collaboration.</li>
                        <li>Research CommBank's values — Integrity, Accountability, Collaboration, Excellence, Service — and weave them naturally into your responses.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🧩 Possible Next Step: Assessment Centre</h2>
                  
                  <p className="text-gray-700 mb-4">
                    May include group activities or case discussions that assess teamwork and analytical thinking.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Tip:</h3>
                    <p className="text-gray-700">Be proactive, inclusive, and help the team progress — collaboration matters more than competition.</p>
                  </div>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔗 Apply Now</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Apply via <Link href="https://www.heraai.net.au" className="text-blue-600 hover:underline">HeraAI.net.au</Link> or the official <Link href="https://www.commbank.com.au/about-us/careers.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">CommBank Careers Portal</Link>
                  </p>
                </section>

                <div className="bg-gray-100 h-px my-8"></div>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">💡 Final Advice</h2>
                  
                  <p className="text-gray-700">
                    Start early, be authentic, and show how your strengths align with CommBank's purpose — "Building a brighter future for all."
                  </p>
                </section>
              </div>
            </div>

            {/* Next Steps */}
            <section className="mb-8 p-8 bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Next Steps</h2>
              <p className="text-gray-700 mb-4">
                Ready to apply for Commonwealth Bank Summer Internship? Browse live graduate job listings to find your perfect opportunity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  👉 Browse Graduate Jobs
                </Link>
              </div>
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

            <footer className="border-t border-gray-200 pt-6 mt-8 p-8">
              <p className="text-sm text-gray-500">
                Written by Héra AI Career Team | Updated October 23, 2025
              </p>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
