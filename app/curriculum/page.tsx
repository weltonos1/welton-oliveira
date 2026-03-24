'use client';

import React, { useState } from 'react';
import { Terminal, Shield, Target, Zap, BookOpen, CheckCircle, Lock, Trophy, ChevronDown, ChevronUp, Code, Star } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { curriculum } from './data';
import { useProgress } from '../hooks/useProgress';
import SimulatedTerminal from '../components/SimulatedTerminal';

export default function Curriculum() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const { xp, level, progressPercent, completedModules, completeModule, isLoaded } = useProgress();

  const toggleTopic = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  const handleComplete = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    completeModule(topicId, 50); // 50 XP per topic
  };

  // Simulated commands for the terminal demo
  const terminalCommands = [
    { cmd: 'nmap -sV 192.168.1.1', output: 'Starting Nmap 7.93 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0012s latency).\nNot shown: 997 closed tcp ports (reset)\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.4p1 Debian 5 (protocol 2.0)\n80/tcp open  http    Apache httpd 2.4.51 ((Debian))\n443/tcp open  ssl/http Apache httpd 2.4.51 ((Debian))\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 6.42 seconds' },
    { cmd: 'whoami', output: 'root' },
    { cmd: 'ls -la', output: 'total 12\ndrwxr-xr-x 2 root root 4096 Mar 24 10:00 .\ndrwxr-xr-x 3 root root 4096 Mar 24 10:00 ..\n-rw-r--r-- 1 root root   45 Mar 24 10:01 flag.txt' },
    { cmd: 'cat flag.txt', output: 'KALI{w3lc0m3_t0_th3_m4tr1x}' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-6 md:p-12 relative">
      
      {/* Floating Progress Bar */}
      {isLoaded && (
        <div className="fixed top-0 left-0 w-full h-1 bg-[#222] z-50">
          <motion.div 
            className="h-full bg-[#00ff00]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-12 mt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 border-b border-[#333] pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-[#111] rounded-full border border-[#333] mb-4">
            <Trophy className="w-12 h-12 text-[#00ff00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Kali Linux: Do Zero ao Advanced Pentester
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A grade curricular definitiva para forjar profissionais de cibersegurança. 
            Do básico da linha de comando até a invasão de redes corporativas complexas.
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

        {/* Interactive Terminal Demo */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-[#00ff00]" />
            <h2 className="text-2xl font-bold text-white">Prática: Terminal Simulado</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Antes de começar, teste seus conhecimentos no terminal abaixo. Tente digitar <code className="text-[#00ff00] bg-black px-1.5 py-0.5 rounded">whoami</code>, <code className="text-[#00ff00] bg-black px-1.5 py-0.5 rounded">ls -la</code>, <code className="text-[#00ff00] bg-black px-1.5 py-0.5 rounded">cat flag.txt</code> ou <code className="text-[#00ff00] bg-black px-1.5 py-0.5 rounded">nmap -sV 192.168.1.1</code>.
          </p>
          <SimulatedTerminal commands={terminalCommands} />
        </div>

        {/* Curriculum Levels */}
        <div className="space-y-16">
          {curriculum.map((levelData, index) => (
            <div key={index} className="relative">
              {/* Level Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
                  {levelData.icon}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{levelData.level}</h2>
                  <p className="text-gray-400 mt-1">{levelData.description}</p>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {levelData.modules.map((module, mIndex) => (
                  <div key={mIndex} className="bg-[#111] border border-[#333] rounded-lg p-6 hover:border-[#555] transition-colors">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-[#00ff00] shrink-0 mt-0.5" />
                      {module.title}
                    </h3>
                    <ul className="space-y-3">
                      {module.topics.map((topic, tIndex) => {
                        const topicId = `${index}-${mIndex}-${tIndex}`;
                        const isExpanded = expandedTopic === topicId;
                        const isCompleted = completedModules.includes(topicId);
                        
                        return (
                          <li key={tIndex} className={`border rounded-lg overflow-hidden transition-colors ${isCompleted ? 'border-[#00ff00]/30 bg-[#00ff00]/5' : 'border-[#222] bg-[#0a0a0a]'}`}>
                            <button 
                              onClick={() => toggleTopic(topicId)}
                              className="w-full flex items-start justify-between p-3 hover:bg-[#151515] transition-colors text-left"
                            >
                              <div className="flex items-start gap-2 pr-4">
                                <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isCompleted ? 'text-[#00ff00]' : 'text-gray-500'}`} />
                                <span className={`text-sm font-medium ${isCompleted ? 'text-[#00ff00]' : (isExpanded ? 'text-white' : 'text-gray-300')}`}>
                                  {topic.title}
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                              )}
                            </button>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-[#222]"
                                >
                                  <div className="p-4 space-y-4">
                                    <div className="text-sm text-gray-400 leading-relaxed">
                                      {topic.explanation}
                                    </div>
                                    
                                    {topic.code && (
                                      <div className="bg-black border border-[#333] rounded-md overflow-hidden">
                                        <div className="bg-[#1a1a1a] px-3 py-1.5 border-b border-[#333] flex items-center gap-2">
                                          <Code className="w-3 h-3 text-gray-500" />
                                          <span className="text-xs text-gray-500 font-mono">Terminal</span>
                                        </div>
                                        <pre className="p-3 text-xs text-[#00ff00] overflow-x-auto">
                                          <code>{topic.code}</code>
                                        </pre>
                                      </div>
                                    )}

                                    <div className="pt-2 flex justify-end">
                                      <button
                                        onClick={(e) => handleComplete(topicId, e)}
                                        disabled={isCompleted}
                                        className={`text-xs font-bold px-4 py-2 rounded transition-colors ${
                                          isCompleted 
                                            ? 'bg-[#00ff00]/20 text-[#00ff00] cursor-default' 
                                            : 'bg-[#111] border border-[#333] text-white hover:border-[#00ff00] hover:text-[#00ff00]'
                                        }`}
                                      >
                                        {isCompleted ? '✓ Concluído' : 'Marcar como Concluído (+50 XP)'}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Practical Lab */}
              <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-[#333] border-l-4 border-l-[#00ff00] rounded-lg p-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-[#00ff00]" />
                  {levelData.lab.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {levelData.lab.description}
                </p>
              </div>
              
              {/* Connector Line (except last) */}
              {index < curriculum.length - 1 && (
                <div className="absolute left-7 top-full h-16 w-px bg-gradient-to-b from-[#333] to-transparent -z-10 hidden md:block"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-12 border-t border-[#333]">
          <h2 className="text-2xl font-bold text-white mb-4">Pronto para começar a jornada?</h2>
          <p className="text-gray-400 mb-8">Os laboratórios práticos requerem um container ativo. Acesse o Mission Control para gerenciar os recursos.</p>
        </div>

      </div>
    </div>
  );
}
