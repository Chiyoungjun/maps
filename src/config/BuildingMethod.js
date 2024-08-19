import React, { useState } from 'react';
import { Building } from "./Building";
import "../css/index.css"

function BuildingMethod() {
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleMethodClick = (method) => {
        setSelectedMethod(prevMethod => prevMethod === method ? null : method);
    };

    return (
        <>
            <div className={"selectList"}>
                <div>건물 방식<br/>
                    <hr/>
                </div>
                <div>
                    {Object.values(Building).map((method) => (
                        <button
                            id={"BMethod"}
                            className={`${selectedMethod === method ? 'selected' : ''}
                            ${method.length <= 2 ? 'Short' : ''}`}
                            key={method}
                            onClick={() => handleMethodClick(method)}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BuildingMethod;