import React from 'react';
import '../css/index.css';

const LocationButton = ({ handleCurrentLocation }) => {
    return (
        <article>
            <div id="location">
                <img
                    src={require('../icon/location.png')}
                    alt="내 위치"
                    onClick={handleCurrentLocation}
                    className="location-icon"
                />
            </div>
        </article>
    );
};

export default LocationButton;