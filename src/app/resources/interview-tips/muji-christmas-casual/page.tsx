import { Metadata } from 'next'
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP8. MUJI Christmas Casual Interview Tips - Complete Guide | Héra AI',
  description: 'Master MUJI Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  keywords: 'MUJI jobs, Christmas Casual retail, MUJI interview tips, holiday employment, MUJI interview, Australian retail jobs',
  openGraph: {
    title: 'EP8. MUJI Christmas Casual Interview Tips - Complete Guide | Héra AI',
    description: 'Master MUJI Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    url: 'https://www.heraai.net.au/resources/interview-tips/muji-christmas-casual',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MUJI Christmas Casual Interview Tips',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP8. MUJI Christmas Casual Interview Tips - Complete Guide | Héra AI',
    description: 'Master MUJI Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    images: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'EP8. MUJI Christmas Casual Interview Tips - Complete Guide | Héra AI',
  description: 'Master MUJI Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  author: {
    '@type': 'Organization',
    name: 'Héra AI',
  },
  keywords: ['MUJI jobs', 'Christmas Casual retail', 'MUJI interview tips', 'holiday employment', 'MUJI interview', 'Australian retail jobs', 'career tips', 'Australia', 'Héra AI'],
  datePublished: '2025-09-10',
  dateModified: '2025-09-10',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.heraai.net.au/resources/interview-tips/muji-christmas-casual',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Héra AI',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.heraai.net.au/logo.png',
    },
  },
}

export default function MujiChristmasCasualPage() {
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
            <span className="text-gray-900">MUJI Christmas Casual</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">EP8. MUJI Christmas Casual Interview Tips</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: September 10, 2025</span>
              <span>🔄 Updated: September 10, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">MUJI jobs</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Christmas Casual</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">retail interview</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">minimalist retail</span>
            </div>
          </header>

          <section className="mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <iframe
                src="https://iframe.cloudflarestream.com/487458cac06c073548552a6b9f9c33f4"
                title="EP8. MUJI Christmas Casual Interview Tips"
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                frameBorder="0"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-gray-600 italic">Watch our comprehensive video guide above, then read the detailed breakdown below.</p>
          </section>

          <article className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                MUJI's Christmas Casual recruitment emphasizes simplicity, teamwork, and calm professionalism — values that mirror the brand itself.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The process is straightforward and quick, often completed within two to three weeks from application to contract.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>8 Aug:</strong> Job posted on MUJI's website</li>
                  <li><strong>10 Aug:</strong> Application submitted</li>
                  <li><strong>16 Aug:</strong> Received interview invitation</li>
                  <li><strong>19 Aug:</strong> Face-to-face interview with Store Manager</li>
                  <li><strong>25 Aug:</strong> Work rights check email</li>
                  <li><strong>26 Aug:</strong> Contract received</li>
                  <li><strong>September:</strong> Onboarded and started work</li>
                </ul>
                <p className="text-gray-700 font-semibold">💡 Fast turnaround — expect offers within 1–2 weeks after your interview.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Day</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Experience</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Location:</strong> MUJI Emporium Store (Melbourne)</li>
                  <li><strong>Welcome Pack:</strong> Candidates received a small employee starter pack (pen, name tag, brief orientation)</li>
                  <li><strong>Atmosphere:</strong> The store atmosphere was friendly and collaborative — busy but supportive</li>
                  <li><strong>Early Work:</strong> Early days on the job involved preparing for Christmas sales and organizing stock</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compensation</h2>
              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Hourly Rate:</strong> ~AUD 30–33/hour (depending on store and award rate)</li>
                  <li><strong>Benefits:</strong> Employee starter kit provided</li>
                  <li><strong>Schedule:</strong> High-volume work expected during the Christmas season</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Questions & Sample Answers</h2>
              
              <div className="bg-orange-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q1. Tell me about yourself</h3>
                <p className="text-gray-700 mb-3">Keep it short — background + 1–2 key strengths (e.g., customer service, reliability).</p>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q2. Why MUJI?</h3>
                <p className="text-gray-700 mb-3">Emphasize the brand's minimalist design, Japanese values, and customer-first culture.</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q3. Give an example of great customer service</h3>
                <p className="text-gray-700 mb-3">Use STAR method — situation, action, result. Keep it positive and specific.</p>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q4. What's your availability?</h3>
                <p className="text-gray-700 mb-3">Show flexibility, especially for Christmas Eve, Boxing Day, and New Year.</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q5. How do you work in a team?</h3>
                <p className="text-gray-700 mb-3">Show calmness and cooperation — MUJI values quiet confidence and consistency.</p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Q6. How would you handle a difficult customer?</h3>
                <p className="text-gray-700 mb-3">Stay polite, listen carefully, and suggest practical solutions promptly.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Tips</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Customer service first</h3>
                <p className="text-gray-700 mb-3">Focus on helpfulness, patience, and consistency.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Show brand alignment</h3>
                <p className="text-gray-700 mb-3">MUJI values simplicity, mindfulness, and empathy.</p>
              </div>

              <div className="bg-teal-50 border-l-4 border-teal-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Be flexible</h3>
                <p className="text-gray-700 mb-3">Weekend and holiday availability gives you an edge.</p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Highlight teamwork</h3>
                <p className="text-gray-700 mb-3">Use examples from school, retail, or volunteering.</p>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Stay calm</h3>
                <p className="text-gray-700 mb-3">MUJI's culture prizes composure and steady professionalism.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>MUJI looks for people who embody its philosophy — calm, humble, and reliable.</strong> Show that you can contribute to a smooth customer experience during the busiest season of the year. Small gestures — like politeness, attention to detail, and quiet confidence — make all the difference.
                </p>
              </div>
            </section>
          </article>

          <section className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stay Updated with Héra AI</h2>
            <p className="text-gray-700 mb-6">Get weekly career tips, job opportunities, and interview strategies delivered to your inbox. Join thousands of Australian students and graduates who are advancing their careers with Héra AI.</p>
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
                <Link href="/resources" className="text-gray-600 hover:text-gray-800 font-medium underline">
                  Browse More Resources
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Career Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/resources/interview-tips/lululemon-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP1. Lululemon Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Master Lululemon Christmas Casual interviews with proven strategies and real examples.</p>
              </Link>
              <Link href="/resources/interview-tips/david-jones-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP2. David Jones Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">David Jones' Christmas casual recruitment is structured yet friendly, designed to evaluate your communication, customer service mindset, and cultural fit.</p>
              </Link>
              <Link href="/resources/interview-tips/myer-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP3. Myer Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Myer's Christmas casual recruitment process is efficient, structured, and welcoming. Learn how to stand out.</p>
              </Link>
              <Link href="/resources/interview-tips/jb-hi-fi-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP4. JB Hi-Fi Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">JB Hi-Fi's Christmas casual recruitment process is energetic, interactive, and team-oriented. Learn how to succeed.</p>
              </Link>
              <Link href="/resources/interview-tips/ralph-lauren-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP5. Ralph Lauren Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Ralph Lauren's Christmas casual recruitment process emphasizes refinement, confidence, and customer connection.</p>
              </Link>
              <Link href="/resources/interview-tips/hugo-boss-christmas-casual" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EP6. Hugo Boss Christmas Casual Interview Tips</h3>
                <p className="text-gray-600">Hugo Boss's Christmas Casual recruitment process reflects the brand's premium yet approachable style — structured, fair, and focused on communication and confidence.</p>
              </Link>
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Written by Héra AI Career Team | Updated September 10, 2025 |
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}






