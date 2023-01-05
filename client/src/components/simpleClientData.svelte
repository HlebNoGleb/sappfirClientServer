<script>
// @ts-nocheck

    import config from '../assets/config';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    export let settings;
    export let questions;

    if (!questions.simpleClientInfo){
        setupDefault()
    }

    function setupDefault(){
        questions.simpleClientInfo = "";
    }

    async function saveSimpleClientInfo(){
        const data = {
            id: questions._id,
            simpleClientInfo: questions.simpleClientInfo
        }

        console.log(data);

        const res = await fetch(`${config.serverUrl}/questions/simpleClientInfo`, {
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
        updateState({state:{simpleClientInfo: false, questions: true}, data:{settings: settings}});
    }
</script>

<div class="container">
    <div class="col">
        <form on:submit|preventDefault={saveSimpleClientInfo}>
            <div class="mb-3">
                <label for="resultSettingsAfterText">Информация клиента после прохождения теста</label>
                <textarea class="form-control" id="resultSettings.AfterText" name="resultSettings.AfterText" bind:value={questions.simpleClientInfo} rows="3"></textarea>
                <div class="form-text">*Поддерживает HTML (встроен Bootstrap 5)</div>
            </div>
            <div class="mb-3">
                {@html questions.simpleClientInfo}
            </div>
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


