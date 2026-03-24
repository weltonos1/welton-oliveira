'use client';

import React, { useState } from 'react';
import { Flag, Trophy, Terminal, Lock, CheckCircle, AlertCircle, Star, ChevronRight, Target } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useProgress } from '../hooks/useProgress';
import SimulatedTerminal from '../components/SimulatedTerminal';

const challenges = [
  {
    id: 'recon-1',
    title: 'Reconhecimento Básico',
    description: 'Use os comandos básicos do Linux para encontrar a flag escondida no sistema de arquivos. Dica: arquivos ocultos começam com um ponto (.).',
    difficulty: 'Iniciante',
    xp: 100,
    flag: 'KALI{h1dd3n_f1l3_f0und}',
    terminalCommands: [
      { cmd: 'ls', output: 'Documents  Downloads  Music  Pictures  Public  Templates  Videos' },
      { cmd: 'ls -a', output: '.  ..  .bash_history  .bashrc  .profile  .secret_flag.txt  Documents  Downloads' },
      { cmd: 'ls -la', output: 'total 32\ndrwxr-xr-x 2 root root 4096 Mar 24 10:00 .\ndrwxr-xr-x 3 root root 4096 Mar 24 10:00 ..\n-rw-r--r-- 1 root root   45 Mar 24 10:01 .secret_flag.txt' },
      { cmd: 'cat .secret_flag.txt', output: 'Parabéns! Aqui está sua flag: KALI{h1dd3n_f1l3_f0und}' },
      { cmd: 'whoami', output: 'root' },
    ]
  },
  {
    id: 'crypto-1',
    title: 'Criptografia 101',
    description: 'Interceptamos uma mensagem codificada. Decodifique a string Base64 para encontrar a flag: S0FMSXtiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59',
    difficulty: 'Iniciante',
    xp: 150,
    flag: 'KALI{b4s364_1s_n0t_3ncrypt10n}',
    terminalCommands: [
      { cmd: 'echo "S0FMSXtiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59" | base64 -d', output: 'KALI{b4s364_1s_n0t_3ncrypt10n}' },
      { cmd: 'base64 -d <<< "S0FMSXtiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59"', output: 'KALI{b4s364_1s_n0t_3ncrypt10n}' },
      { cmd: 'whoami', output: 'root' },
    ]
  },
  {
    id: 'net-1',
    title: 'Análise de Tráfego',
    description: 'Um serviço suspeito está rodando na máquina alvo. Descubra qual porta está aberta e substitua o XXXX na flag: KALI{p0rt_XXXX_0p3n}',
    difficulty: 'Intermediário',
    xp: 200,
    flag: 'KALI{p0rt_8080_0p3n}',
    terminalCommands: [
      { cmd: 'nmap localhost', output: 'Starting Nmap 7.93 ( https://nmap.org )\nNmap scan report for localhost (127.0.0.1)\nHost is up (0.00001s latency).\nNot shown: 999 closed tcp ports (reset)\nPORT     STATE SERVICE\n8080/tcp open  http-proxy\n\nNmap done: 1 IP address (1 host up) scanned in 0.04 seconds' },
      { cmd: 'nmap 127.0.0.1', output: 'Starting Nmap 7.93 ( https://nmap.org )\nNmap scan report for localhost (127.0.0.1)\nHost is up (0.00001s latency).\nNot shown: 999 closed tcp ports (reset)\nPORT     STATE SERVICE\n8080/tcp open  http-proxy\n\nNmap done: 1 IP address (1 host up) scanned in 0.04 seconds' },
      { cmd: 'whoami', output: 'root' },
    ]
  }
];

