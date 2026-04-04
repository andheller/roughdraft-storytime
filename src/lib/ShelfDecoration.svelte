<script>
	let { type = 'plant', side = 'left' } = $props();
</script>

<div class="decoration {type} {side}">
	{#if type === 'plant'}
		<div class="lush-plant">
			<svg viewBox="0 0 140 180" class="plant-svg">
				<!-- Organic Woven Pot -->
				<path d="M40 100 Q30 100 28 105 L22 145 Q20 155 35 155 L105 155 Q120 155 118 145 L112 105 Q110 100 100 100 Z" fill="#d2b48c" />
				<path d="M30 100 L110 100 L112 110 L28 110 Z" fill="#bc8f8f" />
				
				<!-- Draping Vines -->
				<g class="vines">
					<!-- Vine 1 -->
					<path class="vine-path" d="M45 105 Q10 120 15 180 Q20 210 5 240" stroke="#2d5a27" stroke-width="2.5" fill="none" />
					<path class="leaf" d="M15 140 Q5 130 -5 145 Q5 160 15 140" fill="#3e7a37" />
					<path class="leaf" d="M18 190 Q28 180 35 195 Q25 210 18 190" fill="#2d5a27" />
					<path class="leaf" d="M5 240 Q-5 230 -15 245 Q-5 260 5 240" fill="#4a8c42" />
					
					<!-- Vine 2 -->
					<path class="vine-path" d="M95 105 Q130 120 125 190 Q120 230 135 260" stroke="#3e7a37" stroke-width="2" fill="none" />
					<path class="leaf" d="M128 150 Q138 140 145 155 Q135 170 128 150" fill="#4a8c42" />
					<path class="leaf" d="M125 210 Q115 200 108 215 Q118 230 125 210" fill="#2d5a27" />
					<path class="leaf" d="M135 260 Q145 250 152 265 Q142 280 135 260" fill="#3e7a37" />
					
					<!-- Vine 3 (Center) -->
					<path class="vine-path" d="M70 110 Q60 140 75 180" stroke="#4a8c42" stroke-width="2" fill="none" />
					<path class="leaf" d="M75 180 Q85 170 92 185 Q82 200 75 180" fill="#2d5a27" />
				</g>

				<!-- Bushy Top -->
				<g class="bushy-top">
					<path class="leaf" d="M50 105 Q30 60 5 90 Q30 115 50 105" fill="#2d5a27" />
					<path class="leaf" d="M90 105 Q110 60 135 90 Q110 115 90 105" fill="#3e7a37" />
					<path class="leaf" d="M70 100 Q75 40 45 35 Q50 75 70 100" fill="#4a8c42" />
					<path class="leaf" d="M65 105 Q45 50 25 70 Q50 90 65 105" fill="#2d5a27" />
					<path class="leaf" d="M75 105 Q95 50 115 70 Q90 90 75 105" fill="#3e7a37" />
				</g>
			</svg>
		</div>
	{:else if type === 'vase'}
		<div class="eclectic-vase">
			<svg viewBox="0 0 80 120" class="vase-svg">
				<!-- Mid-century / Bohemian Vase -->
				<path d="M25 20 Q25 10 40 10 Q55 10 55 20 L55 30 Q55 40 70 60 Q80 90 70 110 Q60 120 40 120 Q20 120 10 110 Q0 90 10 60 Q25 40 25 30 Z" fill="#264653" />
				<!-- Decorative Glaze Detail -->
				<path d="M15 70 Q40 60 65 70 Q75 90 65 110 Q40 115 15 110 Q5 90 15 70" fill="#2a9d8f" opacity="0.6" />
				<circle cx="40" cy="85" r="8" fill="#e9c46a" opacity="0.8" />
			</svg>
		</div>
	{/if}
</div>

<style>
	.decoration {
		position: relative;
		pointer-events: none;
		z-index: 40;
		filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.4));
		display: flex;
		align-items: flex-end;
	}

	.plant {
		width: 140px;
		margin-bottom: -20px;
	}

	.vase {
		width: 60px;
		margin-bottom: -5px;
	}

	.decoration-left { margin-right: 5px; }
	.decoration-right { margin-left: 5px; }

	.leaf {
		transform-origin: center bottom;
		animation: breathe 5s ease-in-out infinite alternate;
	}

	.vine-path {
		animation: vine-sway 7s ease-in-out infinite alternate;
		transform-origin: top center;
	}

	@keyframes breathe {
		from { transform: rotate(-3deg) scale(1); }
		to { transform: rotate(3deg) scale(1.05); }
	}

	@keyframes vine-sway {
		from { transform: rotate(-2deg); }
		to { transform: rotate(2deg); }
	}

	.plant-svg, .vase-svg {
		overflow: visible;
		width: 100%;
		height: auto;
	}
</style>
