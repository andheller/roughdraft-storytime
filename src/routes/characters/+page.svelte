<script>
	import { characterCast, generationWorkflow, styleLanes } from '$lib/character-lab.js';

	let selectedCharacterId = $state(characterCast[0].id);
	let selectedOptionId = $state(characterCast[0].options?.[0]?.id ?? null);

	const selectedCharacter = $derived(
		characterCast.find((character) => character.id === selectedCharacterId) ?? characterCast[0]
	);
	const selectedPreview = $derived(
		selectedCharacter.options?.find((option) => option.id === selectedOptionId) ?? {
			src: selectedCharacter.render,
			name: 'Current Render',
			tagline: 'Baseline character render'
		}
	);

	const transparentPrompt = $derived.by(() => {
		return [
			'Use case: illustration-story',
			'Asset type: reusable transparent-background character render',
			`Primary request: large full-body render of ${selectedCharacter.name} for recurring story illustration reuse`,
			'Scene/backdrop: transparent background only',
			`Subject: ${selectedCharacter.species}, ${selectedCharacter.role.toLowerCase()}, ${selectedCharacter.vibe.toLowerCase()}`,
			"Style/medium: premium modern children's book illustration, crisp painterly rendering, clean silhouette",
			'Composition/framing: character fills the frame, full body visible, centered, no cropping, readable at large preview size',
			'Lighting/mood: warm, inviting, highly readable',
			`Constraints: keep ${selectedCharacter.lockedTraits.join(', ')}, transparent background, no text, no watermark`,
			'Avoid: photorealism, blur, extra limbs, duplicated tail or wings, tiny figure, clutter'
		].join('\n');
	});

	$effect(() => {
		selectedCharacterId;
		selectedOptionId = selectedCharacter.options?.[0]?.id ?? null;
	});
</script>

<svelte:head>
	<title>Characters | Roughdraft Storytime</title>
	<meta
		name="description"
		content="Large isolated character renders for dialing in a reusable cast and improving story-art consistency."
	/>
</svelte:head>

