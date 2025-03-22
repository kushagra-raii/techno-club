'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { clubsData } from '@/lib/data/clubs';
import { useSession } from 'next-auth/react';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const clubFilter = searchParams.get('club');
  const { data: session } = useSession();

  const [allEvents, setAllEvents] = useState<EventDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<string | null>(clubFilter);

  // Fetch all events sorted by date
  useEffect(() => {
    const sortedEvents = getEventsSortedByDate();
    setAllEvents(sortedEvents);
    
    // Apply initial club filter if present in URL
    if (clubFilter) {
      setFilteredEvents(sortedEvents.filter(event => event.clubId === clubFilter));
    } else {
      setFilteredEvents(sortedEvents);
    }
  }, [clubFilter]);

  // Filter events when search term or selected club changes
  useEffect(() => {
    let result = [...allEvents];
    
    // Apply club filter
    if (selectedClub) {
      result = result.filter(event => event.clubId === selectedClub);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.clubName.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(result);
  }, [searchTerm, selectedClub, allEvents]);

  // Handle club filter selection
  const handleClubSelect = (clubId: string) => {
    setSelectedClub(prevClub => prevClub === clubId ? null : clubId);
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClub(null);
  };

  // Calculate if an event is upcoming, ongoing, or past
  const getEventStatus = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    
    // Set time to beginning of day for both dates
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (eventDate > today) {
      return 'upcoming';
    } else if (eventDate.getTime() === today.getTime()) {
      return 'today';
    } else {
      return 'past';
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen text-white">
        {/* Hero Section */}
        <div className="relative py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black -z-10">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Upcoming Events
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Discover tech events, workshops, and competitions hosted by Medi-Caps University tech clubs.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <section className="py-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-3 pl-10 bg-gray-900 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Search events..."
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {Object.values(clubsData).map((club) => (
                  <button
                    key={club.id}
                    onClick={() => handleClubSelect(club.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedClub === club.id 
                        ? `bg-gradient-to-r ${club.color} text-white`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {club.name}
                  </button>
                ))}
                
                {(selectedClub || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Filters
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">No events found</h2>
                <p className="text-gray-400">Try changing your search or filter criteria</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => {
                  const eventStatus = getEventStatus(event.date);
                  
                  return (
                    <Link 
                      href={`/events/${event.id}`} 
                      key={event.id}
                      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 group"
                    >
                      {/* Event Banner Image or Placeholder */}
                      <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-r ${event.clubColor} opacity-50`}></div>
                        )}
                        
                        {/* Event Status Badge */}
                        <div className="absolute top-4 left-4">
                          {eventStatus === 'upcoming' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-900 text-green-200">
                              Upcoming
                            </span>
                          )}
                          {eventStatus === 'today' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-900 text-blue-200">
                              Today
                            </span>
                          )}
                          {eventStatus === 'past' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-700 text-gray-300">
                              Past
                            </span>
                          )}
                        </div>
                        
                        {/* Club Badge */}
                        <div className="absolute top-4 right-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r ${event.clubColor} text-white`}>
                            {event.clubName}
                          </div>
                        </div>
                        
                        {/* Event Price */}
                        {event.ticketPrice > 0 && (
                          <div className="absolute bottom-4 right-4">
                            <div className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-black/50 text-white backdrop-blur-sm">
                              ₹{event.ticketPrice}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <time dateTime={event.date}>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                          <span className="mx-1.5">•</span>
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-start text-gray-400 text-sm mb-4">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        
                        <p className="text-gray-300 mb-6 line-clamp-2">{event.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="flex items-center text-gray-400">
                              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {event.participantCount}/{event.capacity}
                            </div>
                          </div>
                          
                          <div className={`py-1 px-3 rounded-full text-sm font-medium ${
                            event.ticketPrice > 0 
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-green-900/30 text-green-400"
                          }`}>
                            {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Want to stay updated?</h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              Join our newsletter to receive notifications about upcoming events, workshops, and tech talks from your favorite clubs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 