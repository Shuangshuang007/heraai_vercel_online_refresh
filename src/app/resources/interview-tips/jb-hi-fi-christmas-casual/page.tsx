import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EP4. JB Hi-Fi Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
  description: 'Master JB Hi-Fi Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
  keywords: 'JB Hi-Fi jobs, Christmas Casual jobs, retail interview tips, holiday employment, JB Hi-Fi interview, Australian retail jobs',
  openGraph: {
    title: 'EP4. JB Hi-Fi Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master JB Hi-Fi Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    type: 'article',
    url: 'https://www.heraai.net.au/resources/interview-tips/jb-hi-fi-christmas-casual',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517245381868-b795790b499e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'JB Hi-Fi Christmas Casual Interview Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP4. JB Hi-Fi Christmas Casual Job Interview Tips - Complete Guide | Héra AI',
    description: 'Master JB Hi-Fi Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.',
    images: ['https://images.unsplash.com/photo-1517245381868-b795790b499e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function JBHifiChristmasCasualPage() {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    "headline": "EP4. JB Hi-Fi Christmas Casual Job Interview Tips - Complete Guide",
    "description": "Master JB Hi-Fi Christmas Casual interviews with expert tips from students who got hired. Real Q&As, preparation strategies, and insider advice for Australian retail jobs.",
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
    "keywords": ["JB Hi-Fi jobs", "Christmas Casual jobs", "retail interview tips", "holiday employment", "JB Hi-Fi interview", "Australian retail jobs"],
    "datePublished": "2025-10-08",
    "dateModified": "2025-10-08",
    "mainEntityOfPage": "https://www.heraai.net.au/resources/interview-tips/jb-hi-fi-christmas-casual",
    "image": "https://images.unsplash.com/photo-1517245381868-b795790b499e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
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
            <span className="text-gray-900">JB Hi-Fi Christmas Casual</span>
          </nav>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EP4. JB Hi-Fi Christmas Casual Job Interview Tips
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>📅 Published: October 8, 2025</span>
              <span>🔄 Updated: October 8, 2025</span>
              <span>👥 By: Héra AI Career Team</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['JB Hi-Fi jobs', 'Christmas Casual', 'retail interview', 'holiday jobs'].map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Video Section */}
          <section className="mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <iframe
                src="https://iframe.cloudflarestream.com/2aeae04adc53062bfb65a14fb55fbf2c"
                title="EP4. JB Hi-Fi Christmas Casual Interview Tips"
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                frameBorder="0"
                loading="lazy"
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
                JB Hi-Fi's Christmas casual recruitment process is energetic, interactive, and team-oriented.
                The company looks for candidates who are enthusiastic, proactive, and passionate about technology, music, or pop culture.
                Interviews often involve group activities designed to assess communication, problem-solving, and teamwork.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Timeline</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>September 2:</strong> Submitted online application</li>
                  <li><strong>September 7:</strong> Received email + phone call invite</li>
                  <li><strong>September 8:</strong> Called back (manager on leave; left name & number)</li>
                  <li><strong>September 12:</strong> Followed up again; short phone chat with manager (basic questions: Why JB Hi-Fi?, past experience, availability) → invited to group interview</li>
                  <li><strong>September 21:</strong> Received official group interview email</li>
                  <li><strong>September 27:</strong> Attended group interview</li>
                  <li><strong>September 28:</strong> Received email confirming pass</li>
                  <li><strong>October 2:</strong> Phone call inviting to 1-on-1 interview</li>
                  <li><strong>October 3:</strong> Final 1-on-1 interview (~15 minutes)</li>
                  <li><strong>October 4:</strong> Offer received</li>
                </ul>
                <p className="text-gray-700 font-semibold">📈 Process Duration: Roughly one month from application to final offer.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compensation</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li><strong>Average pay:</strong> AUD $25–30/hour</li>
                  <li>Varies slightly by store and department.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Group Interview Format & Experience</h2>
              
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Candidate 1's Experience</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Multiple group sessions with 7–10 people each.</li>
                  <li><strong>Format included:</strong></li>
                  <li className="ml-8">• Icebreaker game</li>
                  <li className="ml-8">• Three team tasks</li>
                  <li>Atmosphere: relaxed and friendly.</li>
                  <li>Key to success: active participation, sharing opinions, and volunteering to lead.</li>
                  <li>Follow-up: short 1-on-1 chat (15 min) to discuss availability and department preferences.</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Candidate 2's Experience</h3>
                <ul className="list-disc list-inside text-gray-700 mb-3">
                  <li>Started with sign-in, photo, and name tag.</li>
                  <li>Self-introduction: "Name + one obsession."</li>
                  <li><strong>Tasks included:</strong></li>
                  <li className="ml-8">1. Survival scenario: Each person ranked the importance of items, one person presented results.</li>
                  <li className="ml-8">2. Partner pitch: Paired with another candidate; small talk → introduced partner's strengths and why they should be hired.</li>
                  <li className="ml-8">3. Team build challenge: Build a tower using marshmallows & spaghetti, testing creativity and cooperation.</li>
                </ul>
                <p className="text-gray-700 font-semibold">🕒 Duration: about 2 hours total.</p>
                <p className="text-gray-700">Some candidates received immediate offers; others were contacted after reference checks.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Questions</h2>
              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <ol className="list-decimal list-inside text-gray-700 mb-3">
                  <li>Tell us about yourself (or share your "one obsession").</li>
                  <li>Why do you want to join JB Hi-Fi?</li>
                  <li>What makes you a good fit for customer service or teamwork?</li>
                  <li>How would you describe your partner, and why should we hire them?</li>
                  <li>What's your availability and preferred department?</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interview Tips</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Be proactive.</h3>
                <p className="text-gray-700 mb-3">Participate in all activities — speak up and volunteer to lead.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Show team energy.</h3>
                <p className="text-gray-700 mb-3">Smile, listen, and support others.</p>
              </div>

              <div className="bg-teal-50 border-l-4 border-teal-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Keep introductions short but memorable.</h3>
                <p className="text-gray-700 mb-3">Use humor or a unique interest to stand out.</p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Demonstrate leadership subtly.</h3>
                <p className="text-gray-700 mb-3">During group challenges, coordinate and help keep the team on track.</p>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-400 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Don't stress about perfect English.</h3>
                <p className="text-gray-700 mb-3">Interviewers focus on attitude, positivity, and energy more than language.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Final Advice</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong>JB Hi-Fi values fun, teamwork, and enthusiasm.</strong>
                  Be authentic, stay confident, and show that you can thrive in a fast-paced, customer-focused retail environment — especially during the Christmas rush.
                </p>
              </div>
            </section>
          </article>
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
                <Link href="/resources" className="text-gray-600 hover:text-gray-800 font-medium underline">Browse More Resources</Link>
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
            </div>
          </section>
          <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Written by Héra AI Career Team | Updated October 8, 2025 |
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link>
              </p>
          </footer>
        </div>
      </div>
    </>
  );
}
