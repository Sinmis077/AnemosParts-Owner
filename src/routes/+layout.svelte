<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SideNavBar from '../lib/components/side-nav-bar.svelte';
	import * as SideBar from '$lib/components/ui/sidebar';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-sonner';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5 minutes
				refetchInterval: 10 * 60 * 1000 // 10 minutes
			}
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<SideBar.Provider>
		<SideNavBar />

		<SideBar.Inset class="p-5">
			{@render children()}
		</SideBar.Inset>

		<Toaster />
	</SideBar.Provider>
</QueryClientProvider>
