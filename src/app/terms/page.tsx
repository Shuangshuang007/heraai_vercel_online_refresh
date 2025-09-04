"use client";
import { useRouter } from "next/navigation";
import { Logo } from '@/components/Logo';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Left Logo */}
      <div className="absolute left-8 top-8">
        <Logo />
      </div>
      {/* Top Right Back Button */}
      <button
        className="absolute right-8 top-8 text-blue-600 hover:underline text-base flex items-center"
        onClick={() => router.push('/')}
      >
        <span className="mr-1">←</span> Back
      </button>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-start min-h-screen pt-32 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-4xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-lg font-bold text-gray-900 mb-2">Terms of Use</h1>
            <p className="text-sm text-gray-600">Effective Date: July 28, 2025</p>
          </div>
          
          {/* Terms Content */}
          <div className="max-w-none text-gray-700 text-sm">
            <p className="mb-6">
              Welcome to Héra AI. These Terms of Use ("Terms") govern your use of our website and services ("Services"). By accessing or using our Services, you agree to these Terms. If you do not agree, please do not use our Services.
            </p>

            <div className="space-y-6">
              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-sm">
                  By using Héra AI, you affirm that you are at least 18 years old or have legal parental or guardian consent to use our Services. You agree to comply with all applicable laws and these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">2. Use of Services</h2>
                <p className="text-sm">
                  You agree to use our Services only for lawful purposes and in accordance with these Terms. You may not use the Services in any way that could damage, disable, overburden, or impair any part of Héra AI or interfere with any other party's use.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">3. Account Registration</h2>
                <p className="text-sm">
                  To access certain features, you may be required to register an account. You agree to provide accurate and complete information and to keep it up-to-date. You are responsible for maintaining the confidentiality of your account.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">4. Subscription and Billing</h2>
                <p className="text-sm">
                  Some features of Héra AI may require payment of fees. By subscribing, you authorize us to charge your chosen payment method. Subscription details and cancellation options will be provided prior to any payment.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
                <p className="text-sm">
                  All content, features, and functionality on Héra AI are owned by us or our licensors and are protected by international copyright, trademark, and other intellectual property laws. You may not use our content without prior written permission.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">6. Privacy and Cookie Policy</h2>
                <p className="text-sm">
                  Your use of the Services is also governed by our Privacy and Cookie Policy.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">7. Termination</h2>
                <p className="text-sm">
                  We may suspend or terminate your access to the Services at any time, without notice, for any reason, including if you violate these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
                <p className="text-sm">
                  The Services are provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Services will be error-free or uninterrupted.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
                <p className="text-sm">
                  To the maximum extent permitted by law, Héra AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Services.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">10. Governing Law</h2>
                <p className="text-sm">
                  These Terms are governed by the laws of Victoria, Australia, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts of Victoria.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
                <p className="text-sm">
                  We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the Services constitutes your acceptance of the revised Terms.
                </p>
              </section>

              <section className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Contact Us</h2>
                <p className="text-sm">
                  For questions or concerns about these Terms, contact us at: <a href="mailto:shuang@heraai.net.au" className="text-blue-600 hover:underline">shuang@heraai.net.au</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 