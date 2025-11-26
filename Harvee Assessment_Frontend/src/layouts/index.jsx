import React, { Fragment } from "react";
import AppHeader from "@components/Header";

import { Layout } from "antd";

function AppLayout({ children, footer }) {
  return (
    <Fragment>
      <AppHeader />
      <Layout className="app-container">{children}</Layout>
   
    </Fragment>
  );
}

export default AppLayout;
