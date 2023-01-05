<script>
    import Select from 'svelte-select';
    import {createEventDispatcher} from 'svelte';
    import config from "../../assets/config.js";
    const dispatch = createEventDispatcher()

    export let showBack;

    async function domainAdd(e){
        const formData = new FormData(e.target);
        const data = {};

		formData.forEach((value, key) => {
			data[key] = value;
		});

		// console.log(data);

        const res = await fetch(`${config.serverUrl}/domains/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data),
		})

		const json = await res.json();
        const status = res.status;

        if (status == 201) {
            showBack = true;
        }

		let result = JSON.stringify(json);
        console.log(result);
    }

    function updateState(data) {
        dispatch('updateState', data)
    }
</script>

<div class="container">
    <form on:submit|preventDefault={domainAdd}>
        <div class="mb-3">
            <label for="name">Домен</label>
            <input type="text" class="form-control" id="name" name="name" value="" required/>
        </div>
        <div class="mb-3">
            <label for="name">Описание домена</label>
            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
        </div>
        {#if showBack}
            <button type="button" class="btn btn-outline-primary" on:click={() => updateState({state:{domainSelect: true, domainAdd: false, loading: true}})}>Назад</button>
        {/if}
        <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
</div>

<style>

</style>