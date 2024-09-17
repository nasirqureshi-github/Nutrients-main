// src/Pages/Adminlayout/Adminlayout.js
import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    LogoutOutlined,

} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, Breadcrumb, theme, Image, Avatar } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Style/adminlayout.css'; // Import your CSS

const { Header, Sider, Content, Footer } = Layout;

const Adminlayout = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        // logout();
        navigate('/login');
    };
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            navigate('/login')
        }
        setUser(user && user.user.name);
    }, [])

    const profileMenu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    label: <Link to="profile">Profile</Link>,
                    icon: <UserOutlined />,
                },
                {
                    key: 'logout',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    onClick: handleLogout,
                },
            ]}
        />
    );

    return (
        <Layout className="dashboardname-full-layout" >
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,

                }}
                width={"160px"}

            >
                <div  className="demo-logo-vertical">{!collapsed ?

                    <>
                        {/* <Image
                            width={30}
                            style={{ marginTop: "-5px" }}
                            src="https://xpertjobs.pk//index_assets/images/xpert_logo.webp"
                        /> */}
                        Nutrients
                    </>
                    : "Nut"
                } </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={[
                        // 
                        {
                            key: '1',
                            icon: <PieChartOutlined />,
                            label: <Link to="/">Dashboard</Link>,
                        },
                        {
                            key: 'sub1',
                            icon: <UserOutlined />,
                            label: 'User',
                            children: [
                                {
                                    key: '3',
                                    label: <Link to="/add-admin">Add Admin</Link>,
                                },
                                // {
                                //     key: '4',
                                //     label: <Link to="/view-user">View User</Link>,
                                // },
                            ],
                        },
                        {
                            key: '2',
                            icon: <PieChartOutlined />,
                            label: <Link to="Nutrients">Nutrients</Link>,
                        },
                        {
                            key: '7',
                            icon: <PieChartOutlined />,
                            label: <Link to="city">City</Link>,
                        },
                        {
                            key: '5',
                            icon: <PieChartOutlined />,
                            label: <Link to="price-managment">Price-managment</Link>,
                        },
                        {
                            key: '6',
                            icon: <PieChartOutlined />,
                            label: <Link to="Nutrients-quantity">Quantity</Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout
                className="loginname-site-layout"
                style={{
                    marginLeft: collapsed ? "81px" : "160px",
                    background: "#f3f3f3",
                }}
            >
                <Header
                    className="loginname-header"
                    style={{
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="loginname-menu-button"
                    />
                    <div className="loginname-header-right" style={{ marginRight: "30px"}}>
                        <Dropdown overlay={profileMenu} placement="bottomRight">
                            <Avatar>
                                {user && user}
                            </Avatar>
                        </Dropdown>
                    </div>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            minHeight: "80vh",
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    ©{new Date().getFullYear()} NutroVite
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Adminlayout;
