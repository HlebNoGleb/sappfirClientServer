<script>
// @ts-nocheck

    import config from '../assets/config';
    import {createEventDispatcher} from 'svelte';
    import psyhotypesClientData from "../assets/defaultData/psyhotypesClientData.json"
    import PsyhotypesChartText from './psyhotypesChartText.svelte';
    import FormFileView from './common/formFileView.svelte';
    import Modal from './common/modal.svelte';
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

    let showFiles = false;
    let selectedImage = null;
    let selectedInput = null;

    function getSelectedImage(data) {
       const selectedInputId = selectedInput.getAttribute("id");
       selectedImage = data.detail;
       selectedInput.value = selectedImage;

       var event = new Event('input');
       selectedInput.dispatchEvent(event);

       selectedInput.value = selectedImage;

       const previewImage = document.getElementById(`preview-${selectedInputId}`);
    //    previewImage.src = config.serverUrl + "/" + data.detail;

       showFiles = false;
       console.log(questions.questions[0]);
    }

    function selectImage(e) {
        const selectedInputId = e.target.getAttribute("data-id");
        console.log(selectedInputId);
        const input = document.getElementById(selectedInputId);

        if (!input) {
            console.log("Нет инпута")
            return;
        }

        selectedInput = input;
        showFiles = true;
    }

</script>

<div class="container">
    <Modal bind:show={showFiles}>
        <span slot="popup-header">Выберите изображение</span>
        <div slot="popup-content">
            <FormFileView path={`${questions._id}/psyhotypesClientData`} on:select={getSelectedImage}/>
        </div>
    </Modal>
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
                                            <input type="hidden" class="form-control" bind:value="{itemInput.image}" id="image_{item.id}_{j}">
                                            {#if itemInput.image}
                                                <div class="flex">
                                                    <img alt="" src={config.serverUrl + "/" + itemInput.image} id="preview-image_{item.id}_{j}" style="max-width: 200px; margin-bottom: 10px;" />
                                                    <button type="button" class="btn btn-danger" data-id="image_{item.id}_{j}" on:click={() => itemInput.image = ""}>Удалить</button>
                                                </div>
                                            {/if}
                                            <button type="button" class="btn btn-primary" data-id="image_{item.id}_{j}" on:click={selectImage}>Выбрать изображение</button>
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