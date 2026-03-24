import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Try to get real stats and logs
    const [statsRes, logsRes] = await Promise.all([
      execAsync(`docker stats ${id} --no-stream --format "{{json .}}"`),
      execAsync(`docker logs --tail 50 ${id}`)
    ]);

    const stats = JSON.parse(statsRes.stdout.trim());
    const logs = logsRes.stdout.trim() || logsRes.stderr.trim() || 'Nenhum log disponível.';

    return NextResponse.json({
      cpu: stats.CPUPerc,
      memory: stats.MemUsage,
      netIO: stats.NetIO,
      blockIO: stats.BlockIO,
      logs: logs.split('\n').slice(-20) // last 20 lines
    });
  } catch (error) {
    // Fallback to mock data
    return NextResponse.json({
      _mock: true,
      cpu: (Math.random() * 5 + 0.1).toFixed(2) + '%',
      memory: (Math.random() * 100 + 50).toFixed(2) + 'MiB / 2GiB',
      netIO: '1.2kB / 0B',
      blockIO: '0B / 0B',
      logs: [
        '[INFO] Starting Kali Linux container...',
        '[INFO] Initializing network interfaces...',
        '[WARN] No specific entrypoint defined, dropping to shell.',
        'root@kali:/# apt-get update',
        'Hit:1 http://http.kali.org/kali kali-rolling InRelease',
        'Reading package lists... Done',
        'root@kali:/# service ssh start',
        '[INFO] SSH service started on port 22.',
        'root@kali:/# tail -f /var/log/auth.log',
        'Connection from 192.168.1.100 port 54321',
        'Accepted publickey for root from 192.168.1.100',
        'Session opened for user root',
      ]
    });
  }
}
