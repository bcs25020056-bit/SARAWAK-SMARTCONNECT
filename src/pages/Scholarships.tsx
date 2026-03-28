import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ExternalLink, Calendar, Award, Users, Search, Filter, Landmark } from 'lucide-react';
import { cn } from '../lib/utils';

const Scholarships = () => {
  const categories = ['All', 'Government', 'Private', 'University', 'International'];
  const scholarships = [
    {
      id: 1,
      title: 'PTPTN Education Loan',
      provider: 'National Higher Education Fund Corporation',
      category: 'Government',
      deadline: 'Open Year Round',
      amount: 'Up to RM25,000/year',
      eligibility: 'Malaysian Students',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
      color: 'bg-primary-container'
    },
    {
      id: 2,
      title: 'Yayasan Sarawak Tun Taib Scholarship',
      provider: 'Yayasan Sarawak',
      category: 'Government',
      deadline: '30 June 2026',
      amount: 'Full Tuition + Stipend',
      eligibility: 'Sarawakian Students',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000',
      color: 'bg-secondary-container'
    },
    {
      id: 3,
      title: 'Petronas Education Powering Knowledge',
      provider: 'Petronas',
      category: 'Private',
      deadline: '15 April 2026',
      amount: 'Full Scholarship',
      eligibility: 'SPM/STPM Leavers',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000',
      color: 'bg-tertiary-container'
    },
    {
      id: 4,
      title: 'Shell Malaysia Scholarship',
      provider: 'Shell Malaysia',
      category: 'Private',
      deadline: '20 May 2026',
      amount: 'RM30,000/year',
      eligibility: 'Undergraduate Students',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
      color: 'bg-primary-container'
    },
    {
      id: 5,
      title: 'Sarawak Energy Scholarship',
      provider: 'Sarawak Energy Berhad',
      category: 'Private',
      deadline: '10 July 2026',
      amount: 'Full Coverage',
      eligibility: 'Engineering & Tech Students',
      image: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80&w=1000',
      color: 'bg-secondary-container'
    }
  ];

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Scholarship Portal</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          Find and apply for the best financial aid opportunities to fuel your educational journey in Sarawak.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search for scholarships, providers..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl inked-border font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              className={cn(
                "px-6 py-4 rounded-2xl font-bold inked-border transition-all whitespace-nowrap",
                cat === 'All' ? "bg-primary text-on-primary" : "bg-white text-on-surface hover:bg-surface"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {scholarships.map((scholarship, i) => (
          <motion.div 
            key={scholarship.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl inked-border overflow-hidden group hover:-translate-y-2 transition-transform inked-shadow"
          >
            <div className="relative h-48">
              <img 
                src={scholarship.image} 
                alt={scholarship.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-on-surface text-[10px] font-black rounded-full border-2 border-on-surface uppercase tracking-wider">
                  {scholarship.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black font-headline mb-1 group-hover:text-primary transition-colors leading-tight">
                    {scholarship.title}
                  </h3>
                  <p className="text-on-surface-variant font-bold text-xs flex items-center gap-1">
                    <Landmark size={12} /> {scholarship.provider}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Amount</span>
                  <div className="flex items-center gap-1.5 text-sm font-black text-secondary">
                    <Award size={14} />
                    <span>{scholarship.amount}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Deadline</span>
                  <div className="flex items-center gap-1.5 text-sm font-black text-primary">
                    <Calendar size={14} />
                    <span>{scholarship.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 p-3 bg-surface rounded-xl inked-border">
                <Users size={16} className="text-tertiary" />
                <span className="text-xs font-bold text-on-surface-variant">{scholarship.eligibility}</span>
              </div>

              <button className="w-full py-4 bg-primary text-on-primary rounded-2xl font-headline font-black inked-border pressed-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Apply Now <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Section */}
      <section className="mt-16 bg-secondary-container rounded-[3rem] inked-border p-10 inked-shadow relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="px-4 py-1 bg-white rounded-full text-xs font-black uppercase tracking-widest text-secondary mb-4 inline-block inked-border">
              Featured Opportunity
            </span>
            <h2 className="text-4xl font-black font-headline text-on-secondary-container mb-4">
              Yayasan Sarawak High Potential Program
            </h2>
            <p className="text-on-secondary-container/80 font-bold mb-8 leading-relaxed">
              Exclusive scholarship for high-achieving Sarawakian students pursuing STEM and Digital Economy fields. 
              Includes mentorship and guaranteed internship placements.
            </p>
            <button className="bg-secondary text-on-secondary font-headline font-black px-8 py-4 rounded-2xl inked-border bubble-press">
              Check Eligibility
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white rounded-[2.5rem] inked-border inked-shadow flex items-center justify-center p-8">
            <Landmark size={120} className="text-secondary" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarships;
