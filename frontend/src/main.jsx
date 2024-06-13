import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root.layout";
import RegisterPage from "./pages/register/register.page";
import LoginPage from "./pages/login/login.page";
import CounterLogin from "./pages/login/counterlogin.page";
import CounterLayout from "./layouts/counter.layout";
import CounterQueuePage from "./pages/counter/counterQueue.page";
import IssueViewPage from "./pages/counter/issueView.page";
import ClientLayout from "./layouts/client.layout";
import CreateIssuePage from "./pages/client/createIssue.page";
import QueueDetailsPage from "./pages/client/queueDetails.page";
import NotificationPage from "./pages/client/notification.page";

import { SocketProvider } from "./socketContext";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/counterlogin",
        element: <CounterLogin />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/counter",
        element: <CounterLayout />,
        children: [
          {
            path: "allissues",
            element: <CounterQueuePage />,
          },
          {
            path: "issueView/:id",
            element: <IssueViewPage />,
          },
        ],
      },
      {
        path: "/client",
        element: <ClientLayout />,
        children: [
          {
            path: "createIssue",
            element: <CreateIssuePage />,
          },
          {
            path: "queueDetails",
            element: <QueueDetailsPage />,
          },
          {
            path: "notifications",
            element: <NotificationPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
