import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { Layout, Dropdown, Menu, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const changeCollapsed = () => {
    // 改变state的isCollapsed
    // console.log(props);
    props.changeCollapsed();
  };

  const {
    role: { roleName },
    username,
  } = JSON.parse(sessionStorage.getItem("token"));

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item
        danger
        onClick={() => {
          sessionStorage.removeItem("token");
          navigate("/home");
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

      <div style={{ float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

const mapDisptchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
      // payload:
    }; // action
  },
};
export default connect(mapStateToProps, mapDisptchToProps)(TopHeader);
