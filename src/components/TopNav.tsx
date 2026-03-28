import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';

const TopNav = () => {
  const location = useLocation();
  const { user } = useFirebase();
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scholarships', path: '/scholarships' },
    { name: 'Job Search', path: '/job-search' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b-[3px] border-slate-200 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-full mx-auto">
        <Link to="/dashboard" className="text-2xl font-black text-primary tracking-tighter">
          Sarawak Smart Connect
        </Link>
        
        <div className="hidden md:flex gap-8 items-center font-headline font-bold text-sm tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "transition-colors hover:text-primary",
                location.pathname === link.path 
                  ? "text-primary border-b-4 border-primary pb-1" 
                  : "text-slate-500"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="p-2 hover:scale-110 transition-transform text-primary">
            <Bell size={24} />
          </Link>
          <Link 
            to="/profile" 
            className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-primary-container flex items-center justify-center"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="text-primary" size={20} />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
