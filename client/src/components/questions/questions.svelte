<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import defaultTestTypes from '../../assets/defaultData/testTypes.json';
    import config from "../../assets/config.js";
    const dispatch = createEventDispatcher();

    export let settings;
    let questionsArray = [];

    onMount(async () => {
        getAllQuestions();
    });

    async function getAllQuestions() {
        questionsArray = [];
        const req = await fetch(`${config.serverUrl}/questions/?settingsId=${settings._id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
      	});

      	let data = await req.json();
        console.log(data);

        if (data && data.length > 0){
            questionsArray = data;
        }

        setTimeout(() => {
			updateState({state:{loading: false}})
		}, 100);
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{questions: false, tests: true, loading: true}});
    }

    function addNewQuestions() {
        updateState({state:{questionsForm: true, questions: false}, data: {settings: settings, questions: null}});
    }

    function editQuestions(questions) {
        console.log(questions);
        updateState({state:{questionsForm: true, questions: false}, data: {settings: settings, questions: questions}});
    }

    function editPsyhotypesChartText(questions){
        updateState({state:{questions: false, psyhotypesChartText: true}, data:{settings: settings, questions: questions}});
    }

    function editPsyhotypesClientData(questions){
        updateState({state:{questions: false, psyhotypesClientData: true}, data:{settings: settings, questions: questions}});
    }

    function editSimpleClientInfo(questions){
        updateState({state:{questions: false, simpleClientInfo: true}, data:{settings: settings, questions: questions}});
    }

    function showAnswers(questions){
        updateState({state:{questions: false, answers: true}, data:{questions: questions, settings: settings}});
    }

    async function deleteQuestions(id) {
        const req = await fetch(`${config.serverUrl}/questions/?id=${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
      	});

        if (req.status == 201){
            getAllQuestions();
        }
    }

</script>

{#if questionsArray && questionsArray.length > 0}
<div class="container">
    <div class="col">
        <h1>Вопросы для - <code>'{settings.name}'</code></h1>
        {#each questionsArray as item}
            <div class="col my-2">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{defaultTestTypes.find(x=>x.id == item.testTypeId)["name"]}</h5>
                        <span class="d-block my-2 card-text">{defaultTestTypes.find(x=>x.id == item.testTypeId)["description"]}</span>
                        <div class="btn-group my-1" role="group">
                            <button type="button" on:click={() => editQuestions(item)} class="btn btn-outline-primary my-1">Вопросы</button>
                            <button type="button" on:click={() => showAnswers(item)} class="btn btn-outline-info my-1">Ответы</button>
                            <!-- <button type="button" on:click={() => editQuestions(item)} disabled class="btn btn-outline-primary my-1">Настройки</button> -->
                        </div>
                        <button type="button" on:click={() => deleteQuestions(item._id)} class="btn btn-outline-danger my-1">Удалить</button>
                        <div class="col">
                            <span class="d-block mt-2">Настройки результатов</span>
                            <div class="btn-group my-1" role="group">
                                {#if defaultTestTypes.find(x=>x.id == item.testTypeId)["resultSettings"]["psyhotypesChartText"]}
                                    <button type="button" on:click={() => editPsyhotypesChartText(item)} class="btn btn-outline-success">Расшифровка графика психотипов</button>
                                {/if}
                                {#if defaultTestTypes.find(x=>x.id == item.testTypeId)["resultSettings"]["resultClientInfo"]}
                                    <button type="button" on:click={() => editPsyhotypesClientData(item)} class="btn btn-outline-success">Информация клиента по психотипам</button>
                                {/if}
                                {#if defaultTestTypes.find(x=>x.id == item.testTypeId)["resultSettings"]["simpleResult"]}
                                    <button type="button" on:click={() => editSimpleClientInfo(item)} class="btn btn-outline-success">Информация клиента</button>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="button" class="btn btn-primary" disabled={questionsArray.length == defaultTestTypes.length} on:click={() => addNewQuestions()}>Добавить</button>
    </div>
</div>
{:else}
<div class="container">
    <div class="col">
        <div class="col">
        <p>Для <code>'{settings.name}'</code> вопросов нет.</p>
    </div>
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="button" class="btn btn-primary" on:click={() => addNewQuestions()}>Добавить</button>
    </div>
</div>
{/if}

<style>
    .container{
		width: min(50rem, 95%);
	}
</style>

