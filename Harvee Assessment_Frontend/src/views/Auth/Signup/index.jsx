import React, { useEffect } from "react";
import { Button, Card, Flex, Form, Grid, Input, Typography } from "antd";
import AuthAPI from "@redux/features/auth/api";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOutlined } from "@ant-design/icons";
import AppLayout from "@layouts";

const { useBreakpoint } = Grid;

function Signup() {
  const { token, loading } = useSelector((state) => state.auth);
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    // handle signup
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token]);
  return (
    <AppLayout footer>
      <Flex className="full-height">
        {screens.lg && (
          <Flex flex={1}>
            <img
              src="/images/signup.svg"
              style={{ width: 530, maxWidth: "100%", margin: "auto" }}
            />
          </Flex>
        )}

        <Flex flex={1} vertical align="center" justify="center" gap={20}>
          <Card style={{ width: "100%", maxWidth: 476 }}>
            <Flex vertical gap={32}>
              <Flex vertical className="text-center">
                <Typography.Title level={2}>
                  Create Skoolsure account
                </Typography.Title>
                <Typography.Text>
                  Welcome back! Please enter your details.
                </Typography.Text>
              </Flex>
              <Form
                name="signup"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input placeholder="Type your name" />
                </Form.Item>
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
                >
                  <Input.Password placeholder="Type your password" />
                </Form.Item>

                <Flex vertical gap={16} style={{ paddingTop: 20 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Signup
                  </Button>

                  <Button block icon={<GoogleOutlined />}>
                    Signup With Google
                  </Button>
                </Flex>
              </Form>
              <Typography.Text className="text-center">
                Already have an account? <Link to="/auth/signin">Signin</Link>{" "}
              </Typography.Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </AppLayout>
  );
}
export default Signup;
