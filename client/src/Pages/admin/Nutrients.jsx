import React, { useEffect, useState } from 'react';
import { Col, Divider, Row, Select, Alert, Spin, Modal, Form, Input, Button, message } from 'antd';
import './Nutrients.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function Nutrients() {
    const [provinces, setProvinces] = useState([]);
    const [nutrients, setNutrients] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
  

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch nutrients
                const nutrientsResponse = await fetch('https://nutrients-main-backend.vercel.app/api/nutrient', {
                    method: "GET"
                });
                
                if (!nutrientsResponse.ok) {
                    throw new Error('Failed to fetch nutrients');
                }
                const nutrientsData = await nutrientsResponse.json();
                if (nutrientsData.status === 200) {
                    setNutrients(nutrientsData.data);
                } else {
                    throw new Error(nutrientsData.message || 'Failed to fetch nutrients');
                }
            } catch (error) {
                console.error("There was an error fetching the data!", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProvinceChange = value => {
        setSelectedProvince(value);
    };

    const handleChange = (name) => {

        if (name) {
            navigate(`/get-source/${name}`);
        }
    };

    const showAddNutrientModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            values.likelyToEatIn = values.likelyToEatIn.join('/'); // Convert array to string
            const response = await fetch('https://nutrients-main-backend.vercel.app/api/add-source', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to add nutrient');
            }
            const result = await response.json();
            if (response.ok) {
                // setNutrients([...nutrients, result.data]);
                message.success("Source Added")
                form.resetFields();
                setIsModalVisible(false);
            } else {
                message.error(result.message)

                throw new Error(result.message || 'Failed to add nutrient');
            }
        } catch (error) {
            console.error("There was an error adding the nutrient!", error);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <h1 className="nutrients-heading">Nutritional Information</h1>
            <Divider />
            {loading && <Spin size="large" />}
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            {!loading && !error && (
                <>
                    <Row gutter={[16, 16]}>
                        {nutrients.map(nutrient => (
                            <Col
                                xs={24}
                                sm={24}
                                md={12}
                                lg={6}
                                xl={6}
                                xxl={6}
                                key={nutrient._id}
                            >
                                <div
                                    className="nutrient-col"
                                    onClick={() => handleChange(nutrient.name)}
                                    style={{ height: "100px"  }}
                                >
                                    <div className="nutrient-text">{nutrient.name} </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <Button type="primary"  onClick={showAddNutrientModal}>Add New Nutrient</Button>
                </>
            )}
            <Modal
                title="Add New Source"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Add"
                cancelText="Cancel"
                centered
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="addNutrient"
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="foodName"
                                label="Source Name"
                                rules={[{ required: true, message: 'Please enter the source name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="quantity"
                                label="Quantity"
                                rules={[{ required: true, message: 'Please enter the quantity' }]}
                                initialValue={"100"}
                            >
                                <Input type="number" disabled step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="unit"
                                label="Unit"
                                rules={[{ required: true, message: 'Please enter the unit' }]}
                                initialValue={"g"}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: 'Please select the category' }]}
                            >
                                <Select placeholder="Select Category">
                                    <Option value="vegetables">Vegetables</Option>
                                    <Option value="fruits">Fruits</Option>
                                    <Option value="grains">Grains</Option>
                                    <Option value="Dairy Products">Dairy Products</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="likelyToEatIn"
                                label="Likely to Eat In"
                                rules={[{ required: true, message: 'Please select where it is likely to be eaten' }]}
                            >
                                <Select  mode='multiple'   placeholder="Select Meal">
                                    <Option value="breakfast">Breakfast</Option>
                                    <Option value="lunch">Lunch</Option>
                                    <Option value="dinner">Dinner</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="water"
                                label="Water (L)"
                                rules={[{ required: true, message: 'Please enter the water content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="vitaminD"
                                label="Vitamin D (UI)"
                                rules={[{ required: true, message: 'Please enter the Vitamin D content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="omega3FattyAcid"
                                label="Omega 3 Fatty Acid (g)"
                                rules={[{ required: true, message: 'Please enter the Omega 3 Fatty Acid content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="potassium"
                                label="Potassium (mg)"
                                rules={[{ required: true, message: 'Please enter the Potassium content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="vitaminB12"
                                label="Vitamin B12 (mcg)"
                                rules={[{ required: true, message: 'Please enter the Vitamin B12 content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="fiber"
                                label="Fiber (g)"
                                rules={[{ required: true, message: 'Please enter the Fiber content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="iron"
                                label="Iron (mg)"
                                rules={[{ required: true, message: 'Please enter the Iron content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="calcium"
                                label="Calcium (mg)"
                                rules={[{ required: true, message: 'Please enter the Calcium content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Vitamin E (mg)"
                                name="vitE"
                                rules={[{ required: true, message: 'Please enter the Protein content' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="magnesium"
                                label="magnesium  (mg)"
                                rules={[{ required: true, message: 'Please enter the magnesium' }]}
                            >
                                <Input type="number" step="any" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default Nutrients;