<div
	class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(252,215,137,0.26),_transparent_24%),linear-gradient(180deg,_#f7f1e4_0%,_#efe5d1_42%,_#e8dbc3_100%)] text-stone-900"
>
	<section class="border-b border-black/8">
		<div class="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10 lg:py-10">
			<a
				href="/"
				class="inline-flex w-fit items-center gap-2 text-sm font-medium tracking-[0.14em] text-stone-600 uppercase transition hover:text-stone-900"
			>
				<span aria-hidden="true">←</span>
				Back to stories
			</a>

			<div class="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
				<div class="max-w-4xl">
					<p class="mb-4 text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">
						Character Lab Reset
					</p>
					<h1
						class="font-serif text-5xl leading-none font-semibold tracking-[-0.05em] text-stone-950 sm:text-6xl lg:text-7xl"
					>
						Larger isolated characters, rebuilt from scratch.
					</h1>
					<p class="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
						These are fresh transparent-background renders for the recurring cast. The selected
						character is shown at a much larger scale so we can judge silhouette, costume details,
						and face consistency before generating more scene art.
					</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-3">
					<div
						class="rounded-[1.75rem] border border-black/8 bg-white/70 p-5 shadow-[0_20px_60px_rgba(38,24,10,0.08)] backdrop-blur-sm"
					>
						<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
							Rebuilt cast
						</div>
						<div class="mt-2 font-serif text-4xl text-stone-950">{characterCast.length}</div>
						<p class="mt-2 text-sm leading-6 text-stone-600">Large isolated transparent renders.</p>
					</div>
					<div
						class="rounded-[1.75rem] border border-black/8 bg-white/70 p-5 shadow-[0_20px_60px_rgba(38,24,10,0.08)] backdrop-blur-sm"
					>
						<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
							Current pass
						</div>
						<div class="mt-2 font-serif text-4xl text-stone-950">
							{selectedCharacter.options ? `${selectedCharacter.options.length}x` : 'v1'}
						</div>
						<p class="mt-2 text-sm leading-6 text-stone-600">
							{selectedCharacter.options
								? 'Totally different Nutty style options ready to compare.'
								: 'Baseline set to critique and refine.'}
						</p>
					</div>
					<div
						class="rounded-[1.75rem] border border-black/8 bg-white/70 p-5 shadow-[0_20px_60px_rgba(38,24,10,0.08)] backdrop-blur-sm"
					>
						<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
							Next step
						</div>
						<div class="mt-2 font-serif text-4xl text-stone-950">{styleLanes.length}</div>
						<p class="mt-2 text-sm leading-6 text-stone-600">
							Style lanes still available for the next round.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10 lg:py-10">
		<div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
			<aside
				class="rounded-[2rem] border border-black/8 bg-white/72 p-4 shadow-[0_25px_80px_rgba(44,28,10,0.1)] backdrop-blur-sm"
			>
				<div class="mb-4 px-2">
					<p class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
						Cast picker
					</p>
					<h2 class="mt-2 font-serif text-2xl text-stone-950">Select a character.</h2>
				</div>

				<div class="space-y-3">
					{#each characterCast as character}
						<button
							type="button"
							class={`w-full rounded-[1.5rem] border p-3 text-left transition ${
								selectedCharacter.id === character.id
									? 'border-stone-900 bg-stone-950 text-white shadow-[0_16px_35px_rgba(27,17,9,0.18)]'
									: 'border-black/8 bg-white/70 text-stone-900 hover:border-stone-400 hover:bg-white'
							}`}
							onclick={() => (selectedCharacterId = character.id)}
						>
							<div class="flex items-center gap-3">
								<div
									class={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border ${
										selectedCharacter.id === character.id
											? 'border-white/10 bg-white/6'
											: 'border-stone-200 bg-[linear-gradient(180deg,_#fffdfa_0%,_#f3ead8_100%)]'
									}`}
								>
									<img
										src={character.render}
										alt={character.name}
										class="h-full w-full object-contain p-1.5"
									/>
								</div>
								<div class="min-w-0">
									<div class="font-serif text-xl leading-tight">{character.name}</div>
									<div
										class={`mt-1 text-xs font-semibold tracking-[0.18em] uppercase ${
											selectedCharacter.id === character.id ? 'text-amber-300' : 'text-stone-500'
										}`}
									>
										{character.role}
									</div>
									<p
										class={`mt-2 text-sm leading-5 ${
											selectedCharacter.id === character.id ? 'text-stone-300' : 'text-stone-600'
										}`}
									>
										{character.species}
									</p>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</aside>

			<div class="space-y-6">
				<section
					class="overflow-hidden rounded-[2rem] border border-black/8 bg-white/74 shadow-[0_26px_80px_rgba(44,28,10,0.11)] backdrop-blur-sm"
				>
					<div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
						<div class="border-b border-black/8 p-6 lg:border-r lg:border-b-0 lg:p-8">
							<div class="flex flex-wrap items-center gap-3">
								<span
									class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-800 uppercase"
								>
									Selected preview
								</span>
								<span
									class="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-stone-600 uppercase"
								>
									{selectedCharacter.options ? selectedPreview.name : 'Transparent render'}
								</span>
							</div>

							<h2
								class="mt-4 font-serif text-4xl leading-none tracking-[-0.03em] text-stone-950 sm:text-5xl"
							>
								{selectedCharacter.name}
							</h2>
							<p class="mt-4 max-w-2xl text-base leading-7 text-stone-700">
								{selectedCharacter.vibe}
							</p>

							<div
								class="mt-8 flex min-h-[33rem] items-center justify-center rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,_rgba(255,252,246,0.95)_0%,_rgba(244,235,218,0.92)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
							>
								<img
									src={selectedPreview.src}
									alt={`${selectedCharacter.name} isolated character render`}
									class="max-h-[32rem] w-full object-contain"
								/>
							</div>

							{#if selectedCharacter.options}
								<div class="mt-6">
									<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
										Nutty style exploration
									</div>
									<div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
										{#each selectedCharacter.options as option}
											<button
												type="button"
												class={`rounded-[1.4rem] border p-3 text-left transition ${
													selectedPreview.src === option.src
														? 'border-stone-900 bg-stone-950 text-white shadow-[0_16px_35px_rgba(27,17,9,0.18)]'
														: 'border-stone-200 bg-stone-50 text-stone-900 hover:border-stone-400 hover:bg-white'
												}`}
												onclick={() => (selectedOptionId = option.id)}
											>
												<div
													class={`flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.1rem] border ${
														selectedPreview.src === option.src
															? 'border-white/10 bg-white/6'
															: 'border-stone-200 bg-[linear-gradient(180deg,_#fffdfa_0%,_#f3ead8_100%)]'
													}`}
												>
													<img
														src={option.src}
														alt={option.name}
														class="max-h-full w-full object-contain p-2"
													/>
												</div>
												<div class="mt-3 font-serif text-xl">{option.name}</div>
												<p
													class={`mt-1 text-sm leading-5 ${
														selectedPreview.src === option.src ? 'text-stone-300' : 'text-stone-600'
													}`}
												>
													{option.tagline}
												</p>
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div class="p-6 lg:p-8">
							<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
								Locked traits
							</div>
							<div class="mt-3 flex flex-wrap gap-2">
								{#each selectedCharacter.lockedTraits as trait}
									<span
										class="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700"
									>
										{trait}
									</span>
								{/each}
							</div>

							<div class="mt-8">
								<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
									Reusable poses to generate next
								</div>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each selectedCharacter.reuseTargets as target}
										<span class="rounded-full bg-stone-900 px-3 py-2 text-sm text-stone-100">
											{target}
										</span>
									{/each}
								</div>
							</div>

							<div class="mt-8">
								<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
									Story coverage
								</div>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each selectedCharacter.stories as story}
										<span
											class="rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-stone-700"
										>
											{story}
										</span>
									{/each}
								</div>
							</div>

							<div class="mt-8 rounded-[1.6rem] bg-stone-950 p-5 text-stone-100">
								<div class="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
									Current assessment target
								</div>
								<p class="mt-3 text-sm leading-6 text-stone-300">
									Focus on silhouette, facial consistency, costume shape, and whether this design
									will still read when inserted into busy story scenes.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
					<div
						class="rounded-[2rem] border border-black/8 bg-stone-950 p-6 text-stone-100 shadow-[0_24px_70px_rgba(23,15,10,0.22)] lg:p-8"
					>
						<div class="text-xs font-semibold tracking-[0.24em] text-amber-300 uppercase">
							Prompt scaffold
						</div>
						<h3 class="mt-3 font-serif text-3xl leading-tight">{selectedCharacter.name}</h3>
						<p class="mt-3 max-w-xl text-sm leading-6 text-stone-300">
							Use this as the baseline prompt for the next improvement pass. For stronger
							consistency, the next round should use the selected render and one anchor scene image
							as visual inputs.
						</p>
						<pre
							class="mt-5 overflow-x-auto rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-xs leading-6 whitespace-pre-wrap text-stone-200">{transparentPrompt}</pre>
					</div>

					<div
						class="rounded-[2rem] border border-black/8 bg-white/74 p-6 shadow-[0_24px_70px_rgba(44,28,10,0.11)] backdrop-blur-sm lg:p-8"
					>
						<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
							Anchor references
						</div>
						<h3 class="mt-2 font-serif text-3xl leading-tight text-stone-950">
							Source scenes still available for refinement.
						</h3>

						<div class="mt-5 grid gap-4 sm:grid-cols-3">
							{#each selectedCharacter.references as reference}
								<figure class="overflow-hidden rounded-[1.5rem] bg-stone-100">
									<div class="aspect-[4/3] overflow-hidden">
										<img
											src={reference.src}
											alt={`${selectedCharacter.name} reference from ${reference.label}`}
											class="h-full w-full object-cover"
										/>
									</div>
									<figcaption class="px-4 py-3 text-sm text-stone-600">
										{reference.label}
									</figcaption>
								</figure>
							{/each}
						</div>
					</div>
				</section>

				<section
					class="rounded-[2rem] border border-black/8 bg-white/74 p-6 shadow-[0_24px_70px_rgba(44,28,10,0.11)] backdrop-blur-sm lg:p-8"
				>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
								Whole cast
							</div>
							<h3 class="mt-2 font-serif text-3xl leading-tight text-stone-950">
								All isolated characters at a more useful size.
							</h3>
						</div>
						<div class="text-sm text-stone-500">
							Tap any character on the left to enlarge it above.
						</div>
					</div>

					<div class="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
						{#each characterCast as character}
							<div
								class="rounded-[1.7rem] border border-black/8 bg-[linear-gradient(180deg,_rgba(255,252,246,0.98)_0%,_rgba(242,233,216,0.98)_100%)] p-4"
							>
								<div
									class="flex aspect-[4/5] items-center justify-center rounded-[1.3rem] border border-stone-200 bg-white/55 p-4"
								>
									<img
										src={character.render}
										alt={character.name}
										class="max-h-full w-full object-contain"
									/>
								</div>
								<div class="mt-4">
									<div class="font-serif text-2xl text-stone-950">{character.name}</div>
									<div
										class="mt-1 text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase"
									>
										{character.role}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<section class="grid gap-4 md:grid-cols-3">
					{#each generationWorkflow as step}
						<div
							class="rounded-[1.6rem] border border-black/7 bg-white/70 px-5 py-5 shadow-[0_18px_50px_rgba(20,15,11,0.08)]"
						>
							<div class="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
								Next workflow
							</div>
							<h2 class="mt-2 font-serif text-2xl leading-tight text-stone-950">{step.title}</h2>
							<p class="mt-3 text-sm leading-6 text-stone-600">{step.description}</p>
						</div>
					{/each}
				</section>
			</div>
		</div>
	</section>
</div>
