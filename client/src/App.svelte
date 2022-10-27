<script>
  import Loader from './components/loader.svelte';
  import DomainSelectForm from './components/domainSelectForm.svelte';
  import DomainSettingsForm from './components/domainSettingsForm.svelte';
  import DomainAddForm from './components/domainAddForm.svelte';
  import QuestionsForm from './components/questionsForm.svelte';
  import ResultInfo from './components/resultInfo.svelte';
  import ResultClientInfo from './components/resultClientInfo.svelte';
  import Answers from './components/answers.svelte';
  import {onMount} from "svelte";
  import config from "./assets/config.js";

  let domains = [];
  let loading = true;
  let selectedDomain = null;
  let domainSelect = false;
  let domainAdd = false;
  let domainSettings = false;
  let showBack = false;
  let questionsForm = false;
  let resultInfo = false;
  let resultClientInfo = false;
  let answers = false;
  let selectedTest = {}

	onMount(async () => {
		const res = await fetch(`${config.serverUrl}/domains/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		domains = await res.json();
		// console.log(domains);


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

	function updateState(data) {
		console.log(data);
		if (data.detail.state.loading !== undefined) {
			loading = data.detail.state.loading;
			// console.log(loading);
		}

		if (data.detail.state.domainSelect !== undefined) {
			domainSelect = data.detail.state.domainSelect;
			// console.log(domainSelect);
		}

		if (data.detail.state.domainSettings !== undefined) {
			domainSettings = data.detail.state.domainSettings;
			// console.log(domainSettings);
		}

		if (data.detail.state.domainAdd !== undefined) {
			domainAdd = data.detail.state.domainAdd;
			// console.log(domainAdd);
		}

		if (data.detail.state.showBack !== undefined) {
			showBack = data.detail.state.showBack;
			// console.log(showBack);
		}

		if (data.detail.state.questionsForm !== undefined) {
			questionsForm = data.detail.state.questionsForm;
			if (questionsForm){
				selectedTest.id = data.detail.data.id;
			}
		}

		if (data.detail.state.resultInfo !== undefined) {
			resultInfo = data.detail.state.resultInfo;
			if (resultInfo){
				selectedTest.id = data.detail.data.id;
			}
		}

		if (data.detail.state.resultClientInfo !== undefined) {
			resultClientInfo = data.detail.state.resultClientInfo;
			if (resultClientInfo){
				selectedTest.id = data.detail.data.id;
			}
		}

		if (data.detail.state.answers !== undefined) {
			answers = data.detail.state.answers;
			if (answers){
				selectedTest.id = data.detail.data.id;
			}
			// console.log(showBack);
		}
    }
</script>

<Loader loading={loading}></Loader>

{#if domainSelect}
	<DomainSelectForm on:updateState={updateState} domains={domains} bind:selectedDomain={selectedDomain} />
{/if}

{#if domainSettings}
	<DomainSettingsForm on:updateState={updateState} domains={domains} selectedDomain={selectedDomain}/>
{/if}

{#if domainAdd}
	<DomainAddForm on:updateState={updateState} showBack={showBack}/>
{/if}

{#if questionsForm}
	<QuestionsForm on:updateState={updateState} id={selectedTest.id}/>
{/if}

{#if resultClientInfo}
	<ResultClientInfo on:updateState={updateState} id={selectedTest.id}/>
{/if}

{#if resultInfo}
	<ResultInfo on:updateState={updateState} id={selectedTest.id}/>
{/if}

{#if answers}
	<Answers on:updateState={updateState} id={selectedTest.id}/>
{/if}

<style>

</style>
