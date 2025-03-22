"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Clubs', href: '#clubs' },
  { name: 'Events', href: '#events' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  console.log(session);
  const pathname = usePathname();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  // Check if user is admin or superadmin
  const isAdminUser = session?.user?.role === 'admin' || session?.user?.role === 'superadmin';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-purple-900/20' 
        : 'bg-black/70 backdrop-blur-lg'
      } border-b border-purple-900/30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 mr-2">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full blur opacity-70"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">TC</span>
                  </div>
                </div>
                <div>
                  <span className="text-white font-bold text-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">TechnoClub</span>
                  <p className="text-xs text-gray-400">Medi-Caps University</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (pathname === '/' && item.href.startsWith('#'));
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-purple-900/30 ${
                        isActive 
                          ? 'text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoading ? (
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdminUser && (
                  <Link 
                    href="/dashboard" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold">{session.user?.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <span className="max-w-[100px] truncate">{session.user?.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => signIn()} 
                  className="text-white px-4 py-2 rounded-lg text-sm border border-purple-500/50 hover:border-purple-500 transition duration-150 ease-in-out"
                >
                  Sign In
                </button>
                <Link href="/auth/signup">
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-indigo-800 transition duration-150 ease-in-out shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50">
                    Join Us
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-900/30 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (pathname === '/' && item.href.startsWith('#'));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-900/30'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
          
          {/* Mobile auth options */}
          {isAuthenticated ? (
            <>
              {isAdminUser && (
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-900/30"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-900/30"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-900/30"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn()}
                className="w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-900/30 text-left"
              >
                Sign In
              </button>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-indigo-800 transition duration-150 ease-in-out">
                  Join Us
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 