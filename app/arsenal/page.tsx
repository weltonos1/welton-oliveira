'use client';

import React, { useState, useMemo } from 'react';
import { Terminal, Shield, Target, Zap, Search, Filter, Code, Lightbulb, Activity, Wrench } from 'lucide-react';
import Link from 'next/link';
import { arsenalData, Difficulty, Phase } from './data';
import { motion, AnimatePresence } from 'motion/react';

export default function ArsenalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Todos'>('Todos');
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'Todas'>('Todas');

  const filteredTools = useMemo(() => {
    return arsenalData.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tool.strategy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'Todos' || tool.difficulty === selectedDifficulty;
      const matchesPhase = selectedPhase === 'Todas' || tool.phase === selectedPhase;
      
      return matchesSearch && matchesDifficulty && matchesPhase;
    });
  }, [searchQuery, selectedDifficulty, selectedPhase]);

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case 'Iniciante': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediário': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Avançado': return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  const getPhaseIcon = (phase: Phase) => {
    switch(phase) {
      case 'Inteligência': return <Target className="w-4 h-4" />;
      case 'Acesso': return <Zap className="w-4 h-4" />;
      case 'Manutenção': return <Activity className="w-4 h-4" />;
      case 'Limpeza e Relatório': return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 border-b border-[#333] pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-[#111] rounded-full border border-[#333] mb-4">
            <Wrench className="w-12 h-12 text-[#00ff00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Arsenal Hacker: Guia Mestre
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            As 50 ferramentas mais utilizadas no Kali Linux por Pentesters Seniores. 
            Organizadas por fase de ataque e nível de dificuldade.
          </p>
          <div className="pt-6 flex gap-4 justify-center">
             <Link 
              href="/" 
              className="inline-block bg-[#111] text-white border border-[#333] font-bold px-6 py-3 rounded hover:bg-[#222] transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10 shadow-2xl shadow-black/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar ferramenta, categoria ou estratégia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#00ff00] transition-colors"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-gray-500 hidden md:block" />
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="bg-[#0a0a0a] border border-[#333] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#00ff00] w-full md:w-auto"
              >
                <option value="Todos">Todas as Dificuldades</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value as any)}
                className="bg-[#0a0a0a] border border-[#333] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#00ff00] w-full md:w-auto"
              >
                <option value="Todas">Todas as Fases</option>
                <option value="Inteligência">Fase 1: Inteligência</option>
                <option value="Acesso">Fase 2: Acesso</option>
                <option value="Manutenção">Fase 3: Manutenção</option>
                <option value="Limpeza e Relatório">Fase 4: Limpeza/Relatório</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Mostrando {filteredTools.length} de {arsenalData.length} ferramentas
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTools.map((tool) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={tool.id} 
                className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#444] transition-colors flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-[#222] flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#00ff00]" />
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{tool.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getDifficultyColor(tool.difficulty)}`}>
                    {tool.difficulty}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow flex flex-col gap-4">
                  {/* Phase Badge */}
                  <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded w-fit">
                    {getPhaseIcon(tool.phase)}
                    <span className="uppercase tracking-wider font-semibold">{tool.phase}</span>
                  </div>

                  {/* Strategy */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">A Estratégia (O Porquê)</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {tool.strategy}
                    </p>
                  </div>

                  {/* Command */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> O Comando (O Como)
                    </h4>
                    <div className="bg-black border border-[#333] rounded-md p-3 overflow-x-auto">
                      <code className="text-sm text-[#00ff00] whitespace-nowrap">
                        {tool.command}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Card Footer (Pro Tip) */}
                <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] p-4 border-t border-[#222]">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 italic">
                      <strong className="text-gray-300 not-italic">Dica Pro:</strong> {tool.proTip}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTools.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-[#333] rounded-xl">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Nenhuma ferramenta encontrada com esses filtros.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedDifficulty('Todos'); setSelectedPhase('Todas'); }}
                className="mt-4 text-[#00ff00] hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
