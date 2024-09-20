import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Table, Alert, Spin, Statistic, Tag, Button, Popconfirm } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const user_ = JSON.parse(localStorage.getItem('currentUser'));

            try {
                const response = await fetch(`https://nutrients-main-backend.vercel.app/api/user/all-user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user_ && user_.token}`
                    }
                });

                const result = await response.json();
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

    const handleDelete = async (userId) => {
        const user_ = JSON.parse(localStorage.getItem('currentUser'));
        console.log({userId})

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user_ && user_.token}`
                }
            });

            if (response.ok) {
                // Remove the deleted user from the state
                setUsers(users.filter(user => user._id !== userId));
            } else {
                const result = await response.json();
                setError(result.errors || 'Failed to delete user');
            }
        } catch (err) {
            setError('An error occurred while deleting the user');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            
            
    //          onHeaderCell: () => ({
    //   style: { fontSize: '22px' }, // Header font size
    // }),

    // onCell: () => ({
    //     style: { fontSize: '18px' }, // Cell font size
    //   }),



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
            render: (verify) => (verify ? <Tag color='success' bordered={false}>Yes</Tag> : <Tag color='error' bordered={false}>No</Tag>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={<DeleteOutlined  style={{color:"red"}}/>} type="danger">
                      
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card >
                        <Statistic
                            title="Total Users"
                            value={users.length}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="New Admins"
                            value={users.filter(item => item.role === 'Admin').length}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="New Users"
                            value={users.filter(item => item.role !== 'Admin').length}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Verified Users"
                            value={users.filter(item => item.verify).length}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row  gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card  title="Users" >
                        {loading ? (
                            <Spin tip="Loading..." />
                        ) : error ? (
                            <Alert message="Error" description={error} type="error" showIcon />
                        ) : (
                            <Table dataSource={users} columns={columns} rowKey="_id"   />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
