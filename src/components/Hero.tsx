import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="mb-4 text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-white">Welcome to</span>
            <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">TechnoClub</span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-300">
            Empowering students through technology and innovation. Join our community of tech enthusiasts and explore the future together.
          </p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="#clubs" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-900">
              Explore Clubs
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
            <Link href="#events" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-purple-500 hover:bg-purple-900/30 focus:ring-4 focus:ring-purple-900">
              Upcoming Events
            </Link>
          </div>
          
          <div className="mt-12 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-purple-${400 + i*100} to-indigo-${400 + i*100} flex items-center justify-center text-white text-xs font-bold`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="ml-4 text-sm text-gray-300">Join <span className="font-semibold text-white">400+ members</span> in our tech community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 