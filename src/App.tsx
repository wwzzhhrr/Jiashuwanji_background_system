import React, { useState } from 'react';
import FileUpload from './components/AddArtifactFiles';
import FileList from './components/ArtifactFileTable';
import { InputNumber } from '@douyinfe/semi-ui';
import { useCallback } from 'react';
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ArtifactsTable from "./components/ArtifactsTable";
import ArtifactController from "./components/ArtifactController";
import UserList from "./components/UserList";
import Login from "./components/Login";
import SearchBar from "./components/SearchBar";
import {TrackingProvider} from "./components/demo";
import {Demo} from "./components/demo/demo.tsx";
import {Statistics} from "./components/statistics";

const App: React.FC = () => {
  const [artifactId, setArtifactId] = useState<number>(2);
  const [refreshKey, setRefreshKey] = useState<number>(0); // 用于触发刷新

  // 刷新方法，更新 refreshKey 触发 FileList 重新加载
  const refreshFiles = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  console.log('App: 当前 artifactId:', artifactId);

  return (
    <div style={{ padding: 20 }}>
      <h2>文件管理</h2>
      <div style={{ marginBottom: 20 }}>
        <label>作品 ID: </label>
        <InputNumber
          value={artifactId}
          onChange={(value) => {
            const newId = Number(value);
            setArtifactId(newId);
            console.log('App: artifactId 变更为:', newId);
          }}
          min={1}
          style={{ width: 120 }}
        />
      </div>
      <FileUpload artifactId={artifactId} onFileAdded={refreshFiles} />
      <FileList artifactId={artifactId} refreshKey={refreshKey} />
    </div>
  );

const isTokenValid = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp! > Date.now() / 1000;
  } catch {
    return false;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Tabs type="line">
          <TabPane tab="网页数据" itemKey="0">
            <Statistics/>
          </TabPane>
          <TabPane tab="用户信息" itemKey="1">
            <UserList />
          </TabPane>
          <TabPane tab="作品列表" itemKey="2">
            <SearchBar />
            <ArtifactsTable />
          </TabPane>
        </Tabs>
    ),
    loader: () => {
      const token = localStorage.getItem("auth_token");
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem("auth_token");
        throw redirect("/login");
      }
      return null;
    }
  },
  {
    path: "storyDetail/:storyId",
    element: <ArtifactController />
  },
  { path: "login", element: <Login /> },
  {
    path: "demo",
    element:
    <>
      <TrackingProvider>
        <Demo/>
      </TrackingProvider>
    </>

  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;