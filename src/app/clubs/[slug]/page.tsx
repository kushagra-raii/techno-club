import { clubsData, ClubDetails } from '@/lib/data/clubs';
import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';

// Define club colors
const clubColors: Record<string, string> = {
  'ieee': 'from-blue-600 to-blue-800',
  'acm': 'from-green-600 to-green-800',
  'aws': 'from-orange-600 to-orange-800',
  'gdg': 'from-red-600 to-red-800',
  'stic': 'from-purple-600 to-indigo-800'
};

// This function gets called at build time on the server
export function generateStaticParams() {
  // Return a list of possible values for slug
  return Object.keys(clubsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const club = clubsData[slug];
  
  if (!club) {
    return {
      title: 'Club Not Found',
      description: 'The requested club page could not be found',
    };
  }
  
  return {
    title: `${club.name} - Techno Club`,
    description: club.description,
  };
}

// Fetch club events from MongoDB
async function getClubEvents(clubName: string) {
  try {
    await connectToDatabase();
    // Find published events for this club, sorted by start date
    const events = await Event.find({ 
      club: clubName.toUpperCase(),
      isPublished: true,
      startDate: { $gte: new Date() } // Only future events
    })
    .sort({ startDate: 1 }) // Sort by date ascending (upcoming first)
    .lean();
    
    return events;
  } catch (error) {
    console.error(`Error fetching events for club ${clubName}:`, error);
    return [];
  }
}

type Props = {
  params: { slug: string };
};

export default async function ClubPage({ params }: Props) {
  const { slug } = params;
  const club = clubsData[slug];
  const clubColor = clubColors[slug] || 'from-purple-600 to-indigo-800';
  
  // Fetch real events from the database
  const clubEvents = await getClubEvents(club?.name || '');
  
  if (!club) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Club Not Found</h1>
            <p className="text-gray-400 mb-8">The club you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link 
              href="/"
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format event dates for display
  const formattedEvents = clubEvents.map(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Format the date: "Jan 15, 2024"
    const formattedDate = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format the time: "10:00 AM - 1:00 PM"
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const formattedTime = `${startTime} - ${endTime}`;
    
    return {
      ...event,
      formattedDate,
      formattedTime
    };
  });

  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen text-white">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 overflow-hidden">
          {/* Background with gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-${slug}-900/30 to-black -z-10`}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/40 text-purple-300">
                  Student Club
                </div>
                <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${clubColor} bg-clip-text text-transparent`}>
                  {club.name}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {club.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className={`px-5 py-3 bg-gradient-to-r ${clubColor} text-white rounded-lg hover:shadow-lg hover:translate-y-[-2px] transition`}>
                    Join Club
                  </button>
                  <button className="px-5 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/30 transition">
                    Contact Us
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className={`h-56 w-56 rounded-full bg-gradient-to-br ${clubColor} flex items-center justify-center text-white text-6xl font-bold`}>
                  {club.name.substring(0, 2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-purple-900/30">
                <h2 className="text-2xl font-bold mb-4 text-white">Mission</h2>
                <p className="text-gray-300">{club.mission}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-purple-900/30">
                <h2 className="text-2xl font-bold mb-4 text-white">Vision</h2>
                <p className="text-gray-300">{club.vision}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Core Team */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Core Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {club.team.map((member: { id: string; name: string; position: string; initials: string }) => (
                <div 
                  key={member.id}
                  className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30 flex items-center space-x-4 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${clubColor} flex items-center justify-center text-white text-xl font-bold`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-purple-400">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Upcoming Events */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
              <Link 
                href="/events" 
                className="text-purple-400 hover:text-purple-300 flex items-center gap-2 transition"
              >
                View All Events
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {formattedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedEvents.map((event) => (
                  <Link 
                    href={`/events/${event._id}`} 
                    key={event._id.toString()}
                    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:translate-y-[-2px] flex flex-col h-full"
                  >
                    {event.imageUrl && (
                      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={event.imageUrl} 
                          alt={event.name} 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${clubColor} bg-opacity-10 text-white`}>
                          {club.name}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3 space-y-1">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.formattedDate}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.formattedTime}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        
                        {event.ticketPrice > 0 && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <span>₹{event.ticketPrice}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <div className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r ${clubColor} text-white text-sm font-medium transition-all`}>
                        View Details & Register
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-purple-900/30 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
                <p className="text-gray-400 mb-6">Stay tuned! {club.name} will be announcing new events soon.</p>
                <Link 
                  href="/events"
                  className={`inline-flex items-center px-5 py-3 bg-gradient-to-r ${clubColor} text-white rounded-lg hover:shadow-lg transition`}
                >
                  Browse All Events
                </Link>
              </div>
            )}
            
            {/* Display past events from the mock data if no upcoming events */}
            {formattedEvents.length === 0 && club.events && club.events.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-white mb-8">Past Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {club.events.map((event: { id: string; title: string; date: string; description: string }) => (
                    <div 
                      key={event.id}
                      className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300">
                          {event.date}
                        </span>
                      </div>
                      <p className="text-gray-400">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Collaborations */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Collaborations</h2>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-purple-900/30">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Partner</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Year</th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-purple-900/30">
                  {club.collaborations.map((collab: { partner: string; project: string; year: string }, idx: number) => (
                    <tr key={idx} className="hover:bg-purple-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{collab.partner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{collab.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{collab.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 