// RegionSelector.js
import React, { useState } from 'react';
import { regions } from './Regions';
import RegionButtons from './RegionButtons';
import AreaButtons from './AreaButtons';

function RegionSelector() {
    const [selectedRegion, setSelectedRegion] = useState(null);

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
    };

    return (
        <>
            <div className="selectList">
                <div>지역<br/><hr/></div>
                <RegionButtons regions={Object.keys(regions)} onRegionClick={handleRegionClick} />
            </div>
            <div className="selectList">
                <div>상세 지역<br/><hr/></div>
                {selectedRegion && <AreaButtons areas={regions[selectedRegion]} />}
            </div>
        </>
    );
}

export default RegionSelector;