import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP2. David Jones Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
  description: 'Master David Jones Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  keywords: 'David Jones jobs, Christmas Casual jobs, retail interview tips, holiday employment, David Jones interview, Australian retail jobs',
  openGraph: {
    title: 'EP2. David Jones Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master David Jones Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/david-jones-christmas-casual',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'David Jones Christmas Casual Interview Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP2. David Jones Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master David Jones Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function DavidJonesChristmasCasualPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP2. David Jones Christmas Casual Job Interview Tips - Complete Guide",
    "description": "Master David Jones Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.",
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
    "keywords": ["David Jones jobs", "Christmas Casual jobs", "retail interview tips", "holiday employment", "David Jones interview", "Australian retail jobs"],
    "datePublished": "2025-10-20",
    "dateModified": "2025-10-20",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/david-jones-christmas-casual",
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
            <span className="text-gray-900">David Jones Christmas Casual</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP2. David Jones Christmas Casual Job Interview Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 20, 2025</span>
              <span>🔄 Updated: October 20, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['David Jones jobs', 'Christmas Casual', 'retail interview', 'holiday jobs'].map((tag, index) => (
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
                src="https://iframe.cloudflarestream.com/d469d053159a92df4f12a85385693144"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="David Jones Christmas Casual Interview Tips Video"
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
                David Jones' Christmas casual recruitment is structured yet friendly, designed to evaluate your communication, 
                customer service mindset, and cultural fit. The process usually includes a group interview followed by a 1-on-1 session. 
                Interviewers value warmth, professionalism, and teamwork over perfect answers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Process & Timeline</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Application Timeline</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Application:</strong> Submitted in early September</li>
                  <li><strong>Interview Notification:</strong> Received around September 11</li>
                  <li><strong>Interview Date:</strong> October 9</li>
                  <li><strong>Reference Check:</strong> Completed October 10</li>
                  <li><strong>Offer Call:</strong> Received October 11</li>
                </ul>
                <p className="text-gray-700 font-semibold">💨 From application to offer — usually within one month.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Stages</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👥 Group Interview</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Begins with self-introductions (name + "If you could take one item for free at David Jones, what would you choose and why?")</li>
                  <li>A short video introduces David Jones' culture and history</li>
                  <li>Candidates split into small groups to discuss topics (5 minutes preparation each):</li>
                  <li className="ml-8">• How to create a warm connection with customers</li>
                  <li className="ml-8">• How to deliver a "no other" experience</li>
                  <li className="ml-8">• How to work together as a team</li>
                  <li>Each group presents answers while interviewers observe and take notes</li>
                  <li><strong>Focus:</strong> Team interaction, communication, confidence, and warmth</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👤 1-on-1 Interview</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Conducted individually after the group discussion</li>
                  <li><strong>Typical questions include:</strong></li>
                  <li className="ml-8">• What's your availability and preferred department/store?</li>
                  <li className="ml-8">• What do you know about David Jones, and why do you want to work here?</li>
                  <li className="ml-8">• What's the most important quality when working at David Jones?</li>
                  <li className="ml-8">• Tell me about a time you solved a problem or helped a teammate</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Atmosphere</h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Interviewers are friendly, patient, and encouraging</li>
                  <li>Even if answers aren't perfect, they offer guidance and maintain a positive tone</li>
                  <li>The experience feels supportive rather than high-pressure</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compensation & Perks</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Hourly rate:</strong> around AUD $40 (above average for retail casuals)</li>
                  <li><strong>Staff discount:</strong> on in-store purchases (use wisely — many new hires report "buying half the store!" 😄)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Questions Summary</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👥 Group Interview Questions</h3>
                <ol className="list-decimal list-inside text-gray-700 mb-3">
                  <li>Introduce yourself + "If you could choose one item at David Jones for free, what would it be and why?"</li>
                  <li>What is good customer service?</li>
                  <li>How would you create a warm connection with customers?</li>
                  <li>How do you understand "empowered service"?</li>
                  <li>Tell us about a problem you solved</li>
                  <li>How would you help a new team member adapt?</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👤 1-on-1 Interview Questions</h3>
                <ol className="list-decimal list-inside text-gray-700 mb-3">
                  <li>What's your availability and preferred department?</li>
                  <li>What do you know about David Jones and why do you want to join?</li>
                  <li>What do you think is the most important quality at David Jones?</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Tips</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Prepare Customer Service Stories</h3>
                <p className="text-gray-700 mb-3">Focus on teamwork, communication, and initiative.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Understand the Brand</h3>
                <p className="text-gray-700 mb-3">Know David Jones' heritage, luxury positioning, and service values.</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Show Warm Connection Skills</h3>
                <p className="text-gray-700 mb-3">Demonstrate how you make people feel valued and supported.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Be Flexible</h3>
                <p className="text-gray-700 mb-3">Willingness to work weekends and holidays is a major plus.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Stay Positive</h3>
                <p className="text-gray-700 mb-3">Smile, listen actively, and show enthusiasm for the role.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>David Jones values authentic connection and team spirit.</strong> Be friendly, professional, 
                  and genuinely passionate about creating a memorable customer experience. Your attitude matters as much as your answers.
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
              <Link href="/resources/interview-tips/christmas-casual-jobs" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Christmas Casual Jobs Guide</h3>
                <p className="text-gray-600">Complete guide to finding and securing seasonal employment opportunities.</p>
              </Link>
            </div>
          </section>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Written by Héra AI Career Team | Updated October 20, 2025 | 
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
