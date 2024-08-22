import React from 'react';
import '../css/index.css';

const SideMenu = ({ sideMenuOpen, setSideMenuOpen, activeMarker, changeMarker }) => {
    const handleClick = () => {
        setSideMenuOpen(!sideMenuOpen);
    };

    return (
        <div id="appSide" className={sideMenuOpen ? "open" : "closed"}>
            <article>
                <article id="appSideButton">
                    <div id="appSideMoveIcon">
                        <img src={sideMenuOpen ? require("../icon/vecterback2.png") : require('../icon/vecter2.png')} alt=""/>
                        <img src={sideMenuOpen ? require("../icon/vecterback2.png") : require('../icon/vecter2.png')} alt=""/>
                    </div>
                    <div id={sideMenuOpen ? "appSideClickOut" : "appSideClickIn"} onClick={handleClick}>
                        <div>
                            <button>
                                <img src={sideMenuOpen ? require("../icon/Vectorback.png") : require("../icon/Vector.png")} alt=""/>
                            </button>
                        </div>
                    </div>
                </article>
            </article>
            <article>
                <div id="appSideChoice">
                    <button
                        className={`appSCMenu ${activeMarker === 'convenience' ? 'active' : ''}`}
                        onClick={() => changeMarker('convenience')}
                    >
                        <img src={require("../icon/shopping.png")}/>
                        <div>편의시설</div>
                    </button>
                    <button
                        className={`appSCMenu ${activeMarker === 'safety' ? 'active' : ''}`}
                        onClick={() => changeMarker('safety')}
                    >
                        <img src={require("../icon/shopping.png")}/>
                        <div>안전시설</div>
                    </button>
                    <button
                        className={`appSCMenu ${activeMarker === 'medical' ? 'active' : ''}`}
                        onClick={() => changeMarker('medical')}
                    >
                        <img src={require("../icon/shopping.png")}/>
                        <div>의료시설</div>
                    </button>
                    <button
                        className={`appSCMenu ${activeMarker === 'other' ? 'active' : ''}`}
                        onClick={() => changeMarker('other')}
                    >
                        <img src={require("../icon/shopping.png")}/>
                        <div>기타시설</div>
                    </button>
                </div>
            </article>
        </div>
    );
};

export default SideMenu;