import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwt-decode
import { FaRegUserCircle } from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import ClientHeader from "./components/Header";
import { io } from "socket.io-client";

function CreateIssuePage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const socket = io("http://localhost:3000");

  useEffect(() => {
    async function checkUserIssue() {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
          setUserId(decodedToken.userId); // Assuming your token has a userId field

          // Check if user has a pending issue
          const response = await axios.post(
            "http://localhost:3000/issue/checkuserIssue",
            {
              userId: decodedToken.userId,
            }
          );
          console.log(response.data);

          if (response.data.issueStatus === "pending") {
            navigate("/client/queueDetails", {
              state: { issueResponse: response.data },
            });
          }
        } catch (error) {
          console.error("Invalid token:", error);
          navigate("/");
        }
      } else {
        console.error("Token not found");
        navigate("/");
      }
    }

    checkUserIssue();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming you have a function to make API calls
    const issueData = {
      userId,
      name,
      phoneNo,
      email,
      issue,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/issue/create",
        issueData,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}` // Assuming your backend expects an Authorization header
          },
        }
      );

      if (response.data.issueId) {
        const responseIssue = await axios.post(
          "http://localhost:3000/issue/singleIssue",
          {
            issueId: response.data.issueId,
          }
        );

        socket.emit("issueAdded", responseIssue.data);

        alert("Issue created successfully!");
        navigate("/client/queueDetails", {
          state: { issueResponse: response.data },
        });
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
      alert(`Failed to create issue: ${error.response.data.error}`);
    }
  };

  return (
    <div className="mx-16">
      <ClientHeader />
      <h1 className=" text-xl font-bold">Add Your Issue Details</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-3 mt-5  ">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border-2 border-solid p-2"
          required
        />
        <input
          type="text"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Phone Number"
          className="border-2 border-solid p-2"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-2 border-solid p-2"
          required
        />
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Describe your issue"
          className="border-2 border-solid p-2"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg "
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
}

export default CreateIssuePage;
