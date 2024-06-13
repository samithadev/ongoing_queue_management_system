// socketContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // Corrected import statement

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentToken, setCurrentToken] = useState(null); // New state for currentToken

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const socket = io("http://localhost:3000");

      // Retrieve notifications for the current user from local storage
      const storedNotifications =
        JSON.parse(localStorage.getItem("notifications")) || {};
      setNotifications(storedNotifications[userId] || []);

      // Join the user to their room
      socket.emit("joinRoom", userId);

      // Listen for call notifications
      socket.on("callNotification", (data) => {
        const newNotification = { message: data.message };
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, newNotification];

          // Save to local storage
          // const notificationsByUser =
          //   JSON.parse(localStorage.getItem("notifications")) || {};
          // notificationsByUser[userId] = updatedNotifications;
          // localStorage.setItem(
          //   "notifications",
          //   JSON.stringify(notificationsByUser)
          // );

          return updatedNotifications;
        });
      });

      // Listen for currentToken notifications
      socket.on("callTokenNo", (data) => {
        setCurrentToken(data.token);
        localStorage.setItem("currentToken", JSON.stringify(data.token));
      });

      // Cleanup on unmount
      return () => {
        socket.off("callNotification");
        socket.off("callTokenNo");
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ notifications, userId, currentToken }}>
      {children}
    </SocketContext.Provider>
  );
};
