import React from 'react';
import { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

export const metadata: Metadata = {
  title: 'EP10. Rio Tinto Tech Interview Questions Australia 2025 | Héra AI Career Guide',
  description: '⛏️ Master Rio Tinto tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
  keywords: 'Rio Tinto jobs Australia, tech interview tips, software engineering interview, data-driven product improvement, code security, technical debt, Australian tech jobs, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP10. Rio Tinto Tech Interview Questions Australia 2025 | Héra AI Career Guide',
    description: '⛏️ Master Rio Tinto tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/tech-interviews/rio-tinto-tech-interview',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Rio Tinto Tech Interview Questions Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP10. Rio Tinto Tech Interview Questions Australia 2025 | Héra AI Career Guide',
    description: '⛏️ Master Rio Tinto tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/tech-interviews/rio-tinto-tech-interview',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RioTintoTechInterviewPage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP10. Rio Tinto Tech Interview Questions Australia 2025 | Héra AI Career Guide",
    "description": "Master Rio Tinto tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.",
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
    "keywords": ["Rio Tinto jobs Australia", "tech interview tips", "software engineering interview", "data-driven product improvement", "code security", "technical debt", "Australian tech jobs", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-25",
    "dateModified": "2025-10-25",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/tech-interviews/rio-tinto-tech-interview",
    "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
                isPremium={false}
                className="ml-8"
              />
            </div>
          </nav>
        </div>

        <div className="mt-14 pt-4 px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/resources" className="hover:text-gray-700">Resources</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips" className="hover:text-gray-700">Interview Tips</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips/tech-interviews" className="hover:text-gray-700">Tech Interviews</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Rio Tinto</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP10. Rio Tinto Tech Interview Questions & Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 25, 2025</span>
              <span>🔄 Updated: October 25, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Rio Tinto jobs', 'Tech Interview', 'Software Engineering', 'Mining Innovation'].map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <section className="mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <iframe
                src="https://iframe.cloudflarestream.com/fb0cbea7375da57960c3de22701fbe84"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Rio Tinto Tech Interview Questions Video"
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-gray-600 italic">
              Watch our comprehensive video guide above, then read the detailed breakdown below.
            </p>
          </section>

          <article className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Rio Tinto's tech interview process is known for being innovation-focused, security-conscious, and quality-driven. 
                The mining giant values engineers who can use data to improve products, ensure code security, and manage technical debt effectively. 
                Interviews typically focus on your analytical thinking, security awareness, and understanding of how technology impacts 
                mining innovation and operational efficiency.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top 3 Rio Tinto Tech Interview Questions</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Question 1: Data-Driven Product Improvement</h3>
                <p className="text-gray-700 mb-3 font-semibold">"Describe a time you used data to improve a product."</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-3">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Do:</h4>
                  <ul className="list-disc list-inside text-green-700 mb-2">
                    <li>Highlight your analytical thinking and how it aligns with mining innovation</li>
                    <li>Use specific metrics and measurable outcomes to demonstrate impact</li>
                    <li>Discuss how you identified the problem through data analysis</li>
                    <li>Show understanding of how data drives product decisions in mining</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Give vague examples without specific data or metrics</li>
                    <li>Ignore the mining context and operational impact</li>
                    <li>Focus only on technical implementation without business value</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Question 2: Code Security</h3>
                <p className="text-gray-700 mb-3 font-semibold">"How do you ensure security in your code?"</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-3">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Do:</h4>
                  <ul className="list-disc list-inside text-green-700 mb-2">
                    <li>Mention Rio Tinto's strict compliance and security standards</li>
                    <li>Discuss secure coding practices, input validation, and authentication</li>
                    <li>Talk about security testing, code reviews, and vulnerability assessments</li>
                    <li>Show understanding of mining industry security requirements and regulations</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Give generic security advice without mining industry context</li>
                    <li>Ignore compliance and regulatory requirements</li>
                    <li>Focus only on technical security without considering business impact</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Question 3: Technical Debt Management</h3>
                <p className="text-gray-700 mb-3 font-semibold">"How do you handle technical debt?"</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-3">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Do:</h4>
                  <ul className="list-disc list-inside text-green-700 mb-2">
                    <li>Show you value long-term code quality, which Rio Tinto prioritizes</li>
                    <li>Discuss strategies for identifying, prioritizing, and addressing technical debt</li>
                    <li>Mention refactoring, code reviews, and continuous improvement processes</li>
                    <li>Show understanding of balancing feature development with code quality</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Ignore the importance of code quality in mining systems</li>
                    <li>Give examples that don't show strategic thinking about technical debt</li>
                    <li>Focus only on immediate fixes without considering long-term impact</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>Rio Tinto values engineers who can balance innovation with security and quality.</strong> Show that you understand 
                  the unique challenges of mining technology and demonstrate your ability to use data to drive product improvements 
                  while maintaining the highest standards of security and code quality.
                </p>
              </div>
            </section>
          </article>

          <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Written by Héra AI Career Team | Updated October 25, 2025 | 
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
              </p>
          </footer>
        </div>
      </div>
    </>
  );
}
