import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AppLayout from "@layouts";
import Services from "@services";
import UserDetailModal from "./UserDetailModal";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const fetchUsers = useCallback(
    async (page = 1, pageSize = 10, searchFilters = {}) => {
      setLoading(true);
      try {
        const params = {
          ...Object.fromEntries(
            Object.entries(searchFilters).filter(([_, v]) => v)
          ),
          page,
          limit: pageSize,
        };
        const response = await Services.getAllUsers(params);
        setUsers(response.data.users || []);
        setPagination({
          current: page,
          pageSize,
          total: response.data.total || 0,
        });
      } catch (error) {
        message.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange = (pag) => {
    fetchUsers(pag.current, pag.pageSize, filters);
  };

  const handleSearch = () => {
    fetchUsers(1, pagination.pageSize, filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = (record) => {
    setSelectedUser(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/edit-user/${record._id}`);
  };

  const handleDelete = async (userId) => {
    try {
      await Services.deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 150,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ padding: 24 }}>
        <Card title="User Management Dashboard">
          <Flex vertical gap={16}>
            <Flex gap={8} wrap="wrap">
              <Input
                placeholder="Search by name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                style={{ width: 200 }}
              />
              <Input
                placeholder="Search by email"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                style={{ width: 200 }}
              />
              <Input
                placeholder="Filter by state"
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
                style={{ width: 150 }}
              />
              <Input
                placeholder="Filter by city"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                style={{ width: 150 }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Flex>

            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
            />
          </Flex>
        </Card>
      </div>

      <UserDetailModal
        visible={detailModalVisible}
        user={selectedUser}
        onClose={() => setDetailModalVisible(false)}
      />
    </AppLayout>
  );
}

export default Dashboard;
