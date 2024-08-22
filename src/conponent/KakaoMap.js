import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from '../data';
import '../css/index.css';
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import LocationButton from "./components/LocationButton";
import SideMenu from "./components/SideMenu";
import HiddenMenu from "./components/HiddenMenu";

const KakaoMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const convenienceMarkers = useRef([]);
    const safetyMarkers = useRef([]);
    const medicalMarkers = useRef([]);
    const otherMarkers = useRef([]);
    const userMarker = useRef(null);
    const searchMarkers = useRef([]);
    const [activeMarker, setActiveMarker] = useState("convenience");
    const [zoomLevel, setZoomLevel] = useState(6);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [searchResultsVisible, setSearchResultsVisible] = useState(false);
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    useEffect(() => {
        const container = mapContainer.current; // 지도 컨테이너 요소를 참조
        const options = {
            center: new window.kakao.maps.LatLng(37.499463762912974, 127.0288828824399), // 초기 지도 중심 좌표 설정
            level: zoomLevel // 초기 지도 확대/축소 레벨 설정
        };

        // Kakao 지도 객체를 생성하여 map.current에 저장
        map.current = new window.kakao.maps.Map(container, options);

        // 줌 컨트롤러 생성 및 지도에 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 편의시설, 안전시설, 의료시설 마커 생성
        createMarkers();

        // 현재 활성화된 마커 유형에 따라 마커 표시
        changeMarker(activeMarker);

        // 사용자의 현재 위치를 지도에 표시
        handleCurrentLocation();

        // 지도를 클릭할 때 사용자의 위치에 마커를 추가하는 이벤트 리스너 추가
        window.kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
            const latlng = mouseEvent.latLng; // 클릭한 위치의 좌표를 가져옴
            addUserMarker(latlng); // 사용자의 위치에 마커를 추가
        });

        // 지도 확대/축소 레벨이 변경될 때마다 zoomLevel 상태를 업데이트
        window.kakao.maps.event.addListener(map.current, 'zoom_changed', () => {
            const level = map.current.getLevel();
            setZoomLevel(level);
        });

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.kakao.maps.event.removeListener(map.current, 'zoom_changed');
        };
    }, []); // 빈 dependency 배열을 사용하여 컴포넌트가 마운트될 때만 실행되도록 설정

    /* === 마커 관련 함수들 === */

    // Kakao 지도 API에서 제공하는 MarkerImage 객체를 생성하는 함수
    const createMarkerImage = (src, size, options) => {
        return new window.kakao.maps.MarkerImage(src, size, options);
    };

    // 지도에 마커와 인포윈도우를 생성하고 반환하는 함수
    const createMarker = (position, image, title) => {
        const marker = new window.kakao.maps.Marker({
            position: position, // 마커의 위치
            image: image // 마커 이미지
        });
        // 마커에 표시될 인포윈도우 생성
        const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${title}</div>`, // 인포윈도우 내용
            removable: true // 인포윈도우 제거 가능 여부
        });
        // 마커에 마우스를 올리면 인포윈도우를 표시
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
            infoWindow.open(map.current, marker);
        });

        // 마커에서 마우스를 내리면 인포윈도우를 닫음
        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
            infoWindow.close();
        });

        return marker;
    };

    // 편의시설 마커들을 생성하는 함수
    const createMarkers = () => {
        createConvenienceMarkers(); // 편의시설 마커 생성
        createSafetyMarkers(); // 안전시설 마커 생성
        createMedicalMarkers(); // 의료시설 마커 생성
        createOtherMarkers(); //기타시설 마커 생성
    };

    const createConvenienceMarkers = () => {
        markerData.convenience.positions.forEach(({ lat, lng }) => {
            const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
            const imageSize = markerData.convenience.imageOptions.spriteSize; // 마커 이미지 크기 설정
            const imageOptions = markerData.convenience.imageOptions; // 마커 이미지 옵션 설정

            const markerImage = createMarkerImage(markerImageSrc, imageSize, {}); // 마커 이미지 생성
            const marker = createMarker(position, markerImage, '편의시설'); // 마커 생성
            convenienceMarkers.current.push(marker); // 생성된 마커를 편의시설 마커 배열에 추가
        });
    };

    // 안전시설 마커들을 생성하는 함수
    const createSafetyMarkers = () => {
        markerData.safety.positions.forEach(({ lat, lng }) => {
            const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
            const imageSize = markerData.safety.imageOptions.spriteSize; // 마커 이미지 크기 설정
            const imageOptions = markerData.safety.imageOptions; // 마커 이미지 옵션 설정

            const markerImage = createMarkerImage(markerImageSrc, imageSize, {}); // 마커 이미지 생성
            const marker = createMarker(position, markerImage, '안전시설'); // 마커 생성
            safetyMarkers.current.push(marker); // 생성된 마커를 안전시설 마커 배열에 추가
        });
    };

    // 의료시설 마커들을 생성하는 함수
    const createMedicalMarkers = () => {
        markerData.medical.positions.forEach(({ lat, lng }) => {
            const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
            const imageSize = markerData.medical.imageOptions.spriteSize; // 마커 이미지 크기 설정
            const imageOptions = markerData.medical.imageOptions; // 마커 이미지 옵션 설정

            const markerImage = createMarkerImage(markerImageSrc, imageSize, {}); // 마커 이미지 생성
            const marker = createMarker(position, markerImage, '의료시설'); // 마커 생성
            medicalMarkers.current.push(marker); // 생성된 마커를 의료시설 마커 배열에 추가
        });
    };

    // 기타시설 마커들을 생성하는 함수
    const createOtherMarkers = () => {
        markerData.convenience.positions.forEach(({ lat, lng }) => {
            const position = new window.kakao.maps.LatLng(lat, lng); // 마커 위치 설정
            const imageSize = markerData.convenience.imageOptions.spriteSize; // 마커 이미지 크기 설정
            const imageOptions = markerData.convenience.imageOptions; // 마커 이미지 옵션 설정

            const markerImage = createMarkerImage(markerImageSrc, imageSize, {}); // 마커 이미지 생성5
            const marker = createMarker(position, markerImage, '기타시설'); // 마커 생성
            otherMarkers.current.push(marker); // 생성된 마커를 기타시설 마커 배열에 추가
        });
    };

    // 주어진 마커 배열의 모든 마커를 지도에 표시하는 함수
    const setMarkers = (markers) => {
        markers.forEach(marker => marker.setMap(map.current));
    };


    // 지도에 표시된 모든 마커를 제거하는 함수
    const clearAllMarkers = () => {
        // 각 마커 배열에서 모든 마커를 지도에서 제거
        convenienceMarkers.current.forEach(marker => marker.setMap(null));
        safetyMarkers.current.forEach(marker => marker.setMap(null));
        medicalMarkers.current.forEach(marker => marker.setMap(null));
        otherMarkers.current.forEach(marker => marker.setMap(null));
        clearSearchMarkers();

        // 사용자 위치 마커가 있으면 지도에서 제거
        if (userMarker.current) {
            userMarker.current.setMap(null);
        }
        setSearchResults([]); // 검색 결과 초기화
    };

    // 선택된 마커 타입에 따라 지도에 마커를 표시하고 상태값을 업데이트하는 함수
    const changeMarker = (type) => {
        clearAllMarkers(); // 모든 마커 제거

        // 선택된 마커 타입에 따라 해당 카테고리의 마커만 표시
        if (type === 'convenience') {
            setMarkers(convenienceMarkers.current);
        } else if (type === 'safety') {
            setMarkers(safetyMarkers.current);
        } else if (type === 'medical') {
            setMarkers(medicalMarkers.current);
        } else if (type === 'other') {
            setMarkers(otherMarkers.current);  // 기타시설 마커만 표시
        }
        setActiveMarker(type); // 활성화된 마커 타입 상태값 업데이트
        setSidebarVisible(true); // 사이드바 표시
    };

    /* === 위치 관련 함수들 === */
    // 좌표로부터 건물 이름을 얻어오는 함수
    const getBuildingNameFromLatLng = (latlng, callback) => {
        const geocoder = new window.kakao.maps.services.Geocoder(); // Kakao 지오코더 객체 생성

        // 좌표를 주소로 변환
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name; // 첫 번째 결과에서 주소를 추출
                callback(address); // 콜백 함수 호출
            } else {
                callback("건물 정보를 가져올 수 없습니다."); // 실패 시 메시지 반환
            }
        });
    };

    // 사용자 위치에 마커를 추가하는 함수
    const addUserMarker = (latlng) => {
        const imageSize = new window.kakao.maps.Size(30, 30); // 사용자 마커 이미지 크기 설정
        const markerImage = createMarkerImage(userMarkerImageSrc, imageSize, {}); // 사용자 마커 이미지 생성

        // 기존에 존재하는 사용자 마커가 있다면 제거
        if (userMarker.current) {
            userMarker.current.setMap(null);
        }
        if (userMarker.current && userMarker.current.infoWindow) {
            userMarker.current.infoWindow.close();
        }

        // 새로운 사용자 마커 생성
        userMarker.current = new window.kakao.maps.Marker({
            position: latlng,
            image: markerImage
        });

        // 좌표를 통해 건물 이름을 가져와 인포윈도우에 표시
        getBuildingNameFromLatLng(latlng, (buildingName) => {
            const infoWindowContent = `<div style="padding:5px;">${buildingName}</div>`;
            const infoWindow = new window.kakao.maps.InfoWindow({
                content: infoWindowContent,
                removable: true
            });

            // 사용자 마커에 클릭 이벤트 리스너 추가
            userMarker.current.infoWindow = infoWindow;
            window.kakao.maps.event.addListener(userMarker.current, 'click', () => {
                infoWindow.open(map.current, userMarker.current);
            });

            // 사용자 마커를 지도에 표시
            userMarker.current.setMap(map.current);
            // 화면에 x자로 보이던 부분 코드
            // infoWindow.open(map.current, userMarker.current); // 인포윈도우 즉시 열기
        });
    };

    // 사용자의 현재 위치를 가져와 지도에 표시하는 함수
    const handleCurrentLocation = () => {
        if (navigator.geolocation) { // 브라우저가 Geolocation API를 지원하는지 확인
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords; // 현재 위치의 위도와 경도 가져오기
                    const positionLatLng = new window.kakao.maps.LatLng(latitude, longitude); // 현재 위치를 Kakao 지도 좌표 객체로 변환

                    map.current.setCenter(positionLatLng); // 지도의 중심을 현재 위치로 설정

                    addUserMarker(positionLatLng); // 현재 위치에 사용자 마커 추가
                },
                (error) => {
                    console.error('현재 위치를 가져오는 데 실패했습니다.', error); // 현재 위치를 가져오는 데 실패한 경우 에러 로그 출력
                }
            );
        } else {
            alert('이 브라우저는 Geolocation을 지원하지 않습니다.'); // 브라우저가 Geolocation을 지원하지 않는 경우 알림
        }
    };

    /* 검색 관련 함수들 === */
    // 검색창 관련 기능
    const searchPlaces = () => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                clearAllMarkers(); // 기존 마커 제거
                clearSearchMarkers(); // 이전 검색 결과 마커 제거
                const markers = [];
                setSearchResults(data);
                setSearchResultsVisible(true);

                data.forEach((place, index) => {
                    const position = new window.kakao.maps.LatLng(place.y, place.x);
                    const markerImage = createMarkerImage(markerImageSrc, new window.kakao.maps.Size(22, 26), {});
                    const marker = createMarker(position, markerImage, place.place_name);
                    markers.push(marker);
                    marker.setMap(map.current);

                    // 첫 번째 검색 결과로 지도 중심 이동
                    if (index === 0) {
                        map.current.setCenter(position);
                        map.current.setLevel(3); // 확대 레벨 설정 (필요에 따라 조정)
                    }
                });

                searchMarkers.current = markers; // 새로운 검색 결과 마커 저장
            } else {
                alert('검색 결과가 없습니다.');
            }
        });
    };

    //검색창 닫음
    const closeSidebar = () => {
        setSidebarVisible(false);
        setSearchResultsVisible(false);
        setSearchResults([]);
        setSearchKeyword('');
        clearSearchMarkers();
        // 검색 결과 마커 제거
        map.current.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    };

    //마커 클리어
    const clearSearchMarkers = () => {
        searchMarkers.current.forEach(marker => marker.setMap(null));
        searchMarkers.current = [];
    };

    return (
        <div className="kakao-map-wrapper">
            <div className="map-container" ref={mapContainer}>
                <SearchBar
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    searchPlaces={searchPlaces}
                    setSearchResultsVisible={setSearchResultsVisible}
                />
                <SearchResults
                    searchResultsVisible={searchResultsVisible}
                    searchResults={searchResults}
                    closeSidebar={closeSidebar}
                    addUserMarker={addUserMarker}
                    map={map}
                />
                <LocationButton handleCurrentLocation={handleCurrentLocation} />
                <SideMenu
                    sideMenuOpen={sideMenuOpen}
                    setSideMenuOpen={setSideMenuOpen}
                    activeMarker={activeMarker}
                    changeMarker={changeMarker}
                />
                <HiddenMenu sideMenuOpen={sideMenuOpen} />
            </div>
        </div>
    );
};

export default KakaoMap;