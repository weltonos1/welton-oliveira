import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white font-mono">
      <div className="text-center space-y-6 max-w-lg p-8 border border-[#333] rounded-lg bg-[#111]">
        <Terminal className="w-16 h-16 text-[#00ff00] mx-auto" />
        <h1 className="text-4xl font-bold tracking-tight">KaliAcademy</h1>
        <p className="text-gray-400">
          Plataforma de treinamento em cibersegurança.
        </p>
        <div className="pt-4 flex flex-col gap-4">
          <Link 
            href="/curriculum" 
            className="inline-block bg-[#111] text-white border border-[#333] font-bold px-6 py-3 rounded hover:bg-[#222] transition-colors"
          >
            Ver Grade Curricular Completa
          </Link>
          <Link 
            href="/ctf" 
            className="inline-block bg-red-900/30 text-red-500 border border-red-500/50 font-bold px-6 py-3 rounded hover:bg-red-900/50 transition-colors"
          >
            Laboratórios CTF (Capture The Flag)
          </Link>
          <Link 
            href="/arsenal" 
            className="inline-block bg-[#111] text-[#00ff00] border border-[#00ff00] font-bold px-6 py-3 rounded hover:bg-[#00ff00] hover:text-black transition-colors"
          >
            Arsenal Hacker (Guia de Ferramentas)
          </Link>
          <Link 
            href="/admin" 
            className="inline-block bg-[#00ff00] text-black font-bold px-6 py-3 rounded hover:bg-[#00cc00] transition-colors"
          >
            Acessar Mission Control (Admin)
          </Link>
        </div>
      </div>
    </div>
  );
}
