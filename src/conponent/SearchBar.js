import React from 'react';
import '../css/index.css';

const SearchBar = ({ searchKeyword, setSearchKeyword, searchPlaces, setSearchResultsVisible }) => {
    return (
        <article id="searchbar">
            <div id="searchContainer">
                <div id="searchInputContainer">
                    <input
                        id="search"
                        type="text"
                        value={searchKeyword}
                        onChange={(event) => setSearchKeyword(event.target.value)}
                        placeholder="지역, 지하철역, 회사명"
                    />
                    <button className="search-button" onClick={() => {
                        setSearchResultsVisible(true);
                        searchPlaces();
                    }}>
                        <img src={require('../icon/search.png')} alt=""/>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default SearchBar;