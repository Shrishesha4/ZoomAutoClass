<script lang="ts">
    import { auth, googleProvider } from '$lib/firebase';
    import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, browserPopupRedirectResolver } from 'firebase/auth';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let isLogin = true;
    let error = '';

    async function signInWithGoogle() {
        try {
            googleProvider.setCustomParameters({
                prompt: 'select_account',
                access_type: 'offline',
                include_granted_scopes: 'true'
            });
            
            const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
            if (result.user) {
                goto('/');
            }
        } catch (e: any) {
            error = e.message;
        }
    }

    async function handleAuth() {
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            goto('/');
        } catch (e: any) {
            error = e.message;
        }
    }

</script>
<!-- svelte-ignore a11y_label_has_associated_control -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">
            {isLogin ? 'Login' : 'Create Account'}
        </h1>

        {#if error}
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <button
            on:click={signInWithGoogle}
            class="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors mb-6 flex items-center justify-center gap-2 shadow-sm"
        >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
                />
            </svg>
            Continue with Google
        </button>

        <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
        </div>

        <form on:submit|preventDefault={handleAuth} class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    bind:value={email}
                    autocomplete="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    bind:value={password}
                    autocomplete={isLogin ? "current-password" : "new-password"}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
                {isLogin ? 'Login' : 'Sign Up'}
            </button>
        </form>

        <button
            on:click={() => isLogin = !isLogin}
            class="mt-4 text-blue-600 hover:text-blue-800 text-sm w-full text-center"
        >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
    </div>
</div>