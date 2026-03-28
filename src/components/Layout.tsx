import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24">
          <Outlet />
        </main>
      </div>
      
      {/* Footer */}
      <footer className="w-full rounded-t-[3rem] mt-20 bg-white border-t-[5px] border-slate-100">
        <div className="flex flex-col items-center py-12 px-8 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-10 text-slate-500 font-body text-xs font-medium uppercase tracking-widest">
            <a className="hover:text-primary underline transition-all" href="#">Privacy Policy</a>
            <a className="hover:text-primary underline transition-all" href="#">Terms of Service</a>
            <a className="hover:text-primary underline transition-all" href="#">Help Center</a>
            <a className="hover:text-primary underline transition-all" href="#">Contact Us</a>
          </div>
          <p className="text-slate-400 text-sm font-bold">© 2024 Sarawak Smart Connect. Built for the future.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
