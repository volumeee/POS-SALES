import React, { useEffect } from "react";
import { Breadcrumb, Layout, theme } from "antd";
import Sidebar from "./Sidebar/Sidebar";
import AppHeader from "./Header/Header";
import AppFooter from "./Footer/Footer";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateBreadcrumbs } from "../../features/breadCrumbSlice";

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const dispatch = useDispatch();
  const breadcrumbs = useSelector((state) => state.breadcrumbs.breadcrumbs);

  useEffect(() => {
    dispatch(updateBreadcrumbs(pathSnippets));
  }, [dispatch, pathSnippets]);

  const breadCrumbItems = [
    {
      key: "home",
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const breadcrumb = breadcrumbs[url];
      const isLast = index === pathSnippets.length - 1;

      return {
        key: url,
        title:
          isLast && breadcrumb ? (
            <span>{breadcrumb.name}</span>
          ) : (
            <Link to={url}>{breadcrumb ? breadcrumb.name : snippet}</Link>
          ),
      };
    }),
  ];

  const user = {
    name: "John Doe",
    level: "Admin",
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar collapsed={collapsed} user={user} />
      <Layout
        style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          colorBgContainer={colorBgContainer}
        />
        <Breadcrumb style={{ margin: "16px 16px" }} items={breadCrumbItems} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Content
            style={{
              margin: "16px",
            }}
          >
            {children}
          </Content>
          <AppFooter />
        </div>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
