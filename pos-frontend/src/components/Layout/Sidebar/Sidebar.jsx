import React from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ collapsed, user }) => {
  const location = useLocation();

  const items = [
    {
      key: "/customers",
      icon: <UserOutlined />,
      label: <Link to="/customers">Customers</Link>,
    },
    {
      key: "/products",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "/transactions",
      icon: <DollarOutlined />,
      label: <Link to="/transactions">Transactions</Link>,
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
        <h2>POS {!collapsed ? "SALES" : ""}</h2>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        items={items}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#FFFFFF1C",
          paddingBottom: "20px",
          paddingTop: "30px",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "grid",
          justifyContent: "start",
          alignItems: "center",
          color: "#fff",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Avatar size="large" icon={<UserOutlined />} />
          {!collapsed && (
            <div style={{ marginLeft: "10px" }}>
              <div>{user.name}</div>
              <div style={{ fontSize: "12px", color: "grey" }}>
                {user.level}
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button type="primary" icon={<LogoutOutlined />}>
            Logout
          </Button>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
