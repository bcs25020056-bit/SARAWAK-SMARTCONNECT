import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  Award, 
  UserCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Exploration', icon: Compass, path: '/job-search' },
    { name: 'Community', icon: Users, path: '/mentorship' },
    { name: 'Achievements', icon: Award, path: '/achievements' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  return (
    <aside className="hidden lg:flex flex-col py-8 px-4 gap-6 h-[calc(100vh-6rem)] sticky top-24 w-72 rounded-r-[3rem] border-r-[5px] border-slate-900/10 bg-slate-50">
      {/* User Profile Summary */}
      <div className="flex flex-col items-center gap-4 px-6 mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full inked-border overflow-hidden bg-white inked-shadow">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClwilfi_UrxfCZMklMHvED9Qze-ysjMm5tMS4s1bH6yJqvA5dvLkIzm4E0Jnhb5ESnVZ1MIs0Mw9FZdXMbHdvsa_wbAXplcpqOv8oLIt6osM0aXdCu8O-UCMusPxK32_W_12S9E95WkLExKFeAwyXyYuisLGfnwkrbEUfijQt_OHzoiKkhzww-ES6-41z0HqSMkxMVHQM35FXefciOeb1qaEXkVxjQpUfcF2e-mz--BIlD72B_D5PZ_XeoXIfiQSRfuNyGfxLUal3u" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black text-primary font-headline leading-tight">Welcome, Explorer!</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level 15 Storyteller</p>
        </div>
      </div>
      
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-200 group relative",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container inked-border inked-shadow" 
                  : "text-slate-600 hover:translate-x-2 hover:bg-primary-container/10"
              )}
            >
              <item.icon size={22} fill={isActive ? "currentColor" : "none"} />
              <span className="font-headline font-black text-sm">{item.name}</span>
              {isActive && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-4">
        <button className="w-full py-4 bg-primary text-on-primary font-headline font-black rounded-full inked-border pressed-shadow hover:scale-105 transition-transform">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
