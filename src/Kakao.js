import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from './data'; // data.js에서 필요한 데이터 import
import './Kakao.css'; // CSS 파일 import

const KakaoMap = () => {
  const mapContainer = useRef(null); // 지도 컨테이너를 참조
  const map = useRef(null); // 지도를 참조
  const convenienceMarkers = useRef([]); // 편의시설 마커 배열
  const safetyMarkers = useRef([]); // 안전시설 마커 배열
  const medicalMarkers = useRef([]); // 의료시설 마커 배열
  const userMarker = useRef(null); // 사용자 위치 마커
  const [activeMarker, setActiveMarker] = useState("convenience"); // 현재 활성화된 마커 종류 상태
  const [zoomLevel, setZoomLevel] = useState(6); // 현재 지도 확대/축소 레벨 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  useEffect(() => {
    const container = mapContainer.current; // 지도 컨테이너를 참조
    const options = {
      center: new window.kakao.maps.LatLng(35.14571547395411, 129.0073490267914), // 초기 지도 중심 좌표
      level: zoomLevel // 초기 지도 확대/축소 레벨
    };

    map.current = new window.kakao.maps.Map(container, options); // 지도 객체 생성
    createMarkers(); // 마커 생성
    changeMarker(activeMarker); // 현재 활성화된 마커 유형의 마커 설정

    // 사용자 현재 위치에 마커 추가
    handleCurrentLocation();

    // 지도 클릭 시 사용자 위치에 마커 추가
    window.kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
      const latlng = mouseEvent.latLng;
      addUserMarker(latlng);
    });

    // 지도 확대/축소 레벨 변경 시 상태 업데이트
    window.kakao.maps.event.addListener(map.current, 'zoom_changed', () => {
      const level = map.current.getLevel();
      setZoomLevel(level);
    });

    // 클린업 함수: 언마운트 시 이벤트 리스너 제거
    return () => {
      window.kakao.maps.event.removeListener(map.current, 'zoom_changed');
    };
  }, []); // 빈 배열을 dependency로 줘서 컴포넌트가 마운트될 때만 실행

  const createMarkerImage = (src, size, options) => {
    return new window.kakao.maps.MarkerImage(src, size, options);
  };

  const createMarker = (position, image, title) => {
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: image
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${title}</div>`,
      removable: true
    });

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infoWindow.open(map.current, marker);
    });

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infoWindow.close();
    });

    return marker;
  };

  const createMarkers = () => {
    createConvenienceMarkers();
    createSafetyMarkers();
    createMedicalMarkers();
  };

  const createConvenienceMarkers = () => {
    markerData.convenience.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const imageSize = new window.kakao.maps.Size(22, 26);
      const imageOptions = markerData.convenience.imageOptions;

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions);
      const marker = createMarker(position, markerImage, '편의시설');
      convenienceMarkers.current.push(marker);
    });
  };

  const createSafetyMarkers = () => {
    markerData.safety.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const imageSize = new window.kakao.maps.Size(22, 26);
      const imageOptions = markerData.safety.imageOptions;

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions);
      const marker = createMarker(position, markerImage, '안전시설');
      safetyMarkers.current.push(marker);
    });
  };

  const createMedicalMarkers = () => {
    markerData.medical.positions.forEach(({ lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const imageSize = new window.kakao.maps.Size(22, 26);
      const imageOptions = markerData.medical.imageOptions;

      const markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions);
      const marker = createMarker(position, markerImage, '의료시설');
      medicalMarkers.current.push(marker);
    });
  };

  const setMarkers = (markers) => {
    markers.forEach(marker => marker.setMap(map.current));
  };

  const clearAllMarkers = () => {
    convenienceMarkers.current.forEach(marker => marker.setMap(null));
    safetyMarkers.current.forEach(marker => marker.setMap(null));
    medicalMarkers.current.forEach(marker => marker.setMap(null));
    if (userMarker.current) {
      userMarker.current.setMap(null);
    }
    setSearchResults([]);
  };

  const changeMarker = (type) => {
    clearAllMarkers();

    if (type === 'convenience') {
      setMarkers(convenienceMarkers.current);
    } else if (type === 'safety') {
      setMarkers(safetyMarkers.current);
    } else if (type === 'medical') {
      setMarkers(medicalMarkers.current);
    }
    setActiveMarker(type);
  };

  const getBuildingNameFromLatLng = (latlng, callback) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        callback(address);
      } else {
        callback("건물 정보를 가져올 수 없습니다.");
      }
    });
  };

  const addUserMarker = (latlng) => {
    const imageSize = new window.kakao.maps.Size(30, 30);
    const markerImage = createMarkerImage(userMarkerImageSrc, imageSize, {});

    if (userMarker.current) {
      userMarker.current.setMap(null);
    }
    if (userMarker.current && userMarker.current.infoWindow) {
      userMarker.current.infoWindow.close();
    }

    userMarker.current = new window.kakao.maps.Marker({
      position: latlng,
      image: markerImage
    });

    getBuildingNameFromLatLng(latlng, (buildingName) => {
      const infoWindowContent = `<div style="padding:5px;">건물명: ${buildingName}</div>`;
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoWindowContent,
        removable: true
      });

      userMarker.current.infoWindow = infoWindow;

      window.kakao.maps.event.addListener(userMarker.current, 'click', () => {
        infoWindow.open(map.current, userMarker.current);
      });

      userMarker.current.setMap(map.current);
      infoWindow.open(map.current, userMarker.current);
    });
  };

  const searchPlaces = () => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        clearAllMarkers();
        const markers = [];
        setSearchResults(data);
        data.forEach(place => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          const markerImage = createMarkerImage(markerImageSrc, new window.kakao.maps.Size(22, 26), {});
          const marker = createMarker(position, markerImage, place.place_name);
          markers.push(marker);
          marker.setMap(map.current);
        });
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const positionLatLng = new window.kakao.maps.LatLng(latitude, longitude);

          map.current.setCenter(positionLatLng);

          addUserMarker(positionLatLng);
        },
        (error) => {
          console.error('현재 위치를 가져오는 데 실패했습니다.', error);
        }
      );
    } else {
      alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
    }
  };

  return (
    <div className="kakao-map-container">
      <div id="map" className="map" ref={mapContainer}></div>

      {/* 사이드바 */}
      <div className="sidebar">
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

        <div className="search-results">
          <h3>검색 결과</h3>
          <ul className="results-list">
            {searchResults.map((place, index) => (
              <li key={index} className="result-item">
                <span>{place.place_name}</span>
                <button 
                  className="view-location-button"
                  onClick={() => {
                    const position = new window.kakao.maps.LatLng(place.y, place.x);
                    map.current.setCenter(position);
                    addUserMarker(position);
                  }}
                >
                  위치 보기
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="zoom-level-display">
          현재 지도 레벨은 {zoomLevel} 입니다
        </div>

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

      {/* 내 위치 이미지 버튼 */}
      <div className="current-location-button">
        <img 
          src="https://example.com/path/to/location-icon.png" 
          alt="내 위치" 
          onClick={handleCurrentLocation} 
          className="location-icon"
        />
      </div>
    </div>
  );
};

export default KakaoMap;
