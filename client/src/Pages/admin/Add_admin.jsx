import React, { useState } from 'react';
import { Form, Input, Button, Alert, message, Flex } from 'antd';

function Add_admin() {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (values) => {
    const user_ = JSON.parse(localStorage.getItem('currentUser'));

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/api/user/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_ && user_.token}`
        },
        body: JSON.stringify(values)
      });

      const result = await response.json();

      if (result.status === 201) {
        message.success('User created successfully');
        setError(null);
        form.resetFields();
      } else {
        setError(result.errors);
        setSuccess(null);
      }
    } catch (error) {
      message.error('An error occurred while creating the user');
      setSuccess(null);
    }
  };

  return (
    <Flex justify='center' style={{ width: "100%" }}>
      <div style={{ width: "50%" }}>
        <h2>Add Admin</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Province"
            name="Province"
            rules={[{ required: true, message: 'Please input the province!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please input the age!' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Are you"
            name="Areyou"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="DoB"
            rules={[{ required: true, message: 'Please input the date of birth!' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Admin
            </Button>
          </Form.Item>
        </Form>
      </div>

    </Flex>
  );
}

export default Add_admin;
