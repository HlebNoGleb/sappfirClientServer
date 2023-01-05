<script>
    export let psychotypesData;
</script>

{#each psychotypesData as psychotype}
    <p>{psychotype.title}</p>
    <div>
        {@html psychotype.data}
    </div>
{/each}