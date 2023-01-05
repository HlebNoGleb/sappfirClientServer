<script>
    import {onMount} from "svelte";
    import config from "../../assets/config.js";
    import { objectHelper } from '../../assets/objectsHelper';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    export let path;

    console.log(path);

    let data = {
        images:[],
        path:""
    };

    let noData = false;

    onMount(async () => {
        getFiles();
    });

    async function getFiles(){
        const res = await fetch(`${config.serverUrl}/getFiles/?path=${path}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        const json = await res.json();
        console.log(json);
        if (json.error){
            noData = true;
            return;
        }

        noData = false;
        data = json;
    }

    function selectImage(e) {
        const data = e.target.getAttribute('data-path');
        console.log(data);
        dispatch('select', data)
    }

    async function update(event, path) {
        objectHelper.uploadFiles(event, path);
        getFiles();
    }

</script>
<form on:submit|preventDefault={ event=> update(event, path)}>
    <input type="file" multiple name="sampleFile" id="file">
    <button type="submit" class="btn btn-primary">Добавить</button>
</form>
{#if noData}
    <p>Нет файлов</p>
{:else}
<div class="row row-cols-1 row-cols-md-3 g-4">
    {#each data.images as img}
        <div class="col">
          <div class="card h-100 justify-content-between">
            <img src="{config.serverUrl}/{data.path}/{img}" alt="" class="card-img-top" style="max-width: 100%; min-width: 20px;" data-path="{data.path}/{img}" on:click={selectImage}/>
            <div class="card-footer">
              <small class="text-muted">{img}</small>
            </div>
          </div>
        </div>
    {/each}
</div>
{/if}


<style>
    .card {
        pointer-events: none;
        transition: .2s transform ease;
    }

    img {
        pointer-events: auto;
        cursor: pointer;
    }

    .card:hover {
        transform: scale(1.02);
    }
</style>