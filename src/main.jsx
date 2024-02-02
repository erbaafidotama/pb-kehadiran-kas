import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Member from "./routes/member.jsx";
import Kehadiran from "./routes/kehadiran.jsx";
import CatatKas from "./routes/catatKas.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/member",
    element: <Member />,
  },
  {
    path: "/kehadiran",
    element: <Kehadiran />,
  },
  {
    path: "/catatKas",
    element: <CatatKas />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
