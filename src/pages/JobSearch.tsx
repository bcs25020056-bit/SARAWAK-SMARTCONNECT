import React from 'react';
import { motion } from 'motion/react';
import { Search, Terminal, Brush, Bookmark, Star, Lightbulb, History, Check, HelpCircle, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const JobSearch = () => {
  const categories = ['Tech', 'Design', 'Marketing', 'Admin', 'Tourism'];
  
  const jobs = [
    {
      title: 'Senior Frontend Dev',
      company: 'TechSarawak Hub',
      tags: ['Full-time', 'Remote friendly', 'RM 8k - 12k'],
      desc: 'Join our vibrant team building the next generation of digital services for the people of Sarawak. Modern stack: React, Tailwind, and Node.',
      icon: Terminal,
      featured: true
    },
    {
      title: 'UI/UX Design Intern',
      company: 'Creative Borneo',
      tags: ['Kuching, Sarawak', 'Hybrid'],
      desc: 'Looking for a creative soul with a passion for bubbly interfaces and playful brand stories. Learn from the best designers in the region.',
      icon: Brush,
      internship: true
    }
  ];

  return (
    <div className="pt-8 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="bg-surface-container-highest rounded-3xl inked-border p-6 flex flex-col gap-8 sticky top-32 inked-shadow">
          <div>
            <h3 className="font-headline font-extrabold text-xl mb-6">Job Filters</h3>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search roles..."
                className="w-full bg-white rounded-full border-2 border-outline px-6 py-3 focus:border-primary focus:ring-0 transition-all font-medium"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button 
                  key={cat}
                  className={cn(
                    "px-4 py-2 rounded-full font-bold text-sm inked-border bubble-press",
                    i === 0 ? "bg-primary text-on-primary inked-shadow" : "bg-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Job Type</p>
            {['Full-time', 'Internship', 'Contract'].map((type, i) => (
              <label key={type} className="flex items-center gap-3 group cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={i === 0}
                  className="w-6 h-6 rounded-md border-2 border-outline text-primary focus:ring-primary" 
                />
                <span className="font-bold group-hover:text-primary transition-colors">{type}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 bg-secondary-container rounded-2xl inked-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-secondary" size={20} />
              <p className="font-headline font-bold text-sm">Pro Tip</p>
            </div>
            <p className="text-xs leading-relaxed font-medium">Keep your Resume Builder updated to get 2x more matches!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-10">
        <header className="relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-headline font-extrabold text-5xl lg:text-6xl text-on-surface leading-none mb-2">Career Path</h1>
              <p className="text-xl font-medium text-on-surface-variant">Find your dream job in Sarawak's growing ecosystem.</p>
            </div>
            <div className="bg-tertiary-container rounded-full inked-border px-6 py-2 flex items-center gap-3 inked-shadow">
              <Star className="text-on-tertiary-container" size={20} fill="currentColor" />
              <span className="font-bold text-on-tertiary-container">12 New Matches Today!</span>
            </div>
          </div>
        </header>

        {/* Job Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {jobs.map((job, i) => (
            <motion.article 
              key={job.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl inked-border p-6 inked-shadow flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-surface-container rounded-2xl inked-border flex items-center justify-center">
                    <job.icon size={32} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline font-extrabold text-xl leading-tight">{job.title}</h4>
                    <p className="font-bold text-on-surface-variant text-sm">{job.company}</p>
                  </div>
                </div>
                {job.featured && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-black inked-border">FEATURED</span>}
                {job.internship && <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-black inked-border uppercase">Internship</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-bold border-2 border-outline/30">{tag}</span>
                ))}
              </div>

              <p className="text-sm line-clamp-2 text-on-surface-variant font-medium">
                {job.desc}
              </p>

              <div className="mt-auto flex gap-4 pt-4 border-t-2 border-dashed border-outline/20">
                <button className="flex-1 bg-primary text-on-primary rounded-full font-extrabold py-3 inked-border inked-shadow bubble-press">Apply Now</button>
                <button className="w-12 h-12 rounded-full inked-border flex items-center justify-center hover:bg-surface-container transition-colors active:scale-95">
                  <Bookmark size={24} />
                </button>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Application History */}
        <section className="mt-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline font-extrabold text-3xl">Application History</h2>
            <div className="h-1 flex-1 bg-outline/20 rounded-full" />
          </div>
          
          <div className="bg-white rounded-3xl inked-border overflow-hidden inked-shadow">
            <div className="p-6 border-b-2 border-outline/10 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full inked-border flex items-center justify-center">
                  <History className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Digital Marketing Lead</h4>
                  <p className="text-xs text-on-surface-variant font-semibold">Sarawak Energy • Applied 2 days ago</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-tertiary">STAGE 3: INTERVIEW</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary inked-border">
                    <Check size={16} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary inked-border">
                    <Check size={16} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container inked-border animate-pulse">
                    <HelpCircle size={16} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-outline inked-border opacity-50">
                    <Lock size={16} />
                  </div>
                </div>
                <span className="font-bold text-sm">Progress: 65%</span>
              </div>
              
              <div className="relative h-6 bg-surface-container rounded-full border-2 border-outline overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-tertiary-container border-r-4 border-on-tertiary-container rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-around px-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-on-surface/20" />)}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest text-outline">
                <span>Review</span>
                <span>Shortlist</span>
                <span className="text-primary">Interview</span>
                <span>Offer</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobSearch;
