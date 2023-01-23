<script>
    import config from "../assets/config";
    export let clientInfo;
    console.log(clientInfo);
</script>

<div class="row row-cols-1 row-cols-md-2 g-2" >
    {#each clientInfo as psychotype}
        {#each psychotype.data as dataItem}
                <div class="col my-2" >
                    <div class="card">
                        <img src="{config.serverUrl}/{dataItem.image}" class="card-img-top" alt="">
                        <div class="card-body">
                            <h5 class="card-title">{dataItem.name}</h5>
                            <p class="card-text">{dataItem.description}</p>
                            <a href="{dataItem.link}" class="btn btn-primary">Подробнее</a>
                        </div>
                    </div>
                </div>
        {/each}
    {/each}
</div>