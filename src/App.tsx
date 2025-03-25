import "./App.css";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ArtifactsTable from "./components/ArtifactsTable";
import ArtifactController from "./components/ArtifactController";
import UserList from "./components/UserList";
import Login from "./components/Login";
import AuthChecker from "./components/AuthChecker";

const router = createBrowserRouter([
  {
    path: "",
    element: (
        <>
          <AuthChecker />
          <Tabs type="line">
            <TabPane tab="网站数据" itemKey="0">
              <UserList />
            </TabPane>
            <TabPane tab="作品列表" itemKey="1">
              <ArtifactsTable />
            </TabPane>
          </Tabs>
        </>
    ),
  },
  {
    path: "storyDetail/:storyId",
    element: (
        <>
          <AuthChecker />
          <ArtifactController />
        </>
    ),
  },
  {
    path: "login",
    element: <Login />, // 登录页面不需要 AuthChecker
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;