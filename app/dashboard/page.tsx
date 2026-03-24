'use client';

import React from 'react';
import { Trophy, Star, Shield, Target, Zap, Award, Activity, CheckCircle, Flag } from 'lucide-react';
import Link from 'next/link';
import { useProgress } from '../hooks/useProgress';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const { xp, level, progressPercent, completedModules, completedCTFs, isLoaded } = useProgress();

  if (!isLoaded) return null;

  const badges = [
    { id: 'first_blood', name: 'First Blood', desc: 'Completou o primeiro módulo', icon: <Target className="w-6 h-6" />, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', earned: completedModules.length >= 1 },
    { id: 'apprentice', name: 'Aprendiz', desc: 'Alcançou o Nível 2', icon: <BookOpenIcon className="w-6 h-6" />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', earned: level >= 2 },
    { id: 'hacker', name: 'Hacker', desc: 'Alcançou o Nível 5', icon: <TerminalIcon className="w-6 h-6" />, color: 'text-[#00ff00]', bg: 'bg-[#00ff00]/10', border: 'border-[#00ff00]/20', earned: level >= 5 },
    { id: 'master', name: 'Mestre', desc: 'Completou 10 módulos', icon: <Shield className="w-6 h-6" />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', earned: completedModules.length >= 10 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#333] pb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Activity className="w-8 h-8 text-[#00ff00]" />
              Painel do Aluno
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Acompanhe seu progresso, XP e conquistas.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/ctf" 
              className="bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded border border-red-500/30 transition-colors flex items-center gap-2"
            >
              <Flag className="w-4 h-4" /> Desafios CTF
            </Link>
            <Link 
              href="/curriculum" 
              className="bg-[#111] hover:bg-[#222] text-white px-4 py-2 rounded border border-[#333] transition-colors"
            >
              Continuar Aprendendo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Level Card */}
          <div className="col-span-1 md:col-span-2 bg-[#111] border border-[#333] rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Trophy className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#00ff00]">{level}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nível {level}</h2>
                  <p className="text-gray-400">Hacker em Treinamento</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progresso para o Nível {level + 1}</span>
                  <span className="text-[#00ff00] font-bold">{xp} / {level * 100} XP</span>
                </div>
                <div className="h-3 w-full bg-[#222] rounded-full overflow-hidden border border-[#333]">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-600 to-[#00ff00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-span-1 bg-[#111] border border-[#333] rounded-xl p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Módulos Concluídos</p>
                  <p className="text-2xl font-bold text-white">{completedModules.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  <Flag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Flags Capturadas</p>
                  <p className="text-2xl font-bold text-white">{completedCTFs?.length || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de XP</p>
                  <p className="text-2xl font-bold text-white">{xp}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Badges Section */}
        <div className="bg-[#111] border border-[#333] rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Conquistas (Badges)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`p-4 rounded-lg border flex flex-col items-center text-center transition-all ${
                  badge.earned 
                    ? `${badge.bg} ${badge.border}` 
                    : 'bg-[#1a1a1a] border-[#333] opacity-50 grayscale'
                }`}
              >
                <div className={`p-3 rounded-full mb-3 ${badge.earned ? badge.color : 'text-gray-500'}`}>
                  {badge.icon}
                </div>
                <h3 className={`font-bold mb-1 ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-gray-400">{badge.desc}</p>
                
                {!badge.earned && (
                  <div className="mt-3 text-[10px] uppercase tracking-wider text-gray-600 font-bold">
                    Bloqueado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper icons
function BookOpenIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}

function TerminalIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
}
