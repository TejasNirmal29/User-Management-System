import { ArrowLeftOutlined } from "@ant-design/icons";
import AppLayout from "@layouts";
import { Button, Flex, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

function NoMatch() {
  return (
    <AppLayout>
      <Flex
        align="center"
        justify="center"
        style={{ minHeight: `calc(100dvh - var(--hf-height))` }}
      >
        <Flex vertical className="text-center">
          <Typography.Title style={{ fontSize: `7.2vw`, marginBottom: 0 }}>
            404.
          </Typography.Title>
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />}>Back to home</Button>
          </Link>
        </Flex>
      </Flex>
    </AppLayout>
  );
}

export default NoMatch;
