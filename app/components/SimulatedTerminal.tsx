'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface Command {
  cmd: string;
  output: string;
}

export default function SimulatedTerminal({ commands }: { commands: Command[] }) {
  const [history, setHistory] = useState<{type: 'input'|'output', text: string}[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!input.trim()) return;
      
      const newHistory = [...history, { type: 'input', text: input }];
      
      if (input.trim() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const foundCmd = commands.find(c => c.cmd === input.trim());
      if (foundCmd) {
        newHistory.push({ type: 'output', text: foundCmd.output });
      } else {
        newHistory.push({ type: 'output', text: `bash: ${input.split(' ')[0]}: command not found` });
      }
      
      setHistory(newHistory as any);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="bg-black border border-[#333] rounded-lg overflow-hidden font-mono text-sm shadow-2xl w-full max-w-3xl mx-auto my-6">
      <div className="bg-[#1a1a1a] px-4 py-2 border-b border-[#333] flex items-center gap-2">
        <TerminalIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400 text-xs">root@kali:~</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto text-gray-300 flex flex-col">
        {history.map((line, i) => (
          <div key={i} className="mb-2">
            {line.type === 'input' ? (
              <div className="flex flex-col">
                <div className="text-red-500">
                  ┌──(<span className="text-blue-400">root㉿kali</span>)-[<span className="text-white">~</span>]
                </div>
                <div>
                  <span className="text-red-500">└─</span><span className="text-blue-400">#</span>
                  <span className="ml-2 text-white">{line.text}</span>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-[#00ff00] mt-1 font-mono text-xs leading-relaxed">{line.text}</pre>
            )}
          </div>
        ))}
        <div className="flex flex-col mt-1">
          <div className="text-red-500">
            ┌──(<span className="text-blue-400">root㉿kali</span>)-[<span className="text-white">~</span>]
          </div>
          <div className="flex items-center">
            <span className="text-red-500">└─</span><span className="text-blue-400">#</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-white flex-1 ml-2"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
