import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideosBySubcategory } from '@/data/interviewTipsVideos';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const subcategoryNames: { [key: string]: string } = {
  'christmas-casuals': 'Christmas Casuals',
  'graduate-interns': 'Graduate & Interns',
  'data-analytics': 'Data Analytics',
  'finance-strategy': 'Finance & Strategy',
  'software-engineering': 'Software Engineering',
  'product-design': 'Product Design',
  'others': 'Others'
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const videos = getVideosBySubcategory(category);
  const categoryName = subcategoryNames[category] || category;
  
  if (videos.length === 0) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${categoryName} Interview Tips - Expert Guide | Hera AI`,
    description: `Master ${categoryName.toLowerCase()} interview tips with expert guidance. Learn preparation strategies, common questions, and success techniques for ${categoryName.toLowerCase()} roles.`,
    keywords: `${categoryName.toLowerCase()}, interview tips, career preparation, job interview, Hera AI`,
    openGraph: {
      title: `${categoryName} Interview Tips - Expert Guide | Hera AI`,
      description: `Master ${categoryName.toLowerCase()} interview tips with expert guidance and preparation strategies.`,
      type: 'website',
      url: `https://www.heraai.net.au/resources/interview-tips/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const videos = getVideosBySubcategory(category);
  const categoryName = subcategoryNames[category] || category;
  
  if (videos.length === 0) {
    notFound();
  }

  // Generate JSON-LD structured data for collection
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": `${categoryName} Interview Tips`,
    "description": `Comprehensive interview tips and preparation strategies for ${categoryName.toLowerCase()} roles`,
    "url": `https://www.heraai.net.au/resources/interview-tips/${params.category}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": videos.length,
      "itemListElement": videos.map((video, index) => ({
        "@type": "VideoObject",
        "position": index + 1,
        "name": video.title,
        "description": video.description,
        "url": `https://www.heraai.net.au/resources/interview-tips/${video.subcategory}/${video.slug}`,
        "thumbnailUrl": video.thumbnail,
        "uploadDate": video.createdAt,
        "duration": `PT${video.duration.replace(':', 'M')}S`
      }))
    },
    "author": {
      "@type": "Organization",
      "name": "Hera AI",
      "url": "https://www.heraai.net.au"
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
            <span className="text-gray-900">{categoryName}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName} Interview Tips</h1>
            <p className="text-lg text-gray-600 mb-4">
              Master {categoryName.toLowerCase()} interview preparation with expert guidance and proven strategies.
            </p>
            <div className="text-sm text-gray-500">
              {videos.length} video{videos.length !== 1 ? 's' : ''} • Total duration: {videos.reduce((total, video) => {
                const [minutes, seconds] = video.duration.split(':').map(Number);
                return total + minutes * 60 + seconds;
              }, 0) / 60} minutes
            </div>
          </div>

          {/* SEO Content Block */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Learn how to prepare for <strong>{categoryName.toLowerCase()} interviews</strong> with Hera AI. 
              This comprehensive collection covers <strong>interview preparation, common questions, and success strategies</strong>, 
              helping candidates excel in <strong>Australian job market</strong>.
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/resources/interview-tips/${video.subcategory}/${video.slug}`}
                className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-4 space-y-3">
                  {/* Title and Meta */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📅 {video.createdAt}</span>
                      <span>⏱️ {video.duration}</span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      Level: {video.difficulty}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {video.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back to Resources */}
          <div className="mt-12 text-center">
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
