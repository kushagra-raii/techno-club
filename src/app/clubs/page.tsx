import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { clubsData } from '@/lib/data/clubs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Techno Clubs | Medi-Caps University',
  description: 'Explore the technical clubs at Medi-Caps University and find your passion in technology.',
};

export default function ClubsPage() {
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
                Techno Clubs
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Discover the vibrant technical communities at Medi-Caps University. Join a club, enhance your skills, and build your network.
              </p>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.values(clubsData).map((club) => {
                const clubColor = club.color || 'from-purple-600 to-indigo-800';
                
                return (
                  <Link 
                    href={`/clubs/${club.slug}`} 
                    key={club.id}
                    className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 group flex flex-col h-full"
                  >
                    <div className={`h-3 w-full bg-gradient-to-r ${clubColor}`}></div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center mb-6">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${clubColor} group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-white font-bold text-xl">{club.name.substring(0, 2)}</span>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold text-white">{club.name}</h2>
                          <p className="text-gray-400 text-sm">{club.tagline}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6 flex-1">
                        {club.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                        <div className="flex -space-x-2">
                          {club.team.slice(0, 4).map((member, idx) => (
                            <div
                              key={member.id}
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${clubColor} flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900`}
                              title={`${member.name}, ${member.position}`}
                            >
                              {member.initials}
                            </div>
                          ))}
                          {club.team.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">
                              +{club.team.length - 4}
                            </div>
                          )}
                        </div>
                        <span className="text-purple-400 group-hover:text-purple-300 transition flex items-center">
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Technical Clubs */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Why Join a Technical Club?</h2>
              <p className="text-gray-300">
                Technical clubs provide a platform for students to apply classroom knowledge to real-world projects, 
                develop leadership skills, and connect with like-minded peers and industry professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Skill Development</h3>
                <p className="text-gray-300">
                  Enhance your technical and soft skills through workshops, competitions, and collaborative projects.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <div className="w-12 h-12 rounded-lg bg-indigo-900/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Networking</h3>
                <p className="text-gray-300">
                  Connect with peers, alumni, faculty, and industry professionals who share your interests.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Career Opportunities</h3>
                <p className="text-gray-300">
                  Gain practical experience, build a portfolio, and discover internship and job opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <h3 className="text-xl font-bold text-white mb-2">How do I join a club?</h3>
                <p className="text-gray-300">
                  Visit the club's page and click on the "Join Club" button. You'll be asked to fill out a brief form and may be invited to attend an orientation session.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <h3 className="text-xl font-bold text-white mb-2">Are there membership fees?</h3>
                <p className="text-gray-300">
                  Most clubs have a nominal annual membership fee that covers basic club activities. Special events may have additional costs.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <h3 className="text-xl font-bold text-white mb-2">Can I join multiple clubs?</h3>
                <p className="text-gray-300">
                  Yes, you can join multiple clubs based on your interests. However, we recommend balancing your commitments to ensure you can actively participate.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <h3 className="text-xl font-bold text-white mb-2">Do I need prior experience?</h3>
                <p className="text-gray-300">
                  No, most clubs welcome members of all skill levels. They offer workshops and mentorship to help beginners grow and learn.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30">
                <h3 className="text-xl font-bold text-white mb-2">How can I become a club leader?</h3>
                <p className="text-gray-300">
                  Active members can apply for leadership positions during annual elections. Some roles may also be filled through appointment based on demonstrated commitment and skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Join a Technical Club?</h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              Explore our clubs, find your passion, and take the first step toward building your technical career and community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition">
                Join a Club Today
              </a>
              <a href="mailto:techclubs@medicaps.ac.in" className="px-6 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/30 transition">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 