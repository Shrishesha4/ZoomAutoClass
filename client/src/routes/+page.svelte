<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase';
    import { user } from '$lib/stores/auth';
    import { meetings, isRunning, updateMeetings, updateIsRunning, type Meeting } from '$lib/stores/meetings';
    import { goto } from '$app/navigation';

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            user.set(currentUser);
            if (!currentUser) goto('/login');
        });

        return unsubscribe;
    });

    import { onDestroy } from 'svelte';
    
    let newMeeting: Meeting = {
        link: '',
        startTime: '',
        endTime: ''
    };

    // Update the addMeeting function
    async function addMeeting() {
        if (newMeeting.link && newMeeting.startTime && newMeeting.endTime) {
            const updatedMeetings = [...$meetings, { ...newMeeting }];
            await updateMeetings(updatedMeetings);
            newMeeting = { link: '', startTime: '', endTime: '' };
        }
    }

    // Update the removeMeeting function
    async function removeMeeting(index: number) {
        const updatedMeetings = $meetings.filter((_, i) => i !== index);
        await updateMeetings(updatedMeetings);
    }

    // Update the toggleAutomation function
    async function toggleAutomation() {
        const currentState = $isRunning;
        const endpoint = currentState ? '/api/stop' : '/api/start';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify($meetings)
            });
            
            if (response.ok) {
                await updateIsRunning(!currentState);
            }
        } catch (error) {
            console.error('Failed to toggle automation:', error);
        }
    }

    // Add logout function
    async function logout() {
        await auth.signOut();
        goto('/login');
    }
</script>

<!-- Add logout button to your existing template -->
<div class="absolute top-4 right-4">
    <button
        on:click={logout}
        class="text-gray-600 hover:text-gray-800"
    >
        Logout
    </button>
</div>

<!-- svelte-ignore a11y_label_has_associated_control -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
    <div class="container mx-auto max-w-4xl">
        <header class="mb-12 text-center">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Zoom Auto Login</h1>
            <p class="text-gray-600">Automate your Zoom meeting attendance</p>
        </header>

        <!-- Add new meeting card -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all hover:shadow-xl">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Add New Meeting</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Zoom Link</label>
                    <input
                        type="url"
                        bind:value={newMeeting.link}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://zoom.us/j/..."
                    />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                        type="time"
                        bind:value={newMeeting.startTime}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="time"
                        bind:value={newMeeting.endTime}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>
            <button
                on:click={addMeeting}
                class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Meeting
            </button>
        </div>

        <!-- Meeting list -->
        <div class="space-y-4">
            {#each $meetings as meeting, i}
                <div class="bg-white rounded-lg shadow p-6 transform transition-all hover:shadow-md">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="break-all">
                            <span class="text-sm font-medium text-gray-500">Link</span>
                            <p class="text-gray-800">{meeting.link}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500">Start Time</span>
                            <p class="text-gray-800">{meeting.startTime}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500">End Time</span>
                            <p class="text-gray-800">{meeting.endTime}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button
                            on:click={() => removeMeeting(i)}
                            class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Control button -->
        {#if $meetings.length > 0}
            <div class="mt-8 flex justify-center">
                <button
                    on:click={toggleAutomation}
                    class="px-8 py-3 rounded-full font-medium text-white shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 {$isRunning ? 
                        'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 
                        'bg-green-500 hover:bg-green-600 focus:ring-green-500'}"
                >
                    {$isRunning ? 'Stop Automation' : 'Start Automation'}
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        @apply bg-gray-50;
    }
</style>