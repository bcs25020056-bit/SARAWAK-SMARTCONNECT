import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { School, Briefcase, BookOpen, CheckCircle2, Loader2, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  read: boolean;
  createdAt: any;
}

const Notifications = () => {
  const { user } = useFirebase();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty && !loading) {
        // Seed initial notifications ONLY if we are sure it's actually empty and not just loading
        const seedInitial = async () => {
          const initialNotifs = [
            {
              userId: user.uid,
              title: 'New Course Material',
              message: 'Professor Ling just uploaded "Introduction to Data Structures: Module 4" to your learning portal. Grab your digital notebook!',
              type: 'info',
              read: false,
              createdAt: serverTimestamp()
            },
            {
              userId: user.uid,
              title: 'Internship Invitation',
              message: "Petronas Sarawak has invited you for a screening interview for the 'Engineering Associate' internship program. Congratulations!",
              type: 'alert',
              read: false,
              createdAt: serverTimestamp()
            },
            {
              userId: user.uid,
              title: 'Welcome to Smart Connect!',
              message: 'Your journey to empower Sarawak starts here. Explore jobs, scholarships, and more!',
              type: 'success',
              read: false,
              createdAt: serverTimestamp()
            }
          ];

          const notifsCol = collection(db, 'notifications');
          // Use a batch or at least don't let snapshot trigger re-render in a confusing way
          // Actually, adding them will naturally trigger the snapshot else block
          for (const notif of initialNotifs) {
            await addDoc(notifsCol, notif);
          }
        };
        seedInitial();
      } else {
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notifications');
    }
  };

  const dismiss = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notifications/${id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-secondary-container';
      case 'success': return 'bg-tertiary-container';
      default: return 'bg-primary-container';
    }
  };

  const getShadow = (type: string) => {
    switch (type) {
      case 'alert': return 'shadow-[8px_8px_0_0_#6c5a00]';
      case 'success': return 'shadow-[8px_8px_0_0_#006b1b]';
      default: return 'shadow-[8px_8px_0_0_#006289]';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 max-w-4xl px-4 lg:px-12 pb-20 mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 mt-8 gap-4">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">What's New!</h1>
          <p className="text-on-surface-variant font-medium text-lg">
            You have <span className="text-primary font-bold">{unreadCount} unread</span> updates waiting for you.
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-8 py-3 bg-white text-primary border-[3px] border-primary rounded-full font-headline font-bold hover:bg-primary-container/20 transition-all active:scale-95"
        >
          Mark all as read
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center inked-border inked-shadow">
              <p className="font-bold text-on-surface-variant text-xl">All caught up! No new notifications.</p>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const Icon = getIcon(notif.type);
              return (
                <motion.div 
                  key={notif.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "bg-surface-container-highest rounded-3xl p-8 border-[4px] border-on-surface relative",
                    !notif.read && "border-primary"
                  )}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center border-[3px] border-on-surface shrink-0 -mt-14 md:-mt-14",
                      getColor(notif.type),
                      getShadow(notif.type)
                    )}>
                      <Icon size={40} className="text-on-surface" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black font-headline text-on-surface">{notif.title}</h3>
                        <span className="bg-white text-on-surface-variant text-xs font-black px-3 py-1 rounded-full border-2 border-on-surface uppercase">
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-on-surface-variant mb-6 text-lg leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {!notif.read && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="px-6 py-2 bg-primary text-on-primary rounded-full font-headline font-bold pressed-shadow border-[3px] border-on-surface"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button 
                          onClick={() => dismiss(notif.id)}
                          className="px-6 py-2 bg-white text-on-surface-variant rounded-full font-headline font-bold border-[3px] border-outline transition-colors hover:bg-surface"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-bold text-sm shrink-0">
                      {notif.createdAt ? new Date(notif.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};

export default Notifications;
