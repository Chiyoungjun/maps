import React, { useState } from 'react';
import { RealEstate } from "./RealEstate";
import "../css/index.css"

function TransactionMethod() {
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleMethodClick = (method) => {
        setSelectedMethod(prevMethod => prevMethod === method ? null : method);
    };

    return (
        <>
            <div className={"selectList"}>
                <div>거래 방식<br/>
                    <hr/>
                </div>
                <div>
                    {Object.values(RealEstate).map((method) => (
                        <button
                            id={"TAMethod"}
                            className={`${selectedMethod === method ? 'selected' : ''}
                            ${method.length <= 3 ? 'Short' : ''}`}
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

export default TransactionMethod;