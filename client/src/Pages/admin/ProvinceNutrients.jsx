import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, message, Modal, Table, Select } from 'antd';

const { Option } = Select;

function ProvinceNutrients() {
    const { province: pid, name: nid } = useParams();
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [sources, setSources] = useState([]);
    const [currentRecord, setCurrentRecord] = useState(null);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://nutrients-main-backend.vercel.app/api/uploads', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            return data.image; // Assuming the server returns the file path
        } catch (error) {
            message.error(`Error: ${error.message}`);
            return null;
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const uploadedFilePath = await uploadFile(selectedFile);
            if (uploadedFilePath) {
                setFilePath(uploadedFilePath);
                message.success("File Uploaded Successfully");
            }
        }
    };

    const handleSubmit = async (values) => {
        if (filePath) {
            values.image = filePath;
        }

        try {
            const response = await fetch('https://nutrients-main-backend.vercel.app/api/source', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    pid,
                    nid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add source');
            }

            const data = await response.json();

            if (data.success) {
                message.success('Source added successfully!');
                form.resetFields();
                setFile(null);
                setFilePath(null);
                setIsModalVisible(false);
                fetchSources();
            } else {
                throw new Error(data.message || 'Failed to add source');
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const handleSubmitUpdate = async (values) => {
        if (filePath) {
            values.image = filePath;
        }

        try {
            const response = await fetch(`https://nutrients-main-backend.vercel.app/api/updatesource/${currentRecord._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    pid,
                    nid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update source');
            }

            const data = await response.json();

            if (data.success) {
                message.success('Source updated successfully!');
                form.resetFields();
                setFile(null);
                setFilePath(null);
                setIsUpdateModalVisible(false);
                setCurrentRecord(null);
                fetchSources();
            } else {
                throw new Error(data.message || 'Failed to update source');
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const fetchSources = async () => {
        try {
            const response = await fetch('https://nutrients-main-backend.vercel.app/api/getsource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pid,
                    nid,
                }),
            });

            const data = await response.json();
            console.log({ data })
            if (data.success) {
                setSources(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch sources');
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFile(null);
        setFilePath(null);
    };

    const handleCancelUpdate = () => {
        setIsUpdateModalVisible(false);
        setCurrentRecord(null);
        setFile(null);
        setFilePath(null);
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) => text ? <img src={`https://nutrients-main-backend.vercel.app/api/images/${text}`} alt="source" style={{ width: 50, height: 50 }} /> : null,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => handleDelete(record._id)} danger>Delete</Button>
                </span>
            ),
        },
    ];

    const handleEdit = (record) => {
        setCurrentRecord(record);
        form.setFieldsValue({
            name: record.name,
            unit: record.unit,
            price: record.price,
        });
        setFilePath(record.image);
        setIsUpdateModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://nutrients-main-backend.vercel.app/api/source/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete source');
            }

            const data = await response.json();

            if (data.success) {
                message.success('Source deleted successfully!');
                fetchSources();
            } else {
                throw new Error(data.message || 'Failed to delete source');
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchSources();
    }, [pid, nid]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Source List for {sources[0]?.pid?.name} : {sources[0]?.nid?.name}</h2>
                <Button type="primary" onClick={showModal}>Add Source</Button>
            </div>

            {/* Modal for adding a new source */}
            <Modal
                title="Add New Source"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    initialValues={{
                        unit: 'mg',
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the source name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true, message: 'Please select a unit!' }]}
                    >
                        <Select>
                            <Option value="mg">mg</Option>
                            <Option value="liter">liter</Option>
                            <Option value="kg">kg</Option>
                            <Option value="dozen">dozen</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Image Upload"
                        name="image"
                    >
                        <Input
                            type="file"
                            onChange={handleFileChange}
                        />
                        {filePath && (
                            <img
                                src={process.env.REACT_APP_API_BASE_URL+`/api/images/${filePath}`}
                                alt="Uploaded"
                                style={{ width: 100, marginTop: 10 }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Source
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for updating a source */}
            <Modal
                title="Update Source"
                visible={isUpdateModalVisible}
                onCancel={handleCancelUpdate}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmitUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the source name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true, message: 'Please select a unit!' }]}
                    >
                        <Select>
                            <Option value="mg">mg</Option>
                            <Option value="liter">liter</Option>
                            <Option value="kg">kg</Option>
                            <Option value="dozen">dozen</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Image Upload"
                        name="image"
                    >
                        <Input
                            type="file"
                            onChange={handleFileChange}
                        />
                        {currentRecord?.image && (
                            <img
                                src={`https://nutrients-main-backend.vercel.app/images/${currentRecord.image}`}
                                alt="current"
                                style={{ width: 100, marginTop: 10 }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Source
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Table to display sources */}
            <Table
                columns={columns}
                dataSource={sources}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default ProvinceNutrients;
