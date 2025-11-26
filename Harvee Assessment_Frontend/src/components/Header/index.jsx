import React, { memo, useCallback, useMemo } from "react";
import { Button, Flex, Layout, Popconfirm } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import navItems from "@db/navigation";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "@redux/features/auth/slice";

const { Header } = Layout;

function AppHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth || {});

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  const role = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded?.role;
    } catch {
      return null;
    }
  }, [token]);

  // show items if no role is required or user's role matches
  const menuItems = useMemo(
    () =>
      navItems
        .filter((item) => {
          if (!token) return false;
          if (role === "admin") return true;
          return !item.role || item.role === role;
        })
        .map((item) => ({
          key: item.id,
          label: (
            <Button type="text" onClick={() => handleNavigate(item.path)}>
              {item.label}
            </Button>
          ),
        })),
    [handleNavigate, role, token]
  );

  return (
    <Header className="app-header">
      <Flex align="center" gap={30} className="app-header-content">
        {!!token && <NavButtons items={menuItems} />}
        {!!token && (
          <Popconfirm
            title="Are you sure you want to log out?"
            onConfirm={() => {
              dispatch(logout());
              navigate("/auth/signin");
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" shape="circle">
              <LogoutOutlined />
            </Button>
          </Popconfirm>
        )}
      </Flex>
    </Header>
  );
}

const NavButtons = memo(({ items }) => (
  <>
    {items.map(({ key, label }) => (
      <React.Fragment key={key}>{label}</React.Fragment>
    ))}
  </>
));

export default memo(AppHeader);
