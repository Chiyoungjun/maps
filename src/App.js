import React, {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import Kakao from './Kakao';
import './css/index.css'

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
        </section>
    </div>
  );
}

export default App;
