'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  description: string;
  image: string;
  registrationLink: string;
  categoryColor: string;
};

const upcomingEvents: Event[] = [
  {
    id: 'hackathon-2024',
    title: 'Annual Hackathon 2024',
    date: 'Jun 15, 2024',
    time: '09:00 AM - 09:00 PM',
    location: 'Central Hall, Medi-Caps University',
    organizer: 'Coding Club',
    category: 'Hackathon',
    description: 'A 24-hour coding marathon where participants will work in teams to build innovative solutions for real-world problems. Cash prizes worth ₹50,000 to be won!',
    image: '/images/events/hackathon.jpg',
    registrationLink: '/events/hackathon-2024',
    categoryColor: 'from-blue-600 to-blue-400'
  },
  {
    id: 'ai-workshop',
    title: 'AI for Beginners Workshop',
    date: 'Jun 22, 2024',
    time: '11:00 AM - 03:00 PM',
    location: 'Computer Lab 2, Block B',
    organizer: 'AI/ML Club',
    category: 'Workshop',
    description: 'Learn the basics of artificial intelligence and how to implement simple machine learning models using Python and TensorFlow. No prior experience required.',
    image: '/images/events/ai-workshop.jpg',
    registrationLink: '/events/ai-workshop',
    categoryColor: 'from-indigo-600 to-indigo-400'
  },
  {
    id: 'blockchain-seminar',
    title: 'Blockchain Technology Seminar',
    date: 'Jun 25, 2024',
    time: '02:00 PM - 04:30 PM',
    location: 'Auditorium, Block A',
    organizer: 'Blockchain Club',
    category: 'Seminar',
    description: 'Industry experts will talk about the future of blockchain technology and its applications in finance, healthcare, and supply chain management.',
    image: '/images/events/blockchain.jpg',
    registrationLink: '/events/blockchain-seminar',
    categoryColor: 'from-yellow-600 to-yellow-400'
  },
  {
    id: 'robotics-competition',
    title: 'Robotics Design Competition',
    date: 'Jul 03, 2024',
    time: '10:00 AM - 05:00 PM',
    location: 'Robotics Lab, Block C',
    organizer: 'Robotics Club',
    category: 'Competition',
    description: 'Showcase your robot design skills in this day-long competition. Participants will build robots that can navigate through obstacles and perform specific tasks.',
    image: '/images/events/robotics.jpg',
    registrationLink: '/events/robotics-competition',
    categoryColor: 'from-purple-600 to-purple-400'
  },
  {
    id: 'cybersecurity-ctf',
    title: 'Capture The Flag: Cybersecurity Edition',
    date: 'Jul 10, 2024',
    time: '10:00 AM - 08:00 PM',
    location: 'Virtual (Online Event)',
    organizer: 'Cybersecurity Club',
    category: 'Competition',
    description: 'Test your cybersecurity skills in this virtual CTF competition. Solve challenges related to cryptography, web exploitation, reverse engineering, and more.',
    image: '/images/events/ctf.jpg',
    registrationLink: '/events/cybersecurity-ctf',
    categoryColor: 'from-red-600 to-red-400'
  },
  {
    id: 'ui-ux-workshop',
    title: 'Modern UI/UX Design Workshop',
    date: 'Jul 15, 2024',
    time: '01:00 PM - 05:00 PM',
    location: 'Design Studio, Block D',
    organizer: 'Design Club',
    category: 'Workshop',
    description: 'Learn the principles of modern UI/UX design and how to create user-friendly interfaces using industry-standard tools like Figma and Adobe XD.',
    image: '/images/events/ui-ux.jpg',
    registrationLink: '/events/ui-ux-workshop',
    categoryColor: 'from-pink-600 to-pink-400'
  }
];

const EventsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Competition'];
  
  const filteredEvents = activeFilter === 'All' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === activeFilter);

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
    <section id="events" ref={sectionRef} className="py-20 bg-gray-950">
      <div className="container mx-auto px-6">
        <div className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg px-3 py-1 border border-blue-500/30">
            <p className="text-sm font-medium text-white">Upcoming Events</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Learn, Compete, <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Grow</span></h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Join our upcoming seminars, workshops, hackathons, and competitions to enhance your technical skills
            and connect with like-minded tech enthusiasts from Medi-Caps University.
          </p>
        </div>

        {/* Filter buttons */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 hover:border-gray-700 transition-all duration-500 hover:-translate-y-1 relative group transition-all duration-1000 delay-${(index % 6) * 100 + 200} transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                {/* Image placeholder - in a real app, you would use next/image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${event.categoryColor} opacity-70`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {event.category === 'Hackathon' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                    {event.category === 'Workshop' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    {event.category === 'Seminar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                    {event.category === 'Competition' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                  </svg>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${event.categoryColor} text-white`}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                
                <div className="mb-4 text-sm text-gray-400">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{event.organizer}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="flex justify-end">
                  <Link 
                    href={event.registrationLink} 
                    className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${event.categoryColor} text-white text-sm font-medium hover:shadow-lg transition-all`}
                  >
                    Register Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link 
            href="/events" 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-medium inline-flex items-center hover:shadow-lg hover:shadow-blue-600/20 transition-all"
          >
            View All Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection; 