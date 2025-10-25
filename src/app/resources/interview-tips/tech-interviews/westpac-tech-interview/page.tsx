import React from 'react';
import { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

export const metadata: Metadata = {
  title: 'EP4. Westpac Tech Interview Questions Australia 2025 | Héra AI Career Guide',
  description: '🏦 Master Westpac tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
  keywords: 'Westpac jobs Australia, tech interview tips, software engineering interview, data-driven product improvement, code security, technical debt, Australian tech jobs, Héra AI career guide, AI career agent, job interview preparation Australia',
  openGraph: {
    title: 'EP4. Westpac Tech Interview Questions Australia 2025 | Héra AI Career Guide',
    description: '🏦 Master Westpac tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/tech-interviews/westpac-tech-interview',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Westpac Tech Interview Questions Australia 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP4. Westpac Tech Interview Questions Australia 2025 | Héra AI Career Guide',
    description: '🏦 Master Westpac tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.heraai.net.au/resources/interview-tips/tech-interviews/westpac-tech-interview',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WestpacTechInterviewPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP4. Westpac Tech Interview Questions Australia 2025 | Héra AI Career Guide",
    "description": "Master Westpac tech interviews with expert tips from engineers who got hired. Real Q&As, preparation strategies, and insider advice for all tech jobs in Australia.",
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
    "keywords": ["Westpac jobs Australia", "tech interview tips", "software engineering interview", "data-driven product improvement", "code security", "technical debt", "Australian tech jobs", "Héra AI career guide", "AI career agent", "job interview preparation Australia"],
    "datePublished": "2025-10-25",
    "dateModified": "2025-10-25",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/tech-interviews/westpac-tech-interview",
    "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Navigation */}
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

        {/* Breadcrumb Navigation */}
        <div className="mt-14 pt-4 px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/resources" className="hover:text-gray-700">Resources</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips" className="hover:text-gray-700">Interview Tips</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips/tech-interviews" className="hover:text-gray-700">Tech Interviews</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Westpac</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP4. Westpac Tech Interview Questions & Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 25, 2025</span>
              <span>🔄 Updated: October 25, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Westpac jobs', 'Tech Interview', 'Software Engineering', 'Banking Innovation'].map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Optional Video Section */}
          <section className="mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <iframe
                src="https://iframe.cloudflarestream.com/4c0d73d27b55091cea32c3d88dfb20d3"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Westpac Tech Interview Questions Video"
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-gray-600 italic">
              Watch our comprehensive video guide above, then read the detailed breakdown below.
            </p>
          </section>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Westpac's tech interview process is known for being innovation-focused, security-conscious, and quality-driven. 
                The bank values engineers who can use data to improve products, ensure code security, and manage technical debt effectively. 
                Interviews typically focus on your analytical thinking, security awareness, and understanding of how technology impacts 
                banking innovation and customer experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Process & Timeline</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Application & Resume Review</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Submit your application through Westpac's careers page</li>
                  <li>Expect initial screening within 1-2 weeks</li>
                  <li>Technical resume review by engineering team</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📞 Phone/Video Screening (30-45 minutes)</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Initial technical discussion and culture fit assessment</li>
                  <li>Questions about your background and interest in Westpac</li>
                  <li>High-level technical problem solving</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">💻 Technical Interview (1-2 hours)</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Data-driven product improvement challenges</li>
                  <li>Code security and compliance discussions</li>
                  <li>Technical debt management problems</li>
                  <li>Live coding session with real-time feedback</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">⚡ Final Interview & Decision</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Day 1-2:</strong> Technical interview completion</li>
                  <li><strong>Day 3-5:</strong> Team fit and culture assessment</li>
                  <li><strong>Day 5-7:</strong> Final decision and offer</li>
                </ul>
                <p className="text-gray-700 font-semibold">The entire process typically takes 1-2 weeks — be prepared for multiple rounds.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top 3 Westpac Tech Interview Questions</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Question 1: Data-Driven Product Improvement</h3>
                <p className="text-gray-700 mb-3 font-semibold">"Describe a time you used data to improve a product."</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-3">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Do:</h4>
                  <ul className="list-disc list-inside text-green-700 mb-2">
                    <li>Highlight your analytical thinking and how it aligns with banking innovation</li>
                    <li>Use specific metrics and measurable outcomes to demonstrate impact</li>
                    <li>Discuss how you identified the problem through data analysis</li>
                    <li>Show understanding of how data drives product decisions in banking</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Give vague examples without specific data or metrics</li>
                    <li>Ignore the banking context and customer impact</li>
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
                    <li>Mention Westpac's strict compliance and security standards</li>
                    <li>Discuss secure coding practices, input validation, and authentication</li>
                    <li>Talk about security testing, code reviews, and vulnerability assessments</li>
                    <li>Show understanding of banking security requirements and regulations</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Give generic security advice without banking context</li>
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
                    <li>Show you value long-term code quality, which Westpac prioritizes</li>
                    <li>Discuss strategies for identifying, prioritizing, and addressing technical debt</li>
                    <li>Mention refactoring, code reviews, and continuous improvement processes</li>
                    <li>Show understanding of balancing feature development with code quality</li>
                  </ul>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">❌ Don't:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Ignore the importance of code quality in banking systems</li>
                    <li>Give examples that don't show strategic thinking about technical debt</li>
                    <li>Focus only on immediate fixes without considering long-term impact</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Tips</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Focus on Data-Driven Thinking</h3>
                <p className="text-gray-700 mb-3">Emphasize your ability to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Use analytics and metrics to drive product decisions</li>
                  <li>Identify opportunities for improvement through data analysis</li>
                  <li>Measure and validate the impact of your changes</li>
                  <li>Understand customer behavior and banking trends</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Emphasize Security and Compliance</h3>
                <p className="text-gray-700 mb-3">Show your understanding of:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Banking security standards and best practices</li>
                  <li>Regulatory compliance requirements</li>
                  <li>Secure coding practices and vulnerability management</li>
                  <li>Risk assessment and mitigation strategies</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Demonstrate Quality Focus</h3>
                <p className="text-gray-700 mb-3">Highlight your commitment to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Code quality and maintainability</li>
                  <li>Technical debt management and refactoring</li>
                  <li>Testing strategies and quality assurance</li>
                  <li>Long-term thinking and sustainable development</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Prepare Banking-Specific Examples</h3>
                <p className="text-gray-700 mb-3">Have concrete examples ready that show:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>How you've improved user experience through data analysis</li>
                  <li>Security measures you've implemented in previous projects</li>
                  <li>Technical debt you've addressed and its business impact</li>
                  <li>Innovation initiatives you've led or contributed to</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Research Westpac's Innovation</h3>
                <p className="text-gray-700 mb-3">Understand Westpac's tech initiatives:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Westpac app and digital banking features</li>
                  <li>AI and machine learning projects</li>
                  <li>Open banking and API initiatives</li>
                  <li>Customer experience and innovation labs</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>Westpac values engineers who can balance innovation with security and quality.</strong> Show that you understand 
                  the unique challenges of banking technology and demonstrate your ability to use data to drive product improvements 
                  while maintaining the highest standards of security and code quality.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Current Tech Openings & Application Tips</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>When to apply:</strong> Westpac typically has ongoing tech roles throughout the year. 
                Peak hiring periods are usually in Q1 and Q3, but they're always looking for exceptional talent.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Where to find openings:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Westpac careers website</li>
                <li>LinkedIn job postings</li>
                <li>Tech meetups and conferences</li>
                <li>Employee referrals</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Application tips:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Tailor your resume to highlight relevant banking tech experience</li>
                <li>Include specific examples of data-driven product improvements</li>
                <li>Showcase your understanding of security and compliance</li>
                <li>Prepare a portfolio of relevant technical projects</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. What Happens After You Get Hired</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Onboarding program:</strong> New tech hires typically go through a comprehensive onboarding program 
                that covers Westpac's tech stack, development processes, and banking knowledge. This usually lasts 2-4 weeks.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Team structure:</strong> You'll likely join a cross-functional team working on specific product areas 
                like digital banking, payments, or customer experience.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Growth opportunities:</strong> Westpac offers excellent career progression opportunities, including 
                technical leadership roles, product management, and specialized engineering tracks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Common Mistakes to Avoid</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Don't do this:</h3>
                <ul className="list-disc list-inside text-red-700 mb-3">
                  <li>Focus only on technical skills without considering security and compliance</li>
                  <li>Give generic answers about data analysis without banking context</li>
                  <li>Ignore the importance of code quality and technical debt management</li>
                  <li>Show up unprepared for banking-specific questions</li>
                  <li>Ask only about salary and benefits</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Do this instead:</h3>
                <ul className="list-disc list-inside text-green-700 mb-3">
                  <li>Show genuine interest in Westpac's mission and innovation</li>
                  <li>Provide specific examples with measurable outcomes</li>
                  <li>Research the company and prepare thoughtful questions</li>
                  <li>Demonstrate your understanding of banking technology</li>
                  <li>Ask about growth opportunities and team culture</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Follow-Up After Your Interview</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Send a thank-you email:</strong> Within 24 hours, send a personalized thank-you note to your interviewer. 
                Reference specific parts of your conversation and reiterate your enthusiasm for the role.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Follow up appropriately:</strong> If you haven't heard back within the timeframe they mentioned, 
                send a polite follow-up email after 1-2 weeks.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Stay positive:</strong> Even if you don't get this position, the experience is valuable for future applications. 
                Many successful candidates applied multiple times before getting hired.
              </p>
            </section>
          </article>

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
                <a 
                  href="/resources" 
                  className="text-gray-600 hover:text-gray-800 font-medium underline"
                >
                  Browse More Resources
                </a>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Career Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/resources/interview-tips/tech-interviews" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Tech Interview Tips</h3>
                <p className="text-gray-600">Browse all our tech interview guides from top Australian companies.</p>
              </Link>
              <Link href="/resources/interview-tips/tech-interviews/commbank-tech-interview" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP3. Commonwealth Bank Tech Interview Questions</h3>
                <p className="text-gray-600">CommBank's tech interview process focuses on data-driven product improvement, code security, and technical debt management.</p>
              </Link>
            </div>
          </section>

          {/* Article Footer */}
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
