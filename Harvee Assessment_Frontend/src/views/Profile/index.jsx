import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Descriptions, Row, Spin, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Services from "@services";
import AppLayout from "@layouts";

const { Title } = Typography;

function Profile() {
  const { token } = useSelector((state) => state.auth || {});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const response = await Services.getUser(decoded.id);
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [token]);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: 100 }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }
  console.log(`${import.meta.env.VITE_IMAGE_URL}${user.profile_image}`);

  if (!user) return null;

  return (
    <AppLayout>
      <Row justify="center" style={{ padding: "24px 16px" }}>
        <Col xs={24} sm={22} md={20} lg={16} xl={12}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={120}
                src={
                  user.profile_image
                    ? `${import.meta.env.VITE_IMAGE_URL}${user.profile_image}`
                    : null
                }
                icon={!user.profile_image && <UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={3} style={{ margin: 0 }}>
                {user.name}
              </Title>
              <Typography.Text type="secondary">{user.role}</Typography.Text>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {user.address}
              </Descriptions.Item>
              <Descriptions.Item label="City">{user.city}</Descriptions.Item>
              <Descriptions.Item label="State">{user.state}</Descriptions.Item>
              <Descriptions.Item label="Country">
                {user.country}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {user.pincode}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

export default Profile;
