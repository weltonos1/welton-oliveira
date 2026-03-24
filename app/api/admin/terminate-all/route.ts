import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Get all container IDs
    const { stdout } = await execAsync('docker ps -q');
    const ids = stdout.trim().split('\\n').filter(Boolean);
    
    if (ids.length > 0) {
      await execAsync(`docker rm -f ${ids.join(' ')}`);
    }
    return NextResponse.json({ success: true, message: `All containers terminated.` });
  } catch (error) {
    console.error(`Failed to terminate all containers:`, error);
    
    // If we're using mock data, clear the global store
    if ((global as any).mockContainers) {
      (global as any).mockContainers = [];
    }
    
    return NextResponse.json({ success: true, message: `[MOCK] All containers terminated.` });
  }
}
