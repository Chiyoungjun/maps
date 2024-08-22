import React from 'react';
import '../css/index.css';

const SearchResults = ({ searchResultsVisible, searchResults, closeSidebar, addUserMarker, map }) => {
    if (!searchResultsVisible) return null;

    return (
        <div className="sidebar visible">
            <div className="search-results">
                <h3>
                    검색 결과
                    <button className="searchCloseButton" onClick={closeSidebar}>
                        <img src={require("../icon/Close.png")} alt=""/>
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
    );
};

export default SearchResults;