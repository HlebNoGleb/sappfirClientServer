<script>
// @ts-nocheck
    import {createEventDispatcher} from 'svelte';
    import {onMount} from "svelte";
    import config from "../../assets/config.js";
    import Modal from '../common/modal.svelte';
    import PsyhotypesChart from '../common/psyhotypesChart.svelte';
    import defaultTestTypes from '../../assets/defaultData/testTypes.json';
    import { objectHelper } from '../../assets/objectsHelper';
    import xlsx from 'json-as-xlsx';
    const dispatch = createEventDispatcher();

    export let questions;
    export let settings;

    function ExportToExcel(type, fn, dl) {
       var elt = document.getElementById('testTable');
       var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" }, {display: true});
       return dl ?
         XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
         XLSX.writeFile(wb, fn || (`${settings.name}.` + (type || 'xlsx')));
    }


    let xlsxSettings = {
        fileName: "Sappfir test", // Name of the resulting spreadsheet
        extraLength: 10, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    function getExcelTableHeader(data) {
        let allKeys = objectHelper.getAllKeys(data);
        let header = [];

        let testTypeId = questions.testTypeId;

        console.log(allKeys);

        // РАЗДЕЛИТЬ МАССИВ ПСИХОТИПОВ ДЛЯ ХЕДЕРА И БОДИ

        allKeys.forEach(function (e) {
            let headerSettings = answersModel.find(x=>x.key == e);
            if (headerSettings && headerSettings.showInTable[testTypeId]) {
                header.push({key: headerSettings.key, showKey: headerSettings.showKey});
            }
        });

        return header;
    }

    function getExcelTableBody(data) {
        const excelBody = [];
        data.forEach(answer => {
            let body = [];

            tableHeader.forEach(th => {
                let data = objectHelper.getNestedValue(th.key, answer);
                body.push(data.length > 0 ? data : 'Нет данных');
            });

            excelBody.push(body);
        });

        console.log(excelBody);
    }

    function downloadExcel(params) {
        let obj = {}
        obj.sheet = '';

        Object.assign(obj, test)
        console.log(obj);
        let testCol = getExcelTableHeader();
        // xlsx([obj], settings)

        console.log(testCol);
        console.log(testContent);
    }

    var test = {
        sheet: "Adults",
        columns: [
            { label: "User", value: "user" }, // Top level data
            { label: "Age", value: (row) => row.age + " years" }, // Custom format
            { label: "Phone", value: (row) => (row.phone ? row.phone || "" : "") }, // Run functions
        ],
        content: [
            { user: "Andrea", age: 20, phone: "2343243243" },
            { user: "Luis", age: 21 },
        ],
    }

    console.log(questions);

    let answersArray = [];

    let showAllTrDataPopup = false;
    let modalData = {};

    let tableHeader = []
    let tableBody = [];
    let answersModel = [
        {
            key: "_id",
            showKey: "ID",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "questionsId",
            showKey: "ID вопросов",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "answers",
            showKey: "Ответы пользователя",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "__v",
            showKey: "Версия",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: false,
                2: false,
            },
            export: false,
        },
        {
            key: "userData.AgreeFl",
            showKey: "Согласен с ФЗ 152",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: false,
                2: false,
            },
            export: false,
        },
        {
            key: "userData.Name",
            showKey: "Имя",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "userData.FName",
            showKey: "Фамилия",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "userData.Email",
            showKey: "Email",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "userData.Phone",
            showKey: "Телефон",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "userData.Age",
            showKey: "Возраст",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "userData.Sex",
            showKey: "Пол",
            showInTable: {
                1: true,
                2: true,
            },
            showInAll: {
                1: true,
                2: true,
            },
            export: true,
        },
        {
            key: "sum",
            showKey: "Сумма ответов",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: true,
                2: false,
            },
            export: true,
        },
        {
            key: "max",
            showKey: "Номер максимального",
            showInTable: {
                1: false,
                2: false,
            },
            showInAll: {
                1: true,
                2: false,
            },
            export: true,
        },
        {
            key: "leadPsychotypes",
            showKey: "Психотип",
            showInTable: {
                1: true,
                2: false,
            },
            split: true,
            showInAll: {
                1: true,
                2: false,
            },
            export: true,
        }
    ]

    onMount(async () => {
        answersArray = [];
        const req = await fetch(`${config.serverUrl}/answers/?id=${questions._id}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        let data = await req.json();
        if (data && data.length > 0) {
            console.log(data);
            answersArray = data;
            getTableHeader(answersArray[0]);
            getTableBody(answersArray);
        } else {
            console.log("no data");
        }
    });

    function getTableHeader(data) {
        let allKeys = objectHelper.getAllKeys(data);
        let header = [];

        let testTypeId = questions.testTypeId;

        console.log(allKeys);

        // РАЗДЕЛИТЬ МАССИВ ПСИХОТИПОВ ДЛЯ ХЕДЕРА И БОДИ

        allKeys.forEach(function (e) {
            let headerSettings = answersModel.find(x=>x.key == e);
            if (headerSettings && headerSettings.showInTable[testTypeId]) {
                header.push({key: headerSettings.key, showKey: headerSettings.showKey});
            }
        });

        tableHeader = header;
    }

    function getTableBody(data) {
        data.forEach(answer => {
            let body = [];

            tableHeader.forEach(th => {
                let data = objectHelper.getNestedValue(th.key, answer);
                body.push(data.length > 0 ? data : 'Нет данных');
            });

            tableBody.push(body);
        });
        console.log(tableBody);
    }

    function updateState(data) {
        dispatch('updateState', data)
    }

    function goBack(){
        updateState({state:{answers: false, questions: true, loading: true}, data:{settings: settings}});
    }

    function showAllTrData(bodyIndex) {
        modalData = {};
        modalData.data = [];
        const allKeys = objectHelper.getAllKeys(answersArray[bodyIndex]);
        const testTypeId = questions.testTypeId;
        allKeys.forEach(function (e) {
            let headerSettings = answersModel.find(x=>x.key == e);
            if (headerSettings && headerSettings.showInAll[testTypeId]) {
                const dataValue = objectHelper.getNestedValue(headerSettings.key, answersArray[bodyIndex]);
                const value = dataValue.length > 0 ? dataValue : "Нет данных";

                const item = {
                    key: headerSettings.showKey,
                    value: value
                }

                modalData.data.push(item);
            }
        });

        modalData.chartData = answersArray[bodyIndex].sum;

        console.log(modalData);
        showAllTrDataPopup = true;
    }
</script>

{#if answersArray && answersArray.length > 0}
    <div class="container">
        <div class="col" style="max-width: 100%;">
            <h1>Ответы - {settings.name} - {defaultTestTypes.find(x=>x.id == questions.testTypeId).name}</h1>
            <div class="table-responsive">
                <table class="table table-striped" id="testTable">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        {#each tableHeader as th}
                            <th scope="col">{th.showKey}</th>
                        {/each}
                        <th scope="col">все данные</th>
                    </tr>
                    </thead>
                    <tbody>
                        {#each tableBody as tr, i}
                            <tr>
                                <td>{i + 1}</td>
                                {#each tr as td}
                                    <td>{td}</td>
                                {/each}
                                <td>
                                    <button type="button" on:click={() => showAllTrData(i)} class="btn btn-outline-primary btn-sm">
                                        <span>Просмотреть</span>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
            <button type="button" class="btn btn-outline-primary" on:click={() => ExportToExcel()}>Скачать excel</button>
        </div>
    </div>
{:else}
    <div class="container">
        <div class="col">
            <!-- <h1>Ответы - {questions._id}</h1> -->
            <button type="button" class="btn btn-outline-primary" on:click={() => goBack()}>Назад</button>
        </div>
    </div>
{/if}

<Modal bind:show={showAllTrDataPopup}>
    <span slot="popup-header">Данные пользователя</span>
    <div slot="popup-content">
        {#if modalData.data && modalData.data.length > 1}
            <div>
                <ul>
                    {#each modalData.data as item}
                        <li>{item.key}: {item.value}</li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if modalData.chartData && modalData.chartData.length > 0}
            <PsyhotypesChart chartData={modalData.chartData} />
        {/if}
    </div>
</Modal>

<style>
    .container{
		width: 90%;
	}
</style>