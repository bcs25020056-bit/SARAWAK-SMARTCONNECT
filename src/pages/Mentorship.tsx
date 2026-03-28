import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Star, Briefcase, GraduationCap, Calendar, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const Mentorship = () => {
  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Tan',
      role: 'Senior Engineering Manager',
      company: 'Petronas Sarawak',
      rating: 4.9,
      reviews: 124,
      expertise: ['Engineering', 'Leadership', 'Career Strategy'],
      image: 'https://i.pravatar.cc/150?u=sarah',
      color: 'bg-primary-container'
    },
    {
      id: 2,
      name: 'Mr. David Chen',
      role: 'Lead UX Designer',
      company: 'Creative Hub Kuching',
      rating: 4.8,
      reviews: 86,
      expertise: ['UI/UX Design', 'Product Management'],
      image: 'https://i.pravatar.cc/150?u=david',
      color: 'bg-secondary-container'
    },
    {
      id: 3,
      name: 'Ms. Emily Wong',
      role: 'Data Scientist',
      company: 'Sarawak Digital Economy Corp',
      rating: 5.0,
      reviews: 42,
      expertise: ['Data Science', 'AI/ML', 'Python'],
      image: 'https://i.pravatar.cc/150?u=emily',
      color: 'bg-tertiary-container'
    }
  ];

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Mentorship</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          Connect with industry leaders and experts who are ready to guide you on your journey.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search for mentors by expertise..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl inked-border font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="px-8 py-4 bg-white text-on-surface font-bold rounded-2xl inked-border hover:bg-surface transition-colors flex items-center gap-2">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mentors.map((mentor, i) => (
          <motion.div 
            key={mentor.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl inked-border p-8 hover:-translate-y-2 transition-transform"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className={cn("w-24 h-24 rounded-2xl inked-border overflow-hidden", mentor.color)}>
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-2xl font-black font-headline mb-1">{mentor.name}</h3>
                <p className="text-on-surface-variant font-bold text-sm mb-2">{mentor.role}</p>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-secondary fill-secondary" />
                  <span className="text-sm font-black">{mentor.rating}</span>
                  <span className="text-xs font-bold text-slate-400">({mentor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-primary" />
                <p className="text-sm font-semibold text-on-surface-variant">{mentor.company}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map(exp => (
                  <span key={exp} className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-black rounded-full border-2 border-on-surface uppercase">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 bg-primary text-on-primary rounded-2xl font-headline font-black inked-border pressed-shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Chat
              </button>
              <button className="py-3 bg-white text-on-surface rounded-2xl font-headline font-black inked-border hover:bg-surface transition-all flex items-center justify-center gap-2">
                <Calendar size={18} />
                Book
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Mentorship;
