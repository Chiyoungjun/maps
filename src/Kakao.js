import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from './data'; // data.js에서 필요한 데이터를 import
import './Kakao.css'

const KakaoMap = () => {
  // 참조용 변수 선언
  const mapContainer = useRef(null); // 지도 컨테이너 참조
  const map = useRef(null); // 지도 객체 참조
  const convenienceMarkers = useRef([]); // 편의시설 마커 배열 참조
  const safetyMarkers = useRef([]); // 안전시설 마커 배열 참조
  const medicalMarkers = useRef([]); // 의료시설 마커 배열 참조
  const userMarker = useRef(null); // 사용자가 클릭한 위치의 마커 참조
  const [activeMarker, setActiveMarker] = useState("convenience"); // 현재 활성화된 마커 종류 상태
  const [zoomLevel, setZoomLevel] = useState(6); // 현재 확대 레벨 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  useEffect(() => {
    // 지도를 초기화하는 로직
    const container = mapContainer.current; // 지도 컨테이너 가져오기
    const options = {
      center: new window.kakao.maps.LatLng(37.498004414546934, 127.02770621963765), // 초기 중심 좌표 설정
      level: zoomLevel // 초기 확대 레벨 설정
    };

    map.current = new window.kakao.maps.Map(container, options); // 카카오 지도 생성
    
    createMarkers(); // 마커 생성 함수 호출
    changeMarker(activeMarker); // 활성화된 마커 표시

    // 지도를 클릭했을 때 사용자 마커 추가 이벤트 리스너
    window.kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
      const latlng = mouseEvent.latLng; // 클릭한 위치의 좌표
      addUserMarker(latlng); // 사용자 마커 추가 함수 호출
    });

    // 지도 확대/축소 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map.current, 'zoom_changed', () => {
      const level = map.current.getLevel(); // 현재 지도 레벨 가져오기
      setZoomLevel(level); // 현재 레벨 상태 업데이트
    });

    return () => {
      window.kakao.maps.event.removeListener(map.current, 'zoom_changed'); // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    };
  }, []);

  // 마커 이미지를 생성하는 함수
  const createMarkerImage = (src, size, options) => {
    return new window.kakao.maps.MarkerImage(src, size, options);
  };

  // 마커를 생성하는 함수
