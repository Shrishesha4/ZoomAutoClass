import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Meeting } from '$lib/stores/meetings';

export const POST = async ({ request }: RequestEvent) => {
    const meetings: Meeting[] = await request.json();
    
    try {
        // Send meetings to your backend server
        const response = await fetch('https://your-backend-server.com/start-automation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetings)
        });

        if (!response.ok) {
            throw new Error('Failed to start automation');
        }

        return json({ success: true });
    } catch (error) {
        console.error('Failed to start automation:', error);
        return json({ success: false, error: 'Failed to start automation' }, { status: 500 });
    }
};