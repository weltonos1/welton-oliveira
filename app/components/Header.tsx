'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { Terminal, LogOut, LogIn, Star } from 'lucide-react';

export default function Header() {
  const { user, login, logout, loading } = useAuth();
  const { xp, level, isLoaded } = useProgress();

  return (
    <header className="bg-[#111] border-b border-[#333] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-[#00ff00] transition-colors">
        <Terminal className="w-6 h-6 text-[#00ff00]" />
        <span className="hidden sm:inline">KaliAcademy</span>
      </Link>

      <div className="flex items-center gap-4">
        {isLoaded && (
          <Link href="/dashboard" className="hidden md:flex items-center gap-3 bg-[#0a0a0a] border border-[#333] rounded-full px-4 py-1.5 hover:border-[#00ff00] transition-colors cursor-pointer">
            <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
              <Star className="w-3 h-3 fill-yellow-500" />
              {xp} XP
            </div>
            <div className="w-px h-3 bg-[#333]"></div>
            <div className="text-white font-bold text-xs">
              Nível {level}
            </div>
          </Link>
        )}

        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.photoURL && (
                    <Image src={user.photoURL} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full border border-[#333]" referrerPolicy="no-referrer" />
                  )}
                  <span className="text-sm text-gray-300 hidden md:block">{user.displayName || user.email}</span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 px-4 py-2 rounded font-bold hover:bg-[#00ff00]/20 transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
