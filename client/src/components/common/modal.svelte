<script>
    export let show;
    const close = () => show = false;
</script>

{#if show}
    <div class="popup">
        <div class="popup-mask"></div>
        <div class="popup-content">
            <div class="card">
                <h5 class="card-header">
                    <slot name="popup-header">Нет данных1111</slot>
                </h5>
                <div class="card-body">
                    <slot name="popup-content">Нет данных</slot>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-outline-primary" on:click={close}>Закрыть</button>
                </div>
              </div>
        </div>
    </div>
{/if}

<style>
    .popup{
        position:fixed;
        width:100vw;
        height:100vh;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .popup-mask{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.2);
        z-index: -1;
    }
    .popup-content{
        width: min(40rem, 90%);
    }
    .card-body{
        max-height: 50vh;
        overflow-y: auto;
        position: relative;
    }
</style>