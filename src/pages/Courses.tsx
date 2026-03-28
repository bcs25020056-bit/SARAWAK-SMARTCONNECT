import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Play, Clock, Star, Users, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const Courses = () => {
  const categories = ['All', 'Design', 'Business', 'Tech', 'Soft Skills'];
  const courses = [
    {
      id: 1,
      title: 'Intro to UX Design',
      category: 'Design',
      instructor: 'Alex Rivers',
      duration: '12h 30m',
      rating: 4.8,
      students: 1240,
      image: 'https://picsum.photos/seed/ux/400/250',
      color: 'bg-primary-container'
    },
    {
      id: 2,
      title: 'Financial Literacy 101',
      category: 'Business',
      instructor: 'Sarah Tan',
      duration: '8h 45m',
      rating: 4.9,
      students: 3200,
      image: 'https://picsum.photos/seed/finance/400/250',
      color: 'bg-secondary-container'
    },
    {
      id: 3,
      title: 'Critical Thinking',
      category: 'Soft Skills',
      instructor: 'Dr. James Lee',
      duration: '6h 15m',
      rating: 4.7,
      students: 850,
      image: 'https://picsum.photos/seed/thinking/400/250',
      color: 'bg-tertiary-container'
    },
    {
      id: 4,
      title: 'React for Beginners',
      category: 'Tech',
      instructor: 'David Chen',
      duration: '15h 20m',
      rating: 4.9,
      students: 5400,
      image: 'https://picsum.photos/seed/react/400/250',
      color: 'bg-primary-container'
    }
  ];

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Learning Portal</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          Expand your horizons with our curated courses designed for the future of Sarawak.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search for courses..." 
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
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl inked-border overflow-hidden group hover:-translate-y-2 transition-transform"
          >
            <div className="relative h-48">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-on-surface text-xs font-black rounded-full border-2 border-on-surface uppercase">
                  {course.category}
                </span>
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center inked-border">
                  <Play size={32} className="text-primary fill-primary ml-1" />
                </div>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black font-headline mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-on-surface-variant font-bold text-sm mb-6">by {course.instructor}</p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-xs font-bold text-on-surface-variant">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-secondary fill-secondary" />
                  <span className="text-xs font-bold text-on-surface-variant">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-tertiary" />
                  <span className="text-xs font-bold text-on-surface-variant">{course.students}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-primary-container text-on-primary-container rounded-2xl font-headline font-black inked-border pressed-shadow hover:bg-primary-container/80 transition-all">
                Enroll Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
