import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await execAsync(`docker rm -f ${id}`);
    return NextResponse.json({ success: true, message: `Container ${id} terminated.` });
  } catch (error) {
    console.error(`Failed to terminate container ${id}:`, error);
    
    // If we're using mock data, remove it from the global store
    if ((global as any).mockContainers) {
      (global as any).mockContainers = (global as any).mockContainers.filter((c: any) => c.id !== id);
    }
    
    return NextResponse.json({ success: true, message: `[MOCK] Container ${id} terminated.` });
  }
}
