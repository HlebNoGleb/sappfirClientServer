<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import testTypes from '../assets/defaultData/testTypes.json'
    import Select from 'svelte-select'
    import QuestionsEditForm from './questionsEditForm.svelte';
    import config from "../assets/config.js";
    // import defaultQuestions
    const dispatch = createEventDispatcher();

    export let id;
    let questions = null;
    let questionsArray = [];
    let update = false;
    let type = testTypes[0].id;
    console.log(type);

    onMount(async () => {
        const req = await fetch(`${config.serverUrl}/questions/?test=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
      	});

      	let data = await req.json();

        if (data && data.length > 0){
            update = true
            if (data.length > 1){
                console.log(1);
                // console.log(data);
                questionsArray = data;
                questions = [];
            } else {
                console.log(2);
                console.log(data);
                questions = data[0];
                type = data[0].type;
                questionsArray = [];
            }

        } else {
            console.log(3);
            questions = {}
            questionsArray = [];
            type = testTypes[0].id;
            update = false;
        }

        setTimeout(() => {
			updateState({state:{loading: false}})
		}, 1000);
    });

    function updateState(data) {
        dispatch('updateState', data)
    }

    function updateStateFromChild(data){
        updateState(data.detail);
    }

    // $: {
    //     console.log(testType);
    // }

</script>

<!-- {#if questionsArray && questionsArray.length > 0}
<div class="col">
    {#each questionsArray as item}
        <div class="col my-2">
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">{item.name}</h5>
                <p class="card-text">{item.description}</p>
                <p class=" mb-1 card-text">Редактировать:</p>
                <button type="button" class="btn btn-outline-primary">Изменить</button>
                </div>
            </div>
        </div>
    {/each}
    <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
    <button type="button" class="btn btn-primary">Добавить</button>
</div>
{/if} -->


{#if questions}
    <QuestionsEditForm on:updateState={updateStateFromChild} id={id} questions={questions} type={type} update={update}/>
{/if}

