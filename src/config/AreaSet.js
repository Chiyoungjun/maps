import React, { useState, useEffect, useRef } from 'react';
import noUiSlider from 'nouislider';
import '../css/AreaSet.css';

function RealEstateSizeAdjuster() {
    const [minWidth, setMinWidth] = useState(0);
    const [maxWidth, setMaxWidth] = useState(80);
    const sliderRef = useRef(null);

    useEffect(() => {
        if (sliderRef.current) {
            noUiSlider.create(sliderRef.current, {
                start: [minWidth, maxWidth],
                connect: true,
                range: {
                    'min': 0,
                    'max': 80
                },
                step: 1,
            });

            sliderRef.current.noUiSlider.on('update', (values, handle) => {
                const [min, max] = values.map(Number);
                setMinWidth(min);
                setMaxWidth(max);
            });
        }

        return () => {
            if (sliderRef.current.noUiSlider) {
                sliderRef.current.noUiSlider.destroy();
            }
        };
    }, []);

    const handleMinWidthChange = (event) => {
        const newValue = Number(event.target.value);
        if (!isNaN(newValue) && newValue >= 0 && newValue <= maxWidth) {
            setMinWidth(newValue);
            sliderRef.current.noUiSlider.set([newValue, null]);
        }
    };

    const handleMaxWidthChange = (event) => {
        const newValue = Number(event.target.value);
        if (!isNaN(newValue) && newValue >= minWidth && newValue <= 80) {
            setMaxWidth(newValue);
            sliderRef.current.noUiSlider.set([null, newValue]);
        }
    };

    return (
        <div className="selectList">
            <div>면적<hr/></div>
            <div id="WidthBox">
                <div id="SubTitle">
                    <div id="SubTitle2">전용 면적</div>
                    <div id="ShowArea">
                        {`${minWidth.toFixed(0)} 평(${(minWidth * 3.3).toFixed(1)} m²) ~ ${maxWidth.toFixed(0)} 평(${(maxWidth * 3.3).toFixed(1)} m²)`}
                    </div>
                </div>
                <div id="WidthInput">
                    <div id="WidthInputSlide">
                        <div ref={sliderRef}></div>
                        <div id={"WidthInputSlideIndex"}>
                            <div>최소</div>
                            <div>최대</div>
                        </div>
                    </div>
                    <div id="WidthInputText">
                        <div className={"WidthText"}>
                            <label htmlFor="minWidth">최소 평수</label>
                            <input
                                id="minWidth"
                                type="number"
                                value={minWidth.toFixed(0)}
                                onChange={handleMinWidthChange}
                                min="0"
                                max="200"
                            />
                        </div>
                        <div className={"WidthText"}>
                            <label htmlFor="maxWidth">최대 평수</label>
                            <input
                                id="maxWidth"
                                type="number"
                                value={maxWidth.toFixed(0)}
                                onChange={handleMaxWidthChange}
                                min="0"
                                max="200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RealEstateSizeAdjuster;