<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import config from '../assets/config'
    const dispatch = createEventDispatcher();

    export let id;

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{widgetData: false, tests: true}});
    }

</script>
<div class="container">
    <div class="col">
        <h1>Данные для вставки на сайт (Виджет)</h1>
        <p>
            <code>
                <samp>&lt;div id="sappfir-button" data-id="<kbd>{id}</kbd>">&lt;/div&gt;</samp>
                <samp>&lt;script src="{config.serverUrl}/widget.js"&gt;&lt;/script&gt;</samp>
            </code>
        </p>
        <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
    </div>
</div>