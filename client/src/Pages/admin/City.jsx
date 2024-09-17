import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Modal, Form } from 'antd';

const City = () => {
    const [cities, setCities] = useState([]); // State to store the list of cities
    const [currentCity, setCurrentCity] = useState(null); // State to store the current city being edited
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control the modal visibility
    const [form] = Form.useForm(); // Form instance for Ant Design Form

    // Fetch cities from the API
    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('https://neovatus.onrender.com/api/cities');
            const result = await response.json();
            if (result.success) {
                setCities(result.data);
            } else {
                console.error('Failed to fetch cities:', result.message);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Function to handle adding a city
    const handleAddCity = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch('https://neovatus.onrender.com/api/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: values.name }),
            });
            const result = await response.json();
            if (result.success) {
                setCities([...cities, result.data]);
                form.resetFields();
                setIsModalVisible(false);
            } else {
                console.error('Failed to add city:', result.message);
            }
        } catch (info) {
            console.log('Validate Failed:', info);
        }
    };

    // Function to handle editing a city
    const handleEditCity = (city) => {
        setCurrentCity(city); // Set the entire city object, including _id
        form.setFieldsValue({ name: city.name });
        setIsModalVisible(true);
    };

    // Function to handle updating a city
    const handleUpdateCity = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch(`https://neovatus.onrender.com/api/cities/${currentCity._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: values.name }),
            });
            const result = await response.json();
            if (result.success) {
                setCities(cities.map(city =>
                    city._id === currentCity._id ? result.data : city
                ));
                setCurrentCity(null);
                form.resetFields();
                setIsModalVisible(false);
            } else {
                console.error('Failed to update city:', result.message);
            }
        } catch (info) {
            console.log('Validate Failed:', info);
        }
    };

    // Function to handle deleting a city
    const handleDeleteCity = async (cityId) => {
        try {
            const response = await fetch(`https://neovatus.onrender.com/api/cities/${cityId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                setCities(cities.filter(city => city._id !== cityId));
            } else {
                console.error('Failed to delete city:', result.message);
            }
        } catch (error) {
            console.error('Error deleting city:', error);
        }
    };

    // Function to show the modal for adding or editing a city
    const showModal = (city = null) => {
        setCurrentCity(city);
        form.resetFields();
        if (city) {
            form.setFieldsValue({ name: city.name });
        }
        setIsModalVisible(true);
    };

    // Columns for the table
    const columns = [
        {
            title: 'City Name',
            dataIndex: 'name',
            key: 'name',
            width: '80%', // Set width to 80%
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%', // Set width to 20%
            render: (text, record) => (
                <div>
                    <Button onClick={() => showModal(record)} type="primary" style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteCity(record._id)} type="danger" style={{background:"red"}}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                Add City
            </Button>
            <Table 
                dataSource={cities} 
                columns={columns} 
                rowKey="_id" // Use _id as the key for rows
                pagination={false} // Disable pagination if not needed
            />
            <Modal
                title={currentCity ? 'Edit City' : 'Add City'}
                visible={isModalVisible}
                onOk={currentCity ? handleUpdateCity : handleAddCity}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentCity(null);
                    form.resetFields();
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="City Name"
                        rules={[{ required: true, message: 'Please enter the city name' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default City;
