import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from './data'; // data.js에서 import

const KakaoMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const convenienceMarkers = useRef([]);
    const safetyMarkers = useRef([]);
    const medicalMarkers = useRef([]);
    const userMarker = useRef(null);
    const [activeMarker, setActiveMarker] = useState("convenience");
    const [zoomLevel, setZoomLevel] = useState(3); // 현재 확대 레벨 상태
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

    useEffect(() => {
        const container = mapContainer.current;
        const options = {
            center: new window.kakao.maps.LatLng(37.498004414546934, 127.02770621963765),
            level: zoomLevel
        };

        map.current = new window.kakao.maps.Map(container, options);

        createMarkers();
        changeMarker(activeMarker);

        window.kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
            const latlng = mouseEvent.latLng;
            addUserMarker(latlng);
        });

        // 확대/축소 이벤트 리스너 등록
        window.kakao.maps.event.addListener(map.current, 'zoom_changed', () => {
            const level = map.current.getLevel();
            setZoomLevel(level); // 현재 레벨 상태 업데이트
        });

        return () => {
            window.kakao.maps.event.removeListener(map.current, 'zoom_changed');
        };
    }, []);

    const createMarkerImage = (src, size, options) => {
        return new window.kakao.maps.MarkerImage(src, size, options);
    };

    const createMarker = (position, image, title) => {
        const marker = new window.kakao.maps.Marker({
            position: position,
            image: image
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${title}</div>`,
                removable: true
            });
            infoWindow.open(map.current, marker);
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
        setSearchResults([]); // 검색 결과 초기화
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

    const addUserMarker = (latlng) => {
        const imageSize = new window.kakao.maps.Size(30, 30);
        const markerImage = createMarkerImage(userMarkerImageSrc, imageSize, {});
        if (userMarker.current) {
            userMarker.current.setMap(null);
        }
        userMarker.current = createMarker(latlng, markerImage, '내 위치');
        userMarker.current.setMap(map.current);
    };

    const searchPlaces = () => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                clearAllMarkers();
                const markers = [];
                setSearchResults(data); // 검색 결과 저장
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

    return (
        <div>
            <div id="map" ref={mapContainer}></div>
            <div>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="장소 검색"
                />
                <button onClick={searchPlaces}>검색</button>
            </div>
            <div>
                <h3>검색 결과</h3>
                <ul>
                    {searchResults.map((place, index) => (
                        <li key={index}>
                            <span>{place.place_name}</span>
                            <button onClick={() => {
                                const position = new window.kakao.maps.LatLng(place.y, place.x);
                                map.current.setCenter(position);
                                addUserMarker(position); // 사용자 마커 추가
                            }}>위치 보기</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>현재 지도 레벨은 {zoomLevel} 입니다</div>
        </div>
    );
};

export default KakaoMap;
