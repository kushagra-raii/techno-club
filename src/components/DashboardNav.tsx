'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession} from 'next-auth/react';

export default function DashboardNav() {
  const pathname: string = usePathname();
  const { data: session }: { data: Session | null } = useSession();
  
  const isSuperAdmin = session?.user?.role === 'superadmin';
  const isAdmin = session?.user?.role === 'admin' || isSuperAdmin;
  const isMember = session?.user?.role === 'member' || isAdmin;

  const navLinks = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      show: true 
    },
    { 
      href: '/dashboard/profile', 
      label: 'Profile', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      show: true 
    },
    { 
      href: '/dashboard/events', 
      label: 'Events', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      show: isMember 
    },
    { 
      href: '/dashboard/admin/meetings', 
      label: 'Meetings', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      show: session?.user?.role === 'admin' 
    },
    { 
      href: '/dashboard/superadmin/meetings', 
      label: 'All Meetings', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      show: isSuperAdmin 
    },
    { 
      href: '/dashboard/admin/members', 
      label: 'Club Members', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      show: session?.user?.role === 'admin' 
    },
    { 
      href: '/dashboard/superadmin/members', 
      label: 'All Club Members', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      show: isSuperAdmin 
    },
    { 
      href: '/dashboard/user-management', 
      label: 'User Management', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 016 6H2a6 6 0 016-6zM16 8a3 3 0 11-6 0 3 3 0 016 0zm-8 6a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
        </svg>
      ),
      show: isAdmin 
    }
  ];

  return (
    <nav className="bg-gray-900 text-white p-4 rounded-lg mb-8">
      <ul className="flex flex-wrap gap-2">
        {navLinks.map((link) => 
          link.show && (
            <li key={link.href}>
              <Link 
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  pathname === link.href 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-800'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
} 