import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the club data type
type ClubDetails = {
  id: string;
  name: string;
  slug: string;
  description: string;
  mission: string;
  vision: string;
  team: Array<{
    id: string;
    name: string;
    position: string;
    initials: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>;
  collaborations: Array<{
    partner: string;
    project: string;
    year: string;
  }>;
};

// Mock database for clubs
const clubsData: { [key: string]: ClubDetails } = {
  'ieee': {
    id: 'ieee',
    name: 'IEEE',
    slug: 'ieee',
    description: 'The IEEE Student Branch is dedicated to developing professional and technical abilities of its student members through various activities including technical talks, workshops, industrial visits, and social activities.',
    mission: 'To foster technological innovation and excellence for the benefit of humanity by helping members network and collaborate, and to provide professional growth opportunities in the field of electrical and electronic engineering.',
    vision: 'To be the most recognized and respected platform for technology enthusiasts; a body which would not only foster professional skills but also inculcate a sense of social and ethical responsibility.',
    team: [
      {
        id: 'aj',
        name: 'Alex Johnson',
        position: 'Chair',
        initials: 'AJ'
      },
      {
        id: 'sw',
        name: 'Sara Williams',
        position: 'Vice Chair',
        initials: 'SW'
      },
      {
        id: 'mb',
        name: 'Michael Brown',
        position: 'Secretary',
        initials: 'MB'
      },
      {
        id: 'ed',
        name: 'Emma Davis',
        position: 'Treasurer',
        initials: 'ED'
      },
      {
        id: 'dw',
        name: 'David Wilson',
        position: 'Technical Lead',
        initials: 'DW'
      },
      {
        id: 'sm',
        name: 'Sophia Martinez',
        position: 'Events Coordinator',
        initials: 'SM'
      }
    ],
    events: [
      {
        id: 'tech-conf-2023',
        title: 'Tech Conference 2023',
        date: 'November 15, 2023',
        description: 'Annual technical conference featuring speakers from leading tech companies and research institutions.'
      },
      {
        id: 'hackathon-iot',
        title: 'Hackathon: IoT Solutions',
        date: 'September 23-24, 2023',
        description: '48-hour hackathon focusing on developing innovative IoT solutions for real-world problems.'
      },
      {
        id: 'workshop-embedded',
        title: 'Workshop on Embedded Systems',
        date: 'August 10, 2023',
        description: 'Hands-on workshop covering the fundamentals of embedded systems design and implementation.'
      },
      {
        id: 'industry-visit',
        title: 'Industry Visit: Semiconductor Manufacturing',
        date: 'July 5, 2023',
        description: 'Educational visit to a semiconductor manufacturing facility to understand the production process.'
      }
    ],
    collaborations: [
      {
        partner: 'Texas Instruments',
        project: 'Embedded Systems Workshop',
        year: '2023'
      },
      {
        partner: 'Intel',
        project: 'AI Accelerator Program',
        year: '2023'
      },
      {
        partner: 'Cisco',
        project: 'Networking Fundamentals Course',
        year: '2022'
      },
      {
        partner: 'Local Power Company',
        project: 'Smart Grid Research',
        year: '2022'
      },
      {
        partner: 'University Research Lab',
        project: 'Renewable Energy Solutions',
        year: '2021'
      }
    ]
  },
  'acm': {
    id: 'acm',
    name: 'ACM',
    slug: 'acm',
    description: 'The Association for Computing Machinery promotes increased knowledge and interest in computing science and applications.',
    mission: 'To advance computing as a science and profession by enabling professional growth and connecting computing educators, researchers, and professionals.',
    vision: 'To be a leading platform for advancing the art, science, engineering, and application of computing, serving both professional and public interests.',
    team: [
      {
        id: 'js',
        name: 'John Smith',
        position: 'Chair',
        initials: 'JS'
      },
      {
        id: 'lw',
        name: 'Laura Wilson',
        position: 'Vice Chair',
        initials: 'LW'
      },
      {
        id: 'rj',
        name: 'Robert Johnson',
        position: 'Secretary',
        initials: 'RJ'
      },
      {
        id: 'km',
        name: 'Kate Miller',
        position: 'Treasurer',
        initials: 'KM'
      }
    ],
    events: [
      {
        id: 'code-jam',
        title: 'Code Jam 2023',
        date: 'October 20, 2023',
        description: 'Competitive programming contest challenging participants to solve algorithmic puzzles.'
      },
      {
        id: 'webdev-bootcamp',
        title: 'Web Development Bootcamp',
        date: 'September 5-7, 2023',
        description: 'Intensive 3-day bootcamp covering modern web development technologies and practices.'
      },
      {
        id: 'ai-workshop',
        title: 'AI Ethics Workshop',
        date: 'August 18, 2023',
        description: 'Workshop addressing ethical considerations in artificial intelligence development and deployment.'
      }
    ],
    collaborations: [
      {
        partner: 'Google',
        project: 'Cloud Computing Workshop',
        year: '2023'
      },
      {
        partner: 'Microsoft',
        project: 'Student Developer Conference',
        year: '2023'
      },
      {
        partner: 'Amazon',
        project: 'AWS Training Program',
        year: '2022'
      }
    ]
  },
  'aws': {
    id: 'aws',
    name: 'AWS',
    slug: 'aws',
    description: 'The AWS Student Club focuses on cloud computing technologies and offers hands-on experience with Amazon Web Services.',
    mission: 'To provide students with practical knowledge and skills in cloud computing through Amazon Web Services, empowering them to build innovative solutions and accelerate their careers.',
    vision: 'To create a community of cloud-native developers who are ready to tackle real-world challenges and drive technological innovation forward.',
    team: [
      {
        id: 'tr',
        name: 'Tyler Richards',
        position: 'President',
        initials: 'TR'
      },
      {
        id: 'jd',
        name: 'Jessica Davis',
        position: 'Vice President',
        initials: 'JD'
      },
      {
        id: 'nk',
        name: 'Neil Kumar',
        position: 'Technical Lead',
        initials: 'NK'
      },
      {
        id: 'am',
        name: 'Alicia Martinez',
        position: 'Event Coordinator',
        initials: 'AM'
      }
    ],
    events: [
      {
        id: 'aws-builders-day',
        title: 'AWS Builders Day',
        date: 'December 5, 2023',
        description: 'Full-day workshop for students to build and deploy their first cloud application using various AWS services.'
      },
      {
        id: 'serverless-hackathon',
        title: 'Serverless Architecture Hackathon',
        date: 'October 14-15, 2023',
        description: 'A 36-hour hackathon focused on building serverless applications using AWS Lambda and other AWS services.'
      },
      {
        id: 'cloud-fundamentals',
        title: 'Cloud Computing Fundamentals',
        date: 'September 12, 2023',
        description: 'An introductory workshop covering the basics of cloud computing concepts and AWS core services.'
      }
    ],
    collaborations: [
      {
        partner: 'Amazon',
        project: 'AWS Educate Program',
        year: '2023'
      },
      {
        partner: 'Local Startups',
        project: 'Cloud Migration Workshop',
        year: '2023'
      },
      {
        partner: 'University IT Department',
        project: 'Campus Cloud Infrastructure',
        year: '2022'
      }
    ]
  },
  'gdg': {
    id: 'gdg',
    name: 'GDG',
    slug: 'gdg',
    description: 'Google Developer Group connects students passionate about Google technologies and provides learning opportunities through workshops and events.',
    mission: 'To create a space for developers to connect, learn, and grow together while exploring Google technologies and building innovative solutions.',
    vision: 'To foster a vibrant community of student developers who contribute to the technology ecosystem and drive positive change through Google technologies.',
    team: [
      {
        id: 'rp',
        name: 'Ryan Park',
        position: 'Lead Organizer',
        initials: 'RP'
      },
      {
        id: 'ml',
        name: 'Michelle Lee',
        position: 'Co-organizer',
        initials: 'ML'
      },
      {
        id: 'kj',
        name: 'Kevin Jackson',
        position: 'Technical Lead',
        initials: 'KJ'
      },
      {
        id: 'pc',
        name: 'Priya Choudhary',
        position: 'Community Manager',
        initials: 'PC'
      }
    ],
    events: [
      {
        id: 'devfest-2023',
        title: 'DevFest 2023',
        date: 'November 25, 2023',
        description: 'Annual developer festival featuring technical sessions, codelabs, and networking with Google Developer Experts.'
      },
      {
        id: 'flutter-jam',
        title: 'Flutter Jam',
        date: 'October 7, 2023',
        description: 'Hands-on workshop on building cross-platform applications using Flutter and Firebase.'
      },
      {
        id: 'ml-study-jam',
        title: 'Machine Learning Study Jam',
        date: 'September 16, 2023',
        description: 'Collaborative learning session on TensorFlow and Google Cloud machine learning services.'
      }
    ],
    collaborations: [
      {
        partner: 'Google',
        project: 'Google I/O Extended',
        year: '2023'
      },
      {
        partner: 'Women Techmakers',
        project: 'Diversity in Tech Initiative',
        year: '2023'
      },
      {
        partner: 'Local Tech Companies',
        project: 'Career Connect Program',
        year: '2022'
      }
    ]
  },
  'stic': {
    id: 'stic',
    name: 'STIC',
    slug: 'stic',
    description: 'Student Technical Innovation Club encourages innovation and practical application of technology through projects and competitions.',
    mission: 'To cultivate a culture of innovation and practical problem-solving using technology, inspiring students to apply their knowledge to create real-world solutions.',
    vision: 'To be the catalyst for student-led technical innovation on campus, enabling future leaders to develop both technical expertise and entrepreneurial mindset.',
    team: [
      {
        id: 'as',
        name: 'Aiden Smith',
        position: 'President',
        initials: 'AS'
      },
      {
        id: 'lt',
        name: 'Lily Thompson',
        position: 'Vice President',
        initials: 'LT'
      },
      {
        id: 'dc',
        name: 'Daniel Chen',
        position: 'Project Manager',
        initials: 'DC'
      },
      {
        id: 'hr',
        name: 'Hannah Robinson',
        position: 'Innovation Lead',
        initials: 'HR'
      }
    ],
    events: [
      {
        id: 'innovation-challenge',
        title: 'Annual Innovation Challenge',
        date: 'December 10, 2023',
        description: 'Campus-wide competition where teams prototype solutions for real-world problems provided by industry partners.'
      },
      {
        id: 'prototype-workshop',
        title: 'Rapid Prototyping Workshop',
        date: 'October 28, 2023',
        description: 'Hands-on workshop teaching students how to quickly develop and test prototypes using various tools and technologies.'
      },
      {
        id: 'design-thinking',
        title: 'Design Thinking Bootcamp',
        date: 'September 30, 2023',
        description: 'Interactive session on applying design thinking methodology to technical problem-solving and innovation.'
      }
    ],
    collaborations: [
      {
        partner: 'Local Innovation Hub',
        project: 'Student Startup Incubator',
        year: '2023'
      },
      {
        partner: 'Engineering Department',
        project: 'Interdisciplinary Innovation Lab',
        year: '2023'
      },
      {
        partner: 'Industry Partners',
        project: 'Real-World Challenge Program',
        year: '2022'
      }
    ]
  }
};

// This function gets called at request time
export function generateStaticParams() {
  // Return a list of possible values for slug
  return Object.keys(clubsData).map((slug) => ({
    slug,
  }));
}

type Props = {
  params: { slug: string };
};

export default function ClubPage({ params }: Props) {
  const { slug } = params;
  const club = clubsData[slug];
  
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

  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen text-white">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/40 text-purple-300">
                  Student Club
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  {club.name}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {club.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition">
                    Join Club
                  </button>
                  <button className="px-5 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/30 transition">
                    Contact Us
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="h-56 w-56 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-6xl font-bold">
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
              {club.team.map((member) => (
                <div 
                  key={member.id}
                  className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-900/30 flex items-center space-x-4 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold">
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
        
        {/* Past Events */}
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {club.events.map((event) => (
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
                  {club.collaborations.map((collab, idx) => (
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