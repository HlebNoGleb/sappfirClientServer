<script>
// @ts-nocheck

    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import careerQuestions from '../../assets/defaultData/careerDefaultQuestions.json';
    import config from "../../assets/config.js";
    import { objectHelper } from '../../assets/objectsHelper';
    import FormFileView from '../common/formFileView.svelte';
    import Modal from '../common/modal.svelte';

    export let questions;
    export let settings;
    export let testType;
    export let update;

    let questionsId = questions ? questions._id : null;

    if (!questions || questions.questions.length == 0){
        setupDefault()
    }

    function setupDefault() {
        questions = careerQuestions;
    }

    async function saveQuestionsData(e) {
        const data = {};

        data.answers = questions.answers;
        data.questions = questions.questions;
        data.settingsId = settings._id;
        data.testTypeId = testType.id;

        const res = await fetch(`${config.serverUrl}/questions/`, {
            method: update ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
		})

		const json = await res.json();
        let result = json;
        if (res.status == 201){
            Swal.fire(
                'Отлично',
                'Вопросы сохранены!',
                'success'
            );
            update = true;
            questionsId = result._id;
            return null;
        }

        Swal.fire(
            'Ошибка',
            'Произошла ошибка, вопросы не сохранены',
            'error'
        );
        return null;
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{questions: true, questionsForm: false, loading: true}, data:{settings: settings}});
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
<h1>вопросы для карьеры</h1>

<Modal bind:show={showFiles}>
    <span slot="popup-header">Выберите изображение</span>
    <div slot="popup-content">
        <FormFileView path={`${questionsId}`} on:select={getSelectedImage}/>
    </div>
</Modal>

<form on:submit|preventDefault={saveQuestionsData}>
    {#each questions.questions as item, i}
        <div class="col my-2">
            <div class="card">
                <div class="card-body">
                    <div>
                        <label for="question_{i}" class="form-label">Вопрос #{i + 1}</label>
                        <input type="text" class="form-control" bind:value="{item.text}" name="question_{i}" id="question_{i}">
                        {#if update}
                            <div class="d-flex flex-column align-items-start g-2 my-2">
                                <input type="hidden" class="form-control" bind:value="{item.image}" name="image_{i}" id="image_{i}">
                                {#if item.image}
                                    <div class="flex">
                                        <img alt="" src={config.serverUrl + "/" + item.image} id="preview-image_{i}" style="max-width: 200px; margin-bottom: 10px;" />
                                        <button type="button" class="btn btn-danger" data-id="image_{i}" on:click={() => item.image = ""}>Удалить</button>
                                    </div>
                                {/if}
                                <button type="button" class="btn btn-primary" data-id="image_{i}" on:click={selectImage}>Выбрать изображение</button>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/each}
        <p>Ответы на вопросы</p>
    {#each questions.answers as item, i}
        <div class="col my-2">
            <div class="card">
                <div class="card-body">
                    <div>
                        <label for="answer_{i}" class="form-label">Ответ #{i}</label>
                        <input type="text" class="form-control" bind:value="{item}" name="answer_{i}" id="answer_{i}">
                    </div>
                </div>
            </div>
        </div>
    {/each}
    <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
    <button type="submit" class="btn btn-primary">Сохранить</button>
</form>