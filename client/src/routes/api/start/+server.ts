import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Meeting } from '$lib/stores/meetings';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

let automationProcess: ReturnType<typeof spawn> | null = null;

export const POST = async ({ request }: RequestEvent) => {
    const meetings: Meeting[] = await request.json();
    
    // Convert meetings to Python-compatible format
    const pythonData = meetings.map(m => [
        m.link,
        m.startTime,
        m.endTime
    ]);
    
    // Write meetings to a temporary data file
    const dataPath = join(process.cwd(), 'temp_data.py');
    writeFileSync(dataPath, `lst = ${JSON.stringify(pythonData, null, 2)}\n`);
    
    // Start the Python automation script
    automationProcess = spawn('python3', [join(process.cwd(), 'main.py')], {
        stdio: 'inherit'
    });
    
    automationProcess.on('error', (error) => {
        console.error('Failed to start automation:', error);
    });
    
    return json({ success: true });
};