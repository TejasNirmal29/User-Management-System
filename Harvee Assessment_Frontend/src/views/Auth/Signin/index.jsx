import React, { useEffect } from "react";
import { Button, Card, Flex, Form, Grid, Input, Typography } from "antd";
import AuthAPI from "@redux/features/auth/api";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOutlined } from "@ant-design/icons";
import AppLayout from "@layouts";

const { useBreakpoint } = Grid;

function Signin() {
  const { token, loading } = useSelector((state) => state.auth || {});
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(AuthAPI.login(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);
  return (
    <AppLayout footer>
      <Flex className="full-height">
        <Flex flex={1} vertical align="center" justify="center" gap={20}>
          <Card style={{ width: "100%", maxWidth: 476 }}>
            <Flex vertical gap={32}>
              <Flex vertical className="text-center">
                <Typography.Title level={2}>
                  Sign in to User Management System
                </Typography.Title>
                <Typography.Text>
                  Welcome back! Please enter your credentials.
                </Typography.Text>
              </Flex>
              <Form
                name="signin"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email address!",
                    },
                  ]}
                >
                  <Input placeholder="Type your email address" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input.Password placeholder="Type your password" />
                </Form.Item>

                <Button
                  style={{ marginTop: 24 }}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Signin
                </Button>
              </Form>
              <Typography.Text className="text-center">
                Don't have account? <Link to="/auth/signup">Signup</Link>{" "}
              </Typography.Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </AppLayout>
  );
}
export default Signin;
