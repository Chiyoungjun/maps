import React, { useEffect, useState } from "react";
const { kakao } = window;

const KakaoMaps = () => {
    const [info, setInfo] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let mapContainer = document.getElementById('KakaoMaps');

        let mapOption = {
            center: new kakao.maps.LatLng(35.14571547395411, 129.0073490267914),
            level: 6,
            zoomControl: true,
            mapTypeId: kakao.maps.MapTypeId.ROADMAP
        };

        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
        setMap(kakaoMap);

        const zoomControl = new kakao.maps.ZoomControl();
        kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 현재 위치 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const currentPos = new kakao.maps.LatLng(lat, lng);
                kakaoMap.setCenter(currentPos);

                // 현재 위치 마커 추가
                const marker = new kakao.maps.Marker({
                    position: currentPos,
                    map: kakaoMap
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;">현재 위치</div>'
                });
                infowindow.open(kakaoMap, marker);
            });
        }
    }, []);

    useEffect(() => {
        if (!map) return;

        const ps = new kakao.maps.services.Places();

        const searchPlaces = () => {
            if (searchTerm) {
                ps.keywordSearch(searchTerm, (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const bounds = new kakao.maps.LatLngBounds();
                        let newMarkers = [];

                        for (var i = 0; i < data.length; i++) {
                            const position = new kakao.maps.LatLng(data[i].y, data[i].x);
                            newMarkers.push({
                                position: position,
                                content: data[i].place_name,
                            });
                            bounds.extend(position);
                        }
                        setMarkers(newMarkers);
                        map.setBounds(bounds);
                    }
                });
            }
        };

        searchPlaces();
    }, [map, searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setMarkers([]); // 이전 마커 초기화
        setInfo(null); // 이전 인포윈도우 초기화
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요"
                />
                <button type="submit">검색</button>
            </form>

            <div
                id="KakaoMaps"
                style={{
                    width: "100%",
                    height: "500px"
                }}></div>

            {markers.map((marker, index) => {
                const kakaoMarker = new kakao.maps.Marker({
                    position: marker.position,
                    map: map
                });

                kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                    setInfo(marker);
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${marker.content}</div>`
                    });
                    infowindow.open(map, kakaoMarker);
                });

                return null; // 마커는 여기서 반환하지 않음
            })}

            {info && (
                <div style={{ position: "absolute", top: "10px", left: "10px", background: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
                    {info.content}
                </div>
            )}
        </div>
    );
}

export default KakaoMaps;
