import React from 'react'
import { Input } from 'antd';
function CustomInput({ placeholder, value, onChange }) {
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            style={{ height: "3.5em", margin: "10px 0px" }}
        />
    )
}

export default CustomInput