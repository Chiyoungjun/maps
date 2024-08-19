// RegionButtons.js
import React from 'react';
import "../css/index.css"

function RegionButtons({ regions, onRegionClick, selectedRegion }) {
    return (
        <div id="region">
            {regions.map((region) => (
                <button
                    id={"AHMButtonRegion"}
                    className={selectedRegion === region ? 'selected' : ''}
                    key={region}
                    onClick={() => onRegionClick(region)}>
                    {region}
                </button>
            ))}
        </div>
    );
}

export default RegionButtons;