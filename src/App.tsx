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