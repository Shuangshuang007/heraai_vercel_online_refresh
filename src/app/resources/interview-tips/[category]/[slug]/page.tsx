import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideoBySlug, getVideosBySubcategory } from '@/data/interviewTipsVideos';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

interface VideoPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const video = getVideoBySlug(slug);
  
  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  return {
    title: video.seoData.metaTitle,
    description: video.seoData.metaDescription,
    keywords: video.seoData.keywords.join(', '),
    openGraph: {
      title: video.seoData.metaTitle,
      description: video.seoData.metaDescription,
      type: 'video.other',
      url: `https://www.heraai.net.au/resources/interview-tips/${category}/${slug}`,
      images: [
        {
          url: video.thumbnail,
          width: 300,
          height: 200,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.seoData.metaTitle,
      description: video.seoData.metaDescription,
      images: [video.thumbnail],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { category, slug } = await params;
  const video = getVideoBySlug(slug);
  
  if (!video) {
    notFound();
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.seoData.metaDescription,
    "thumbnailUrl": video.thumbnail,
    "uploadDate": video.createdAt,
    "contentUrl": video.videoUrl,
    "duration": `PT${video.duration.replace(':', 'M')}S`,
    "keywords": video.seoData.keywords,
    "author": {
      "@type": "Organization",
      "name": "Hera AI",
      "url": "https://www.heraai.net.au"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hera AI",
      "url": "https://www.heraai.net.au",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.heraai.net.au/logo.png"
      }
    }
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
            <span className="text-gray-900 capitalize">{video.subcategory.replace('-', ' ')}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{video.title}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Video Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>📅 {video.createdAt}</span>
              <span>⏱️ {video.duration}</span>
              <span className="capitalize">Level: {video.difficulty}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`https://iframe.cloudflarestream.com/a819eba9c520db4ac51c4e72e5975d12`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title={video.title}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* SEO Content Block */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Learn how to prepare for <strong>{video.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong> with Hera AI. 
              This video covers <strong>{video.tags.slice(0, 2).join(', ')}</strong> and practical examples, 
              helping candidates succeed in <strong>Australian job market</strong>.
            </p>
          </div>

          {/* Video Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Video</h2>
            <p className="text-gray-700 leading-relaxed">{video.content}</p>
          </div>

          {/* Related Videos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getVideosBySubcategory(video.subcategory)
                .filter(v => v.id !== video.id)
                .slice(0, 4)
                .map((relatedVideo) => (
                  <Link
                    key={relatedVideo.id}
                    href={`/resources/interview-tips/${relatedVideo.subcategory}/${relatedVideo.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{relatedVideo.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedVideo.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      📅 {relatedVideo.createdAt} • ⏱️ {relatedVideo.duration}
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Back to Resources */}
          <div className="text-center">
            <Link
              href="/resources"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Resources
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
