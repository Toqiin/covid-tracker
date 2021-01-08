import React from 'react';
import './USMap.css';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { showUSDataOnMap } from './util';
import {
    Slider,
    Typography
} from "@material-ui/core";
import {DateTime} from 'luxon';
import { useEffect, useState } from 'react';

function USTimelineMap({ data, mapCenter, mapZoom, date }) {

    const [selectedDate, setSelectedDate] = useState(DateTime.local().toISODate());

    var now = DateTime.local();
    var start = DateTime.fromISO("2020-01-21");
    var daysDuration = now.diff(start, 'days');
    daysDuration.toObject();
    var daysSince = Math.floor(daysDuration.days);

    const onSliderChange = (event, value) => {
        var newDate = DateTime.fromISO("2020-01-21").plus({days: value});
        newDate = newDate.toISODate();
        // console.log(newDate);
        if (newDate !== selectedDate) {
            setSelectedDate(newDate);
        }
    }

    return (
        <div>
            <div className="slider-container">
                <Typography id="discrete-slider-timeline" gutterBottom>
                    Days since pandemic began
                </Typography>
                <Slider
                    defaultValue={daysSince}
                    aria-labelledby="discrete-slider-timeline"
                    min={0}
                    max={daysSince}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={onSliderChange}
                />
            </div>
            
            <div className="us_map">
                <LeafletMap key={JSON.stringify(mapCenter) + mapZoom} center={mapCenter} zoom={mapZoom} >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        subdomains='abcd'
                        maxZoom='19'
                        minZoom='2'
                    />
                    {showUSDataOnMap(data, selectedDate)}
                </LeafletMap>
            </div>
        </div>
    )
}

export default USTimelineMap
