import React from 'react';

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  club: string;
};

const events: Event[] = [
  {
    id: 'tech-conf-2024',
    title: 'Tech Conference 2024',
    date: 'November 15, 2024',
    description: 'Annual technical conference featuring speakers from leading tech companies and research institutions.',
    image: '/images/tech-conference.jpg',
    club: 'IEEE'
  },
  {
    id: 'hackathon-iot',
    title: 'Hackathon: IoT Solutions',
    date: 'September 23-24, 2024',
    description: '48-hour hackathon focusing on developing innovative IoT solutions for real-world problems.',
    image: '/images/hackathon.jpg',
    club: 'Robotics Club'
  },
  {
    id: 'workshop-embedded',
    title: 'Workshop on Embedded Systems',
    date: 'August 10, 2024',
    description: 'Hands-on workshop covering the fundamentals of embedded systems design and implementation.',
    image: '/images/embedded-workshop.jpg',
    club: 'IEEE'
  },
  {
    id: 'industry-visit',
    title: 'Industry Visit: Semiconductor Manufacturing',
    date: 'July 5, 2024',
    description: 'Educational visit to a semiconductor manufacturing facility to understand the production process.',
    image: '/images/industry-visit.jpg',
    club: 'ACM'
  }
];

const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-20 bg-gradient-to-b from-black to-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg">
            Join us for these exciting upcoming events and activities organized by our tech clubs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-purple-900/30 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-purple-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded">
                    {event.title.substring(0, 2)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-purple-400 text-sm">{event.club}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300">
                    {event.date}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{event.description}</p>
                
                <div className="flex justify-between items-center">
                  <button className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    Register Now
                  </button>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-white text-xs">
                      +9
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <button className="inline-flex items-center justify-center px-5 py-3 border border-purple-500 rounded-lg text-purple-400 hover:bg-purple-900/30 transition-colors duration-200">
            View all events
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection; 