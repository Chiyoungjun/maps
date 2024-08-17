import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Kakao from './Kakaotest';
import './css/index.css'
import styled from "styled-components";

function App() {
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
            <div id={"appSide"}>
                <article id={"appSideButton"}>
                    {/*슬라이드 인/아웃 버튼*/}
                    <div id={"appSideMoveIcon"}>
                        <img src={require("./icon/vecter2.png")} alt=""/>
                        <img src={require("./icon/vecter2.png")} alt=""/>
                    </div>
                    <div id={"appSideClick"}>
                    <div>
                            <img src={require("./icon/Vector.png")} alt=""/>
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
        </section>
    </div>
  );
}

export default App;
