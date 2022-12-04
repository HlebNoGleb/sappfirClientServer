<script>
    import {createEventDispatcher} from 'svelte';
    import testTypes from '../assets/defaultData/testTypes.json'
    import defaultQuestionsType1 from '../assets/defaultData/defaultQuestionsType1.json'
    import defaultQuestionsType2 from '../assets/defaultData/defaultQuestionsType2.json'
    import {onMount} from "svelte";
    import Select from 'svelte-select'
    import config from "../assets/config.js";
    const dispatch = createEventDispatcher();

    export let questions;
    export let type;
    export let id;
    export let update;

    let showQuestions = false

    let selectedType = testTypes.find(x => x.id == type);

    async function saveQuestionsData(e){
        const formData = new FormData(e.target);
        const data = {};
        const answers = [];
        const questions = [];
		formData.forEach((value, key) => {
            if (key.includes('answer')){
                const newKey = key.split('_');
                const answer = {
                    id: newKey[1],
                    value: value
                }
                answers.push(answer);
            } else if (key.includes('question')){

                const newKey = key.split('_');
                const question = {
                    id: newKey[1],
                    value: value
                }
                questions.push(question);
            } else {
                data[key] = value;
            }

            data.answers = answers;
            data.questions = questions;
            data.testId = id;
            data.type = selectedType.id;
		});

        const res = await fetch(`${config.serverUrl}/questions/`, {
            method: update ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data),
		})

		const json = await res.json();
		let result = JSON.stringify(json);
        console.log(result);
    }

    onMount(async () => {
        if (questions && Object.keys(questions).length === 0) {
            getDefaultQuestionByType()
        } else {
            showQuestions = true;
        }
    });

    function getDefaultQuestionByType(){
        let id = selectedType.id;
        switch (id) {
            case '1':
            questions = defaultQuestionsType1
                break;
            case '2':
            questions = defaultQuestionsType2
                break;
            default:
            questions = defaultQuestionsType1
                break;
        }
        showQuestions = true;
    }

    function goBack(){
        updateState({state:{domainSettings: true, questionsForm: false}});
    }

    function updateState(data) {
        dispatch('updateState', data)
    }
</script>

<div class="container">
    <form on:submit|preventDefault={saveQuestionsData}>
        <div class="mb-3">
            {#if update}
                <p>Вопросы для теста с типом: {selectedType.name}</p>
            {:else}
                <Select items={testTypes} on:change={getDefaultQuestionByType} bind:value={selectedType} id={'type'} inputAttributes={{name: 'type'}} placeholder={'Выберите тип теста'} itemId={'id'} label={'name'}></Select>
            {/if}
        </div>
        {#if showQuestions}
            {#each questions.questions as item}
                <div class="col my-2">
                    <div class="card">
                        <div class="card-body">
                            <div>
                                <label for="question_{item.id}" class="form-label">Вопрос #{item.id}</label>
                                <input type="text" class="form-control" value="{item.value}" name="question_{item.id}" id="question_{item.id}">
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
            <p>Ответы на вопросы</p>
            {#each questions.answers as item}
                <div class="col my-2">
                    <div class="card">
                        <div class="card-body">
                            <div>
                                <label for="answer_{item.id}" class="form-label">Ответ #{item.id}</label>
                                <input type="text" class="form-control" value="{item.value}" name="answer_{item.id}" id="answer_{item.id}">
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
        <div class="mb-3"></div>
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
</div>

<style>
    .container{
		width: min(35rem, 90%);
	}
</style>