'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Server, Activity, Trash2, ShieldAlert, Terminal, RefreshCw, Cpu, MemoryStick, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MetricData {
  time: string;
  cpu: number;
  memory: number;
}

interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  studentId: string;
}

export default function AdminDashboard() {
  const [metricsHistory, setMetricsHistory] = useState<MetricData[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({ cpu: 0, memory: 0, totalMem: 0 });
  const [isKilling, setIsKilling] = useState<string | null>(null);
  const [isKillingAll, setIsKillingAll] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMock, setIsMock] = useState(false);

  // Alert states
  const [cpuHighSince, setCpuHighSince] = useState<number | null>(null);
  const [memHighSince, setMemHighSince] = useState<number | null>(null);
  const [showCpuAlert, setShowCpuAlert] = useState(false);
  const [showMemAlert, setShowMemAlert] = useState(false);
  const [cpuAlertDismissed, setCpuAlertDismissed] = useState(false);
  const [memAlertDismissed, setMemAlertDismissed] = useState(false);

  // Container details state
  const [expandedContainer, setExpandedContainer] = useState<string | null>(null);
  const [containerDetails, setContainerDetails] = useState<Record<string, any>>({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Activity tracking for stuck containers
  const [containerActivity, setContainerActivity] = useState<Record<string, { lastUpdate: number, status: string, lastLogs?: string }>>({});
  const [now, setNow] = useState(Date.now());

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      
      if (data._mock) setIsMock(true);

      const newMetric = {
        time: new Date(data.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.round(data.cpu),
        memory: Math.round(data.memory.usagePercent),
      };

      setCurrentMetrics({
        cpu: newMetric.cpu,
        memory: newMetric.memory,
        totalMem: Math.round(data.memory.total / (1024 * 1024 * 1024)), // GB
      });

      setMetricsHistory(prev => {
        const history = [...prev, newMetric];
        if (history.length > 30) history.shift(); // Keep last 30 data points
        return history;
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics', error);
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/containers');
      const data = await res.json();
      setContainers(data.containers || []);
      if (data._mock) setIsMock(true);

      const currentTime = Date.now();
      setContainerActivity(prev => {
        const next = { ...prev };
        (data.containers || []).forEach((c: Container) => {
          // Check if status changed OR if we have new logs (if we have details for this container)
          const currentDetails = containerDetails[c.id];
          const hasNewLogs = currentDetails && currentDetails.logs && 
            (!next[c.id] || next[c.id].lastLogs !== currentDetails.logs);

          if (!next[c.id] || next[c.id].status !== c.status || hasNewLogs) {
            next[c.id] = { 
              lastUpdate: currentTime, 
              status: c.status,
              lastLogs: currentDetails?.logs || ''
            };
          }
        });
        return next;
      });
    } catch (error) {
      console.error('Failed to fetch containers', error);
    }
  }, [containerDetails]);

  useEffect(() => {
    fetchMetrics();
    fetchContainers();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchContainers();
      setNow(Date.now());
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchMetrics, fetchContainers]);

  useEffect(() => {
    const now = Date.now();
    
    // CPU Alert Logic (> 85% for 10s)
    if (currentMetrics.cpu > 85) {
      if (cpuHighSince === null) {
        setCpuHighSince(now);
      } else if (now - cpuHighSince >= 10000 && !cpuAlertDismissed) {
        setShowCpuAlert(true);
      }
    } else {
      setCpuHighSince(null);
      setShowCpuAlert(false);
      setCpuAlertDismissed(false);
    }

    // Memory Alert Logic (> 90% for 10s)
    if (currentMetrics.memory > 90) {
      if (memHighSince === null) {
        setMemHighSince(now);
      } else if (now - memHighSince >= 10000 && !memAlertDismissed) {
        setShowMemAlert(true);
      }
    } else {
      setMemHighSince(null);
      setShowMemAlert(false);
      setMemAlertDismissed(false);
    }
  }, [currentMetrics.cpu, currentMetrics.memory, cpuHighSince, memHighSince, lastUpdated, cpuAlertDismissed, memAlertDismissed]);

  const killContainer = async (id: string) => {
    if (!confirm(`Tem certeza que deseja encerrar o container ${id}?`)) return;
    setIsKilling(id);
    try {
      await fetch(`/api/admin/terminate/${id}`, { method: 'POST' });
      await fetchContainers();
    } catch (error) {
      console.error('Failed to kill container', error);
    } finally {
      setIsKilling(null);
    }
  };

  const killAllContainers = async () => {
    if (!confirm('ALERTA DE EMERGÊNCIA: Tem certeza que deseja encerrar TODOS os containers ativos? Isso desconectará todos os alunos.')) return;
    setIsKillingAll(true);
    try {
      await fetch('/api/admin/terminate-all', { method: 'POST' });
      await fetchContainers();
    } catch (error) {
      console.error('Failed to kill all containers', error);
    } finally {
      setIsKillingAll(false);
    }
  };

  const fetchContainerDetails = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/containers/${id}`);
      const data = await res.json();
      setContainerDetails(prev => ({ ...prev, [id]: data }));
    } catch (error) {
      console.error('Failed to fetch container details', error);
    }
  }, []);

  const toggleContainer = async (id: string) => {
    if (expandedContainer === id) {
      setExpandedContainer(null);
      return;
    }
    setExpandedContainer(id);
    if (!containerDetails[id]) {
      setIsLoadingDetails(true);
      await fetchContainerDetails(id);
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expandedContainer) {
      interval = setInterval(() => {
        fetchContainerDetails(expandedContainer);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expandedContainer, fetchContainerDetails]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff00] font-mono p-6">
      {/* Floating Alerts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80">
        <AnimatePresence>
          {showCpuAlert && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-red-900/90 border border-red-500 text-red-100 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 backdrop-blur-sm"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">ALERTA: Alto uso de CPU detectado!</p>
              </div>
              <button 
                onClick={() => { setShowCpuAlert(false); setCpuAlertDismissed(true); }} 
                className="text-red-400 hover:text-red-200 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          {showMemAlert && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-yellow-900/90 border border-yellow-500 text-yellow-100 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 backdrop-blur-sm"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">ATENÇÃO: Alto uso de memória detectado!</p>
              </div>
              <button 
                onClick={() => { setShowMemAlert(false); setMemAlertDismissed(true); }} 
                className="text-yellow-400 hover:text-yellow-200 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#333] pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Terminal className="w-8 h-8 text-[#00ff00]" />
              KaliAcademy Mission Control
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Monitoramento de Servidor & Gestão de Containers
              {isMock && <span className="ml-2 text-yellow-500">(Modo Simulação)</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Atualizado: {lastUpdated.toLocaleTimeString()}
            </div>
            <button 
              onClick={killAllContainers}
              disabled={isKillingAll || containers.length === 0}
              className="bg-red-900/50 hover:bg-red-600 text-red-100 px-4 py-2 rounded border border-red-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              {isKillingAll ? 'Encerrando...' : 'KILL ALL CONTAINERS'}
            </button>
          </div>
        </header>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 rounded-full text-blue-400">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Containers Ativos</p>
              <p className="text-3xl font-bold text-white">{containers.length}</p>
            </div>
          </div>

          <div className={`bg-[#111] border rounded-lg p-6 flex items-center gap-4 ${currentMetrics.cpu > 80 ? 'border-red-500' : 'border-[#333]'}`}>
            <div className={`p-3 rounded-full ${currentMetrics.cpu > 80 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Uso de CPU</p>
              <p className="text-3xl font-bold text-white">{currentMetrics.cpu}%</p>
            </div>
          </div>

          <div className={`bg-[#111] border rounded-lg p-6 flex items-center gap-4 ${currentMetrics.memory > 85 ? 'border-yellow-500' : 'border-[#333]'}`}>
            <div className={`p-3 rounded-full ${currentMetrics.memory > 85 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-purple-900/30 text-purple-400'}`}>
              <MemoryStick className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Uso de RAM ({currentMetrics.totalMem}GB Total)</p>
              <p className="text-3xl font-bold text-white">{currentMetrics.memory}%</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-blue-400" />
            Uso de Recursos (Últimos 60s)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#00ff00" fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="memory" name="RAM %" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMem)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Containers Table */}
        <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#333]">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
              <Server className="w-5 h-5 text-purple-400" />
              Containers Ativos ({containers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium w-10"></th>
                  <th className="p-4 font-medium">ID do Aluno</th>
                  <th className="p-4 font-medium">Container ID</th>
                  <th className="p-4 font-medium">Imagem</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Tempo de Vida</th>
                  <th className="p-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {containers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Nenhum container ativo no momento.
                    </td>
                  </tr>
                ) : (
                  containers.map((container) => {
                    const activity = containerActivity[container.id];
                    const isStuck = activity && (now - activity.lastUpdate > 30000) && container.state === 'running';

                    return (
                    <React.Fragment key={container.id}>
                      <tr 
                        className={`transition-colors cursor-pointer ${
                          isStuck 
                            ? 'bg-red-900/20 border-l-2 border-red-500 hover:bg-red-900/30 animate-pulse' 
                            : expandedContainer === container.id 
                              ? 'bg-[#1a1a1a]' 
                              : 'hover:bg-[#1a1a1a]'
                        }`}
                        onClick={() => toggleContainer(container.id)}
                      >
                        <td className="p-4 text-gray-500">
                          {expandedContainer === container.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                            {container.studentId}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 text-sm font-mono">{container.id.substring(0, 12)}</td>
                        <td className="p-4 text-gray-400 text-sm">{container.image}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isStuck ? (
                              <span title="Container não responde há mais de 30s">
                                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                              </span>
                            ) : (
                              <span className={`w-2 h-2 rounded-full ${container.state === 'running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                            )}
                            <span className={`text-sm capitalize ${isStuck ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                              {isStuck ? 'Travado' : container.state}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">{container.status.replace('Up ', '')}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleContainer(container.id); }}
                              className="bg-blue-900/50 hover:bg-blue-600 text-blue-100 px-4 py-2 rounded border border-blue-700 flex items-center gap-2 transition-colors"
                              title="Ver Logs"
                            >
                              <Terminal className="w-4 h-4" />
                              Logs
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); killContainer(container.id); }}
                              disabled={isKilling === container.id}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              {isKilling === container.id ? 'Encerrando...' : 'Encerrar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedContainer === container.id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#0f0f0f] border-b border-[#222]"
                          >
                            <td colSpan={7} className="p-0">
                              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {isLoadingDetails && !containerDetails[container.id] ? (
                                  <div className="col-span-3 flex items-center justify-center p-8 text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando detalhes...
                                  </div>
                                ) : containerDetails[container.id] ? (
                                  <>
                                    {/* Stats Panel */}
                                    <div className="col-span-1 space-y-4">
                                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-400" /> Recursos do Container
                                      </h3>
                                      <div className="bg-[#1a1a1a] rounded border border-[#333] p-4 space-y-3">
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Uso de CPU</p>
                                          <p className="text-lg font-mono text-green-400">{containerDetails[container.id].cpu}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Uso de Memória</p>
                                          <p className="text-lg font-mono text-purple-400">{containerDetails[container.id].memory}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-xs text-gray-500 mb-1">I/O de Rede</p>
                                            <p className="text-sm font-mono text-gray-300">{containerDetails[container.id].netIO}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500 mb-1">I/O de Disco</p>
                                            <p className="text-sm font-mono text-gray-300">{containerDetails[container.id].blockIO}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Logs Panel */}
                                    <div className="col-span-1 lg:col-span-2 space-y-4">
                                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-green-400" /> Logs Recentes
                                      </h3>
                                      <div className="bg-[#111] rounded border border-[#333] p-4 h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-1">
                                        {containerDetails[container.id].logs?.length > 0 ? (
                                          containerDetails[container.id].logs.map((log: string, i: number) => (
                                            <div key={i} className="break-all hover:bg-[#1a1a1a] px-1 rounded">
                                              {log}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-gray-600 italic">Nenhum log disponível.</div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="col-span-3 text-red-400 p-4">Erro ao carregar detalhes.</div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
