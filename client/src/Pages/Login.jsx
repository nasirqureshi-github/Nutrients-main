import React, { useState } from 'react';
import './Style/login.css';
import { Typography, Row, Col, Divider, Button, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../Components/Forms/CustomInput';
import CustomPasswordInput from '../Components/Forms/CustomPasswordInput';

const { Title, Text, Link } = Typography;

const Login = () => {
    // const [username, setUsername] = useState('aasad.saddiqui4455@gmail.com');
    // const [password, setPassword] = useState('Asad1234!');
    const [username, setUsername] = useState('qureshiatif812@gmail.com');
    const [password, setPassword] = useState('CgGgVg');
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const handleLogin = async () => {
        console.log({baseURL})
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL +'/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login successful', data);
            localStorage.setItem('currentUser', JSON.stringify(data))
            navigate('/');
        } catch (error) {
            message.error('Login failed. Please check your credentials.');
        }
    };

    const handleUsernameChange = (value) => {
        setUsername(value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="login">
            <div className="login-container">
                <Title level={3}>Sign in to Dashboard</Title>
              
                <Row style={{ margin: '15px 0px' }}>

                    <CustomInput
                        placeholder="email"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <CustomPasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                  
                    <Button type="primary" onClick={handleLogin} style={{ width: '100%', marginTop: '10px' }}>
                        Login
                    </Button>
                </Row>
            </div>
        </div>
    );
};

export default Login;