export default function CTFPage() {
  const { xp, level, completedCTFs, completeCTF, isLoaded } = useProgress();
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

  if (!isLoaded) return null;

  const handleFlagSubmit = (challengeId: string, expectedFlag: string, xpReward: number) => {
    const input = flagInputs[challengeId]?.trim();
    
    if (input === expectedFlag) {
      setSuccesses({ ...successes, [challengeId]: true });
      setErrors({ ...errors, [challengeId]: false });
      completeCTF(challengeId, xpReward);
    } else {
      setErrors({ ...errors, [challengeId]: true });
      setTimeout(() => setErrors({ ...errors, [challengeId]: false }), 3000);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Iniciante': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediário': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Avançado': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-6 md:p-12 relative">
      
      <div className="max-w-6xl mx-auto space-y-12 mt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 border-b border-[#333] pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-[#111] rounded-full border border-[#333] mb-4">
            <Flag className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Capture The Flag (CTF)
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Teste suas habilidades em cenários práticos. Encontre a flag escondida e ganhe XP.
            O formato da flag é sempre <code className="text-[#00ff00] bg-[#111] px-2 py-1 rounded">KALI{'{...}'}</code>.
          </p>
          <div className="pt-6 flex gap-4 justify-center">
             <Link 
              href="/" 
              className="inline-block bg-[#111] text-white border border-[#333] font-bold px-6 py-3 rounded hover:bg-[#222] transition-colors"
            >
              Voltar ao Início
            </Link>
            <Link 
              href="/dashboard" 
              className="inline-block bg-[#111] text-[#00ff00] border border-[#00ff00] font-bold px-6 py-3 rounded hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              Meu Dashboard
            </Link>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Desafios Disponíveis
            </h2>
            
            {challenges.map((challenge) => {
              const isCompleted = completedCTFs.includes(challenge.id);
              const isActive = activeChallenge === challenge.id;
              
              return (
                <button
                  key={challenge.id}
                  onClick={() => setActiveChallenge(challenge.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'bg-[#1a1a1a] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                      : isCompleted
                        ? 'bg-[#0a0a0a] border-[#00ff00]/30 hover:border-[#00ff00]/60'
                        : 'bg-[#111] border-[#333] hover:border-[#555]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold ${isCompleted ? 'text-[#00ff00]' : 'text-white'}`}>
                      {challenge.title}
                    </h3>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-[#00ff00]" />}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {challenge.xp} XP
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Details */}
          <div className="lg:col-span-8">
            {activeChallenge ? (
              <AnimatePresence mode="wait">
                {challenges.filter(c => c.id === activeChallenge).map(challenge => {
                  const isCompleted = completedCTFs.includes(challenge.id) || successes[challenge.id];
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[#111] border border-[#333] rounded-xl overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 border-b border-[#222]">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty}
                              </span>
                              <span className="text-sm text-yellow-500 font-bold flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                Recompensa: {challenge.xp} XP
                              </span>
                            </div>
                          </div>
                          {isCompleted && (
                            <div className="bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Resolvido
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                          {challenge.description}
                        </p>
                      </div>

                      <div className="p-6 bg-[#0a0a0a] flex-grow">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Terminal className="w-4 h-4" />
                          Terminal do Desafio
                        </h3>
                        <SimulatedTerminal commands={challenge.terminalCommands} />
                      </div>

                      <div className="p-6 bg-[#1a1a1a] border-t border-[#222]">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Flag className="w-4 h-4" />
                          Submeter Flag
                        </h3>
                        
                        {isCompleted ? (
                          <div className="bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg p-4 flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-[#00ff00]" />
                            <div>
                              <p className="text-[#00ff00] font-bold">Desafio Concluído!</p>
                              <p className="text-sm text-[#00ff00]/70">Você ganhou {challenge.xp} XP por esta flag.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-4">
                            <input
                              type="text"
                              placeholder="KALI{...}"
                              value={flagInputs[challenge.id] || ''}
                              onChange={(e) => setFlagInputs({ ...flagInputs, [challenge.id]: e.target.value })}
                              className={`flex-1 bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                                errors[challenge.id] ? 'border-red-500 focus:border-red-500' : 'border-[#333] focus:border-red-500'
                              }`}
                            />
                            <button
                              onClick={() => handleFlagSubmit(challenge.id, challenge.flag, challenge.xp)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              Enviar <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {errors[challenge.id] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-3 flex items-center gap-1.5"
                          >
                            <AlertCircle className="w-4 h-4" /> Flag incorreta. Tente novamente.
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="bg-[#111] border border-[#333] border-dashed rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <Target className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum Desafio Selecionado</h3>
                <p>Selecione um desafio na lista ao lado para começar a hackear.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
