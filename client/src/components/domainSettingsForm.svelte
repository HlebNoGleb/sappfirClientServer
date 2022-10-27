<script>
    import Select from 'svelte-select';
    import {createEventDispatcher} from 'svelte';
    import defaultSettings from '../assets/defaultData/defaultSettins.json'
    import testTypes from '../assets/defaultData/testTypes.json'
    import {onMount} from "svelte";
    import config from "../assets/config.js";
    const dispatch = createEventDispatcher()

    export let selectedDomain;
    export let domains;

    let settings = null;
    let settingsArray = [];
    let imagePreview = null;
    let update = false;

    let testType = null;

    // $: {
    //     console.log(settings);
    // }

    onMount(async () => {
        const req = await fetch(`${config.serverUrl}/settings/?domain=${selectedDomain._id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
      	});

      	let data = await req.json();
        // console.log(data);

        if (data && data.length > 0){
            if (data.length > 1){
                settingsArray = data;
                update = true;
            } else {
                settingsArray = data;
                update = true;
            }
        } else {
            addNewTest();
        }

        setTimeout(() => {
			updateState({state:{loading: false}})
		}, 1000);
    });

    async function saveDomainData(e){
        const formData = new FormData(e.target);
        const data = {};
        let color = {};
        let userData = {};
        let resultSettings = {};
		formData.forEach((value, key) => {
            if (key.includes('Color')){
                color[key] = value;
            } else if (key.includes('userData')){
                userData[key.slice(8)] = value;
            } else if (key.includes('resultSettings')){
                resultSettings[key.slice(14)] = value;
            } else {
                data[key] = value;
            }
		});

        data.color = color;
        data.userData = userData;
        data.resultSettings = resultSettings;

		console.log(data, update);

        const res = await fetch(`${config.serverUrl}/settings/`, {
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

    function editTestSettings(id){
        settings = settingsArray.find(x => x._id == id);
        imagePreview = settings.image;
        let settingsType = testTypes.filter(x=> x.id == settings.type)[0];
        testType = settingsType ? settingsType : testTypes[0];
        settingsArray = [];
    }

    function editTestQuestions(id){
        updateState({state:{domainSettings: false, questionsForm: true}, data:{id: id}});
    }

    function editResultInfo(id){
        updateState({state:{domainSettings: false, resultInfo: true}, data:{id: id}});
    }

    function editResultClientInfo(id){
        updateState({state:{domainSettings: false, resultClientInfo: true}, data:{id: id}});
    }

    function showAnswers(id){
        updateState({state:{domainSettings: false, answers: true}, data:{id: id}});
    }

    function goBack(){
        updateState({state:{domainSelect: true, domainSettings: false}});
    }

    function addNewTest(){
        settingsArray = [];
        settings = defaultSettings;
        imagePreview = settings.image;
        let settingsType = testTypes.filter(x=> x.id == settings.type)[0];
        testType = settingsType ? settingsType : testTypes[0];
        update = false;
    }

    function updateState(data) {
        dispatch('updateState', data)
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
    }
</script>

{#if settings}
<form on:submit|preventDefault={saveDomainData}>
    <div class="mb-3">
        <label for="name">Название теста</label>
        <input type="text" class="form-control" id="name" name="name" value={settings.name} required/>
        {#if settings._id}
            <input type="hidden" name="_id" value={settings._id} />
        {/if}
    </div>
    <div class="mb-3">
        <label for="description">Описание теста</label>
        <textarea class="form-control" id="description" name="description" rows="3" required>{settings.description}</textarea>
    </div>
    <div class="mb-3">
        <label for="domainId">Домен</label>
        <Select value={selectedDomain} items={domains} inputAttributes={{name:'domainId'}} id={'domainId'} placeholder={'Выберите домен'} itemId={'_id'} label={'name'}></Select>
    </div>
    <div class="mb-3">
        <label for="help">Помощь по тесту</label>
        <textarea class="form-control" id="help" name="help" rows="3" required>{settings.help}</textarea>
    </div>
    <div class="mb-3">
        <label for="image">Изображение</label>
        <input type="text" class="form-control" id="image" name="image" bind:value={imagePreview} />
        {#if imagePreview}
            <img class="image-preview my-2" src={imagePreview} alt="Изображение" />
        {/if}
    </div>
    <div class="mb-3">
        <label for="color">Цвета</label>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="mainColor">Основной цвет</label>
                    <input type="color" class="form-control" id="mainColor" name="mainColor" value={settings.color.mainColor} />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="secondaryColor">Вторичный цвет</label>
                    <input type="color" class="form-control" id="secondaryColor" name="secondaryColor" value={settings.color.secondaryColor} />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="tertiaryColor">Тертичный цвет</label>
                    <input type="color" class="form-control" id="tertiaryColor" name="tertiaryColor" value={settings.color.tertiaryColor} />
                </div>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label for="">Информация о пользователе</label>
        <div class="form-check form-switch">
            <input class="form-check-input" name="userDataName" type="checkbox" role="switch" id="userDataName" checked>
            <label class="form-check-label" for="userDataName">Имя</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataFName" type="checkbox" role="switch" id="userDataFName">
            <label class="form-check-label" for="userDataFName">Фамилия</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataEmail" type="checkbox" role="switch" id="userDataEmail" checked>
            <label class="form-check-label" for="userDataEmail">E-mail</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataPhone" type="checkbox" role="switch" id="userDataPhone">
            <label class="form-check-label" for="userDataPhone">Телефон</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataAge" type="checkbox" role="switch" id="userDataAge" checked>
            <label class="form-check-label" for="userDataAge">Возраст</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataSex" type="checkbox" role="switch" id="userDataSex" checked>
            <label class="form-check-label" for="userDataSex">Пол</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" name="userDataAgreeFL" type="checkbox" role="switch" id="userDataAgreeFL" checked>
            <label class="form-check-label" for="userDataAgreeFL">Соглашение с ФЗ-152</label>
          </div>
    </div>
    <div class="mb-3">
        <label for="">Вывод результата</label>
        <div class="form-check form-switch">
            <input class="form-check-input" name="resultSettingsChart" type="checkbox" role="switch" id="resultSettingsChart" checked>
            <label class="form-check-label" for="resultSettingsChart">График</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" name="resultSettingsInfo" type="checkbox" role="switch" id="resultSettingsInfo" checked>
            <label class="form-check-label" for="resultSettingsInfo">Информация</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" name="resultSettingsClientInfo" type="checkbox" role="switch" id="resultSettingsClientInfo" checked>
            <label class="form-check-label" for="resultSettingsClientInfo">Клиентская информация</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" name="resultSettingsAfterTextToggle" type="checkbox" role="switch" id="resultSettingsAfterTextToggle" checked>
            <label class="form-check-label" for="resultSettingsAfterTextToggle">Информация после прохождения теста</label>
        </div>
        <div class="mb-3">
            <label for="resultSettingsAfterText">Информация после прохождения теста</label>
            <textarea class="form-control" id="resultSettingsAfterText" name="resultSettingsAfterText" rows="3" required>{settings.resultSettings.AfterText}</textarea>
            <div class="form-text">*Поддерживает HTML (встроен Bootstrap 5)</div>
        </div>
    </div>


    <button type="button" class="btn btn-outline-primary" on:click={() => updateState({state:{domainSettings: false, domainSelect: true}})}>Назад</button>
    <button type="submit" class="btn btn-primary">Сохранить</button>
</form>
{/if}

{#if settingsArray && settingsArray.length > 0}
<div class="col">
    {#each settingsArray as item}
        <div class="col my-2">
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">{item.name}</h5>
                <p class="card-text">{item.description}</p>
                <div class="btn-group my-1" role="group">
                    <button type="button" on:click={() => editTestSettings(item._id)} class="btn btn-outline-primary">Настройки</button>
                    <button type="button" on:click={() => editTestQuestions(item._id)} class="btn btn-primary">Вопросы</button>
                </div>
                <div class="btn-group my-1" role="group">
                    <button type="button" on:click={() => editResultInfo(item._id)} class="btn btn-outline-success" disabled>Расшифровка графика</button>
                    <button type="button" on:click={() => editResultClientInfo(item._id)} class="btn btn-success">Информация клиента</button>
                </div>
                <div class="btn-group my-1" role="group">
                    <button type="button" on:click={() => showAnswers(item._id)} class="btn btn-outline-info">Ответы</button>
                </div>
                    <button type="button" on:click={() => deleteTest(item._id)} class="btn btn-danger">Удалить</button>
                </div>
            </div>
        </div>
    {/each}
    <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
    <button type="button" class="btn btn-primary" on:click={() => addNewTest()}>Добавить</button>
</div>
{/if}

<style>
    .image-preview{
        max-width: 160px;
        border-radius: 10px;
    }
</style>