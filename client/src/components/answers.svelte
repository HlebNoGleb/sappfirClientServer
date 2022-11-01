<script>
// @ts-nocheck

    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import config from "../assets/config.js";
    import xlsx from "json-as-xlsx";


    let settings = {
      fileName: "Sappfir test", // Name of the resulting spreadsheet
      extraLength: 10, // A bigger number means that columns will be wider
      writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
      RTL: false, // Display the columns from right-to-left (the default value is false)
    }
    // import defaultQuestions
    const dispatch = createEventDispatcher();

    export let id;
    let showTable = false;
    let showNoData = false;
    let data = [];
    let tableData = {};
    let tableColNames = {
      Name: {
        ru: "Имя",
        en: "Name"
      },
      FName: {
        ru: "Фамилия",
        en: "Fname"
      },
      Email: {
        ru: "Почта",
        en: "Email"
      },
      Phone: {
        ru: "Телефон",
        en: "Phone"
      },
      Age: {
        ru: "Возрастная группа",
        en: "Age group"
      },
      Sex: {
        ru: "Пол",
        en: "Sex"
      },
      AgreeFl: {
        ru: "Согласен с ФЗ-152",
        en: "Agree with FZ-152"
      },
      answers: {
        ru: "Ответы",
        en: "Answers"
      },
      sum: {
        ru: "Сумма",
        en: "Sum"
      },
      max: {
        ru: "Индексы лидирующих психотипов",
        en: "Lead psychotypes indexes"
      },
      leadPsychotypes: {
        ru: "Лидирующие психотипы",
        en: "Lead Psychotypes"
      },
      testId: {
        ru: "Номер теста",
        en: "Test ID"
      },
    };

    let exportLocalizations = [
      { value: "ru" },
      { value: "en" },
    ]

    let selectedExportLocalization = exportLocalizations[0].value;

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{answers: false, domainSettings: true}});
    }

    onMount(async () => {
        const req = await fetch(`${config.serverUrl}/answers/?testId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
      	});

        let json = await req.json();
        data = json;
        if (data && data.length > 0){
          tableData = getTableData(data);
          showTable = true;
        } else {
          showNoData = true;
        }
    });

    function getTableData(data) {
      let columns = getTableColumns(data);
      console.log(columns);
      let content = getTableContent(data);
      console.log(content);

      let retObj = {
        columns: columns,
        content: content
      }

      return retObj;
    }

    function getTableColumns(data) {
      let columns = [];
      Object.keys(data[0]).forEach(row => {
        if(typeof data[0][row] === 'object' && data[0][row] !== null && !Array.isArray(data[0][row])){
          Object.keys(data[0][row]).forEach(element => {
            console.log(element);
            let obj = {
              label: tableColNames[element][selectedExportLocalization],
              value: element,
            };
            // obj[element] = element;
            columns.push(obj);
          });
        } else {
          if (!row.startsWith("_")){
            let obj = {
              label: tableColNames[row][selectedExportLocalization],
              value: row,
            };
            columns.push(obj);
          }
        }
      });

      return columns;
    }

    function getTableContent(data) {
      let content = [];
      data.forEach(row => {
        let rows = {};
        Object.keys(row).forEach(rowElement => {
          if(typeof row[rowElement] === 'object' && row[rowElement] !== null && !Array.isArray(row[rowElement])){
            Object.keys(row[rowElement]).forEach(rowSubElement => {
              rows[rowSubElement] = row[rowElement][rowSubElement];
            });
          } else {
            if (!rowElement.startsWith("_")){
              if (Array.isArray(row[rowElement])){
                rows[rowElement] = row[rowElement].join(", ");
              } else {
                rows[rowElement] = row[rowElement];
              }

            }
          }
        });

        content.push(rows);
      });

      return content;
    }

    function downloadExcel(params) {
      let obj = {}
      obj.sheet = '';

      Object.assign(obj, tableData)
      console.log(obj);
      xlsx([obj], settings, callback)
    }

    let callback = function (sheet) {
      console.log("Download complete:", sheet)
    }
</script>


{#if showTable}
<div class="col g-2">
  <button type="button" class="btn btn-outline-primary mb-3" on:click={downloadExcel}>Выгрузить в Excel</button>
  <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
  <select bind:value={selectedExportLocalization} on:change="{() => tableData = getTableData(data)}">
    {#each exportLocalizations as localization}
      <option value={localization.value}>
        {localization.value}
      </option>
    {/each}
  </select>
  <table class="table table-striped table-bordered">
    <thead>
      <tr>
        {#each tableData.columns as col}
          <th scope="col">{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each tableData.content as row}
        <tr>
            {#each Object.keys(row) as key}
              <td>{row[key]}</td>
            {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <button type="button" class="btn btn-outline-primary" on:click={downloadExcel}>Выгрузить в Excel</button>
  <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
</div>
{/if}

{#if showNoData}
<div class="col col-auto">
  <p>Нет данных</p>
  <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
</div>
{/if}

<style>
</style>


