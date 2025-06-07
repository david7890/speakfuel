'use client';

import { useState } from 'react';

interface MiniStoryProps {
  data: {
    title: string;
    story: string;
    characters: string[];
    setting: string;
  };
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MiniStory({ data, isTransitioning }: MiniStoryProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // Aquí iría la lógica para reproducir audio
    setTimeout(() => setIsPlaying(false), 3000); // Simular duración del audio
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M10 9v6M14 9v6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mini Story</h2>
              <p className="text-green-100">Listen and immerse yourself</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {data.title}
          </h3>

          {/* Story Context */}
          <div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Setting
                </h4>
                <p className="text-gray-700 text-sm">{data.setting}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Characters
                </h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  {data.characters.map((character, index) => (
                    <li key={index}>• {character}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">Listen to the story</p>
                  <p className="text-sm text-gray-600">Native pronunciation and natural pace</p>
                </div>
              </div>
              {isPlaying && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
          </div>

          {/* Story Text */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-l-4 border-green-500">
            <div className="prose prose-lg max-w-none">
              {data.story.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-800 leading-relaxed mb-4 font-medium">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </div>

          {/* Reading Tip */}
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h5 className="font-semibold text-emerald-800 mb-2">Story Tip</h5>
                <p className="text-emerald-700 text-sm">
                  Try to visualize the scene as you read. Imagine yourself in the coffee shop with Sarah and Emma. 
                  This helps you remember the vocabulary and context better!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 