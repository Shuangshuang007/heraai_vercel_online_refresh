import React from 'react';
import { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

export const metadata: Metadata = {
  title: 'EP1. Lululemon Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
  description: '🎄 Master Lululemon Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  keywords: 'Lululemon jobs, Christmas Casual jobs, retail interview tips, holiday employment, Lululemon interview, Australian retail jobs',
  openGraph: {
    title: 'EP1. Lululemon Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: '🎄 Master Lululemon Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    type: 'article',
        url: 'https://docs.google.com/document/d/1RU10HYThlNjN-Y8_8bnc9tSWcoaYgB7H0iilRcze4is/edit?tab=t.0',
    images: [
      {
        url: 'https://docs.google.com/document/d/1RU10HYThlNjN-Y8_8bnc9tSWcoaYgB7H0iilRcze4is/edit?tab=t.0',
        width: 1200,
        height: 630,
        alt: 'Lululemon Christmas Casual Interview Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP1. Lululemon Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: '🎄 Master Lululemon Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    images: ['https://docs.google.com/document/d/1RU10HYThlNjN-Y8_8bnc9tSWcoaYgB7H0iilRcze4is/edit?tab=t.0'],
  },
};

export default function LululemonChristmasCasualPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP1. Lululemon Christmas Casual Job Interview Tips - Complete Guide",
    "description": "Master Lululemon Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.",
    "author": {
      "@type": "Organization",
      "name": "Héra AI",
      "url": "https://www.heraai.net.au"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Héra AI",
      "url": "https://www.heraai.net.au",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.heraai.net.au/logo.png"
      }
    },
    "keywords": ["Lululemon jobs", "Christmas Casual jobs", "retail interview tips", "holiday employment", "Lululemon interview", "Australian retail jobs"],
      "datePublished": "2025-10-01",
      "dateModified": "2025-10-01",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/lululemon-christmas-casual",
    "image": "https://docs.google.com/document/d/1RU10HYThlNjN-Y8_8bnc9tSWcoaYgB7H0iilRcze4is/edit?tab=t.0"
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
            <span className="text-gray-900">Lululemon Christmas Casual</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP1. Lululemon Christmas Casual Job Interview Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 1, 2025</span>
              <span>🔄 Updated: October 1, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Lululemon jobs', 'Christmas Casual', 'retail interview', 'holiday jobs'].map((tag, index) => (
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
                src="https://iframe.cloudflarestream.com/a819eba9c520db4ac51c4e72e5975d12"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Lululemon Christmas Casual Interview Tips Video"
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
                Lululemon's Christmas casual hiring process is known for being fast, friendly, and experience-focused. 
                The brand values authenticity, teamwork, and enthusiasm for an active lifestyle. Interviews are typically 
                casual but purposeful — they assess your customer service mindset and alignment with the Lululemon culture.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Process & Timeline</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Resume Submission</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Submit your resume online (usually in early September)</li>
                  <li>Expect a phone call within 2–3 weeks if shortlisted</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📞 Phone Interview</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Focuses on your background, availability, and holiday plans</li>
                  <li>Friendly tone — a chance to express your personality and flexibility</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👥 Group Interview (≈1 hour, ~3 candidates)</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Conducted by the store's hiring manager</li>
                  <li>Each candidate answers similar questions in turn</li>
                  <li>Relaxed atmosphere — more of a conversation about your experiences and understanding of the brand</li>
                  <li>Interviewers observe your team interaction, positivity, and communication style</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">⚡ Result Timeline</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Day 2:</strong> Reference check</li>
                  <li><strong>Day 3:</strong> Offer call from the manager</li>
                  <li><strong>Day 4:</strong> Contract and onboarding pack received</li>
                </ul>
                <p className="text-gray-700 font-semibold">The entire process can wrap up in less than a week — be ready to respond quickly.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Interview Questions</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📞 Phone Interview Questions</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Tell me about yourself</li>
                  <li>What's your availability during the holiday period?</li>
                  <li>Do you have any Christmas travel plans?</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👥 Group Interview Questions</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Tell us about yourself</li>
                  <li>How do you deliver excellent customer service?</li>
                  <li>What does the Lululemon brand mean to you?</li>
                  <li>Do you have any questions for us?</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Tips</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Use Resume Keywords</h3>
                <p className="text-gray-700 mb-3">Highlight words like:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Customer experience</li>
                  <li>Cross-cultural communication</li>
                  <li>Teamwork</li>
                  <li>Community engagement</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Prepare Customer Service Stories</h3>
                <p className="text-gray-700 mb-3">Have 1–2 short examples ready that demonstrate:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>How you helped a customer or resolved an issue</li>
                  <li>Your teamwork or communication skills</li>
                  <li>How you went above and beyond to create a positive experience</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Show Enthusiasm for the Brand</h3>
                <p className="text-gray-700 mb-3">Lululemon looks for people who genuinely love the brand's lifestyle — mindfulness, fitness, and personal growth.</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Mention your interest in wellness, yoga, or activewear</li>
                  <li>Be authentic rather than rehearsed</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Be Present & Positive</h3>
                <p className="text-gray-700 mb-3">Group interviews are about energy as much as answers:</p>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Listen actively</li>
                  <li>Smile and stay engaged</li>
                  <li>Encourage fellow candidates</li>
                  <li>Show that you'd be a fun, supportive teammate</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Retail Experience Helps</h3>
                <p className="text-gray-700 mb-3">Having any background in retail or hospitality gives you an edge — especially for future opportunities in FMCG or luxury brands.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>Lululemon values genuine connection over polished answers.</strong> Be yourself, stay grounded, 
                  and demonstrate how you'd bring warmth and enthusiasm to their community during the busy holiday season.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Current Christmas Casual Openings & Application Tips</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>When to apply:</strong> Lululemon typically starts hiring for Christmas Casual positions in September-October. 
                Don't wait until December – most positions are filled by early November.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Where to find openings:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Lululemon careers website</li>
                <li>Indeed, Seek, and LinkedIn job boards</li>
                <li>Store visits (ask about upcoming opportunities)</li>
                <li>University career services</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Application tips:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Tailor your resume to highlight customer service and retail experience</li>
                <li>Include any fitness, wellness, or community involvement</li>
                <li>Write a compelling cover letter that shows brand knowledge</li>
                <li>Apply to multiple locations to increase your chances</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. What Happens After You Get Hired</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Training program:</strong> New Christmas Casual Educators typically go through a comprehensive training program 
                that covers product knowledge, customer service standards, and brand values. This usually lasts 1-2 weeks.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Typical schedule:</strong> Expect to work 15-25 hours per week during the holiday season, 
                with increased hours during peak shopping periods (Black Friday, Christmas week).
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Growth opportunities:</strong> Many Christmas Casual employees are offered permanent positions 
                or invited back for future seasonal work. It's also a great stepping stone to other retail management roles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Common Mistakes to Avoid</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Don't do this:</h3>
                <ul className="list-disc list-inside text-red-700 mb-3">
                  <li>Focus only on the discount benefits</li>
                  <li>Give generic answers about customer service</li>
                  <li>Show up unprepared or late</li>
                  <li>Dress inappropriately for the brand</li>
                  <li>Ask only about pay and hours</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Do this instead:</h3>
                <ul className="list-disc list-inside text-green-700 mb-3">
                  <li>Show genuine passion for wellness and community</li>
                  <li>Provide specific examples with the STAR method</li>
                  <li>Research the brand and prepare thoughtful questions</li>
                  <li>Dress in smart casual with athletic elements</li>
                  <li>Ask about growth opportunities and team culture</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Follow-Up After Your Interview</h2>
              
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stay Updated with Héra AI</h2>
            <p className="text-gray-700 mb-6">
              Get weekly career tips, job opportunities, and interview strategies delivered to your inbox. 
              Join thousands of Australian students and graduates who are advancing their careers with Héra AI.
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
              <Link href="/resources/interview-tips/retail-interview-tips" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Retail Interview Tips</h3>
                <p className="text-gray-600">Master the art of retail interviews with proven strategies and real examples.</p>
              </Link>
              <Link href="/resources/interview-tips/christmas-casual-jobs" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Christmas Casual Jobs Guide</h3>
                <p className="text-gray-600">Complete guide to finding and securing seasonal employment opportunities.</p>
              </Link>
            </div>
          </section>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Written by Héra AI Career Team | Updated October 1, 2025 | 
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
              </p>
          </footer>
        </div>
      </div>
    </>
  );
}
