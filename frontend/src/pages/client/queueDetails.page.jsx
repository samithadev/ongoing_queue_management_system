import React, { useState, useEffect, useRef } from "react";
import ClientHeader from "./components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "../../socketContext";

const socket = io("http://localhost:3000");

function QueueDetailsPage() {
  const [currentToken, setCurrentToken] = useState(
    localStorage.getItem("currentToken") || null
  );
  const [issue, setIssue] = useState();
  const [issueId, setIssueId] = useState(null);
  const [myToken, setMyToken] = useState(null);
  const [counterName, setCounterName] = useState("");
  const [nextToken, setNextToken] = useState(
    localStorage.getItem("nextToken") || "none"
  );

  const { notifications } = useSocket();

  const previousNotificationsLength = useRef(notifications.length);

  const navigate = useNavigate();

  useEffect(() => {
    if (previousNotificationsLength.current < notifications.length) {
      const newNotifications = notifications.slice(
        previousNotificationsLength.current
      );
      newNotifications.forEach((notification) => {
        alert(`New notification: ${notification.message}`);
      });
      previousNotificationsLength.current = notifications.length;
    }
  }, [notifications]);

  // Fetch issue status on component mount
  const fetchIssueStatus = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/issue/getIssueIdByStatus",
        {
          userId: userId,
          issueStatus: "pending",
          status: "online",
        }
      );
      const issueId = response.data.issueId;
      setIssueId(issueId);

      if (issueId) {
        const responseIssue = await axios.post(
          "http://localhost:3000/issue/singleIssue",
          {
            issueId: issueId,
          }
        );
        const issue = responseIssue.data;
        console.log(issue);
        setIssue(issue);
        setMyToken(issue.tokenNo);
        setCounterName(issue.counter.counterName);

        socket.emit("joinCounterRoom", issue.counter.counterName); // Join the counter room

        if (issue.issueStatus === "done") {
          navigate("/client/createIssue");
        }
      }
    } catch (error) {
      console.error("Error fetching issue status", error);
    }
  };

  useEffect(() => {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    const userId = decodedToken.userId;

    fetchIssueStatus(userId);

    // return () => {
    //   socket.off("issueDone");
    //   socket.off("changeCounter");
    // };
  }, []);

  useEffect(() => {
    socket.on("callTokenNo", (data) => {
      console.log("called", data);
      setCurrentToken(data.token);
      setNextToken(data.nextToken);
      localStorage.setItem("currentToken", data.token);
      localStorage.setItem("nextToken", data.nextToken);
    });

    socket.on("issueDone", () => {
      navigate("/client/createIssue");
    });

    socket.on("changeCounter", (newIssues) => {
      console.log("this is issue: ", newIssues);
      newIssues.forEach((issue) => {
        fetchIssueStatus(issue.userId);
      });
    });

    return () => {
      socket.off("callTokenNo");
      socket.off("issueDone");
      socket.off("changeCounter");
    };
  }, []);

  const handleCancel = async () => {
    try {
      await axios.put("http://localhost:3000/issue/updateIssueStatus", {
        issueId,
        issueStatus: "cancel",
        status: "offline",
      });
      alert("Issue marked as canceled!");
      socket.emit("issueCanceled", issue);
      navigate("/client/createIssue");
    } catch (error) {
      console.error("Error updating issue status", error);
    }
  };

  if (!myToken) {
    return <ClientHeader notificationCount={notifications.length} />;
  }

  return (
    <div className="mx-16">
      <ClientHeader notificationCount={notifications.length} />

      <h1 className="text-xl">Ongoing Queue</h1>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center border-2 border-solid p-16 gap-3">
          <h2 className="text-5xl">Current No</h2>
          <h2 className="text-8xl text-red-600">
            {currentToken !== null ? currentToken : "Loading..."}
          </h2>
        </div>

        <div className="flex gap-3 text-2xl mt-5">
          <h1 className="font-bold">Counter Assigned:</h1>
          <h2>{counterName || "Loading..."}</h2>
        </div>

        <div className="flex gap-3 text-2xl mt-5">
          <h1 className="font-bold">Next:</h1>
          <h2>{nextToken !== null ? nextToken : "none"}</h2>
        </div>

        <div className="flex gap-3 text-2xl mt-5">
          <h1 className="font-bold text-red-600">My No:</h1>
          <h2>{myToken}</h2>
        </div>
        {currentToken === myToken && (
          <div className="flex gap-3 text-2xl mt-5 text-green-600">
            <h1 className="font-bold">You're Now</h1>
          </div>
        )}
        {myToken === nextToken && (
          <div className="flex gap-3 text-2xl mt-5 text-blue-600">
            <h1 className="font-bold">Ready your next</h1>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-5 mr-10">
        <button
          onClick={handleCancel}
          className="p-2 bg-red-600 text-white rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QueueDetailsPage;
