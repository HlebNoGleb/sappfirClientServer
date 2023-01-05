<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import config from "../../assets/config.js";
    import {onMount} from "svelte";

    export let selectedDomain;
    let settingsArray = [];

    onMount(async () => {
        getAllSettings();
    });

    async function getAllSettings() {
        settingsArray = [];
        const req = await fetch(`${config.serverUrl}/settings/?domain=${selectedDomain._id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
      	});

      	let data = await req.json();

        if (data && data.length > 0){
            settingsArray = data;
        }

        console.log(data);

        setTimeout(() => {
			updateState({state:{loading: false}})
		}, 100);
    }


    function updateState(data) {
        dispatch('updateState', data)
    }

    function addNewTest(){
        updateState({state:{tests: false, testSettings: true}, data:{selectedDomain: selectedDomain}});
    }

    function editTestSettings(settings){
        updateState({state:{tests: false, testSettings: true}, data:{settings: settings, selectedDomain: selectedDomain}});
    }

    function editTestQuestions(settings){
        updateState({state:{tests: false, questions: true, loading: true}, data:{settings: settings}});
    }

    function getWidget(id){
        updateState({state:{tests: false, widgetData: true}, data:{id: id}});
    }

    function goBack(){
        updateState({state:{domainSelect: true, tests: false}});
    }

    async function deleteTest(id) {
        const res = await fetch(`${config.serverUrl}/settings?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
		})

        const json = await res.json();
		let result = JSON.stringify(json);
        console.log(result);
        getAllSettings();
    }
</script>
{#if settingsArray && settingsArray.length > 0}
    <div class="container">
        <div class="col">
            {#each settingsArray as item}
                <div class="col my-2">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">{item.name}</h5>
                        <p class="card-text">{item.description}</p>
                        <div class="btn-group my-1" role="group">
                            <button type="button" on:click={() => editTestSettings(item)} class="btn btn-outline-primary">Настройки</button>
                            <button type="button" on:click={() => editTestQuestions(item)} class="btn btn-primary">Вопросы</button>
                        </div>
                            <button type="button" on:click={() => deleteTest(item._id)} class="btn btn-danger">Удалить</button>
                            <button type="button" on:click={() => getWidget(item._id)} class="btn btn-dark">Виджет</button>
                        </div>
                    </div>
                </div>
            {/each}
            <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
            <button type="button" class="btn btn-primary" on:click={() => addNewTest()}>Добавить</button>
        </div>
    </div>
{:else}
<div class="container">
    <div class="col">
        <div class="col">
        <p>Для домена <code>{selectedDomain.name}</code> тестов нет.</p>
    </div>
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        <button type="button" class="btn btn-primary" on:click={() => addNewTest()}>Добавить</button>
    </div>
</div>
{/if}