import React, { useEffect, useState } from "react";
import ClientHeader from "./components/Header";
import { io } from "socket.io-client";

import { useSocket } from "../../socketContext";

const socket = io("http://localhost:3000");

function NotificationPage() {
  const { notifications } = useSocket();

  return (
    <div className="mx-16">
      <ClientHeader notificationCount={notifications.length} />
      <h1>Notifications</h1>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="notification-card my-2 p-3 shadow-lg rounded-lg"
            >
              <p>{notification.message}</p>
            </div>
          ))
        ) : (
          <p>No notifications to display</p>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
