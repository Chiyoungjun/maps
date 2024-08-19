import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Kakao from './Kakao';
import KakaoMaps from './KakaoMaps';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Kakao />} />
      </Routes>
    </div>
  );
}

export default App;
