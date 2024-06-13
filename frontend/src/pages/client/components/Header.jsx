import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwt-decode
import { FaRegUserCircle } from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import axios from "axios";

function ClientHeader({ notificationCount }) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        setUserId(decodedToken.userId); // Assuming your token has a userId field
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/");
      }
    } else {
      console.error("Token not found");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className=" flex items-center justify-between py-12 ">
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white rounded-lg"
      >
        Logout
      </button>
      <div className=" flex items-center gap-5">
        <div className="relative">
          <Link to={"/client/notifications"}>
            <FiBell size={25} />
          </Link>
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        <Link
          to={"/client/queueDetails"}
          className=" flex items-center border-2 p-2 rounded-full gap-5"
        >
          <FaRegUserCircle size={30} />{" "}
          <div className=" text-xl">{username}</div>
        </Link>
      </div>
    </div>
  );
}

export default ClientHeader;
