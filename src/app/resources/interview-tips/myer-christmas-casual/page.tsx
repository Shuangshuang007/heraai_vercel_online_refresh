import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP3. Myer Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
  description: 'Master Myer Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  keywords: 'Myer jobs, Christmas Casual jobs, retail interview tips, holiday employment, Myer interview, Australian retail jobs',
  openGraph: {
    title: 'EP3. Myer Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master Myer Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/myer-christmas-casual',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Myer Christmas Casual Interview Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP3. Myer Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master Myer Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function MyerChristmasCasualPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP3. Myer Christmas Casual Job Interview Tips - Complete Guide",
    "description": "Master Myer Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.",
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
    "keywords": ["Myer jobs", "Christmas Casual jobs", "retail interview tips", "holiday employment", "Myer interview", "Australian retail jobs"],
    "datePublished": "2025-10-10",
    "dateModified": "2025-10-10",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/myer-christmas-casual",
    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 shadow-sm h-[56px]">
          <nav className="flex justify-between items-center px-6 h-[56px]">
            <div className="flex space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Héra AI
                </span>
              </Link>
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
              <Link href="/account-setting" className="flex items-center justify-center w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ml-8" title="Account Setting">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-5 h-5">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </Link>
            </div>
          </nav>
        </div>

        {/* Breadcrumbs */}
        <div className="mt-14 pt-4 px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/resources" className="hover:text-gray-700">Resources</Link>
            <span className="mx-2">/</span>
            <Link href="/resources/interview-tips" className="hover:text-gray-700">Interview Tips</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Myer Christmas Casual</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP3. Myer Christmas Casual Job Interview Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 10, 2025</span>
              <span>🔄 Updated: October 10, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Myer jobs', 'Christmas Casual', 'retail interview', 'holiday jobs'].map((tag, index) => (
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
                src="https://iframe.cloudflarestream.com/0eff1d40665b964983d2c59109f4c1ea"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Myer Christmas Casual Interview Tips Video"
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
                Myer's Christmas casual recruitment process is efficient, structured, and welcoming. The company values a positive attitude, 
                customer focus, and teamwork. Even with little retail experience, showing enthusiasm, flexibility, and communication skills will set you apart.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Timeline</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📅 Application Timeline</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>August 22:</strong> Submitted application</li>
                  <li><strong>September 22:</strong> Received group interview invitation</li>
                  <li><strong>October 2:</strong> Attended online group interview (9 participants)</li>
                  <li><strong>October 2 (afternoon):</strong> Received email to upload passport & work rights</li>
                  <li><strong>October 3:</strong> Received official offer</li>
                </ul>
                <p className="text-gray-700 font-semibold">🕒 Entire process: about two weeks from interview to offer.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Format</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">💻 Online Group Interview</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Mode:</strong> Online (via video conference)</li>
                  <li><strong>Duration:</strong> ~1 hour</li>
                  <li><strong>Structure:</strong></li>
                  <li className="ml-8">1. 1-minute self-introduction – include your background and any retail experience</li>
                  <li className="ml-8">2. Group discussion (3 participants) – short scenario task:</li>
                  <li className="ml-12">"A customer wants to buy a Christmas gift. How would you recommend and present the products?"</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Interview Questions & Sample Answers</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q1. What does "great customer service" mean to you?</h3>
                  <p className="text-gray-700 italic">"To me, great customer service means listening carefully to the customer's needs, offering something that genuinely fits, and ensuring they leave feeling valued and happy."</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q2. Why are you interested in this Myer role?</h3>
                  <p className="text-gray-700 italic">"I really admire Myer's culture of service and its long-standing retail tradition in Australia. I'd love to bring my enthusiasm for fashion and customer care to the team this Christmas."</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q3. Sell this product to me (role-play scenario)</h3>
                  <p className="text-gray-700">Start by asking questions like: "Who are you shopping for?"<br/>
                  Then highlight key features, suggest add-ons, and end with: "Would you like me to wrap this as a gift?"</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q4. How would you handle a difficult customer?</h3>
                  <p className="text-gray-700 italic">"I'd stay calm, listen to their concerns, and offer practical solutions — maybe an exchange or store credit. The goal is to ensure they leave satisfied."</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q5. What's your availability and preferred department?</h3>
                  <p className="text-gray-700 italic">"I'm flexible with weekdays and weekends, and open to any department that needs more support."</p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Q6. Tell us about your past experience or strengths</h3>
                  <p className="text-gray-700 italic">"Even without formal retail experience, I've developed strong teamwork, communication, and responsibility skills from school projects and volunteering."</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips & Insights</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Fast Process</h3>
                  <p className="text-gray-700">Myer's interview and offer timeline is faster than most retailers (e.g., David Jones).</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Availability Matters</h3>
                  <p className="text-gray-700">Candidates with more open schedules, such as students or working holiday visa holders, are often prioritized.</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. No Retail Experience? No Problem</h3>
                  <p className="text-gray-700">Focus on attitude, reliability, and teamwork.</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Be Prepared for Role-Play</h3>
                  <p className="text-gray-700">Practice short, natural dialogues that show customer empathy.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Stay Connected</h3>
                  <p className="text-gray-700">Check back in November — additional openings often appear when others withdraw.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>Myer values positive energy and genuine service more than polished answers.</strong> Show your personality, engage warmly, 
                  and highlight your ability to contribute to the Christmas retail rush with enthusiasm and flexibility.
                </p>
              </div>
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
                <Link 
                  href="/resources" 
                  className="text-gray-600 hover:text-gray-800 font-medium underline"
                >
                  Browse More Resources
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Career Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/resources/interview-tips/lululemon-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP1. Lululemon Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Master Lululemon Christmas Casual interviews with proven strategies and real examples.</p>
              </Link>
              <Link href="/resources/interview-tips/david-jones-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP2. David Jones Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Master David Jones Christmas Casual interviews with proven strategies and real examples.</p>
              </Link>
            </div>
          </section>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Written by Héra AI Career Team | Updated October 10, 2025 | 
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
