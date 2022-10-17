<script>
    export let chartData;
    import { onMount } from "svelte";
    import Chart from 'chart.js/auto';

    let chartLabels = [
        'Индивидуалист',
        'Инноватор',
        'Лидер мнений',
        'Модник',
        'Консерватор',
        'Чувствительный',
        'Замкнутый',
        'Реалист',
    ];

    let colors = [
        '#ff6961',
        '#ffb480',
        '#f8f38d',
        '#42d6a4',
        '#08cad1',
        '#59adf6',
        '#9d94ff',
        '#c780e8',
    ]

    let chartValues = chartData;
    let ctx;
	let chartCanvas;

    onMount(async (promise) => {
        ctx = chartCanvas.getContext('2d');
        let dataSets = getDataSets(chartValues);
        let chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartLabels,
                datasets: getDataSets(chartValues),
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,

                    }
                }
            }
		});
	});

    function getDataSets(chartValues) {
        let result = [];
        let processingData = chartValues;
        console.log(chartValues);

        // for (var i = 0; i < processingData.length - 1; i++) {

        //     let tempResult = [0, 0, 0, 0, 0, 0, 0, 0];
        //     tempResult[i] = processingData[i];
        //     tempResult[i + 1] = processingData[i + 1];
        //     let resObj = {
        //         label: chartLabels[i],
        //         backgroundColor: colors[i],
        //         borderColor: colors[i],
        //         data: tempResult,
        //         lineBorderColor: '#fff',
        //         pointHoverBackgroundColor: '#fff',
        //     }
        //     result.push(resObj);
        // }

        let lastIndex = processingData.length - 1;
        let lastTempResult = processingData//[processingData[lastIndex], 0, 0, 0, 0, 0, 0, processingData[lastIndex]];
        console.log(lastTempResult);
        let resObj = {
            label: '',
            borderColor: colors[7],
            data: lastTempResult,
            lineBorderColor: colors[7],
            pointHoverBackgroundColor: colors[7],
        }
        result.push(resObj);

        console.log(result);
        return result;
    }

</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>