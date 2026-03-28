import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Target, Zap, Shield, Award, CheckCircle2, Loader2 } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

const Achievements = () => {
  const { profile, loading } = useFirebase();

  const achievements = [
    {
      id: 1,
      title: 'First Step',
      desc: 'Complete your profile information.',
      icon: Target,
      color: 'bg-primary-container',
      shadow: 'shadow-[8px_8px_0_0_#006289]',
      completed: !!profile?.displayName && !!profile?.bio
    },
    {
      id: 2,
      title: 'Job Seeker',
      desc: 'Apply for your first internship or job.',
      icon: Briefcase,
      color: 'bg-secondary-container',
      shadow: 'shadow-[8px_8px_0_0_#6c5a00]',
      completed: profile?.xp > 100 // Just a placeholder check
    },
    {
      id: 3,
      title: 'Knowledge Hunter',
      desc: 'Complete 3 course modules.',
      icon: Zap,
      color: 'bg-tertiary-container',
      shadow: 'shadow-[8px_8px_0_0_#006b1b]',
      completed: profile?.level > 2
    },
    {
      id: 4,
      title: 'Community Pillar',
      desc: 'Help 5 other students with their questions.',
      icon: Shield,
      color: 'bg-primary-container',
      shadow: 'shadow-[8px_8px_0_0_#006289]',
      completed: false
    },
    {
      id: 5,
      title: 'Sarawak Champion',
      desc: 'Participate in a local community project.',
      icon: Trophy,
      color: 'bg-secondary-container',
      shadow: 'shadow-[8px_8px_0_0_#6c5a00]',
      completed: false
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const completedCount = achievements.filter(a => a.completed).length;

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Achievements</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
            Track your progress and celebrate your milestones as you grow within the Sarawak ecosystem.
          </p>
          <div className="bg-white p-6 rounded-3xl inked-border flex items-center gap-6">
            <div className="w-16 h-16 bg-primary-container rounded-2xl inked-border flex items-center justify-center">
              <Award size={32} className="text-on-surface" />
            </div>
            <div>
              <p className="text-3xl font-black font-headline">{completedCount}/{achievements.length}</p>
              <p className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Milestones Unlocked</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {achievements.map((achievement, i) => (
          <motion.div 
            key={achievement.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "bg-white rounded-3xl inked-border p-8 relative group transition-all",
              achievement.completed ? "opacity-100" : "opacity-60 grayscale hover:grayscale-0"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center border-[3px] border-on-surface shrink-0 -mt-14 mb-6 group-hover:rotate-6 transition-transform",
              achievement.color,
              achievement.shadow
            )}>
              <achievement.icon size={40} className="text-on-surface" />
            </div>
            
            <h3 className="text-2xl font-black font-headline mb-2">{achievement.title}</h3>
            <p className="text-on-surface-variant font-medium mb-6">{achievement.desc}</p>
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "px-4 py-1 rounded-full border-2 border-on-surface text-xs font-black uppercase",
                achievement.completed ? "bg-tertiary-container text-on-tertiary-container" : "bg-surface-container-highest text-on-surface-variant"
              )}>
                {achievement.completed ? 'Completed' : 'Locked'}
              </span>
              {achievement.completed && <CheckCircle2 className="text-tertiary" size={24} />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { Briefcase } from 'lucide-react';
export default Achievements;
