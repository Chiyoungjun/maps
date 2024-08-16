import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Kakao from './Kakao';
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
        </section>
    </div>
  );
}

export default App;
