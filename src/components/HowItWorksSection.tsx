import React from 'react';

export default function HowItWorksSection() {
  const useCases = [
    {
      id: 1,
      title: "Use Case 1",
      description: "Upload Resume - We Turn Into Profile",
      videoSrc: "/videos/Resume to Profile.MP4"
    },
    {
      id: 2,
      title: "Use Case 2", 
      description: "Talk, Ask, Explore and Apply via Chatbot",
      videoSrc: "/videos/Chatbot.MP4"
    }
  ];

  return (
    <section className="mt-16 mb-24 px-4 w-full max-w-[1600px] mx-auto text-gray-800 text-[17px] leading-[1.75rem] tracking-wide">
      <h2 className="text-4xl font-bold text-center text-gray-700 mb-4">What Héra Does for You</h2>
      <p className="text-gray-600 text-lg leading-relaxed text-center mb-12">In addition to Corporate Direct channel, we also offer you:</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
        {useCases.map((useCase, idx) => (
          <div
            key={useCase.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg w-full flex flex-col items-center"
          >
            <p className="text-gray-700 text-xl font-semibold leading-relaxed mb-6 text-center">{useCase.description}</p>
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
              <iframe
                src={`https://iframe.videodelivery.net/${idx === 0 ? 'de69f6a9324b1453d3efc13531d8892a' : '1a459af14844cf127a77b2093cfac9ab'}`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                title={idx === 0 ? "Resume to Profile Video" : "Chatbot Video"}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 