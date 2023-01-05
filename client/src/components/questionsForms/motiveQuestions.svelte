<script>
// @ts-nocheck

    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import config from "../../assets/config.js";
    export let questions;
    export let settings;
    export let testType;
    export let update;

    let questionsArray = [];
    let defaultData = [
        {
            question: "Вопрос",
            answers: [
                "Ответ 1", "Ответ 2"
            ]
        }
    ]

    if (!questions){
        setupDefault()
    } else {
        questionsArray = questions.questions;
    }

    function setupDefault() {
        questionsArray = [...defaultData];
    }

    function addAnswer(questionIndex) {
        questionsArray[questionIndex].answers.push(`Ответ ${questionsArray[questionIndex].answers.length + 1}`);
        console.log(questionsArray);
        questionsArray = questionsArray;
    }

    function deleteAnswer(questionIndex) {
        questionsArray[questionIndex].answers.pop();
        questionsArray = questionsArray;
    }

    function addQuestion() {
        questionsArray.push({
            question: "Вопрос",
            answers: [
                "Ответ 1", "Ответ 2"
            ]
        });
        console.log(questionsArray);
        questionsArray = questionsArray;
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{questions: true, questionsForm: false, loading: true}, data:{settings: settings}});
    }

    async function saveQuestionsData(e) {
        let data = {};
        data.questions = questionsArray;
        data.answers = [];
        data.settingsId = settings._id;
        data.testTypeId = testType.id;

        console.log(data);

        const res = await fetch(`${config.serverUrl}/questions/`, {
            method: update ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data),
		})

		const json = await res.json();
		let result = JSON.stringify(json);
        if (res.status == 201){
            Swal.fire(
                'Отлично',
                'Вопросы сохранены!',
                'success'
            );
            return null;
        }

        Swal.fire(
            'Ошибка',
            'Произошла ошибка, вопросы не сохранены',
            'error'
        );
        return null;
    }

</script>

<h1>Вопросы для мотивов</h1>
<form on:submit|preventDefault={saveQuestionsData}>
    {#each questionsArray as question, i}
        <div class="col my-2">
            <div class="card">
                <div class="card-body">
                    <label for="question_{i}" class="form-label">Вопрос #{i + 1}</label>
                    <input type="text" class="form-control" bind:value="{question.question}" name="questions_{i}" id="questions_{i}">
                    {#each question.answers as answer, j}
                        <div class="col my-2">
                            <div class="card">
                                <div class="card-body">
                                    <label for="answer_{i}_{j}" class="form-label">Ответ #{j + 1}</label>
                                    <input type="text" class="form-control" bind:value="{answer}" name="answer_{i}_{j}" id="answer_answer_{i}_{j}">
                                </div>
                            </div>
                        </div>
                    {/each}
                    <div class="btn-group my-1" role="group">
                        <button type="button" class="btn btn-primary" on:click={()=> addAnswer(i)}>Добавить ответ</button>
                        <button type="button" class="btn btn-outline-danger" on:click={()=> deleteAnswer(i)}>Удалить ответ</button>
                    </div>
                </div>
            </div>
        </div>
    {/each}
    <button type="button" class="btn btn-outline-primary" on:click={addQuestion}>Добавить вопрос</button>
    <button type="submit" class="btn btn-primary">Сохранить</button>
</form>
<button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>


