<script>
    import Select from 'svelte-select';
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    const dispatch = createEventDispatcher()
    export let domains = [];
    export let selectedDomain = null;
	import config from "../assets/config.js";

    function updateState(data) {
        dispatch('updateState', data)
    }

    onMount(async () => {
		const res = await fetch(`${config.serverUrl}/domains/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		domains = await res.json();
		// console.log(domains);
        updateState({state:{loading: false}})
	});

</script>

<div class="container">
	<form on:submit|preventDefault={() => updateState({state:{domainSelect: false, domainSettings: true, loading: true}})}>
		<div class="mb-3">
			<label for="domain-select" class="form-label">Список доменов</label>
			<Select bind:value={selectedDomain} items={domains} id={'domain-select'} placeholder={'Выберите домен'} itemId={'_id'} label={'name'}></Select>
			{#if selectedDomain}
			<div class="form-text">{selectedDomain.description}</div>
			{:else}
			<div class="form-text">После выбора домена вы сможете настроить тест для выбранно домена</div>
			{/if}
		</div>
		<button type="button" class="btn btn-outline-primary" on:click={() => updateState({state:{domainSelect: false, domainAdd: true, showBack: true}})}>Добавить</button>
		<button type="submit" disabled='{!selectedDomain}' class="btn btn-primary">Редактировать</button>
	</form>
</div>

<style>
	.container{
		width: min(25rem, 90%);
	}
</style>