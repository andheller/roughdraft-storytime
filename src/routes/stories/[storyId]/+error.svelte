<script>
	import { page } from '$app/stores';
	
	$: status = $page.status;
	$: message = $page.error?.message || 'Something went wrong';
</script>

<svelte:head>
	<title>Story Not Found - Kids Story Collection</title>
	<meta name="description" content="The story you're looking for could not be found." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
	<!-- Floating particles animation -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-4 -left-4 w-72 h-72 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
		<div class="absolute top-1/4 -right-8 w-96 h-96 bg-orange-200 rounded-full opacity-15 animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-200 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<div class="container mx-auto px-4 py-8 relative z-10">
		<div class="mb-8">
			<a href="/stories" class="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-amber-200 text-amber-700 transition-all hover:bg-white/90 hover:text-amber-900 hover:shadow-lg hover:scale-105">
				<svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				<span class="font-medium">Back to Stories</span>
			</a>
		</div>

		<div class="flex items-center justify-center min-h-[60vh]">
			<div class="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-amber-200 max-w-md mx-auto">
				<!-- Sad book illustration -->
				<div class="mb-8">
					<svg class="w-24 h-24 mx-auto text-amber-600 opacity-80" fill="currentColor" viewBox="0 0 24 24">
						<path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
						<path d="M12 6.5v15c1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05V6c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5z" opacity="0.3"/>
					</svg>
				</div>

				<h1 class="text-4xl font-bold text-amber-800 mb-4">Story Not Found</h1>
				
				{#if status === 404}
					<p class="text-xl text-amber-700 mb-2">Oops! This story seems to have wandered off...</p>
					<p class="text-amber-600 mb-8">The story you're looking for doesn't exist in our collection.</p>
				{:else}
					<p class="text-xl text-amber-700 mb-2">Something went wrong</p>
					<p class="text-amber-600 mb-8">{message}</p>
				{/if}

				<div class="space-y-4">
					<a href="/stories" class="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-full font-medium transition-all hover:bg-amber-700 hover:scale-105 shadow-lg">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
						</svg>
						Browse All Stories
					</a>
					
					<div class="text-center">
						<a href="/" class="text-amber-700 hover:text-amber-900 transition-colors underline">
							Go to Homepage
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>