import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import { statesPos } from './states';

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 400,
        stateMultiplier: 200,
        timelineMultiplier: 1500
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 600,
        stateMultiplier: 300
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 1000,
        stateMultiplier: 500
    },
};

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
}

export const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const showDataOnMap = (states, data, onCircleClick, USFocus, casesType = "cases") => {
    let countryCircles = data.map(function (country) {
        if (USFocus) {
            if (country.country !== 'USA') {
                return (
                    <Circle
                        center={[country.countryInfo.lat, country.countryInfo.long]}
                        color={casesTypeColors[casesType].hex}
                        fillColor={casesTypeColors[casesType].hex}
                        fillOpacity={0.4}
                        radius={
                            Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
                        }
                        eventHandlers={{
                            click: () => {
                                onCircleClick(country);
                            },
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            }
                        }}
                    >
                        <Popup>
                            <div className="info-container">
                                <div
                                    className="info-flag"
                                    style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                                ></div>
                                <div className="info-name">{country.country}</div>
                                <div className="info-confirmed">
                                    Cases: {numeral(country.cases).format("0,0")}
                                </div>
                                <div className="info-recovered">
                                    Recovered: {numeral(country.recovered).format("0,0")}
                                </div>
                                <div className="info-deaths">
                                    Deaths: {numeral(country.deaths).format("0,0")}
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                );
            }
        } else {
            return (
                <Circle
                    center={[country.countryInfo.lat, country.countryInfo.long]}
                    color={casesTypeColors[casesType].hex}
                    fillColor={casesTypeColors[casesType].hex}
                    fillOpacity={0.4}
                    radius={
                        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
                    }
                    eventHandlers={{
                        click: () => {
                            onCircleClick(country);
                        },
                        mouseover: (e) => {
                            e.target.openPopup();
                        },
                        mouseout: (e) => {
                            e.target.closePopup();
                        }
                    }}
                >
                    <Popup>
                        <div className="info-container">
                            <div
                                className="info-flag"
                                style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                            ></div>
                            <div className="info-name">{country.country}</div>
                            <div className="info-confirmed">
                                Cases: {numeral(country.cases).format("0,0")}
                            </div>
                            <div className="info-recovered">
                                Recovered: {numeral(country.recovered).format("0,0")}
                            </div>
                            <div className="info-deaths">
                                Deaths: {numeral(country.deaths).format("0,0")}
                            </div>
                        </div>
                    </Popup>
                </Circle>
            );
        }

    });

    let stateCircles = [];
    if (USFocus) {
        stateCircles = states.map(function (state) {
            let stateCenter = [];
            for (let i = 0; i < statesPos.length; i++) {
                if (statesPos[i].state === state.state) {
                    stateCenter = [statesPos[i].latitude, statesPos[i].longitude];
                }
            }

            if (stateCenter.length > 0) {
                return (
                    <Circle
                        center={stateCenter}
                        color={casesTypeColors[casesType].hex}
                        fillColor={casesTypeColors[casesType].hex}
                        fillOpacity={0.4}
                        radius={
                            Math.sqrt(state[casesType]) * casesTypeColors[casesType].stateMultiplier
                        }
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            }
                        }}
                    >
                        <Popup>
                            <div className="info-container">
                                <div
                                    className="info-flag"
                                    // style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                                ></div>
                                <div className="info-name">{state.state}</div>
                                <div className="info-confirmed">
                                    Cases: {numeral(state.cases).format("0,0")}
                                </div>
                                <div className="info-recovered">
                                    Recovered: {numeral(state.recovered).format("0,0")}
                                </div>
                                <div className="info-deaths">
                                    Deaths: {numeral(state.deaths).format("0,0")}
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                );
            }
        });
    }

    return countryCircles.concat(stateCircles);
};

const getStatePos = (stateName) => {
    for (let i = 0; i < statesPos.length; i++) {
        if (stateName === statesPos[i].state) {
            return [statesPos[i].latitude, statesPos[i].longitude];
        }
    }
}

export const fixStatesData = (data) => {
    // console.log(data);
    let response = {};
    let lastDay = {};
    for (let i = 0; i < data.length; i++) {
        let stateName = data[i].state;
        let date = data[i].date;
        if (!(response.hasOwnProperty(stateName))) {
            response[stateName] = {};
            response[stateName]["pos"] = getStatePos(stateName);
            response[stateName][date] = data[i].cases;
            lastDay[stateName] = data[i].cases;
        } else {
            response[stateName][date] = data[i].cases - lastDay[stateName];
            lastDay[stateName] = data[i].cases;
        }

    }

    return response;
};

export const showUSDataOnMap = (data, date) => {
    // console.log(data);
    let returnedCircles = [];
    for (const [state, stateData] of Object.entries(data)) {
        // console.log(state);
        // console.log(state, data[state].pos, data[state][date]);
        // console.log(date, state, data[state][date], Math.sqrt(isNaN(data[state][date]) ? 0 : data[state][date]) * casesTypeColors.cases.timelineMultiplier);
        let circle = (<Circle
            center={data[state].pos}
            color={casesTypeColors.cases.hex}
            fillColor={casesTypeColors.cases.hex}
            fillOpacity={0.4}
            radius={
                isNaN(Math.sqrt(isNaN(data[state][date]) ? 0 : data[state][date]) * casesTypeColors.cases.timelineMultiplier) ? 0 : Math.sqrt(isNaN(data[state][date]) ? 0 : data[state][date]) * casesTypeColors.cases.timelineMultiplier
            }>
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                    // style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    ></div>
                    <div className="info-name">{state}</div>
                    <div className="info-confirmed">
                        New Cases: {numeral(data[state][date]).format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>);
        returnedCircles.push(circle);
    }

    return returnedCircles;

};