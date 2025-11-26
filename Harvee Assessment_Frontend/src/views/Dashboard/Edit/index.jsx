import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Services from "@services";
import AppLayout from "@layouts";
import { ArrowLeftOutlined } from "@ant-design/icons";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await Services.getUser(id);
        const user = response.data.user;
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country,
          pincode: user.pincode,
          role: user.role,
        });
      } catch (error) {
        message.error("Failed to fetch user");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await Services.updateUser(id, values);
      message.success("User updated successfully");
      navigate("/dashboard");
    } catch (error) {
      message.error("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: 100 }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: 24 }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={16} xl={12}>
            <Card
              title="Edit User"
              extra={
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/dashboard")}
                >
                  Back
                </Button>
              }
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Please enter phone" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Role" name="role">
                  <Select>
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Address" name="address">
                  <Input />
                </Form.Item>

                <Form.Item label="City" name="city">
                  <Input />
                </Form.Item>

                <Form.Item label="State" name="state">
                  <Input />
                </Form.Item>

                <Form.Item label="Country" name="country">
                  <Input />
                </Form.Item>

                <Form.Item label="Pincode" name="pincode">
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    block
                  >
                    Update User
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
}

export default UserEdit;
