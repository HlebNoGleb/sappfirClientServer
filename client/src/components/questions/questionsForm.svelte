<script>
// @ts-nocheck

    import {createEventDispatcher} from 'svelte';
    import Select from 'svelte-select'
    import defaultTestTypes from '../../assets/defaultData/testTypes.json';
    import CareerQuestions from '../questionsForms/careerQuestions.svelte';
    import MotiveQuestions from '../questionsForms/motiveQuestions.svelte';

    const questionComponents = [
        {
            name: "CareerQuestions",
            component: CareerQuestions
        },
        {
            name: "MotiveQuestions",
            component: MotiveQuestions
        }
    ]

    const dispatch = createEventDispatcher();

    export let settings;
    export let questions;

    let selectedTestType = null;
    let update = false;
    let questionsForm = questionComponents[0]["component"];

    if (questions){
        setupByQuestions();
    } else {
        setupDefault();
    }

    function setupByQuestions(){
        update = true;
        selectedTestType = defaultTestTypes.find(x=>x.id == questions.testTypeId);
        getQuestionsFormByType(selectedTestType);
    }

    function setupDefault(){
        update = false;
        selectedTestType = defaultTestTypes.find(x=>x.id == settings.testTypeId);
        getQuestionsFormByType(selectedTestType);
    }

    function getQuestionsFormByType(testType) {
        questionsForm = questionComponents.find(x=> x.name == selectedTestType.component)["component"];
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function updateStateFromChild(data) {
        updateState(data.detail)
    }

</script>

<div class="container">
    <div class="col">
        <h1>Добавление вопросов для {settings.name}</h1>
        {#if !update}
            <Select items={defaultTestTypes} clearable={false} on:change={() => getQuestionsFormByType(selectedTestType)} bind:value={selectedTestType} id={'type'} placeholder={'Выберите тип теста'} itemId={'id'} label={'name'}></Select>
        {/if}
        <svelte:component this={questionsForm} update={update} questions={questions} settings={settings} testType={selectedTestType} on:updateState={updateStateFromChild}/>
    </div>
</div>

<style>
    .container{
		width: min(50rem, 90%);
	}
</style>

