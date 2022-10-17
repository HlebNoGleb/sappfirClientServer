<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import { each, is_client } from 'svelte/internal';
    import psyhotypes from '../staticData/psychotypes.json'
    // import defaultQuestions
    const dispatch = createEventDispatcher();

    export let id;

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{resultClientInfo: false, domainSettings: true}});
    }

    function saveResultClientInfo(e) {
        const formData = new FormData(e.target);
        let data = [];
        const formDataFields = [];
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
            console.log(retObj);
        });
    }

    let obj = {
        maverik:[
            {
                title: 1234,
                description: 12345,
                link: 123456,
            },
            {
                title: 1234,
                description: 12345,
                link: 123456,
            }
        ]
    }

</script>

<div>
    <form on:submit|preventDefault={saveResultClientInfo}>
        {#each psyhotypes as psyhotype}
            <div class="mb-5">
                <h3>Информация для {psyhotype.title}</h3>
                {#each [0,1,2,3] as _, index}
                <div class="mb-4 border border-1 p-2 rounded">
                    <div class="mb-2">
                        <label for="title" class="form-label">Название</label>
                        <input type="text" class="form-control" id="title" name="{psyhotype.name}-title-{index}" value="{psyhotype.title}-{index}">
                    </div>
                    <div class="mb-2">
                        <label for="description" class="form-label">Описание</label>
                        <input type="text" class="form-control" id="description" name="{psyhotype.name}-description-{index}" value="{psyhotype.title}-{index}-{index}">
                    </div>
                    <div class="mb-2">
                        <label for="link" class="form-label">Ссылка</label>
                        <input type="text" class="form-control" id="link" name="{psyhotype.name}-link-{index}" value="http://localhost:5173/">
                    </div>
                    <div class="mb-2">
                        <label for="formFile" class="form-label">Изображение</label>
                        <input class="form-control" type="file" id="formFile">
                    </div>
                </div>
                {/each}
            </div>
        {/each}
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
	    <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
</div>