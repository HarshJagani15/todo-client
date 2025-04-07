import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
    </React.Fragment>
  );
};

export default Layout;
