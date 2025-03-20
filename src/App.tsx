import './App.css'
import SearchBar from './components/SearchBar/index';
import ArtifactsTable from "./components/ArtifactsTable";
import ArtifactController from "./components/ArtifactController";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element:
          <>
            <SearchBar />
            <ArtifactsTable />
          </>,
    },
    {
      path: 'storyDetail/:storyId',
      element:
          <>
            <ArtifactController />
          </>,
    },
    {
      path:'login',
      element:
          <>
            <Login />
          </>,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App
