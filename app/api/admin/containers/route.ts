import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Mock data fallback for when Docker is not available in the environment
let MOCK_CONTAINERS = [
  { id: 'a1b2c3d4e5f6', name: 'kali-student-101', image: 'kalilinux/kali-rolling', state: 'running', status: 'Up 2 hours', studentId: 'STD-101' },
  { id: 'f6e5d4c3b2a1', name: 'kali-student-102', image: 'kalilinux/kali-rolling', state: 'running', status: 'Up 5 minutes', studentId: 'STD-102' },
  { id: '112233445566', name: 'kali-student-103', image: 'kalilinux/kali-rolling', state: 'running', status: 'Up 3 days', studentId: 'STD-103' },
  { id: '998877665544', name: 'kali-student-104', image: 'kalilinux/kali-rolling', state: 'running', status: 'Up 1 hour', studentId: 'STD-104' },
];

// In-memory store to simulate killing containers when using mock data
if ((global as any).mockContainers === undefined) {
  (global as any).mockContainers = MOCK_CONTAINERS;
}

export async function GET() {
  try {
    const { stdout } = await execAsync('docker ps --format "{{json .}}"');
    const containers = stdout.trim().split('\\n').filter(Boolean).map(line => {
      const data = JSON.parse(line);
      return {
        id: data.ID,
        name: data.Names,
        image: data.Image,
        state: data.State,
        status: data.Status,
        studentId: data.Names.includes('student') ? data.Names.split('-').pop() : 'Unknown',
      };
    });
    return NextResponse.json({ containers });
  } catch (error) {
    // Fallback to mock data if docker is not available in the environment
    return NextResponse.json({ containers: (global as any).mockContainers, _mock: true });
  }
}
