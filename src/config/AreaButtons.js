// AreaButtons.js
import React from 'react';

function AreaButtons({ areas }) {
    return (
        <div id="area">
            {areas.map((area) => (
                <button id={'AHMButtonArea'} className={"AHMButton"} key={area}>{area}</button>
            ))}
        </div>
    );
}

export default AreaButtons;