import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Home from "../../views/sandbox/home/Home";
import Error from "../../views/sandbox/error/error";
import RightList from "../../views/sandbox/right-manage/RightList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import UserList from "../../views/sandbox/user-manage/UserList";
import { Route, Navigate, Routes, BrowserRouter as Router } from "react-router-dom";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import axios from "axios";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";

const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};

function NewsRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      // console.log(res);
      setBackRouteList([...res[0].data, ...res[1].data]);
      // console.log(BackRouteList)
    });
  }, []);

  const {
    role: { rights },
  } = JSON.parse(sessionStorage.getItem("token"));

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson);
  };

  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Routes>
        {BackRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact />;
          }
          return null;
        })}

        <Route path="/" element={<Navigate replace from="/" to="home" />} />
        {BackRouteList.length > 0 && <Route path="*" element={<Error />} />}
      </Routes>
    </Spin>
  );
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
  isLoading,
});

const mapDisptchToProps = {
  changeCollapsed() {
    return {
      type: "change_loading",
      // payload:
    }; // action
  },
};

export default connect(mapStateToProps, mapDisptchToProps)(NewsRouter);
