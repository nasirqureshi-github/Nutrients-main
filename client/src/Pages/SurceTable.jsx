import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Spin, Alert, Modal, Form, Input } from 'antd';
import 'antd/dist/reset.css';

function SourceTable() {
    const { name } = useParams(); // Get the name from the URL params
    const [data, setData] = useState([]); // State to hold the source data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors
    const [editingRecord, setEditingRecord] = useState(null); // State to hold the record being edited
    const [form] = Form.useForm(); // Form instance for Ant Design Form

    // Define the nameMapping object
    const nameMapping = {
        "Fiber": "fiber",
        "Potassium": "potassium",
        "Iron": "iron",
        "Water": "water",
        "Vitamin D": "vitaminD",
        "Calcium": "calcium",
        "Magnesium": "magnesium",
        "Vitamin B12": "vitaminB12",
        "Omega-3 Fatty Acids": "omega3FattyAcid",
        "Vitamin E": "vitE"
    };

    // Define units for each nutrient
    const unitMapping = {
        "Fiber": "g",
        "Potassium": "mg",
        "Iron": "mg",
        "Water": "L",
        "Vitamin D": "UI",
        "Calcium": "mg",
        "Magnesium": "mg",
        "Vitamin B12": "mcg",
        "Omega-3 Fatty Acids": "g",
        "Vitamin E": "mg"
    };

    // Map name to check_name
    const check_name = nameMapping[name] || null;

    useEffect(() => {
        if (!check_name) {
            setError('Invalid name parameter');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`https://neovatus.onrender.com/api/get-source/${check_name}`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data); // Set the data from the response
                } else {
                    setError('Failed to retrieve data');
                }
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchData();
    }, [check_name]); // Include check_name in the dependency array

    const handleEdit = (record) => {
        // Set the editing record and open the modal
        setEditingRecord(record);
        form.setFieldsValue({ [check_name]: record[check_name] }); // Set form field value to the current check_name value
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedRecord = { ...editingRecord, [check_name]: values[check_name] };

            // Call the API to update the record on the server
            const response = await fetch(`https://neovatus.onrender.com/api/update-source/${updatedRecord._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [check_name]: updatedRecord[check_name] }),
            });
            const result = await response.json();

            if (response.ok) {
                // Update the data locally
                setData(data.map(item => item._id === updatedRecord._id ? updatedRecord : item));
                // Close the modal and reset the editing record
                setEditingRecord(null);
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            setError(error.message || 'Error updating data');
            // Optionally, you might want to refetch data here if needed
            // await fetchData();
        }
    };

    const handleModalCancel = () => {
        // Close the modal and reset the editing record
        setEditingRecord(null);
    };

    const handleDelete = (record) => {
        // Show confirmation modal before deleting
        Modal.confirm({
            title: 'Are you sure you want to delete this source?',
            content: `This action will permanently delete ${record.foodName}.`,
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Call the API to delete the record
                    const response = await fetch(`https://neovatus.onrender.com/api/delete-source/${record._id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        // Remove the deleted record from the data
                        setData(data.filter(item => item._id !== record._id));
                    } else {
                        throw new Error('Failed to delete record');
                    }
                } catch (error) {
                    setError(error.message || 'Error deleting data');
                }
            },
        });
    };

    if (loading) {
        return <div><Spin tip="Loading..." /></div>; // Show loading spinner while fetching data
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />; // Show error message if there's an error
    }

    // Define columns for the table
    const columns = [
        {
            title: 'Food Name',
            dataIndex: 'foodName',
            key: 'foodName',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Likely to Eat In',
            dataIndex: 'likelyToEatIn',
            key: 'likelyToEatIn',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: name,
            dataIndex: check_name, // Use check_name here
            key: check_name, // Use check_name here
            render: (text) => (
                <span>{text} {unitMapping[name]}</span> // Display value with unit
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEdit(record)} type="primary" style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record)} style={{backgroundColor:"red"}} type="danger">
                        Delete
                    </Button>
                    

                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>Source Data for {name}</h2>
            <Table 
                dataSource={data} 
                columns={columns} 
                rowKey="_id"
                pagination={false} // Disable pagination if not needed
            />

            <Modal
                title={`Edit ${name}`}
                visible={!!editingRecord}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name={check_name}
                        label={name}
                        rules={[{ required: true, message: `Please enter the ${name}` }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default SourceTable;
