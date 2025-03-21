"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ClubsSection from '@/components/ClubsSection';
import EventsSection from '@/components/EventsSection';
import TeamSection from '@/components/TeamSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <ClubsSection />
        <EventsSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
