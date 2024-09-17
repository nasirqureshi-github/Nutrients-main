import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  Select,
  Upload,
  message,
  Row,
  Col,
  Flex,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [sources, setSources] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPriceId, setCurrentPriceId] = useState(null);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchSources();
    fetchCities();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      setSelectedCity(cities[0]._id);
      fetchPrices(cities[0]._id);
    }
  }, [cities]);

  const fetchSources = async () => {
    try {
      const response = await fetch(
        "https://neovatus.onrender.com/api/get-allsource"
      );
      const result = await response.json();
      if (response.ok) {
        setSources(result.data);
      } else {
        console.error("Failed to fetch sources:", result.message);
      }
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch("https://neovatus.onrender.com/api/cities");
      const result = await response.json();
      if (response.ok) {
        setCities(result.data);
      } else {
        console.error("Failed to fetch cities:", result.message);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchPrices = async (cityId) => {
    try {
      const response = await fetch(
        `https://neovatus.onrender.com/api/prices?city=${cityId}`
      );
      const result = await response.json();
      if (response.ok) {
        setPrices(result.data);
      } else {
        console.error("Failed to fetch prices:", result.message);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    fetchPrices(value);
  };

  const handleAddOrUpdatePrice = async () => {
    try {
      const values = await form.validateFields();

      const data = {
        source: values.source,
        city: values.city,
        quantity: values.quantity,
        price: values.price,
        unit: values.unit,
        image: image,
      };

      const url = isEditing
        ? ` https://neovatus.onrender.com/api/prices/${currentPriceId}`
        : " https://neovatus.onrender.com/api/prices";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          isEditing ? "Price Updated Successfully" : "Price Added Successfully"
        );
        form.resetFields();
        setImage(null);
        setIsModalVisible(false);
        fetchPrices(selectedCity);
        setIsEditing(false);
        setCurrentPriceId(null);
      } else {
        message.error(result.message);
      }
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const handleImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://neovatus.onrender.com/api/uploads",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        setImage(result.image);
        message.success("Image uploaded successfully");
        return false; // Prevent automatic upload
      } else {
        console.error("Failed to upload image:", result.message);
        message.error("Image upload failed");
        return false;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Image upload failed");
      return false;
    }
  };

  const handleEditClick = (record) => {
    setIsEditing(true);
    setCurrentPriceId(record._id);
    form.setFieldsValue({
      source: record.source._id,
      city: record.city,
      quantity: record.quantity,
      price: record.price,
      unit: record.unit,
    });
    setImage(record.image);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Source Name",
      dataIndex: ["source", "foodName"],
      key: "source",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: ["source", "image"],
      key: "image",
      render: (text) =>
        text ? (
          <img
            src={`https://neovatus.onrender.com/api/images/${text}`}
            alt="Price Image"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleEditClick(record)} type="link">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" style={{ width: "100%" }}>
        {" "}
        <Select
          placeholder="Select a city"
          value={selectedCity}
          onChange={handleCityChange}
          style={{ width: 200, marginBottom: 16 }}
        >
          {cities.map((city) => (
            <Option key={city._id} value={city._id}>
              {city.name}
            </Option>
          ))}
        </Select>
        <Button
          onClick={() => {
            setIsEditing(false);
            setIsModalVisible(true);
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add Price
        </Button>
      </Flex>
      <Table
        dataSource={prices}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        title={isEditing ? "Edit Price" : "Add Price"}
        visible={isModalVisible}
        onOk={handleAddOrUpdatePrice}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setImage(null);
          setIsEditing(false);
          setCurrentPriceId(null);
        }}
        centered
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          {isEditing ? (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please enter the quantity" },
                    ]}
                  >
                    <Input placeholder="e.g., 1000 g, 12 dozen" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="unit"
                    label="Unit"
                    rules={[
                      { required: true, message: "Please enter the unit" },
                    ]}
                  >
                    <Select placeholder="Select a unit">
                      <Option value="g">g</Option>
                      <Option value="dozen">dozen</Option>
                      {/* Add more options as needed */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      { required: true, message: "Please enter the price" },
                    ]}
                  >
                    <Input type="number" placeholder="e.g., 50" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="source"
                    label="Source"
                    rules={[
                      { required: true, message: "Please select a source" },
                    ]}
                  >
                    <Select placeholder="Select a source">
                      {sources.map((source) => (
                        <Option key={source._id} value={source._id}>
                          {source.foodName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      { required: true, message: "Please select a city" },
                    ]}
                  >
                    <Select placeholder="Select a city">
                      {cities.map((city) => (
                        <Option key={city._id} value={city._id}>
                          {city.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please enter the quantity" },
                    ]}
                  >
                    <Input placeholder="e.g., 1000" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="unit"
                    label="Unit"
                    rules={[
                      { required: true, message: "Please select a unit" },
                    ]}
                  >
                    <Select placeholder="Select a unit">
                      <Option value="g">g</Option>
                      <Option value="dozen">dozen</Option>
                      {/* Add more options as needed */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      { required: true, message: "Please enter the price" },
                    ]}
                  >
                    <Input type="number" placeholder="e.g., 50" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="image" label="Upload Image">
                    <Upload
                      customRequest={handleImageUpload}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PriceManagement;
