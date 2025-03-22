'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Hero: React.FC = () => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Check if user is admin or superadmin
  const isAdminUser = session?.user?.role === 'admin' || session?.user?.role === 'superadmin';
  
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Add animation classes when the hero is in view
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/50 to-black z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>
      
      {/* Tech-inspired floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute h-24 w-24 border border-purple-500/20 rounded-xl top-1/4 left-1/5 animate-float" 
             style={{ animationDelay: '0s', transform: 'rotate(10deg)' }}></div>
        <div className="absolute h-16 w-16 border border-blue-500/20 rounded-full top-1/3 right-1/4 animate-float" 
             style={{ animationDelay: '2s' }}></div>
        <div className="absolute h-20 w-20 border border-indigo-500/20 rounded-lg bottom-1/4 left-1/3 animate-float" 
             style={{ animationDelay: '1s', transform: 'rotate(45deg)' }}></div>
        <div className="absolute h-32 w-32 border border-purple-500/20 rounded-full bottom-1/3 right-1/6 animate-float" 
             style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-block mb-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg px-3 py-1 border border-purple-500/30">
              <p className="text-sm font-medium text-white">Medi-Caps University</p>
            </div>
            
            <h1 className="mb-4 text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block text-white">Welcome to</span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                TechnoClub
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-gray-300 leading-relaxed">
              We work with the intention of conducting various seminars, events, and workshops in different technical domains. Our main aim is to increase the technical potential of the students of Medi-Caps University.
            </p>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {session ? (
                isAdminUser ? (
                  <Link 
                    href="/dashboard"
                    className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-900 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
                  >
                    Go to Dashboard
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                ) : (
                  <Link 
                    href="/profile"
                    className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-900 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
                  >
                    My Profile
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                )
              ) : (
                <Link 
                  href="/auth/signup"
                  className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-900 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
                >
                  Become a Member
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              )}
              <Link 
                href="#clubs" 
                className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg border border-purple-500/50 hover:bg-purple-900/30 focus:ring-4 focus:ring-purple-900 transition-all duration-300 hover:border-purple-500"
              >
                Explore Clubs
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">10+</span>
                <span className="text-sm text-gray-400">Tech Clubs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">50+</span>
                <span className="text-sm text-gray-400">Events Yearly</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">1000+</span>
                <span className="text-sm text-gray-400">Active Members</span>
              </div>
            </div>
          </div>
          
          {/* Hero visualization or image */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-70"></div>
              
              {/* Modern design element - 3D-like club visualization */}
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Techno Clubs</h3>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Coding Club", color: "from-blue-600 to-blue-400" },
                    { name: "Robotics Club", color: "from-purple-600 to-purple-400" },
                    { name: "AI/ML Club", color: "from-indigo-600 to-indigo-400" },
                    { name: "Design Club", color: "from-pink-600 to-pink-400" },
                    { name: "IoT Club", color: "from-green-600 to-green-400" },
                    { name: "Cybersecurity Club", color: "from-red-600 to-red-400" }
                  ].map((club, index) => (
                    <div 
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all transform hover:-translate-y-1"
                    >
                      <div className={`w-10 h-10 rounded-full mb-3 bg-gradient-to-r ${club.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{club.name.substring(0, 2)}</span>
                      </div>
                      <h4 className="text-white font-medium">{club.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">Active Members</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Link href="#clubs" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">
                    View all clubs
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-gray-400 text-sm mb-2">Scroll down</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero; 