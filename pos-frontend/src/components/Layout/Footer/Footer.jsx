import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      POS Sales ©{new Date().getFullYear()} CV.Maju Kedepan
    </Footer>
  );
};

export default AppFooter;
