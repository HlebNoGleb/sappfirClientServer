<script>
    import config from "../src/assets/config";
    import { onMount } from "svelte";
    import Loader from './components/loader.svelte';
    import Chart from './components/chart.svelte';
    import ChartInfo from './components/chartInfo.svelte';
    import ClientInfo from './components/clientInfo.svelte';
    import defaultTestTypes from '../src/assets/testTypes.json';

    let questions = null;
    let settings = null;
    let showQuestions = false;
    let showNoQuestions = false;
    let showUserForm = false;
    let showResult = false;

    let userData = null;
    let verticalMode = false;

    let agesGroupArray = ["18-24", "25-35", "36-45", "46-55", "55+"];
    let sexArray = ["Мужской", "Женский"];

    let loading = true;
    let chartData = {};
    let psychotypesData = {};
    let clientInfo = {};
    let simpleClientData = "";
    let key = null;

    onMount(async () => {
        let url = (window.location != window.parent.location)
            ? document.referrer
            : null;

        if (!url){
            showNoData();
            return null;
        }

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        key = params.key;

        console.log(key);

        if (!key){
            showNoData();
            return null;
        }

        const req = await fetch(`${config.serverUrl}/api/?key=${key}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Request-Url':`${url}`,
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
                verticalMode = settings.resultSettings.VerticalMode ? true : false;
                setColors(settings.color);
                loading = false;
        } else {
            showNoData();
        }

    });

    function setColors(colors){
        document.documentElement.style.setProperty('--text-color', colors.mainColor);
        document.documentElement.style.setProperty('--background-color', colors.secondaryColor);
        document.documentElement.style.setProperty('--wrapper-color', colors.tertiaryColor);
    }

    function showNoData(){
        showQuestions = false;
        showUserForm = false;
        showNoQuestions = true;
        loading = false;
    }

    let selected = [];

    async function saveData(e){

        // разбить на методы в зависимости от типа теста

        // if (Object.keys(selected).length < questions.questions.length){
        //     alert("Вы ответили не на все вопросы")
        //     return;
        // }

        loading = true;

        let fortest = [];
        for (let index = 0; index < 40; index++) {
            let rnd = Math.floor(Math.random() * 3) + 1;
            fortest.push(rnd);
        }

        let dataObj = {
            questionsId: questions._id,
            selected: fortest,//selected,
            userData:userData,
        }

        console.log(selected);

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
        clientInfo = [];
        simpleClientData = "";
        // window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // showQuestions = false;
        showResult = true;
        loading = false;
        chartData = result.graphData;
        psychotypesData = result.psyhotypesChartText;
        clientInfo = result.psyhotypesClientData;
        simpleClientData = result.simpleClientData
    }

</script>

<Loader loading={loading}></Loader>

<div class="wrapper">
    {#if showQuestions || showUserForm}
        <div class="test-background" style="background-image: url('{settings.image}')"></div>
        {#if showQuestions}
            <div class="container">
                <form on:submit|preventDefault={saveData}>
                <div class="row row-cols-1 row-cols-md-1 g-2" class:row-cols-md-2={verticalMode}>
                    {#each questions.questions as question, i }
                        <div class="col my-2" >
                            {#if verticalMode}
                                <div class="card">
                                    <img src="{config.serverUrl}/{question.image}" class="card-img-top" alt="">
                                    <div class="card-body">
                                        <h5 class="card-title">Вопрос  #{i+1}</h5>
                                        {#if settings.testTypeId == defaultTestTypes[0].id}
                                            <p class="card-text">{question.text}</p>
                                            {#each questions.answers as answer, j}
                                                <div class="form-check">
                                                    <input class="form-check-input" bind:group={selected[i]} type="radio" value="{j + 1}" checked id="{i}_{j}">
                                                    <label class="form-check-label" for="{i}_{j}">{answer}</label>
                                                </div>
                                            {/each}
                                        {:else}
                                            <p class="card-text">{question.question}</p>
                                            {#each question.answers as answer, j}
                                                <div class="form-check">
                                                    <input class="form-check-input" bind:group={selected[i]} type="radio" value="{j + 1}" checked id="{i}_{j}">
                                                    <label class="form-check-label" for="{i}_{j}">{answer}</label>
                                                </div>
                                            {/each}
                                        {/if}
                                    </div>
                                </div>
                            {:else}
                                <div class="card mb-3">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <img src="{config.serverUrl}/{question.image}" class="card-img-top" alt="">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">Вопрос  #{i+1}</h5>
                                                {#if settings.testTypeId == defaultTestTypes[0].id}
                                                    <p class="card-text">{question.text}</p>
                                                    {#each questions.answers as answer, j}
                                                        <div class="form-check">
                                                            <input class="form-check-input" bind:group={selected[i]} type="radio" value="{j + 1}" checked id="{i}_{j}">
                                                            <label class="form-check-label" for="{i}_{j}">{answer}</label>
                                                        </div>
                                                    {/each}
                                                {:else}
                                                    <p class="card-text">{question.question}</p>
                                                    {#each question.answers as answer, j}
                                                        <div class="form-check">
                                                            <input class="form-check-input" bind:group={selected[i]} type="radio" value="{j + 1}" checked id="{i}_{j}">
                                                            <label class="form-check-label" for="{i}_{j}">{answer}</label>
                                                        </div>
                                                    {/each}
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/if}
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
            <div class="container">
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
                                    <input class="form-check-input" name="Age" type="radio" value={ageGroup} id="ageGroup-{i}" >
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
                                    <input class="form-check-input" name="Sex" type="radio" value={sex} id="sex-{i}" >
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
        <div class="container">
            {#if settings.resultSettings.Chart && chartData}
                <Chart chartData={chartData}/>
            {/if}
            {#if settings.resultSettings.Info && psychotypesData}
                <ChartInfo psychotypesData={psychotypesData}/>
            {/if}
            {#if settings.resultSettings.ClientInfo && clientInfo}
                <ClientInfo clientInfo={clientInfo}/>
            {/if}
            {#if settings.resultSettings.AfterTextToggle}
                {@html settings.resultSettings.AfterText}
            {/if}
            {#if simpleClientData}
                {@html simpleClientData}
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
        z-index: 1;
        transition: .5s all ease;
    }
</style>