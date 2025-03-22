'use client';

import React, { useState, useRef, useEffect } from 'react';

type TeamMember = {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  image: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  color: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    position: 'President',
    department: 'Computer Science',
    bio: 'Fourth-year student passionate about AI and machine learning. Leading the club\'s vision and strategic initiatives.',
    image: '/images/team/rahul.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    color: 'from-blue-600 to-blue-400'
  },
  {
    id: 'priya-patel',
    name: 'Priya Patel',
    position: 'Vice President',
    department: 'Electronics Engineering',
    bio: 'Third-year student with expertise in robotics and embedded systems. Coordinates inter-club activities and workshops.',
    image: '/images/team/priya.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    color: 'from-purple-600 to-purple-400'
  },
  {
    id: 'amit-singh',
    name: 'Amit Singh',
    position: 'Technical Lead',
    department: 'Computer Science',
    bio: 'Fourth-year student specializing in full-stack development. Manages the club\'s technical projects and mentors junior members.',
    image: '/images/team/amit.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    color: 'from-indigo-600 to-indigo-400'
  },
  {
    id: 'neha-gupta',
    name: 'Neha Gupta',
    position: 'Events Coordinator',
    department: 'Information Technology',
    bio: 'Third-year student with exceptional organizational skills. Plans and executes all club events, workshops, and seminars.',
    image: '/images/team/neha.jpg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    color: 'from-pink-600 to-pink-400'
  },
  {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    position: 'Treasurer',
    department: 'Computer Science',
    bio: 'Third-year student handling club finances and budget planning. Ensures resources are allocated efficiently for all activities.',
    image: '/images/team/arjun.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    color: 'from-green-600 to-green-400'
  },
  {
    id: 'divya-kumar',
    name: 'Divya Kumar',
    position: 'Creative Director',
    department: 'Design Engineering',
    bio: 'Second-year student overseeing club branding, social media presence, and promotional materials for all events.',
    image: '/images/team/divya.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    color: 'from-yellow-600 to-yellow-400'
  }
];

const TeamSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
    <section id="team" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-950 to-black">
      <div className="container mx-auto px-6">
        <div className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-4 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg px-3 py-1 border border-green-500/30">
            <p className="text-sm font-medium text-white">Meet Our Team</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The <span className="bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Minds</span> Behind TechnoClub</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our dedicated team of student leaders works tirelessly to create opportunities for technical growth
            and foster a collaborative learning environment at Medi-Caps University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 shadow-xl transition-all duration-500 hover:-translate-y-1 group relative transition-all duration-1000 delay-${index * 100 + 200} transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center mb-4">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-bold`}>
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{member.name}</h3>
                    <p className={`text-sm bg-gradient-to-r ${member.color} bg-clip-text text-transparent font-medium`}>{member.position}</p>
                  </div>
                </div>
                
                <div className="mb-1 text-gray-400 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{member.department}</span>
                </div>
                
                <p className="text-gray-400 text-sm mt-4 h-24 overflow-hidden">
                  {member.bio}
                </p>
                
                <div className={`h-0.5 w-full bg-gradient-to-r ${member.color} mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                
                <div className="mt-4 flex space-x-3">
                  {member.social.github && (
                    <a 
                      href={member.social.github} 
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin} 
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter} 
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 