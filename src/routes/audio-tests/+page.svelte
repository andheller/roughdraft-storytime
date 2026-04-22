<script>
	let { data } = $props();

	function formatDate(value) {
		if (!value) return 'Unknown date';

		return new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}
	
	function formatVoiceSetting(value) {
		return typeof value === 'number' ? value.toFixed(2) : String(value);
	}
</script>

<svelte:head>
	<title>Audio Shootouts | Roughdraft Storytime</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.16),_transparent_40%),linear-gradient(180deg,_#fffdf7_0%,_#f7f0de_52%,_#efe5cf_100%)] text-stone-900">
	<div class="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Stories
		</a>

		<section class="grid gap-10 pb-10 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
			<div class="space-y-5">
				<p class="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Voice Shootouts</p>
				<h1 class="max-w-[11ch] font-serif text-5xl leading-[0.94] tracking-tight sm:text-6xl">
					Listen side by side.
				</h1>
				<p class="max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
					Short narration tests pulled from local ElevenLabs shootouts. Each set keeps the same text,
					model, and settings so the voice itself is easier to judge.
				</p>
			</div>

			<div class="rounded-[2rem] border border-amber-950/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(120,53,15,0.12)] backdrop-blur">
				<p class="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">What To Listen For</p>
				<div class="mt-4 grid gap-4 text-sm leading-6 text-stone-600 sm:grid-cols-3">
					<div>
						<p class="font-semibold text-stone-900">Pacing</p>
						<p>Does the pause pattern feel natural for read-aloud listening?</p>
					</div>
					<div>
						<p class="font-semibold text-stone-900">Tone</p>
						<p>Does it feel playful, steady, warm, or too performative for the story?</p>
					</div>
					<div>
						<p class="font-semibold text-stone-900">Clarity</p>
						<p>Listen for consonants, names, and whether emphasis lands where it should.</p>
					</div>
				</div>
			</div>
		</section>

		{#if data.shootouts.length === 0}
			<div class="rounded-[2rem] border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-600">
				No shootouts found in <code>exports/audio-tests</code>.
			</div>
		{:else}
			<div class="space-y-12">
				{#each data.shootouts as shootout}
					<section class="overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-[0_32px_120px_rgba(28,25,23,0.08)] backdrop-blur">
						<div class="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
							<div class="border-b border-black/5 bg-[linear-gradient(180deg,_rgba(255,251,235,0.92)_0%,_rgba(255,247,237,0.86)_100%)] p-7 lg:border-b-0 lg:border-r">
								<div class="flex flex-wrap items-center gap-3">
									<p class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
										{shootout.label}
									</p>
									<span class="rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
										{shootout.voices.length} voices
									</span>
								</div>

								<h2 class="mt-4 font-serif text-3xl leading-tight text-stone-950">
									{shootout.label.replaceAll('-', ' ')}
								</h2>
								<p class="mt-3 text-sm leading-6 text-stone-600">
									Generated {formatDate(shootout.generatedAt)} with <span class="font-medium text-stone-900"
										>{shootout.model}</span
									>
									at <span class="font-medium text-stone-900">{shootout.outputFormat}</span>.
								</p>

								<div class="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-600">
									<div class="rounded-2xl bg-white/70 p-4">
										<p class="text-xs uppercase tracking-[0.2em] text-stone-400">Stability</p>
										<p class="mt-1 text-lg font-semibold text-stone-900">
											{formatVoiceSetting(shootout.voiceSettings?.stability)}
										</p>
									</div>
									<div class="rounded-2xl bg-white/70 p-4">
										<p class="text-xs uppercase tracking-[0.2em] text-stone-400">Similarity</p>
										<p class="mt-1 text-lg font-semibold text-stone-900">
											{formatVoiceSetting(shootout.voiceSettings?.similarity_boost)}
										</p>
									</div>
									<div class="rounded-2xl bg-white/70 p-4">
										<p class="text-xs uppercase tracking-[0.2em] text-stone-400">Style</p>
										<p class="mt-1 text-lg font-semibold text-stone-900">
											{formatVoiceSetting(shootout.voiceSettings?.style)}
										</p>
									</div>
									<div class="rounded-2xl bg-white/70 p-4">
										<p class="text-xs uppercase tracking-[0.2em] text-stone-400">Boost</p>
										<p class="mt-1 text-lg font-semibold text-stone-900">
											{shootout.voiceSettings?.use_speaker_boost ? 'On' : 'Off'}
										</p>
									</div>
								</div>

								<div class="mt-6 rounded-[1.5rem] border border-black/5 bg-stone-950 px-5 py-5 text-stone-100">
									<p class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Snippet</p>
									<pre class="mt-4 whitespace-pre-wrap font-serif text-base leading-7 text-stone-100">{shootout.text}</pre>
								</div>
							</div>

							<div class="p-5 sm:p-7">
								<div class="grid gap-4">
									{#each shootout.voices as voice, index}
										<div class="rounded-[1.5rem] border border-black/5 bg-[linear-gradient(180deg,_rgba(250,250,249,0.92)_0%,_rgba(245,245,244,0.86)_100%)] p-5 transition-transform duration-200 hover:-translate-y-0.5">
											<div class="flex flex-wrap items-start justify-between gap-4">
												<div>
													<p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
														Voice {index + 1}
													</p>
													<h3 class="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
														{voice.name}
													</h3>
													<p class="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
														{voice.notes}
													</p>
												</div>
											</div>

											<div class="mt-4 rounded-2xl bg-white/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
												<audio class="w-full" controls preload="metadata" src={voice.audioUrl}>
													<a href={voice.audioUrl}>Listen to {voice.name}</a>
												</audio>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</section>
				{/each}
			</div>
		{/if}
	</div>
</div>