const createMarker = (position, image, title) => {
  const marker = new window.kakao.maps.Marker({
    position: position, // 마커 위치
    image: image // 마커 이미지
  });

  // 여기서 infoWindow를 마커별로 새로 생성
  const infoWindow = new window.kakao.maps.InfoWindow({
    content: `<div style="padding:5px;">${title}</div>`, // 정보창 내용
    removable: true // 닫기 버튼 표시
  });

  // 마커에 마우스오버 이벤트 리스너 추가
  window.kakao.maps.event.addListener(marker, 'mouseover', () => {
    infoWindow.open(map.current, marker); // 지도에 정보창 열기
  });

  // 마커에 마우스아웃 이벤트 리스너 추가
  window.kakao.maps.event.addListener(marker, 'mouseout', () => {
    infoWindow.close(); // 정보창 닫기
  });

  return marker; // 생성된 마커 반환
};
  // 편의시설, 안전시설, 의료시설 마커를 모두 생성하는 함수
  const createMarkers = () => {
    createConvenienceMarkers(); // 편의시설 마커 생성
    createSafetyMarkers(); // 안전시설 마커 생성
    createMedicalMarkers(); // 의료시설 마커 생성
  };

  // 편의시설 마커를 생성하는 함수
  const createConvenienceMarkers = () => {
    markerData.convenience.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
      const imageSize = new window.kakao.maps.Size(22, 26); // 마커 이미지 크기 설정
      const imageOptions = markerData.convenience.imageOptions; // 마커 이미지 옵션 설정

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions); // 마커 이미지 생성
      const marker = createMarker(position, markerImage, '편의시설'); // 마커 생성
      convenienceMarkers.current.push(marker); // 생성된 마커를 배열에 추가
    });
  };

  // 안전시설 마커를 생성하는 함수
  const createSafetyMarkers = () => {
    markerData.safety.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
      const imageSize = new window.kakao.maps.Size(22, 26); // 마커 이미지 크기 설정
      const imageOptions = markerData.safety.imageOptions; // 마커 이미지 옵션 설정

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions); // 마커 이미지 생성
      const marker = createMarker(position, markerImage, '안전시설'); // 마커 생성
      safetyMarkers.current.push(marker); // 생성된 마커를 배열에 추가
    });
  };

  // 의료시설 마커를 생성하는 함수
  const createMedicalMarkers = () => {
    markerData.medical.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
      const imageSize = new window.kakao.maps.Size(22, 26); // 마커 이미지 크기 설정
      const imageOptions = markerData.medical.imageOptions; // 마커 이미지 옵션 설정

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions); // 마커 이미지 생성
      const marker = createMarker(position, markerImage, '의료시설'); // 마커 생성
      medicalMarkers.current.push(marker); // 생성된 마커를 배열에 추가
    });
  };

  // 마커를 지도에 표시하는 함수
  const setMarkers = (markers) => {
    markers.forEach(marker => marker.setMap(map.current)); // 각 마커를 지도에 표시
  };

  // 모든 마커를 지도에서 제거하는 함수
  const clearAllMarkers = () => {
    convenienceMarkers.current.forEach(marker => marker.setMap(null)); // 편의시설 마커 제거
    safetyMarkers.current.forEach(marker => marker.setMap(null)); // 안전시설 마커 제거
    medicalMarkers.current.forEach(marker => marker.setMap(null)); // 의료시설 마커 제거
    if (userMarker.current) {
      userMarker.current.setMap(null); // 사용자 마커 제거
    }
    setSearchResults([]); // 검색 결과 초기화
  };

  // 마커 종류를 변경하는 함수
  const changeMarker = (type) => {
    clearAllMarkers(); // 모든 마커 제거

    if (type === 'convenience') {
      setMarkers(convenienceMarkers.current); // 편의시설 마커 표시
    } else if (type === 'safety') {
      setMarkers(safetyMarkers.current); // 안전시설 마커 표시
    } else if (type === 'medical') {
      setMarkers(medicalMarkers.current); // 의료시설 마커 표시
    }
    setActiveMarker(type); // 현재 활성화된 마커 타입 설정
  };

  const getBuildingNameFromLatLng = (latlng, callback) => {
    const ps = new window.kakao.maps.services.Places();
    const searchRadius = 200; // 검색 반경을 늘려봅니다.
  
    ps.categorySearch('PM9', (data, status, pagination) => { // 'PM9'는 건물 관련 카테고리 예시
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        // 검색 결과가 있을 경우 첫 번째 결과의 건물명
        const buildingName = data[0].place_name;
        callback(buildingName); // 콜백으로 건물명 반환
      } else {
        callback("건물 정보를 가져올 수 없습니다."); // 오류 처리
      }
    }, {
      location: latlng,
      radius: searchRadius
    });
  };
  
  const addUserMarker = (latlng) => {
    const imageSize = new window.kakao.maps.Size(30, 30); // 사용자 마커 이미지 크기 설정
    const markerImage = createMarkerImage(userMarkerImageSrc, imageSize, {}); // 사용자 마커 이미지 생성
  
    if (userMarker.current) {
      userMarker.current.setMap(null); // 기존 사용자 마커 제거
    }
  
    // 건물명을 가져와서 인포윈도우 내용을 설정합니다.
    getBuildingNameFromLatLng(latlng, (buildingName) => {
      const infoWindowContent = `<div style="padding:5px;">건물명: ${buildingName}</div>`;
  
      // 새로운 사용자 마커 생성
      userMarker.current = new window.kakao.maps.Marker({
        position: latlng, // 클릭한 위치의 좌표 설정
        image: markerImage // 마커 이미지 설정
      });
  
      // 인포윈도우 생성
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoWindowContent, // 인포윈도우의 내용
        removable: true // 인포윈도우 닫기 버튼 활성화
      });
  
      // 마커 클릭 시 인포윈도우를 표시하도록 설정
      window.kakao.maps.event.addListener(userMarker.current, 'click', () => {
        infoWindow.open(map.current, userMarker.current);
      });
  
      // 지도에 마커를 추가
      userMarker.current.setMap(map.current);
  
      // 인포윈도우를 즉시 열기 (선택 사항, 마커 클릭 시 자동으로 열도록 설정할 수도 있음)
      infoWindow.open(map.current, userMarker.current);
    });
  };;
  // 장소를 검색하는 함수
  const searchPlaces = () => {
    const ps = new window.kakao.maps.services.Places(); // 장소 검색 서비스 생성
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        clearAllMarkers(); // 모든 마커 제거
        const markers = [];
        setSearchResults(data); // 검색 결과 상태 업데이트
        data.forEach(place => {
          const position = new window.kakao.maps.LatLng(place.y, place.x); // 검색된 장소 위치 설정
          const markerImage = createMarkerImage(markerImageSrc, new window.kakao.maps.Size(22, 26), {}); // 마커 이미지 생성
          const marker = createMarker(position, markerImage, place.place_name); // 마커 생성
          markers.push(marker); // 생성된 마커를 배열에 추가
          marker.setMap(map.current); // 마커를 지도에 표시
        });
      } else {
        alert('검색 결과가 없습니다.'); // 검색 결과가 없을 때 경고창 표시
      }
    });
  };

  return (
    <div className="kakao-map-container">
      {/* 지도 컨테이너 */}
      <div 
        id="map" 
        ref={mapContainer} 
        className="map" 
        style={{ width: '500px', height: '500px' }}
      ></div>

      {/* 장소 검색 입력란 */}
      <div className="search-container">
        <input 
          type="text" 
          value={searchKeyword} 
          onChange={(e) => setSearchKeyword(e.target.value)} 
          className="search-input"
          placeholder="장소 검색" 
        />
        <button className="search-button" onClick={searchPlaces}>검색</button>
      </div>

      {/* 검색 결과 목록 */}
      <div className="search-results">
        <h3>검색 결과</h3>
        <ul className="results-list">
          {searchResults.map((place, index) => (
            <li key={index} className="result-item">
              <span>{place.place_name}</span>
              <button 
                className="view-location-button"
                onClick={() => {
                  const position = new window.kakao.maps.LatLng(place.y, place.x); // 검색된 장소 위치 설정
                  map.current.setCenter(position); // 지도 중심 이동
                  addUserMarker(position); // 사용자 마커 추가
                }}
              >
                위치 보기
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 현재 지도 레벨 표시 */}
      <div className="zoom-level-display">
        현재 지도 레벨은 {zoomLevel} 입니다
      </div>

      {/* 마커 타입 선택 버튼 */}
      <div className="marker-selection">
        <button 
          className={`marker-button ${activeMarker === 'convenience' ? 'active' : ''}`}
          onClick={() => changeMarker('convenience')}
        >
          편의시설
        </button>
        <button 
          className={`marker-button ${activeMarker === 'safety' ? 'active' : ''}`}
          onClick={() => changeMarker('safety')}
        >
          안전시설
        </button>
        <button 
          className={`marker-button ${activeMarker === 'medical' ? 'active' : ''}`}
          onClick={() => changeMarker('medical')}
        >
          의료시설
        </button>
      </div>
    </div>
  );
};

export default KakaoMap;
