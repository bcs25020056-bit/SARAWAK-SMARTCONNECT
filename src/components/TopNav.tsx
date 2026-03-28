import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { cn } from '../lib/utils';

const TopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Courses', path: '/courses' },
    { name: 'Job Search', path: '/job-search' },
    { name: 'Profile', path: '/profile' },
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
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClwilfi_UrxfCZMklMHvED9Qze-ysjMm5tMS4s1bH6yJqvA5dvLkIzm4E0Jnhb5ESnVZ1MIs0Mw9FZdXMbHdvsa_wbAXplcpqOv8oLIt6osM0aXdCu8O-UCMusPxK32_W_12S9E95WkLExKFeAwyXyYuisLGfnwkrbEUfijQt_OHzoiKkhzww-ES6-41z0HqSMkxMVHQM35FXefciOeb1qaEXkVxjQpUfcF2e-mz--BIlD72B_D5PZ_XeoXIfiQSRfuNyGfxLUal3u" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
