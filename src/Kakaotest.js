import React, { useEffect, useRef, useState } from "react";
import { markerData, markerImageSrc, userMarkerImageSrc } from './data'; // 데이터 파일에서 필요한 데이터들을 import
import './css/index.css'; // 스타일링을 위한 CSS 파일 import

const Kakao = () => {


    return (
        <div className="kakao-map-wrapper">
            <div className="map-container" ref={mapContainer}>
                {/* 지도 */}
                <div id="map" className="map" ref={mapContainer}></div>

                {/* 사이드바 */}
                <button className={`sidebar-toggle-button ${sidebarVisible}`} onClick={toggleSidebar}>
                    {sidebarVisible ? '닫기' : '열기'}
                </button>
                <div className={`sidebar ${sidebarVisible ? 'visible' : 'invisible'}`}>
                    <div className="search-results">
                        <h3>검색 결과</h3>
                        <ul className="results-list">
                            {searchResults.map((place, index) => (
                                <li key={index} className="result-item">
                                    <span><strong>장소명:</strong> {place.place_name}</span><br />
                                    <span><strong>주소:</strong> {place.address_name || '주소 정보 없음'}</span><br />
                                    <span><strong>카테고리:</strong> {place.category_name || '카테고리 정보 없음'}</span><br />
                                    <span><strong>전화번호:</strong> {place.phone || '전화번호 정보 없음'}</span>
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
                </div>
            </div>

            {/* 네비게이션 바 */}
            <div className="navbar">
                <div className="navbar-content">
                    {/* 시설 선택 버튼들 */}
                    <div className="facility-buttons">
                        <button
                            className={`facility-button ${activeMarker === 'convenience' ? 'active' : ''}`}
                            onClick={() => changeMarker('convenience')}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1004/1004909.png" // 편의시설 아이콘 URL
                                alt="편의시설"
                                className="facility-icon"
                            />
                        </button>
                        <button
                            className={`facility-button ${activeMarker === 'safety' ? 'active' : ''}`}
                            onClick={() => changeMarker('safety')}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1004/1004911.png" // 안전시설 아이콘 URL
                                alt="안전시설"
                                className="facility-icon"
                            />
                        </button>
                        <button
                            className={`facility-button ${activeMarker === 'medical' ? 'active' : ''}`}
                            onClick={() => changeMarker('medical')}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1004/1004910.png" // 의료시설 아이콘 URL
                                alt="의료시설"
                                className="facility-icon"
                            />
                        </button>
                        <button
                            className={`facility-button ${activeMarker === 'other' ? 'active' : ''}`}
                            onClick={() => changeMarker('other')}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1004/1004911.png" // 안전시설 아이콘 URL
                                alt="기타시설"
                                className="facility-icon"
                            />
                        </button>
                    </div>

                    {/* 검색 기능 */}
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

                    {/* 내 위치 버튼 */}
                    <div className="current-location-button">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/5717/5717514.png"
                            alt="내 위치"
                            onClick={handleCurrentLocation}
                            className="location-icon"
                            style={{ width: '30px', height: '30px' }} // 원하는 크기로 설정
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kakao;