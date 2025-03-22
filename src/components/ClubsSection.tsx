'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Club = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  members: number;
  achievements: string[];
};

const clubs: Club[] = [
  {
    id: 'coding',
    name: 'Coding Club',
    description: 'Fostering coding skills through competitive programming, hackathons, and collaborative projects. Learn languages like Python, Java, C++, and more.',
    color: 'from-blue-600 to-blue-400',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    members: 250,
    achievements: ['National-level hackathon winners', '3 members placed in FAANG companies', 'Organized 10+ coding workshops']
  },
  {
    id: 'robotics',
    name: 'Robotics Club',
    description: 'Designing and building robots for various competitions and real-world applications. Focus on hardware integration, embedded systems, and automation.',
    color: 'from-purple-600 to-purple-400',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    members: 120,
    achievements: ['Robocon 2023 finalists', 'Built delivery robots for campus use', 'Workshop on Arduino programming']
  },
  {
    id: 'aiml',
    name: 'AI/ML Club',
    description: 'Exploring artificial intelligence and machine learning technologies. From neural networks to computer vision and natural language processing.',
    color: 'from-indigo-600 to-indigo-400',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    members: 180,
    achievements: ['Published research paper at IEEE conference', 'Developed AI model for local hospital', 'Conducted workshops on TensorFlow and PyTorch']
  },
  {
    id: 'design',
    name: 'Design Club',
    description: 'Creative hub for UI/UX design, graphic design, and product design. Learning industry-standard tools and design thinking methodologies.',
    color: 'from-pink-600 to-pink-400',
    icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
    members: 150,
    achievements: ['Designed UI for 3 startup products', 'Adobe Design Achievement awards finalist', 'Annual design exhibition with 1000+ visitors']
  },
  {
    id: 'iot',
    name: 'IoT Club',
    description: 'Connecting devices and creating smart solutions. Work with sensors, microcontrollers, and cloud platforms to build Internet of Things projects.',
    color: 'from-green-600 to-green-400',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    members: 95,
    achievements: ['Smart campus project implementation', 'IoT solution for local agriculture', 'Workshop series on ESP32 and Raspberry Pi']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Club',
    description: 'Learning ethical hacking, network security, and cyber defense. Regular CTF competitions and security awareness workshops.',
    color: 'from-red-600 to-red-400',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    members: 110,
    achievements: ['3rd place in National CTF competition', 'Conducted security audit for university website', 'Hosted workshops on penetration testing']
  },
  {
    id: 'blockchain',
    name: 'Blockchain Club',
    description: 'Exploring the world of decentralized technologies. From cryptocurrencies to smart contracts and decentralized applications.',
    color: 'from-yellow-600 to-yellow-400',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    members: 85,
    achievements: ['Developed university voting system on blockchain', 'DApp development workshop', 'Crypto investment strategies seminar']
  },
  {
    id: 'gamedev',
    name: 'Game Development',
    description: 'Creating interactive games and simulations. Learn game design, 3D modeling, and programming with popular game engines.',
    color: 'from-teal-600 to-teal-400',
    icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    members: 75,
    achievements: ['Published game on Steam', 'Game jam winners 2023', 'Unity and Unreal Engine workshops']
  }
];

const ClubsSection: React.FC = () => {
  const [activeClub, setActiveClub] = useState<Club>(clubs[0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="clubs" ref={sectionRef} className="py-20 bg-gradient-to-b from-black to-gray-950">
      <div className="container mx-auto px-6">
        <div className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg px-3 py-1 border border-purple-500/30">
            <p className="text-sm font-medium text-white">Discover Our Clubs</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tech Communities at <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Medi-Caps</span></h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our Techno clubs work with the intention of conducting various seminars, events, and workshops in different technical domains. 
            The main aim of all the clubs is to increase the technical potential of the students of the University.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Club list/sidebar */}
          <div className={`bg-gray-900/60 backdrop-blur-sm p-5 rounded-xl border border-gray-800 h-fit lg:sticky lg:top-24 transition-all duration-1000 delay-100 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h3 className="text-white text-xl font-bold mb-4">Our Clubs</h3>
            <div className="flex flex-col space-y-1">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setActiveClub(club)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all text-left ${
                    activeClub.id === club.id 
                      ? `bg-gradient-to-r ${club.color} text-white font-medium` 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                    activeClub.id !== club.id ? `bg-gradient-to-r ${club.color} bg-opacity-20` : 'bg-white'
                  }`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${activeClub.id === club.id ? 'text-white' : 'text-white'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={club.icon} />
                    </svg>
                  </div>
                  <span>{club.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Club details */}
          <div className={`col-span-1 lg:col-span-2 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              {/* Background decoration */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${activeClub.color} blur-xl opacity-20 rounded-xl transition-all duration-500`}></div>
              
              <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${activeClub.color}`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activeClub.icon} />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-3xl font-bold text-white">{activeClub.name}</h2>
                      <p className="text-gray-400">
                        <span className="font-medium text-gray-300">{activeClub.members}+</span> active members
                      </p>
                    </div>
                  </div>
                  <Link href={`/clubs/${activeClub.id}`} className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${activeClub.color} text-white font-medium hover:shadow-lg transition-all`}>
                    Join Club
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                <div className="mt-6 mb-8">
                  <h3 className="text-lg font-medium text-white mb-3">About the Club</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {activeClub.description}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Key Achievements</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeClub.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`p-1 bg-gradient-to-r ${activeClub.color} rounded-full mt-1 mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    Want to know more? <Link href={`/clubs/${activeClub.id}`} className={`font-medium bg-gradient-to-r ${activeClub.color} bg-clip-text text-transparent`}>View detailed information</Link>
                  </div>
                  <div className="flex space-x-1">
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </Link>
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </Link>
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 11v2.4h3.97c-.16 1.03-1.2 3.02-3.97 3.02-2.39 0-4.34-1.98-4.34-4.42S4.61 7.58 7 7.58c1.36 0 2.27.58 2.79 1.08l1.9-1.83C10.47 5.69 8.89 5 7 5c-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.72-2.84 6.72-6.84 0-.46-.05-.81-.11-1.16H7z" fill-rule="evenodd" clip-rule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubsSection; 