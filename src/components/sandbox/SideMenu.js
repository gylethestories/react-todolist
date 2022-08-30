import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Layout, Menu } from "antd";
import "./index.css";
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage/list": <MenuFoldOutlined />,
  "/right-manage/role/list": <MenuUnfoldOutlined />,
  "/right-manage/right/list": <UploadOutlined />,
  "/news-manage/add": <VideoCameraOutlined />,
  "/publish-manage/unpublished": <VideoCameraOutlined />,
};

function SideMenu(props) {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const openKeys = ["/" + location.pathname.split("/")[1]];

  const {
    role: { rights },
  } = JSON.parse(sessionStorage.getItem("token"));

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        checkPagePermission(item) && (
          <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => navigate(item.key)}>
            {item.title}
          </Menu.Item>
        )
      );
    });
  };

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">发布管理系统</div>
        <div style={{ flex: "1", overflow: "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={location.pathname} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});

const mapDisptchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
      // payload:
    }; // action
  },
};

export default connect(mapStateToProps, mapDisptchToProps)(SideMenu);
