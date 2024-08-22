import React from 'react';
import '../css/index.css';
import RegionSelector from "../config/RegionSelector";
import TransactionMethod from "../config/TransactionMethod";
import BuildingMethod from "../config/BuildingMethod";
import AreaSet from "../config/AreaSet";

const HiddenMenu = ({ sideMenuOpen }) => {
    return (
        <article id="hiddenMenu" className={sideMenuOpen ? "open" : "closed"}>
            <div id='hiddenTable'>
                <RegionSelector/>
                <TransactionMethod/>
                <BuildingMethod/>
                <AreaSet/>
                <div className="selectList">
                    <div>n개의 결과<br/>
                        <hr/>
                    </div>
                    <div>리스트</div>
                </div>
            </div>
        </article>
    );
};

export default HiddenMenu;