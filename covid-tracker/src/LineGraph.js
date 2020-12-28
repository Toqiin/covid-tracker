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

function LineGraph({casesType = 'cases', dataType = 'daily', timeType = 'all'}) {

    // the graph's state is the data it displays
    const [data, setData] = useState({});

    // generate the data in the correct format for chart.js to display.
    // params:
    // data - the json object fetched by API call
    // casesType - whether to show the death or the cases data
    // dataType - daily change or total stats
    const buildChartData = (data, casesType, dataType) => {
        const chartData = [];

        // if type is daily we need to calculate the change from each data point to the next
        if (dataType === 'daily') {
            let lastDataPoint;

            for (let date in data.cases) {
                // if the lastDataPoint exists (which should be all cases but the first data point we have)
                if (lastDataPoint) {
                    const newDataPoint = {
                        x: date,
                        y: data[casesType][date] - lastDataPoint
                    };

                    chartData.push(newDataPoint);
                }

                // update the lastDataPoint var with the actual total from the day we are iterating at
                lastDataPoint = data[casesType][date];
            }

        // if its total we just explicitly read the data
        } else if (dataType === 'total') {
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

        let timeRange;
        // just read the timeType and convert to an appropriate string for the API call
        switch(timeType) {
            case 'all':
                timeRange = 'all';
                break;
            case 'year':
                timeRange = '365';
                break;
            case '3month':
                timeRange = '90';
                break;
            case 'month':
                timeRange = '30';
                break;
            case 'week':
                timeRange = '7';
                break;
            default:
                break;
        }
        
        let url = `https://disease.sh/v3/covid-19/historical/all?lastdays=${timeRange}`;
        // call the API and set the data in the LineGraph state
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const chartData = buildChartData(data, casesType, dataType);
            setData(chartData);
        })
    }, [casesType, dataType, timeType]);

    return (
        <div className="linegraph">
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
