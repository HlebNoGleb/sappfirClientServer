<script>
    export let clientInfo;
</script>

<div class="row row-cols-1 row-cols-md-2 g-2" >
    {#each clientInfo as psychotypes}
        {#each psychotypes as psychotype}
                <div class="col my-2" >
                    <div class="card">
                        <img src="https://picsum.photos/200" class="card-img-top" alt="">
                        <div class="card-body">
                            <h5 class="card-title">{psychotype.title}</h5>
                            <p class="card-text">{psychotype.description}</p>
                            <a href="{psychotype.link}" class="btn btn-primary">Подробнее</a>
                        </div>
                    </div>
                </div>
        {/each}
    {/each}
</div>