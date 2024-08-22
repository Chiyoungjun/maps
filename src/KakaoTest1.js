import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from './data'; // 데이터 파일에서 필요한 데이터들을 import
import './css/index.css';
import RegionSelector from "./config/RegionSelector";
import TransactionMethod from "./config/TransactionMethod";
import BuildingMethod from "./config/BuildingMethod";
import AreaSet from "./config/AreaSet"; // 스타일링을 위한 CSS 파일 import

const Kakao = () => {
    const mapContainer = useRef(null); // 지도 컨테이너 요소를 참조하는 ref 생성
    const map = useRef(null); // Kakao 지도 객체를 참조하는 ref 생성
    const convenienceMarkers = useRef([]); // 편의시설 마커들을 저장할 ref 배열
    const safetyMarkers = useRef([]); // 안전시설 마커들을 저장할 ref 배열
    const medicalMarkers = useRef([]); // 의료시설 마커들을 저장할 ref 배열
    const otherMarkers = useRef([]); //기타시설 마커들을 저장할 ref 배열
    const userMarker = useRef(null); // 사용자 위치 마커를 저장할 ref
    const searchMarkers = useRef([])
    const [activeMarker, setActiveMarker] = useState("convenience"); // 현재 활성화된 마커 타입을 저장하는 상태값 (기본값은 "편의시설")
    const [zoomLevel, setZoomLevel] = useState(6); // 현재 지도 확대/축소 레벨 상태값 (기본값은 6)
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색어를 저장하는 상태값
    const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장하는 상태값
    const [sidebarVisible, setSidebarVisible] = useState(false); // 사이드바의 표시 여부를 저장하는 상태값
    const [searchResultsVisible, setSearchResultsVisible] = useState(false);

    // 컴포넌트가 처음 마운트될 때 실행
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

    // 세 가지 유형의 마커(편의시설, 안전시설, 의료시설)를 생성하는 함수
    const createMarkers = () => {
        createConvenienceMarkers(); // 편의시설 마커 생성
        createSafetyMarkers(); // 안전시설 마커 생성
        createMedicalMarkers(); // 의료시설 마커 생성
        createOtherMarkers(); //기타시설 마커 생성
    };

    // 편의시설 마커들을 생성하는 함수
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
            // infoWindow.open(map.current, userMarker.current); // 인포윈도우 즉시 열기
        });
    };

    // 검색창 관련 기능

    // const searchPlaces = () => {
    //     const ps = new window.kakao.maps.services.Places(); // Kakao 장소 검색 객체 생성
    //     // 키워드를 이용한 장소 검색
    //     ps.keywordSearch(searchKeyword, (data, status) => {
    //         if (status === window.kakao.maps.services.Status.OK) {
    //             clearAllMarkers(); // 기존 마커 제거
    //             clearSearchMarkders(); // 이전 검색 결과 마커 제거
    //             const markers = [];
    //             setSearchResults(data); // 검색 결과 상태 업데이트
    //             setSearchResultsVisible(true);
    //             data.forEach(place => {
    //                 const position = new window.kakao.maps.LatLng(place.y, place.x); // 검색된 장소의 위치 설정
    //                 const markerImage = createMarkerImage(markerImageSrc, new window.kakao.maps.Size(22, 26), {}); // 마커 이미지 생성
    //                 const marker = createMarker(position, markerImage, place.place_name); // 마커 생성
    //                 markers.push(marker); // 생성된 마커 배열에 추가
    //                 marker.setMap(map.current); // 지도에 마커 표시
    //             });
    //             // setSidebarVisible(true); // 사이드바 표시
    //
    //         } else {
    //             alert('검색 결과가 없습니다.'); // 검색 실패 시 알림
    //         }
    //     });
    // };
    const searchPlaces = () => {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                clearAllMarkers(); // 기존 마커 제거
                clearSearchMarkers(); // 이전 검색 결과 마커 제거
                const markers = [];
                setSearchResults(data);
                setSearchResultsVisible(true);
                data.forEach(place => {
                    const position = new window.kakao.maps.LatLng(place.y, place.x);
                    const markerImage = createMarkerImage(markerImageSrc, new window.kakao.maps.Size(22, 26), {});
                    const marker = createMarker(position, markerImage, place.place_name);
                    markers.push(marker);
                    marker.setMap(map.current);
                });
                searchMarkers.current = markers; // 새로운 검색 결과 마커 저장
            } else {
                alert('검색 결과가 없습니다.');
            }
        });
    };

    const closeSidebar = () => {
        setSidebarVisible(false);
        setSearchResultsVisible(false);
        setSearchResults([]);
        setSearchKeyword('');
        clearSearchMarkers();
        // 검색 결과 마커 제거
        map.current.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    };

    const clearSearchMarkers = () => {
        searchMarkers.current.forEach(marker => marker.setMap(null));
        searchMarkers.current = [];
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

    // 사이드바 열기/닫기 함수
    // const toggleSidebar = () => {
    //     setSidebarVisible(!sidebarVisible);
    // };

    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    const handleClick = () => {
        setSideMenuOpen(!sideMenuOpen);
    }

    return (
        <div className="kakao-map-wrapper">
            <div className="map-container" ref={mapContainer}>
                {/* 지도 */}
                <div id="map" className="map" ref={mapContainer}>
                    <article id={"searchbar"}>
                        <div id={"searchContainer"}>
                            <div id={"searchInputContainer"}>
                                <input
                                    id={"search"}
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(event) => setSearchKeyword(event.target.value)}
                                    placeholder={"지역, 지하철역, 회사명"}
                                />
                                <button className="search-button" onClick={() => {
                                    setSearchResultsVisible(true);
                                    searchPlaces();
                                }}>
                                    <img src={require('./icon/search.png')} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div id={"resultContainer"}>
                            {searchResultsVisible && (
                                <div className="sidebar visible">
                                    <div className="search-results">
                                        <h3>검색 결과
                                            <button className={"searchCloseButton"} onClick={closeSidebar}>
                                                <img src={require("./icon/Close.png")} alt=""/>
                                            </button>
                                            <br/>
                                            <hr/>
                                        </h3>
                                        <ul className="results-list">
                                            {searchResults.map((place, index) => (
                                                <li key={index} className="result-item">
                                                    <span><strong>장소명:</strong> {place.place_name}</span><br/>
                                                    <span><strong>주소:</strong> {place.address_name || '주소 정보 없음'}</span><br/>
                                                    <span><strong>카테고리:</strong> {place.category_name || '카테고리 정보 없음'}</span><br/>
                                                    <span><strong>전화번호:</strong> {place.phone || '전화번호 정보 없음'}</span>
                                                    <div>
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
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                    <article>
                        <div id={"location"}>
                            <img
                                src={require('./icon/location.png')}
                                alt="내 위치"
                                onClick={handleCurrentLocation}
                                className="location-icon"
                            />
                        </div>
                    </article>
                    <div id={"appSide"} className={sideMenuOpen ? "open" : "closed"}>
                        <article>
                            <article id={"appSideButton"}>
                                {/*슬라이드 인/아웃 버튼*/}
                                <div id={"appSideMoveIcon"}>
                                    <img
                                        src={sideMenuOpen ? require("./icon/vecterback2.png") : require('./icon/vecter2.png')}
                                        alt=""/>
                                    <img
                                        src={sideMenuOpen ? require("./icon/vecterback2.png") : require('./icon/vecter2.png')}
                                        alt=""/>
                                </div>
                                <div id={sideMenuOpen ? "appSideClickOut" : "appSideClickIn"} onClick={handleClick}>
                                    <div>
                                        <button>
                                            <img
                                                src={sideMenuOpen ? require("./icon/Vectorback.png") : require("./icon/Vector.png")}
                                                alt=""/>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </article>
                        <article>
                            <div id={"appSideChoice"}>
                                <button
                                    className={`appSCMenu ${activeMarker === 'convenience' ? 'active' : ''}`}
                                    onClick={() => changeMarker('convenience')}
                                >
                                    <img src={require("./icon/shopping.png")}/>
                                    <div>편의시절</div>
                                </button>
                                <button
                                    className={`appSCMenu ${activeMarker === 'safety' ? 'active' : ''}`}
                                    onClick={() => changeMarker('safety')}
                                >
                                    <img src={require("./icon/shopping.png")}/>
                                    <div>안전시설</div>
                                </button>
                                <button
                                    className={`appSCMenu ${activeMarker === 'medical' ? 'active' : ''}`}
                                    onClick={() => changeMarker('medical')}
                                >
                                    <img src={require("./icon/shopping.png")}/>
                                    <div>편의시절</div>
                                </button>
                                <button
                                    className={`appSCMenu ${activeMarker === 'other' ? 'active' : ''}`}
                                    onClick={() => changeMarker('other')}
                                >
                                    <img src={require("./icon/shopping.png")}/>
                                    <div>편의시절</div>
                                </button>
                            </div>
                        </article>
                    </div>
                    <article id={"hiddenMenu"} className={sideMenuOpen ? "open" : "closed"}>
                        <div id={'hiddenTable'}>
                            <RegionSelector/>
                            <TransactionMethod/>
                            <BuildingMethod/>
                            <AreaSet/>
                            <div className={"selectList"}>
                                <div>n개의 결과<br/>
                                    <hr/>
                                </div>
                                {/*여기도 컨포넌트 or 큰 창이 띄울수 있는 버튼*/}
                                <div> 리스트</div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Kakao;