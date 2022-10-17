<script>
    import config from "../src/assets/config";
    import { onMount } from "svelte";
    import Loader from './components/loader.svelte';
    import Chart from './components/chart.svelte';
    import ChartInfo from './components/chartInfo.svelte';

    let questions = null;
    let settings = null;
    let showQuestions = false;
    let showNoQuestions = false;
    let showUserForm = false;
    let showResult = false;

    let userData = null;
    let color = null;

    let agesGroupArray = ["18-24", "25-35", "36-45", "46-55", "55+"];
    let sexArray = ["Мужской", "Женский"];

    let loading = true;
    let chartData = {};
    let psychotypesData = {};

    onMount(async () => {
      const req = await fetch(`${config.serverUrl}/api/?key=${config.testId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let data = await req.json();
      console.log(data);

      if (data && Object.keys(data).length > 0){
            questions = data.questions;
            settings = data.settings;
            showQuestions = false;
            showNoQuestions = false;
            showUserForm = true;
            color = settings.image;
            loading = false;
      } else {
            showQuestions = false;
            showUserForm = false;
            showNoQuestions = true;
            loading = false;
      }

    });

    let selected = [];

    async function saveData(e){
        // if (Object.keys(selected).length < questions.questions.length){
        //     alert("no")
        //     return;
        // } else {
        //     alert("yes")
        //     console.log(selected)
        // }
        loading = true;

        let fortest = [];
        for (let index = 0; index < 40; index++) {
            fortest.push(Math.floor(Math.random() * 3) + 1)
        }

        let dataObj = {
            testId:config.testId,
            selected:fortest, //selected
            data:userData,
        }

        const res = await fetch(`${config.serverUrl}/api/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(dataObj)
		})

        const json = await res.json();
        const status = res.status;

        if (status == 200) {
            console.log(json);
            calcResult(json);
        }
    }

    function saveUserForm(e){
        const formData = new FormData(e.target);

        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        if (!data.AgreeFl){
            alert("Чтобы приступить к тесту необходимо согласиться с ФЗ-152")
            return;
        }

        userData = data;
        console.log(userData);
        showUserForm = false;
        showQuestions = true;
    }

    async function calcResult(result){
        showResult = false;
        chartData = [];
        psychotypesData = [];
        await new Promise(resolve => setTimeout(resolve, 1000));
        showResult = true;
        loading = false;
        chartData = result.result.sum;
        psychotypesData = result.result.psychotypesData;
    }

</script>
<Loader loading={loading}></Loader>
<div class="wrapper">
    {#if showQuestions || showUserForm}
        <div class="test-background" style="background-image: url('{settings.image}')"></div>
        {#if showQuestions}
            <div class="container" style="background-color:{settings.color.mainColor}">
                <form on:submit|preventDefault={saveData}>
                <div class="row row-cols-1 row-cols-md-2 g-2" >
                    {#each questions.questions as question, i }
                        <div class="col my-2" >
                            <div class="card">
                                <img src={settings.image} class="card-img-top" alt="">
                                <div class="card-body">
                                    <h5 class="card-title">Вопрос  #{question.id}</h5>
                                    <p class="card-text">{question.value}</p>
                                    {#each questions.answers as answer}
                                        <div class="form-check">
                                            <input class="form-check-input" bind:group={selected[i]} type="radio" value="{answer.id}" checked id="{question.id}_{answer.id}">
                                            <label class="form-check-label" for="{question.id}_{answer.id}">{answer.value}</label>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}
                    </div>
                    <div class="d-flex justify-content-end g-2">
                        <!-- <button type="button" class="btn btn-outline-primary mx-2" on:click={}>Сбросить</button> -->
                        <button type="submit" class="btn btn-primary">Отправить</button>
                    </div>
                </form>
            </div>
        {/if}
        {#if showUserForm}
            <div class="container" style="background-color:{settings.color.mainColor}">
                <form on:submit|preventDefault={saveUserForm}>
                    {#if settings.userData.Name}
                        <div class="mb-3">
                            <label for="Name">Имя</label>
                            <input type="text" class="form-control" id="Name" name="Name" placeholder="Введите ваше имя" />
                        </div>
                    {/if}
                    {#if settings.userData.FName}
                        <div class="mb-3">
                            <label for="FName">Фамилия</label>
                            <input type="text" class="form-control" id="FName" name="FName" placeholder="Введите вашу фамилию" />
                        </div>
                    {/if}
                    {#if settings.userData.Email}
                        <div class="mb-3">
                            <label for="Email">E-mail</label>
                            <input type="email" class="form-control" id="Email" name="Email" placeholder="Введите вашу почту" />
                        </div>
                    {/if}
                    {#if settings.userData.Phone}
                        <div class="mb-3">
                            <label for="Phone">Телефон</label>
                            <input type="phone" class="form-control" id="Phone" name="Phone" placeholder="Введите вашу почту" />
                        </div>
                    {/if}
                    {#if settings.userData.Age}
                        <div class="mb-3">
                            <label for="">Выберите ваш возраст</label>
                            {#each agesGroupArray as ageGroup, i}
                                <div class="form-check mb-1">
                                    <input class="form-check-input" name="Age" type="radio" value={i} id="ageGroup-{i}" >
                                    <label class="form-check-label" for="ageGroup-{i}">{ageGroup}</label>
                                </div>
                            {/each}
                        </div>
                    {/if}
                    {#if settings.userData.Sex}
                        <div class="mb-3">
                            <label for="">Выберите ваш пол</label>
                            {#each sexArray as sex, i}
                                <div class="form-check mb-1">
                                    <input class="form-check-input" name="Sex" type="radio" value={i} id="sex-{i}" >
                                    <label class="form-check-label" for="sex-{i}">{sex}</label>
                                </div>
                            {/each}
                        </div>
                    {/if}
                    {#if settings.userData.AgreeFL}
                        <div class="form-check mb-3">
                            <input class="form-check-input" name="AgreeFl" id="agreeFL" type="checkbox" >
                            <label class="form-check-label" for="agreeFL">Я согласен с ФЗ-152</label>
                        </div>
                    {/if}
                    <div class="d-flex justify-content-end g-2">
                        <button type="submit" class="btn btn-primary">Перейти к тесту</button>
                    </div>
                </form>
            </div>
        {/if}
    {/if}
    {#if showNoQuestions}
        <p>no data</p>
    {/if}
    {#if showResult}
        <div class="container" style="background-color:{settings.color.mainColor}">
            {#if settings.resultSettings.Chart}
                <Chart chartData={chartData}/>
            {/if}
            {#if settings.resultSettings.Info}
                <ChartInfo psychotypesData={psychotypesData}/>
            {/if}
            {#if settings.resultSettings.ClientInfo}
                <p>ClientInfo</p>
            {/if}
            {#if settings.resultSettings.AfterTextToggle}
                {@html settings.resultSettings.AfterText}
            {/if}
        </div>
    {/if}
</div>

<style>
    .test-background{
        position: absolute;
        height: 40vh;
        background-size: cover;
        background-position: center;
        top: 0;
        width: 100%;
        z-index: -1;
        transition: .5s all ease;
    }
</style>