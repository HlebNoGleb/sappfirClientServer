<script>
// @ts-nocheck

    import config from '../assets/config';
    import {createEventDispatcher} from 'svelte';
    import psyhotypesClientData from "../assets/defaultData/psyhotypesClientData.json"
    import PsyhotypesChartText from './psyhotypesChartText.svelte';
    const dispatch = createEventDispatcher();
    export let settings;
    export let questions;

    if (questions.psyhotypesClientData && questions.psyhotypesClientData.length == 0){
        setupDefault()
    }

    function setupDefault(){
        questions.psyhotypesClientData = psyhotypesClientData;
        console.log(questions.psyhotypesClientData);
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{psyhotypesClientData: false, questions: true}, data:{settings: settings, questions: questions}});
    }

    function addPsyhotypeClientData(index) {
        questions.psyhotypesClientData[index].data.push({
                "name": "",
                "description": "",
                "image":"",
                "link": ""
            });
        questions = questions;
    }

    function deletePsyhotypeClientData(index) {
        questions.psyhotypesClientData[index].data.pop();
        questions = questions;
    }

    async function saveQuestionsData(e) {
        console.log(questions.psyhotypesClientData);
        const data = {
            id: questions._id,
            psyhotypesClientData: questions.psyhotypesClientData
        }

        const res = await fetch(`${config.serverUrl}/questions/psyhotypesClientData`, {
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

</script>

<div class="container">
    <form on:submit|preventDefault={saveQuestionsData}>
        {#each questions.psyhotypesClientData as item, i}
            <div class="col my-2">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">{questions.psyhotypesChartText.length > 0 ? questions.psyhotypesChartText[i].title : questions.psyhotypesClientData[i].title}</p>
                        {#each item.data as itemInput, j}
                            <div class="col my-2">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label for="name_{item.id}_{j}" class="form-label">Название</label>
                                            <input type="text" class="form-control" bind:value="{itemInput.name}" id="name_{item.id}_{j}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="description_{item.id}_{j}" class="form-label">Описание</label>
                                            <input type="text" class="form-control" bind:value="{itemInput.description}" id="description_{item.id}_{j}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="image_{item.id}_{j}" class="form-label">Картинка</label>
                                            <input type="text" class="form-control" bind:value="{itemInput.image}" id="image_{item.id}_{j}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="link_{item.id}_{j}" class="form-label">Ссылка</label>
                                            <input type="text" class="form-control" bind:value="{itemInput.link}" id="link_{item.id}_{j}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                        <div class="btn-group my-1" role="group">
                            <button type="button" class="btn btn-primary" on:click={()=> addPsyhotypeClientData(i)}>Добавить данные</button>
                            <button type="button" class="btn btn-outline-danger" on:click={()=> deletePsyhotypeClientData(i)}>Удалить данные</button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>

</div>