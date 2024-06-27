import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaRegUserCircle } from "react-icons/fa";
import { io } from "socket.io-client";

function Header() {
  const [username, setusername] = useState();
  const [counterName, setCounterName] = useState("");
  const [counterId, setCounterId] = useState("");
  const [assignuser, setassignUser] = useState("");
  const [issues, setIssues] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const socket = io("http://localhost:3000");

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

  // const handleCounterClose = async () => {
  //   console.log(issues);
  //   await axios.put("http://localhost:3000/issue/closeCounter", {
  //     counterId,
  //   });
  //   if (error.response && error.response.data && error.response.data.message === "No online counters available") {
  //     alert("Cannot close counter as there are issues assigned to it.");
  //     return;
  //   }
  //   try {
  //     console.log(assignuser);

  //     await axios.put("http://localhost:3000/counter/resign_user", {
  //       assignUser: assignuser,
  //     });
  //     localStorage.removeItem("token");
  //     localStorage.clear();
  //     navigate("/counterlogin");
  //   } catch (error) {
  //     console.error("Error resigning user", error);
  //   }
  // };

  const handleCounterClose = async () => {
    console.log(issues);
    const pendingIssues = issues.filter(
      (issue) => issue.issueStatus === "pending"
    );

    if (pendingIssues.length > 0) {
      try {
        const response = await axios.put(
          "http://localhost:3000/issue/closeCounter",
          {
            counterId,
          }
        );
        const reAssignedIssues = response.data.reAssignIssues;
        console.log("reassign Issues: ", reAssignedIssues);

        socket.emit("issuesAdded", reAssignedIssues);

        socket.emit("changeCounter", reAssignedIssues);
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "Can not reassign") {
          alert("No online counters");
          return;
        } else {
          console.error("Error closing counter", error);
        }
      }
    }

    try {
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
        {/* <div className=" flex items-center border-2 p-2 rounded-full gap-5">
          <FaRegUserCircle size={30} />{" "}
          <div className=" text-xl">{username}</div>
        </div> */}
        <Link
          to={"/counter/allissues"}
          className=" flex items-center border-2 p-2 rounded-full gap-5"
        >
          <FaRegUserCircle size={30} />{" "}
          <div className=" text-xl">{username}</div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
