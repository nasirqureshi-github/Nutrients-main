import React, { useState } from 'react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const CustomPasswordInput = ({ placeholder, value, onChange }) => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <Input.Password
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ height: "3.5em", margin: "10px 0px" }}
            iconRender={(iconVisible) =>
                iconVisible ? (
                    <EyeTwoTone onClick={toggleVisibility} />
                ) : (
                    <EyeInvisibleOutlined onClick={toggleVisibility} />
                )
            }
        />
    );
};

export default CustomPasswordInput;
