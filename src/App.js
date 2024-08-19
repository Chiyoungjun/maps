import React, {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import Kakao from './Kakaotest';
import './css/index.css'
import RegionSelector from "./config/RegionSelector";
import TransactionMethod from "./config/TransactionMethod";
import {Building} from "./config/Building";
import BuildingMethod from "./config/BuildingMethod";

function App() {

    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    const handleClick = () => {
        setSideMenuOpen(!sideMenuOpen);
    }



  return (
    <div id={"App"}>
        <header id={"appHeader"}>
            <nav id={"appNav"}>
                <div id={"appIcon"}>
                    <img src={require('./icon/Group58.jpg')} alt=""/>
                </div>
                <div id={"appTitle"}>
                    <h1>대충 홈페이지 제목</h1>
                </div>
                <nav id={"appChoice"}>
                    <div>주거</div>
                    <div>직장</div>
                </nav>
            </nav>
            <div id={"appLogin"}>
                <div id={"appLoginButton"}>
                    로그인
                </div>
            </div>
            <div id={"appLine"}>
                <hr style={{height: "2%", backgroundColor: "black"}}/>
            </div>
        </header>
        <section id={"appContent"}>
            <Routes id={"mapContent"}>
            <Route path="/" element={<Kakao />} />
            </Routes>
            <article>
                <input id={"search"} type="text" placeholder={"지역, 지하철역, 회사명"}/>
            </article>
            <article>
                <button id={'location'}>
                    <img src={require('./icon/location.png')} alt=""/>
                </button>
            </article>
            <div id={"appSide"} className={sideMenuOpen ? "open" : "closed"}>
                <article id={"appSideButton"}>
                    {/*슬라이드 인/아웃 버튼*/}
                    <div id={"appSideMoveIcon"}>
                        <img src={sideMenuOpen ? require("./icon/vecterback2.png") : require('./icon/vecter2.png')} alt=""/>
                        <img src={sideMenuOpen ? require("./icon/vecterback2.png") : require('./icon/vecter2.png')} alt=""/>
                    </div>
                    <div id={sideMenuOpen ? "appSideClickOut" : "appSideClickIn"} onClick={handleClick}>
                        <div>
                            <button>
                                <img src={sideMenuOpen ? require("./icon/Vectorback.png") : require("./icon/Vector.png")} alt=""/>
                            </button>
                        </div>
                    </div>
                </article>
                <article id={"appSideChoice"}>
                    {/*간편 메뉴 버튼*/}
                    <div className={"appSCMenu"}>
                        <img src={require("./icon/shopping.png")} alt=""/>
                        <div>편의시절</div>
                    </div>
                    <div className={"appSCMenu"}>
                        <img src={require("./icon/sefety.png")} alt=""/>
                        <div>안전시설</div>
                    </div>
                    <div className={"appSCMenu"}>
                        <img src={require("./icon/hospital.png")} alt=""/>
                        <div>의료시설</div>
                    </div>
                    <div className={"appSCMenu"}>
                        <img src={require("./icon/plus.png")} alt=""/>
                        <div>기타시설</div>
                    </div>
                </article>
            </div>
            <article id={"hiddenMenu"} className={sideMenuOpen ? "open" : "closed"}>
                {/*해당부분을 컴포넌트로 하는 것이 좋아보임*/}
                <div id={'hiddenTable'}>
                    <RegionSelector />
                    <TransactionMethod/>
                    <BuildingMethod/>
                    <div className={"selectList"}>
                        <div>면적<br/><hr/></div>
                        <div>면적 내용</div>
                    </div>
                    {/*<div>주변 직장</div>  추후에 할 예정*/}
                    <div className={"selectList"}>
                        <div>n개의 결과<br/><hr/></div>
                        {/*여기도 컨포넌트 or 큰 창이 띄울수 있는 버튼*/}
                        <div> 리스트</div>
                    </div>
                </div>
            </article>
        </section>
    </div>
  );
}

export default App;
