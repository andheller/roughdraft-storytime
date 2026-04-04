<script>
	import { themeState } from './theme.svelte.js';

	let { top = '-20px', left = '50%', scale = 1 } = $props();

	let isDark = $derived(
		themeState.appearance === 'dark' ||
		(themeState.appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);
</script>

<div class="pendant-lamp" style="--lamp-top: {top}; --lamp-left: {left}; --lamp-scale: {scale};">
	<div class="cord"></div>
	<div class="lamp-container {isDark ? 'off' : 'on'}">
		<!-- Rattan / Wicker Shade -->
		<svg viewBox="0 0 160 120" class="shade-svg">
			<defs>
				<pattern id="rattan-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
					<path d="M0 5 L10 5 M5 0 L5 10" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" />
				</pattern>
			</defs>
			
			<!-- Shadow/Depth -->
			<path d="M20 100 Q80 120 140 100 L120 20 Q80 0 40 20 Z" fill="rgba(0,0,0,0.1)" transform="translate(4,4)" />
			
			<!-- Main Shade Body -->
			<path class="shade-body" d="M20 100 Q80 120 140 100 L120 20 Q80 0 40 20 Z" fill="#d4a373" />
			
			<!-- Wicker Texture Overlay -->
			<path d="M20 100 Q80 120 140 100 L120 20 Q80 0 40 20 Z" fill="url(#rattan-pattern)" />
			
			<!-- Horizontal Wicker Bands -->
			<path d="M25 85 Q80 100 135 85" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2" />
			<path d="M32 55 Q80 65 128 55" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2" />
			<path d="M38 25 Q80 35 122 25" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2" />
			
			<!-- Inner Glow when On -->
			<ellipse cx="80" cy="100" rx="40" ry="10" fill="rgba(251, 191, 36, 0.4)" class="glow-inner" />
		</svg>
		
		<div class="bulb"></div>
		<div class="ambient-light"></div>
		<div class="ceiling-cast"></div>
	</div>
</div>

<style>
	.pendant-lamp {
		position: absolute;
		top: var(--lamp-top);
		left: var(--lamp-left);
		transform: translateX(-50%) scale(var(--lamp-scale));
		z-index: 100;
		pointer-events: none;
	}

	.cord {
		width: 3px;
		height: 120px;
		background: #2c2c2c;
		margin: 0 auto;
		background-image: linear-gradient(to right, #1a1a1a, #444, #1a1a1a);
	}

	.lamp-container {
		position: relative;
		margin-top: -5px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.shade-svg {
		width: 160px;
		height: 120px;
		filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
		transition: filter 0.3s ease;
	}

	.shade-body {
		transition: fill 0.3s ease;
	}

	.lamp-container.off .shade-body {
		fill: #8b7355;
	}

	.lamp-container.off .shade-svg {
		filter: grayscale(0.2) brightness(0.7);
	}

	.bulb {
		position: absolute;
		bottom: 15px;
		width: 24px;
		height: 24px;
		background: #fff;
		border-radius: 50%;
		z-index: -1;
		transition: all 0.1s ease-out;
	}

	.lamp-container.on .bulb {
		background: #fbbf24;
		box-shadow: 0 0 30px #fbbf24, 0 0 60px #f59e0b;
	}

	.lamp-container.off .bulb {
		background: #64748b;
		opacity: 0.5;
	}

	.ambient-light {
		position: absolute;
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
		width: 1000px;
		height: 800px;
		background: radial-gradient(circle at top, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 40%, transparent 70%);
		opacity: 0;
		transition: opacity 0.2s ease-out;
		mix-blend-mode: plus-lighter;
		pointer-events: none;
	}

	.ceiling-cast {
		position: absolute;
		top: -150px;
		left: 50%;
		transform: translateX(-50%);
		width: 600px;
		height: 200px;
		background: radial-gradient(ellipse at bottom, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.2s ease-out;
		mix-blend-mode: overlay;
	}

	.lamp-container.on .ambient-light,
	.lamp-container.on .ceiling-cast {
		opacity: 1;
	}

	.glow-inner {
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}

	.lamp-container.on .glow-inner {
		opacity: 1;
	}

	@media (max-width: 768px) {
		.pendant-lamp { transform: translateX(-50%) scale(0.7); }
	}
</style>
