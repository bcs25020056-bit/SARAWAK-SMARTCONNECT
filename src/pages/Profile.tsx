import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Star, 
  Trophy, 
  Camera, 
  MessageSquare, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

const Profile = () => {
  const skills = [
    { name: 'UX Design', color: 'bg-primary text-on-primary' },
    { name: 'Digital Literacy', color: 'bg-tertiary text-on-tertiary' },
    { name: 'Communication', color: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Photography', color: 'bg-surface-container-high text-on-surface' },
    { name: 'Copywriting', color: 'bg-primary-container text-on-primary-container' },
    { name: 'Public Speaking', color: 'bg-white text-on-surface' },
  ];

  const education = [
    {
      institution: 'Digital Heritage Academy',
      degree: 'Advanced Cultural Storytelling Module',
      date: 'Completed: Oct 2023 • Top 5% of Class',
      status: 'CERTIFIED',
      statusColor: 'bg-tertiary-container text-on-tertiary-container',
      icon: BookOpen,
      iconBg: 'bg-surface-container-low'
    },
    {
      institution: 'Kuching Tech Institute',
      degree: 'Interaction Design & Community Engagement',
      date: 'Graduated: 2022 • Honors Degree',
      status: 'VERIFIED',
      statusColor: 'bg-white text-secondary inked-border',
      icon: GraduationCap,
      iconBg: 'bg-surface-container-low',
      verified: true
    }
  ];

  return (
    <div className="pt-8 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-surface-container-low rounded-[3rem] inked-border p-10 flex flex-col md:flex-row items-center gap-10 inked-shadow-lg overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative">
          <div className="w-48 h-48 rounded-full inked-border-heavy overflow-hidden bg-white">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClwilfi_UrxfCZMklMHvED9Qze-ysjMm5tMS4s1bH6yJqvA5dvLkIzm4E0Jnhb5ESnVZ1MIs0Mw9FZdXMbHdvsa_wbAXplcpqOv8oLIt6osM0aXdCu8O-UCMusPxK32_W_12S9E95WkLExKFeAwyXyYuisLGfnwkrbEUfijQt_OHzoiKkhzww-ES6-41z0HqSMkxMVHQM35FXefciOeb1qaEXkVxjQpUfcF2e-mz--BIlD72B_D5PZ_XeoXIfiQSRfuNyGfxLUal3u" 
              alt="Alex Rivers"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center inked-shadow">
            <Star className="text-on-secondary-container" size={24} fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="font-headline font-black text-5xl text-on-surface">Alex Rivers</h1>
            <div className="inline-flex items-center gap-2 bg-tertiary-container px-4 py-1.5 rounded-full inked-border text-on-tertiary-container font-black text-sm uppercase tracking-wider">
              <Sparkles size={16} />
              Level 12 Explorer
            </div>
          </div>
          <p className="text-xl font-medium text-on-surface-variant max-w-2xl">
            A curious traveler documenting the hidden gems of Sarawak. Passionate about digital storytelling and community heritage. 🌏✨
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inked-border font-bold text-sm">
              <MapPin size={18} className="text-primary" />
              Kuching, MY
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inked-border font-bold text-sm">
              <Calendar size={18} className="text-primary" />
              Joined Jan 2024
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Personal Info & Education */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Personal Info Form */}
          <section className="bg-white rounded-[2.5rem] inked-border p-10 inked-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-container rounded-full inked-border flex items-center justify-center">
                <Award className="text-primary" size={24} />
              </div>
              <h2 className="font-headline font-black text-3xl">Personal Info</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-2">
                <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Rivers"
                  className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-primary focus:ring-0 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="alex.rivers@example.com"
                  className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-primary focus:ring-0 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-10">
              <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Bio / About Me</label>
              <textarea 
                rows={4}
                defaultValue="I love discovering new places in Sarawak and sharing the stories behind local landmarks. Always looking for the next adventure!"
                className="w-full bg-surface-container-low rounded-2xl inked-border px-6 py-4 font-bold focus:border-primary focus:ring-0 transition-all resize-none"
              />
            </div>

            <button className="w-full bg-primary text-on-primary font-headline font-black text-xl py-5 rounded-2xl inked-border inked-shadow bubble-press">
              Save Changes
            </button>
          </section>

          {/* Education Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary-container rounded-full inked-border flex items-center justify-center">
                  <GraduationCap className="text-tertiary" size={24} />
                </div>
                <h2 className="font-headline font-black text-3xl">Education</h2>
              </div>
              <button className="flex items-center gap-2 font-headline font-black text-primary hover:translate-x-1 transition-transform">
                Add New <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {education.map((item, i) => (
                <motion.div 
                  key={item.institution}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl inked-border p-6 inked-shadow flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  <div className={cn("w-16 h-16 rounded-2xl inked-border flex items-center justify-center shrink-0", item.iconBg)}>
                    <item.icon className="text-primary" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="font-headline font-black text-xl">{item.institution}</h4>
                      <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", item.statusColor)}>
                        {item.status}
                      </span>
                    </div>
                    <p className="font-bold text-on-surface mb-1">{item.degree}</p>
                    <p className="text-sm font-medium text-on-surface-variant">{item.date}</p>
                  </div>
                  {item.verified && (
                    <div className="bg-secondary-container p-2 rounded-full inked-border">
                      <CheckCircle2 size={20} className="text-on-secondary-container" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Skills & Progress */}
        <div className="flex flex-col gap-10">
          {/* Skills Section */}
          <section className="bg-surface-container-high rounded-[2.5rem] inked-border p-10 inked-shadow flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center">
                <Sparkles className="text-on-secondary-container" size={24} />
              </div>
              <h2 className="font-headline font-black text-3xl">My Skills</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div 
                  key={skill.name}
                  className={cn(
                    "px-6 py-3 rounded-full font-black text-sm inked-border inked-shadow bubble-press",
                    skill.color
                  )}
                >
                  {skill.name}
                </div>
              ))}
            </div>

            <div className="mt-4 p-6 bg-white/50 rounded-3xl border-2 border-dashed border-on-surface/20 text-center">
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
                New skills unlock as you level up your Exploration rank!
              </p>
            </div>
          </section>

          {/* Progress Section */}
          <section className="bg-white rounded-[2.5rem] inked-border p-10 inked-shadow flex flex-col gap-8">
            <h2 className="font-headline font-black text-3xl">Adventure Progress</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between font-black text-sm uppercase tracking-widest">
                  <span>Exploration Points</span>
                  <span className="text-primary">850/1000 XP</span>
                </div>
                <div className="h-6 bg-surface-container rounded-full inked-border overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-primary-container border-r-4 border-on-primary-container"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between font-black text-sm uppercase tracking-widest">
                  <span>Community Badges</span>
                  <span className="text-tertiary">14 Earned</span>
                </div>
                <div className="h-6 bg-surface-container rounded-full inked-border overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    className="h-full bg-tertiary-container border-r-4 border-on-tertiary-container"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-dashed border-outline/20">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-primary-container rounded-2xl inked-border flex items-center justify-center">
                  <Trophy size={24} className="text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase text-center">12 Trophies</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-tertiary-container rounded-2xl inked-border flex items-center justify-center">
                  <Camera size={24} className="text-tertiary" />
                </div>
                <span className="text-[10px] font-black uppercase text-center">42 Photos</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-secondary-container rounded-2xl inked-border flex items-center justify-center">
                  <MessageSquare size={24} className="text-on-secondary-container" />
                </div>
                <span className="text-[10px] font-black uppercase text-center">156 Posts</span>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="relative rounded-[2.5rem] inked-border overflow-hidden inked-shadow h-64 group">
            <img 
              src="https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1000" 
              alt="Sarawak Jungle"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
              <h3 className="font-headline font-black text-2xl text-white leading-tight">
                Join the Next Expedition
              </h3>
              <p className="text-white/80 text-sm font-bold">
                New quests available in Bako National Park!
              </p>
              <button className="bg-white text-on-surface font-headline font-black px-6 py-3 rounded-xl inked-border bubble-press self-start">
                Learn More
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
