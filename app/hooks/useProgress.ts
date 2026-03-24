'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [xp, setXp] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedCTFs, setCompletedCTFs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Fallback to localStorage if not logged in
      Promise.resolve().then(() => {
        const savedXp = localStorage.getItem('kali_xp');
        const savedModules = localStorage.getItem('kali_modules');
        const savedCTFs = localStorage.getItem('kali_ctfs');
        
        if (savedXp) setXp(parseInt(savedXp));
        if (savedModules) setCompletedModules(JSON.parse(savedModules));
        if (savedCTFs) setCompletedCTFs(JSON.parse(savedCTFs));
        
        setIsLoaded(true);
      });
      return;
    }

    // Sync with Firestore
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setXp(data.xp || 0);
        setCompletedModules(data.completedModules || []);
        setCompletedCTFs(data.completedCTFs || []);
        setIsLoaded(true);
      }
    }, (error) => {
      console.error("Error fetching progress:", error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const completeModule = async (moduleId: string, gainedXp: number) => {
    if (completedModules.includes(moduleId)) return;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          completedModules: arrayUnion(moduleId),
          xp: increment(gainedXp)
        });
      } catch (error) {
        console.error("Error updating module progress:", error);
      }
    } else {
      const newModules = [...completedModules, moduleId];
      const newXp = xp + gainedXp;
      
      setCompletedModules(newModules);
      setXp(newXp);
      
      localStorage.setItem('kali_modules', JSON.stringify(newModules));
      localStorage.setItem('kali_xp', newXp.toString());
    }
  };

  const completeCTF = async (ctfId: string, gainedXp: number) => {
    if (completedCTFs.includes(ctfId)) return;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          completedCTFs: arrayUnion(ctfId),
          xp: increment(gainedXp)
        });
      } catch (error) {
        console.error("Error updating CTF progress:", error);
      }
    } else {
      const newCTFs = [...completedCTFs, ctfId];
      const newXp = xp + gainedXp;
      
      setCompletedCTFs(newCTFs);
      setXp(newXp);
      
      localStorage.setItem('kali_ctfs', JSON.stringify(newCTFs));
      localStorage.setItem('kali_xp', newXp.toString());
    }
  };

  const getLevel = () => Math.floor(xp / 100) + 1;
  const getNextLevelXp = () => getLevel() * 100;
  const getProgressPercent = () => ((xp % 100) / 100) * 100;

  return { 
    xp, 
    level: getLevel(),
    nextLevelXp: getNextLevelXp(),
    progressPercent: getProgressPercent(),
    completedModules, 
    completedCTFs,
    completeModule,
    completeCTF,
    isLoaded
  };
}
