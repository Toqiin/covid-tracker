import React from 'react';
import {useState, useEffect} from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';

function Map({ mapCenter, mapZoom }) {

    return (
        <div className="map">
            <LeafletMap key={JSON.stringify(mapCenter)} center={mapCenter} zoom={mapZoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution={JSON.stringify(mapCenter)}
                />
            </LeafletMap>
        </div>
    )
}

export default Map
