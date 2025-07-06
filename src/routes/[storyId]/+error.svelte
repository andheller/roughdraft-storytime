<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Story Not Found - Kids Story Collection</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
	<div class="text-center">
		<div class="mb-8">
			<div class="text-8xl mb-4">📚</div>
			<h1 class="text-4xl font-bold text-amber-900 mb-2">Story Not Found</h1>
			<p class="text-lg text-amber-700 mb-6">
				The story you're looking for doesn't exist or has been moved.
			</p>
		</div>
		
		<div class="space-y-4">
			<a
				href="/"
				class="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-xl"
			>
				← Back to Story Collection
			</a>
			
			<div class="text-sm text-amber-600">
				Error {$page.status}: {$page.error?.message}
			</div>
		</div>
	</div>
</div>