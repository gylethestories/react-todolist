import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/login/Login";
import Detail from "../views/news/Detail";
import News from "../views/news/News";
import NewsSandBox from "../views/sandbox/NewsSandBox";
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} exact />
        <Route path="/news" element={<News />} exact />
        <Route path="/detail/:id" element={<Detail />} exact />
        {/* <Route path="/" element={<NewsSandBox></NewsSandBox>} exact /> */}
        <Route path="/*" element={localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
