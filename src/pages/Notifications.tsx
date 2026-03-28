import React from 'react';
import { motion } from 'motion/react';
import { School, Briefcase, BookOpen, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: 'New Course Material',
      type: 'Urgent',
      desc: 'Professor Ling just uploaded "Introduction to Data Structures: Module 4" to your learning portal. Grab your digital notebook!',
      time: '2h ago',
      icon: School,
      color: 'bg-primary-container',
      shadow: 'shadow-[8px_8px_0_0_#006289]',
      btnText: 'View Lesson'
    },
    {
      id: 2,
      title: 'Internship Invitation',
      type: 'Invitation',
      desc: "Petronas Sarawak has invited you for a screening interview for the 'Engineering Associate' internship program. Congratulations!",
      time: '5h ago',
      icon: Briefcase,
      color: 'bg-secondary-container',
      shadow: 'shadow-[8px_8px_0_0_#6c5a00]',
      btnText: 'Accept & Schedule'
    },
    {
      id: 3,
      title: 'Library Renewal',
      type: 'Reminder',
      desc: 'Your loan for "The Art of User Experience" is expiring in 2 days. Would you like to renew it for another 2 weeks?',
      time: 'Yesterday',
      icon: BookOpen,
      color: 'bg-tertiary-container',
      shadow: 'shadow-[8px_8px_0_0_#006b1b]',
      btnText: 'Renew Now'
    }
  ];

  return (
    <div className="flex-1 max-w-4xl px-4 lg:px-12 pb-20 mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 mt-8 gap-4">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">What's New!</h1>
          <p className="text-on-surface-variant font-medium text-lg">
            You have <span className="text-primary font-bold">3 unread</span> updates waiting for you.
          </p>
        </div>
        <button className="px-8 py-3 bg-white text-primary border-[3px] border-primary rounded-full font-headline font-bold hover:bg-primary-container/20 transition-all active:scale-95">
          Mark all as read
        </button>
      </header>

      <div className="flex flex-col gap-12">
        {notifications.map((notif, i) => (
          <motion.div 
            key={notif.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-highest rounded-3xl p-8 border-[4px] border-on-surface hover:translate-y-[-4px] transition-transform duration-200 relative"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center border-[3px] border-on-surface shrink-0 -mt-14 md:-mt-14",
                notif.color,
                notif.shadow
              )}>
                <notif.icon size={40} className="text-on-surface" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black font-headline text-on-surface">{notif.title}</h3>
                  <span className="bg-white text-on-surface-variant text-xs font-black px-3 py-1 rounded-full border-2 border-on-surface uppercase">
                    {notif.type}
                  </span>
                </div>
                <p className="text-on-surface-variant mb-6 text-lg leading-relaxed">
                  {notif.desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-2 bg-primary text-on-primary rounded-full font-headline font-bold pressed-shadow border-[3px] border-on-surface">
                    {notif.btnText}
                  </button>
                  <button className="px-6 py-2 bg-white text-on-surface-variant rounded-full font-headline font-bold border-[3px] border-outline transition-colors hover:bg-surface">
                    Dismiss
                  </button>
                </div>
              </div>
              <span className="text-on-surface-variant font-bold text-sm shrink-0">{notif.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Sidebar (Visual only for layout consistency) */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border-[4px] border-on-surface shadow-[12px_12px_0_0_#d8eaff]">
          <div className="w-full h-32 bg-primary-container rounded-2xl overflow-hidden border-[3px] border-on-surface mb-6">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3SkT46sJogBjLBP_N-jkROPYalmecUCFWW84uK1ots5nWOOL1HTT9afclKDZ2m3RBbO9PdB1WKk1er4WTv_VzEfrdCPAd3OCVUnZYZ_-X__bjcd9OaVGDWzpMhAo07VdXEYQQf1BaWRowZ1xhw0cxLoaAsRHmmmp3Yl5ix2Jv-ol2Lq5PZRED-fVKREXwaCv1yiqxG6R6EC8ES8cYNN-x3WcSR2WlBO8xZlZrXDM8S6LijH_d4fvZ8PuSSGs1mt_D3TMh5msgeYDg" 
              alt="Summary"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-headline font-black text-xl mb-3">Today's Summary</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-on-surface-variant">1 Academic Update</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <p className="text-sm font-semibold text-on-surface-variant">1 Career Opportunity</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary-container rounded-3xl p-6 border-[4px] border-on-surface flex flex-col items-center text-center">
          <CheckCircle2 className="text-on-secondary-container mb-4" size={48} />
          <h4 className="font-headline font-black text-xl text-on-secondary-container mb-2">Clean Slate!</h4>
          <p className="text-on-secondary-container font-medium text-sm mb-6">Stay on top of your journey. Keeping notifications clean helps you focus!</p>
          <div className="w-full h-2 bg-on-secondary-container/20 rounded-full overflow-hidden">
            <div className="w-[75%] h-full bg-on-secondary-container rounded-full" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-tighter text-on-secondary-container mt-2">75% Efficiency Score</p>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
export default Notifications;
