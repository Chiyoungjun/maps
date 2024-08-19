// AreaButtons.js
import React, {useState} from 'react';
import '../css/index.css'

function AreaButtons({ areas }) {
    const [selectedArea, setSelectedArea] = useState(null);

    const handleAreaClick = (area) => {
        setSelectedArea(prevArea => prevArea === area ? null : area);
    };


    return (
        <div id="area">
            {areas.map((area) => (
                <button
                    id={'AHMButtonArea'}
                    className={`AHMButton ${selectedArea === area ? 'selected' : ''}`}
                    key={area}
                    onClick={() => handleAreaClick(area)}
                >
                    {area}
                </button>
            ))}
        </div>
    );
}

export default AreaButtons;