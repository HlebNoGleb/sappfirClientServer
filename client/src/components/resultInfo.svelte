<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    // import defaultQuestions
    const dispatch = createEventDispatcher();

    export let id;

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{resultInfo: false, domainSettings: true}});
    }
</script>

<div>
    ResultInfo {id}
    <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
</div>


