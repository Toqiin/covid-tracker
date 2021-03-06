import React from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { showDataOnMap } from './util';

function Map({ states, countries, mapCenter, mapZoom, updateAppCountry, USFocus }) {

    const onCircleClick = (country) => {
        updateAppCountry(country);
    };

    return (
        <div className="map">
            <LeafletMap key={JSON.stringify(mapCenter) + mapZoom} center={mapCenter} zoom={mapZoom} >
                <TileLayer
                    url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains='abcd'
                    maxZoom='19'
                    minZoom='2'
                />
                {showDataOnMap(states, countries, onCircleClick, USFocus)}
            </LeafletMap>
        </div>
    )
}

export default Map
