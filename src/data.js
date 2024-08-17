export const markerData = {
    convenience: {
        positions: [
            { lat: 37.49729291770947, lng: 127.02587362608637 }, // 편의시설 1
            { lat: 37.49654540521486, lng: 127.02546694890695 }  // 편의시설 2
        ],
        imageOptions: {
            spriteOrigin: new window.kakao.maps.Point(10, 0),
            spriteSize: new window.kakao.maps.Size(36, 98)
        }
    },
    safety: {
        positions: [
            { lat: 37.498535461505684, lng: 127.02948149502778 }, // 안전시설 1
            { lat: 37.49621536281186, lng: 127.03020491448352 }  // 안전시설 2
        ],
        imageOptions: {
            spriteOrigin: new window.kakao.maps.Point(10, 36),
            spriteSize: new window.kakao.maps.Size(36, 98)
        }
    },
    medical: {
        positions: [
            { lat: 37.49966168796031, lng: 127.03007039430118 }, // 의료시설 1
            { lat: 37.499463762912974, lng: 127.0288828824399 }  // 의료시설 2
        ],
        imageOptions: {
            spriteOrigin: new window.kakao.maps.Point(10, 72),
            spriteSize: new window.kakao.maps.Size(36, 98)
        }
    }
};

// 새로운 이미지 URL로 교체
export const markerImageSrc = 'https://example.com/path/to/new/category-image.png'; // 새로운 카테고리 이미지 URL
export const userMarkerImageSrc = 'https://example.com/path/to/new/user-marker-image.png'; // 새로운 사용자 마커 이미지 URL
