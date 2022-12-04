<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import { each, is_client } from 'svelte/internal';
    import psyhotypes from '../staticData/psychotypes.json'
    import config from "../assets/config.js";
    // import defaultQuestions
    const dispatch = createEventDispatcher();

    export let id;
    console.log(id);
    let update = false;

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{resultClientInfo: false, domainSettings: true}});
    }

    async function saveResultClientInfo(e) {
        const formData = new FormData(e.target);
        const formDataFields = [];
        let data = {};
        let finalObj = {}

        for (let field of formData) {
            const [key, value] = field;
            formDataFields.push(field);
        }

		psyhotypes.forEach(element => {
            let name = element.name;
            let retObj = {};
            retObj[name] = [];
            let currentIndex = 0;
            let currentObj = {};

            formDataFields.forEach(element => {
                if (element[0].includes(name)){
                    let inputName = element[0].split("-")[1];
                    let index = element[0].split("-")[2];
                    if (index == currentIndex) {
                        let obj = {};
                        obj[inputName] = element[1];
                        Object.assign(currentObj, obj);
                    } else {
                        currentIndex = index;
                        retObj[name].push(currentObj);
                        currentObj = {};
                        let obj = {};
                        obj[inputName] = element[1];
                        Object.assign(currentObj, obj);
                    }
                }
            });
            retObj[name].push(currentObj);
            Object.assign(data, retObj);
        });

        Object.assign(finalObj, {resultClientData: data})
        Object.assign(finalObj, {_id: id});

        console.log(finalObj);

        const res = await fetch(`${config.serverUrl}/settings/`, {
            method: update ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalObj),
		})

		const json = await res.json();
		let result = JSON.stringify(json);
        console.log(result);
    }

</script>

<div class="container">
    <form on:submit|preventDefault={saveResultClientInfo}>
        {#each psyhotypes as psyhotype}
            <div class="mb-5">
                <h3>Информация для {psyhotype.title}</h3>
                {#each [0,1,2,3] as _, index}
                <div class="mb-4 border border-1 p-2 rounded">
                    <div class="mb-2">
                        <label for="title" class="form-label">Название</label>
                        <input type="text" class="form-control" id="title" name="{psyhotype.name}-title-{index}" value="">
                    </div>
                    <div class="mb-2">
                        <label for="description" class="form-label">Описание</label>
                        <textarea class="form-control" id="description" name="{psyhotype.name}-description-{index}" rows="3"></textarea>
                    </div>
                    <div class="mb-2">
                        <label for="link" class="form-label">Ссылка</label>
                        <input type="text" class="form-control" id="link" name="{psyhotype.name}-link-{index}" value="">
                    </div>
                    <!-- <div class="mb-2">
                        <label for="formFile" class="form-label">Изображение</label>
                        <input class="form-control" type="file" id="formFile">
                    </div> -->
                </div>
                {/each}
            </div>
        {/each}
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
	    <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
</div>

<style>
    .container{
		width: min(30rem, 90%);
	}
</style>