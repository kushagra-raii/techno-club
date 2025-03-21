import React from 'react';
import Link from 'next/link';

type Club = {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
};

const clubs: Club[] = [
  {
    id: 'ieee',
    name: 'IEEE',
    description: 'The IEEE Student Branch is dedicated to developing professional and technical abilities of its student members through various activities.',
    icon: '/icons/ieee.svg',
    slug: 'ieee'
  },
  {
    id: 'acm',
    name: 'ACM',
    description: 'The Association for Computing Machinery promotes increased knowledge and interest in computing science and applications.',
    icon: '/icons/acm.svg',
    slug: 'acm'
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'The AWS Student Club focuses on cloud computing technologies and offers hands-on experience with Amazon Web Services.',
    icon: '/icons/aws.svg',
    slug: 'aws'
  },
  {
    id: 'gdg',
    name: 'GDG',
    description: 'Google Developer Group connects students passionate about Google technologies and provides learning opportunities through workshops and events.',
    icon: '/icons/gdg.svg',
    slug: 'gdg'
  },
  {
    id: 'stic',
    name: 'STIC',
    description: 'Student Technical Innovation Club encourages innovation and practical application of technology through projects and competitions.',
    icon: '/icons/stic.svg',
    slug: 'stic'
  }
];

const ClubsSection: React.FC = () => {
  return (
    <section id="clubs" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Tech Clubs</h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Explore our diverse range of technology clubs and find the perfect community to grow your skills and pursue your passions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <div 
              key={club.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-purple-900/30 rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="p-6">
                <div className="mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {club.name.substring(0, 2)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                <p className="text-gray-400 mb-4">{club.description}</p>
                <Link 
                  href={`/clubs/${club.slug}`}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium"
                >
                  Learn more
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubsSection; 