<script>
// @ts-nocheck

    import Select from 'svelte-select';
    import {createEventDispatcher} from 'svelte';
    import defaultSettings from '../../assets/defaultData/defaultSettings.json';
    import defaultTestTypes from '../../assets/defaultData/testTypes.json';
    import { objectHelper } from '../../assets/objectsHelper';
    import config from "../../assets/config.js";
    const dispatch = createEventDispatcher()

    export let settings;
    export let selectedDomain;

    let model = {
        name: "Название теста",
        description: "Описание теста",
        domainId: "",
        testTypeId: "1",
        help: "Помощь по тесту",
        image: "",
        color: {
            mainColor: "#ff0000",
            secondaryColor: "#ff0000",
            tertiaryColor: "#ff0000",
        },
        userData: {
            Name: true,
            FName: true,
            Email: true,
            Phone: true,
            Age: true,
            Sex: true,
            AgreeFL: true,
        },
        resultSettings:{
            VerticalMode: true,
            Chart: true,
            Info: true,
            ClientInfo: true,
            AfterTextToggle: true,
            AfterText: "Спасибо за прохождение теста"
        }
    }

    let imagePreview = null;
    let selectedTestType = null;
    let update = true;

    if (!settings){
        setupDefault();
        update = false;
    } else {
        setupAdditional()
        update = true;
    }

    function setupDefault() {
        settings = model;
        imagePreview = settings.image;
        selectedTestType = defaultTestTypes.find(x=>x.id == settings.testTypeId);
        console.log(selectedTestType);
        // updateTypeDescriptions();
    }

    function setupAdditional() {
        imagePreview = settings.image;
        selectedTestType = defaultTestTypes.find(x=>x.id == settings.testTypeId);
        Object.assign(model, {_id:''})
    }

    async function saveDomainData(e){
        const formData = new FormData(e.target);
        const modelKeys = objectHelper.getAllKeys(model);

        let resObj = {};

        modelKeys.forEach(element => {
            let value = formData.get(element) ?? objectHelper.getDefaultValueByType(objectHelper.getNestedValue(element, model));

            if (value == "on"){
                value = true;
            }

            objectHelper.createNestedObject( resObj, element.split('.'), value );
        });

        console.log(resObj);

        const res = await fetch(`${config.serverUrl}/settings/`, {
            method: update ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(resObj),
		})

		const json = await res.json();
		let result = JSON.stringify(json);
        console.log(result);

        if (!update){
            updateState({state:{tests: true, testSettings: false, loading: true}})
        } else {
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
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

</script>

<!-- {#if settings} -->
    <div class="container">
        <form on:submit|preventDefault={saveDomainData}>
            <div class="mb-3">
                <label for="domainId">Домен</label>
                <p>{selectedDomain.name}</p>
                <input type="hidden" name="domainId" value="{selectedDomain._id}">
            </div>
            <div class="mb-3">
                <!-- <label for="name">Название теста</label> -->
                <input type="text" class="form-control" id="name" name="name" value={settings.name} required/>
                {#if settings._id}
                    <input type="hidden" name="_id" value={settings._id} />
                {/if}
            </div>
            <div class="mb-3">
                <label for="description">Тип теста</label>
                <Select items={defaultTestTypes} clearable={false} id={'testTypeId'} bind:value={selectedTestType} placeholder={'Выберите тип теста'} itemId={'id'} label={'name'}></Select>
                {#if selectedTestType}
                    <div class="form-text">{selectedTestType?.description}</div>
                    <input type="hidden" name="testTypeId" value={selectedTestType.id} />
                {/if}
            </div>
            <div class="mb-3">
                <label for="description">Описание теста</label>
                <textarea class="form-control" id="description" name="description" rows="3" required>{settings.description}</textarea>
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
            <div class="mb-3" style="display: none">
                <label for="color">Цвета</label>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="color.mainColor">Основной цвет</label>
                            <input type="color" class="form-control" id="color.mainColor" name="color.mainColor" value={settings.color.mainColor} />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="color.secondaryColor">Вторичный цвет</label>
                            <input type="color" class="form-control" id="color.secondaryColor" name="color.secondaryColor" value={settings.color.secondaryColor} />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="color.tertiaryColor">Тертичный цвет</label>
                            <input type="color" class="form-control" id="color.tertiaryColor" name="color.tertiaryColor" value={settings.color.tertiaryColor} />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="">Информация о пользователе</label>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.Name" type="checkbox" role="switch" id="userData.Name" checked={settings.userData.Name}>
                    <label class="form-check-label" for="userData.Name">Имя</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.FName" type="checkbox" role="switch" id="userData.FName" checked={settings.userData.FName}>
                    <label class="form-check-label" for="userData.FName">Фамилия</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.Email" type="checkbox" role="switch" id="userData.Email" checked={settings.userData.Email}>
                    <label class="form-check-label" for="userData.Email">E-mail</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.Phone" type="checkbox" role="switch" id="userData.Phone" checked={settings.userData.Phone}>
                    <label class="form-check-label" for="userData.Phone">Телефон</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.Age" type="checkbox" role="switch" id="userData.Age" checked={settings.userData.Age}>
                    <label class="form-check-label" for="userData.Age">Возраст</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.Sex" type="checkbox" role="switch" id="userData.Sex" checked={settings.userData.Sex}>
                    <label class="form-check-label" for="userData.Sex">Пол</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="userData.AgreeFL" type="checkbox" role="switch" id="userData.AgreeFL" checked={settings.userData.AgreeFL}>
                    <label class="form-check-label" for="userData.AgreeFL">Соглашение с ФЗ-152</label>
                </div>
            </div>
            <div class="mb-3">
                <label for="">Вывод результата</label>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="resultSettings.VerticalMode" type="checkbox" role="switch" id="resultSettings.VerticalMode" checked={settings.resultSettings.VerticalMode}>
                    <label class="form-check-label" for="resultSettings.VerticalMode">Вертикаьный вид вопросов</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="resultSettings.Chart" type="checkbox" role="switch" id="resultSettings.Chart" checked={settings.resultSettings.Chart}>
                    <label class="form-check-label" for="resultSettings.Chart">График</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="resultSettings.Info" type="checkbox" role="switch" id="resultSettings.Info" checked={settings.resultSettings.Info}>
                    <label class="form-check-label" for="resultSettings.Info">Информация</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="resultSettings.ClientInfo" type="checkbox" role="switch" id="resultSettings.ClientInfo" checked={settings.resultSettings.ClientInfo}>
                    <label class="form-check-label" for="resultSettings.ClientInfo">Клиентская информация</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" name="resultSettings.AfterTextToggle" type="checkbox" role="switch" id="resultSettings.AfterTextToggle" checked={settings.resultSettings.AfterTextToggle}>
                    <label class="form-check-label" for="resultSettings.AfterTextToggle">Информация после прохождения теста</label>
                </div>
                <div class="mb-3">
                    <label for="resultSettingsAfterText">Информация после прохождения теста</label>
                    <textarea class="form-control" id="resultSettings.AfterText" name="resultSettings.AfterText" rows="3">{settings.resultSettings.AfterText}</textarea>
                    <div class="form-text">*Поддерживает HTML (встроен Bootstrap 5)</div>
                </div>
            </div>

            <button type="button" class="btn btn-outline-primary" on:click={() => updateState({state:{tests: true, testSettings: false}})}>Назад</button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
        </form>
    </div>
<!-- {/if} -->

<style>
    .container{
		width: min(30rem, 90%);
	}

    .image-preview{
        max-width: 160px;
        border-radius: 10px;
    }
</style>