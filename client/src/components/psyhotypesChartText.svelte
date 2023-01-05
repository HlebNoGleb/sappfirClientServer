<script>
// @ts-nocheck

    import config from '../assets/config';
    import {createEventDispatcher} from 'svelte';
    import psyhotypesChartText from "../assets/defaultData/psyhotypesChartText.json"
    const dispatch = createEventDispatcher();

    export let settings;
    export let questions;

    if (questions.psyhotypesChartText && questions.psyhotypesChartText.length == 0){
        setupDefault()
    }

    function setupDefault(){
        questions.psyhotypesChartText = psyhotypesChartText;
    }

    async function savePsyhotypesChartText(){
        const data = {
            id: questions._id,
            psyhotypesChartText: questions.psyhotypesChartText
        }

        const res = await fetch(`${config.serverUrl}/questions/psyhotypesChartText`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data),
		})

		const json = await res.json();
		let result = JSON.stringify(json);
        if (res.status == 201){
            Swal.fire(
                'Отлично',
                'Данные сохранены!',
                'success'
            );
            return null;
        }

        Swal.fire(
            'Ошибка',
            'Произошла ошибка, данные не сохранены',
            'error'
        );
        return null;
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{psyhotypesChartText: false, questions: true}, data:{settings: settings}});
    }
</script>

<div class="container">
    <div class="col">
        <form on:submit|preventDefault={savePsyhotypesChartText}>
        {#each questions.psyhotypesChartText as item, i}
        <div class="d-grid g-2">
            <div class="col my-2">
                <div class="card">
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="title-{item.id}" class="form-label">Название психотипа</label>
                            <input type="text" id="title-{item.id}" class="form-control" bind:value="{item.title}">
                        </div>
                        <div class="mb-3">
                            <label for="data-{item.id}">Информация после прохождения теста</label>
                            <textarea class="form-control" id="data-{item.id}" bind:value="{item.data}" rows="3"></textarea>
                            <div class="form-text">*Поддерживает HTML (встроен Bootstrap 5)</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col my-2">
                {item.title}
                {@html item.data}
            </div>
        </div>
        {/each}
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
    </div>
</div>

<style>
    .container{
		width: min(50rem, 95%);
	}
</style>


