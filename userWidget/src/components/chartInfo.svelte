<script>
    export let psychotypesData;
</script>

{#each psychotypesData as psychotype}
    <p>{psychotype.title}</p>
    <p>{psychotype.thinkingType}</p>
    <p>{psychotype.learningWays}</p>
    <p>{psychotype.characterFeatures}</p>
    <p>{psychotype.stressReactions}</p>
    <p>{psychotype.recommendations}</p>
{/each}