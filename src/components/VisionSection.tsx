import React from 'react';

export default function VisionSection() {
  return (
    <section className="mt-16 mb-24 px-6 max-w-5xl mx-auto text-gray-800 text-[17px] leading-[1.75rem] tracking-wide">
      <h2 className="text-4xl font-bold text-center text-gray-700 mb-12">Letter from the Founder</h2>
      <div>
        <div>
          <p className="mb-5">
            I'm Shuang, and I started building <em>Héra AI</em> with a simple belief: <strong>the job market today is deeply unfair</strong>.
          </p>
          
          <p className="mb-5">
            On one side, candidates face fewer opportunities, tougher competition, and a flood of AI-screened rejections.<br />
            On the other, companies have access to powerful recruitment tools — yet still struggle to find the right talent.<br />
            Most large companies don't even review resumes themselves — the first cut is made by algorithms.
          </p>
          
          <p className="mb-5">
            Meanwhile, jobseekers are expected to navigate fragmented platforms, fill out endless forms, and risk being flagged as bots for trying to automate.<br />
            <strong>That's fundamentally wrong.</strong>
          </p>
          
          <p className="mb-5">
            Héra AI aims to rebalance this market — giving jobseekers real tools of their own.<br />
            Starting from your resume, we autofill your profile, analyse your skills, and match you with roles — even those you might not have considered.<br />
            We'll show you why a job might fit, but we'll never force a choice.
          </p>
          
          <p className="mb-5">
            Most importantly, we connect you directly to jobs posted on <strong>company websites</strong> — the original, high-trust source.<br />
            It's an open secret that many top employers prioritise candidates who apply via their own site.
          </p>
          
          <p className="mb-5">
            In our first month, I'm still building — including our auto-apply system —<br />
            but we're already working to make the job hunt more <strong>humane, efficient, and fair</strong>.
          </p>
          
          <p className="mt-8 font-medium">
            — Shuang
            <a
              href="https://www.linkedin.com/in/shuangshuang-wu-169bbb5a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block ml-2 align-middle"
            >
              <img
                src="/linkedin-icon.svg"
                alt="LinkedIn"
                className="w-5 h-5 align-middle"
              />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
} 