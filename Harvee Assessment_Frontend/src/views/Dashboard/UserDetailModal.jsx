import React from "react";
import { Avatar, Descriptions, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";

function UserDetailModal({ visible, user, onClose }) {
  if (!user) return null;

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={80}
          src={
            user.profile_image
              ? `${import.meta.env.VITE_IMAGE_URL}${user.profile_image}`
              : null
          }
          icon={!user.profile_image && <UserOutlined />}
        />
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
        <Descriptions.Item label="City">{user.city}</Descriptions.Item>
        <Descriptions.Item label="State">{user.state}</Descriptions.Item>
        <Descriptions.Item label="Country">{user.country}</Descriptions.Item>
        <Descriptions.Item label="Pincode">{user.pincode}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default UserDetailModal;
