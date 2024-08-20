import React, { useEffect } from "react";

function Kakao() {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // window.kakao 사용
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options); // window.kakao 사용
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '100vh',
          overflow: 'hidden',
      }}
    ></div>
  );
}

export default Kakao;
