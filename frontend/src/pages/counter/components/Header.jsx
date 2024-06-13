import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaRegUserCircle } from "react-icons/fa";

function Header() {
  const [username, setusername] = useState();
  const [counterName, setCounterName] = useState("");
  const [counterId, setCounterId] = useState("");
  const [assignuser, setassignUser] = useState("");
  const [issues, setIssues] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchIssues = async (counterId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/issue/allIssuesfor",
        {
          counterId,
        }
      );
      console.log(response.data);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues", error);
    }
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setassignUser(decodedToken.userId);
      setusername(decodedToken.username);
      fetchCounterName(decodedToken.userId);
    } else {
      console.error("Token not found");
    }
  }, []);

  useEffect(() => {
    if (counterId) {
      fetchIssues(counterId);
    }
  }, [counterId]);

  const fetchCounterName = async (assignUser) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/counter/getcounterassign",
        {
          assignUser,
        }
      );
      console.log(response.data);
      setCounterName(response.data.counterName);
      setCounterId(response.data.counterId);
      fetchIssues(response.data.counterId);
    } catch (error) {
      console.error("Error fetching counter name", error);
    }
  };

  const handleCounterClose = async () => {
    console.log(issues);
    if (issues.some((issue) => issue.issueStatus === "pending")) {
      alert("Cannot close counter as there are issues assigned to it.");
      return;
    }
    try {
      console.log(assignuser);
      await axios.put("http://localhost:3000/counter/resign_user", {
        assignUser: assignuser,
      });
      localStorage.removeItem("token");
      localStorage.clear();
      navigate("/counterlogin");
    } catch (error) {
      console.error("Error resigning user", error);
    }
  };

  return (
    <div className=" flex items-center justify-between py-12">
      <div>
        Counter
        <div className=" border-2 solid rounded-full bg-slate-400 px-2 mt-1">
          counter: {counterName}
        </div>
      </div>
      <div className=" flex items-center gap-5">
        <button
          onClick={handleCounterClose}
          className="p-2 bg-red-600 text-white rounded-lg"
        >
          Close Counter
        </button>
        <div className=" flex items-center border-2 p-2 rounded-full gap-5">
          <FaRegUserCircle size={30} />{" "}
          <div className=" text-xl">{username}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
