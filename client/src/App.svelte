<script>
  import Loader from './components/common/loader.svelte';
  import DomainSelectForm from './components/tests/domainSelectForm.svelte';
  import SettingsForm from './components/tests/settingsForm.svelte';
  import DomainAddForm from './components/tests/domainAddForm.svelte';
  import Questions from './components/questions/questions.svelte';
  import QuestionsForm from './components/questions/questionsForm.svelte';
  import PsyhotypesChartText from './components/psyhotypesChartText.svelte';
  import PsyhotypesClientData from './components/psyhotypesClientData.svelte';
  import SimpleClientData from './components/simpleClientData.svelte';
  import WidgetData from './components/widgetData.svelte';
  import Answers from './components/answers/answers.svelte';
  import {onMount} from "svelte";
  import config from "./assets/config.js";
  import Tests from './components/tests/tests.svelte';


  let domains = [];
  let loading = true;
  let selectedDomain = null;
  let domainSelect = false;
  let domainAdd = false;
  let tests = false;
  let testSettings = false;
  let showBack = false;
  let questions = false;
  let questionsForm = false;
  let psyhotypesChartText = false;
  let psyhotypesClientData = false;
  let simpleClientInfo = false;
  let answers = false;
  let widgetData = false;
  let selectedTest = {};

  let componentData = {}; // объект передаваемых данных на все компоненты через изменение состояния

	onMount(async () => {
		const res = await fetch(`${config.serverUrl}/domains/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		domains = await res.json();

		if (Object.keys(domains).length === 0) {
			domainAdd = true
		} else {
			domainSelect = true
			showBack = true
		}

		setTimeout(() => {
			loading = false
		}, 100);
	});

	function updateState(stateData) {
		if (stateData.detail.state.loading !== undefined) {
			loading = stateData.detail.state.loading;
		}

		if (stateData.detail.state.domainSelect !== undefined) {
			domainSelect = stateData.detail.state.domainSelect;
		}

		if (stateData.detail.state.tests !== undefined) {
			tests = stateData.detail.state.tests;
		}

		if (stateData.detail.state.testSettings !== undefined) {
			testSettings = stateData.detail.state.testSettings;
			if (testSettings){
				componentData.settings = stateData.detail.data.settings;
				componentData.selectedDomain = stateData.detail.data.selectedDomain;
			}
		}

		if (stateData.detail.state.domainAdd !== undefined) {
			domainAdd = stateData.detail.state.domainAdd;
		}

		if (stateData.detail.state.showBack !== undefined) {
			showBack = stateData.detail.state.showBack;
		}

		if (stateData.detail.state.questions !== undefined) {
			questions = stateData.detail.state.questions;
			if (questions){
				componentData.settings = stateData.detail.data.settings;
			}
		}

		if (stateData.detail.state.questionsForm !== undefined) {
			questionsForm = stateData.detail.state.questionsForm;
			if (questionsForm){
				componentData.settings = stateData.detail.data.settings;
				componentData.questions = stateData.detail.data.questions;
			}
		}

		if (stateData.detail.state.psyhotypesChartText !== undefined) {
			psyhotypesChartText = stateData.detail.state.psyhotypesChartText;
			if (psyhotypesChartText){
				componentData.settings = stateData.detail.data.settings;
				componentData.questions = stateData.detail.data.questions;
			}
		}

		if (stateData.detail.state.psyhotypesClientData !== undefined) {
			psyhotypesClientData = stateData.detail.state.psyhotypesClientData;
			if (psyhotypesClientData){
				componentData.settings = stateData.detail.data.settings;
				componentData.questions = stateData.detail.data.questions;
			}
		}

		if (stateData.detail.state.simpleClientInfo !== undefined) {
			simpleClientInfo = stateData.detail.state.simpleClientInfo;
			if (simpleClientInfo){
				componentData.settings = stateData.detail.data.settings;
				componentData.questions = stateData.detail.data.questions;
			}
		}

		if (stateData.detail.state.answers !== undefined) {
			answers = stateData.detail.state.answers;
			if (answers){
				componentData.settings = stateData.detail.data.settings;
				componentData.questions = stateData.detail.data.questions;
			}
		}

		if (stateData.detail.state.widgetData !== undefined) {
			widgetData = stateData.detail.state.widgetData;
			if (widgetData){
				selectedTest.id = stateData.detail.data.id;
			}
		}
    }

	let file = null;
	$:{
		console.log(file);
	}
</script>

<Loader loading={loading}></Loader>

{#if domainSelect}
	<DomainSelectForm on:updateState={updateState} domains={domains} bind:selectedDomain={selectedDomain} />
{/if}

{#if tests}
	<Tests on:updateState={updateState} selectedDomain={selectedDomain}/>
{/if}

{#if testSettings}
	<SettingsForm on:updateState={updateState} settings={componentData.settings} selectedDomain={componentData.selectedDomain}/>
{/if}

{#if domainAdd}
	<DomainAddForm on:updateState={updateState} showBack={showBack}/>
{/if}

{#if questions}
	<Questions on:updateState={updateState} settings={componentData.settings}/>
{/if}

{#if questionsForm}
	<QuestionsForm on:updateState={updateState} settings={componentData.settings} questions={componentData.questions}/>
{/if}

{#if psyhotypesClientData}
	<PsyhotypesClientData on:updateState={updateState} settings={componentData.settings} questions={componentData.questions}/>
{/if}

{#if psyhotypesChartText}
	<PsyhotypesChartText on:updateState={updateState} settings={componentData.settings} questions={componentData.questions}/>
{/if}

{#if simpleClientInfo}
	<SimpleClientData on:updateState={updateState} settings={componentData.settings} questions={componentData.questions}/>
{/if}

{#if answers}
	<Answers on:updateState={updateState} questions={componentData.questions} settings={componentData.settings}/>
{/if}

{#if widgetData}
	<WidgetData on:updateState={updateState} id={selectedTest.id}/>
{/if}