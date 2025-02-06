import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

let automationProcess: any = null;

export const POST = async ({ request }: RequestEvent) => {
    if (automationProcess) {
        automationProcess.kill();
        automationProcess = null;
    }
    return json({ success: true });
};