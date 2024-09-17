import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Alert } from 'antd';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user || !user.token) {
                setError('No user token found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/api/user/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const data = await response.json();
                setProfile(data.user);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <h1>Profile</h1>
            {profile && (
                <Card bordered={false} style={{ width: "100%" }}>
                    <Descriptions title="User Info" bordered>
                        <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                        <Descriptions.Item label="Age">{profile.age}</Descriptions.Item>
                        <Descriptions.Item label="Role">{profile.role}</Descriptions.Item>
                        <Descriptions.Item label="Country">{profile.country}</Descriptions.Item>
                        <Descriptions.Item label="Province">{profile.Province}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{profile.DoB}</Descriptions.Item>
                        <Descriptions.Item label="Verified">{profile.verify ? 'Yes' : 'No'}</Descriptions.Item>
                        <Descriptions.Item label="Are you">{profile.Areyou}</Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </div>
    );
}

export default Profile;
