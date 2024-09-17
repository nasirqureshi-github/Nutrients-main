import React, { useState, useEffect } from 'react';
import { Table, Alert, Spin, Typography } from 'antd';

const { Title, Text } = Typography;

function View_admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const user_ = JSON.parse(localStorage.getItem('currentUser'));

            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/api/user/all-user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user_ && user_.token}`
                    }
                });

                const result = await response.json();
                console.log({ result });
                if (response.ok) {
                    setUsers(result.Users);
                    setError(null);
                } else {
                    setError(result.errors || 'Failed to fetch users');
                }
            } catch (err) {
                setError('An error occurred while fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Province',
            dataIndex: 'Province',
            key: 'Province',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Verified',
            dataIndex: 'verify',
            key: 'verify',
            render: (verify) => (verify ? 'Yes' : 'No'),
        },
    ];

    return (
        <div>
            <Title level={2}>View Users</Title>
            {loading ? (
                <Spin tip="Loading..." />
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <>
                    <Text strong>Total Users: {users.length}</Text>
                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                    />
                </>
            )}
        </div>
    );
}

export default View_admin;
