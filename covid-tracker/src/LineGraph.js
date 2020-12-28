import React, {useState, useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral";
import {toTitleCase} from './util';
import './LineGraph.css';

const options = {
    legend: {
        display: 'false',
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
}

function LineGraph({casesType = 'cases', timeType = 'daily'}) {

    const [data, setData] = useState({});

    const buildChartData = (data, casesType, timeType) => {
        const chartData = [];

        if (timeType === 'daily') {
            console.log("here1")
            let lastDataPoint;

            for (let date in data.cases) {
                if (lastDataPoint) {
                    const newDataPoint = {
                        x: date,
                        y: data[casesType][date] - lastDataPoint
                    };

                    chartData.push(newDataPoint);
                }

                lastDataPoint = data[casesType][date];
            }
        } else if (timeType === 'total') {
            console.log('here2');
            for (let date in data.cases) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date]
                };

                chartData.push(newDataPoint);
            }
        }

        return chartData;

    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=420')
        .then(response => response.json())
        .then(data => {
            const chartData = buildChartData(data, casesType, timeType);
            setData(chartData);
        })
    }, [casesType, timeType]);

    return (
        <div className="linegraph">
            <h1>Im a graph</h1>
            {data?.length > 0 && (
                <Line className="graph"
                options={options}
                data={{
                    datasets: [{
                        label: toTitleCase(casesType),
                        backgroundColor: "rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data: data
                    }]
                }}
            />
            )}
            
        </div>
    )
}

export default LineGraph
