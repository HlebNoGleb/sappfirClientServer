<script>
    export let loading
</script>

{#if loading}
	<div class="loader">
		<div class="wrapper">
			<span class="dot"></span>
			<div class="dots">
			<span></span>
			<span></span>
			<span></span>
			</div>
		</div>
	</div>
{/if}

<style>
    .loader{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #fff;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}
.wrapper {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 142px;
	height: 40px;
	margin: -20px 0 0 -71px;
	background: white;
	filter: contrast(20);
}
.dot {
	position: absolute;
	width: 16px;
	height: 16px;
	top: 12px;
	left: 5px;
	filter: blur(4px);
	background: #000;
	border-radius: 50%;
	transform: translateX(0);
	animation: dot 2.8s infinite;
}
.dots {
	transform: translateX(0);
	margin-top: 12px;
	margin-left: 31px;
	animation: dots 2.8s infinite;
}
span {
	display: block;
	float: left;
	width: 16px;
	height: 16px;
	margin-left: 16px;
	filter: blur(4px);
	background: #000;
	border-radius: 50%;
}

@keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}
</style>