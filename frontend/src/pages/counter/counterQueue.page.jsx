import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaRegUserCircle } from "react-icons/fa";
import Header from "./components/Header";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function CounterQueuePage() {
  const [username, setusername] = useState();
  const [counterName, setCounterName] = useState("");
  const [counterId, setCounterId] = useState("");
  const [assignuser, setassignUser] = useState("");
  const [issues, setIssues] = useState([]);
  const [calledIssues, setCalledIssues] = useState([]);

  const nextIssue = null;

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
      setIssues(
        response.data
          .filter(
            (issue) =>
              issue.issueStatus === "pending" && issue.status === "online"
          )
          .sort((a, b) => a.tokenNo - b.tokenNo)
      );

      socket.emit("joinCounter", counterId);
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

  //---------------------------------------------------

  useEffect(() => {
    // Listen for new issue and updates
    const handleIssueAdded = (newIssue) => {
      fetchIssues(newIssue.counterId);
    };

    const handleIssuesAdded = (newIssues) => {
      fetchIssues(newIssues[0].counterId);
    };

    const handleIssueCanceled = (canceledIssue) => {
      fetchIssues(canceledIssue.counterId);
    };

    socket.on("issueAdded", handleIssueAdded);
    socket.on("issuesAdded", handleIssuesAdded);
    // socket.on("issueUpdated", handleIssueUpdated);
    socket.on("issueCanceled", handleIssueCanceled);

    // Cleanup on unmount
    return () => {
      socket.off("issueAdded", handleIssueAdded);
      socket.off("issuesAdded", handleIssuesAdded);
      // socket.off("issueUpdated", handleIssueUpdated);
      socket.off("issueCanceled", handleIssueCanceled);
    };
  }, [counterId]);

  const fetchCounterName = async (assignUser) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/counter/getcounterassign",
        {
          assignUser,
        }
      );
      setCounterName(response.data.counterName);
      setCounterId(response.data.counterId);
      fetchIssues(response.data.counterId);
    } catch (error) {
      console.error("Error fetching counter name", error);
    }
  };

  const handleCall = (userId, tokenNo, counterName, nextTokenNo) => {
    console.log("Next Token No", nextTokenNo);
    setCalledIssues([...calledIssues, userId]);
    // Join the user to their room
    socket.emit("joinRoom", userId);

    socket.emit("callUser", { userId, counterName });
    socket.emit("curruntToken", { tokenNo, counterName, nextTokenNo });

    socket.emit("callNotification", {
      message: `Token ${tokenNo} is being called at ${counterName}`,
    });
  };

  return (
    <div className="mx-16">
      <Header />
      <div className="issues-list">
        {issues.length > 0 ? (
          issues.map((issue, index) => {
            const nextIssue = issues[index + 1];
            const nextTokenNo = nextIssue ? nextIssue.tokenNo : null;
            return (
              <div
                key={index}
                className="issue-card my-2 p-3 shadow-lg rounded-lg flex justify-between items-center"
              >
                <div className=" flex gap-5 items-center">
                  <div className=" bg-slate-200 p-2 rounded-full">
                    <p className=" font-bold text-red-600">{issue.tokenNo}</p>
                  </div>
                  <div>
                    <h3 className="text-lg">{issue.name}</h3>
                    <p className=" font-bold text-blue-700">{issue.phoneNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Link
                    to={`/counter/issueView/${issue.issueId}`}
                    className="p-2 bg-red-600 text-white rounded-lg"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleCall(
                        issue.userId,
                        issue.tokenNo,
                        issue.counter.counterName,
                        nextTokenNo
                      )
                    }
                    // className="p-2 bg-green-600 text-white rounded-lg"
                    className={`p-2 text-white rounded-lg ${
                      calledIssues.includes(issue.userId)
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                  >
                    {calledIssues.includes(issue.userId) ? "Recall" : "Call"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No issues to display</p>
        )}
      </div>
    </div>
  );
}

export default CounterQueuePage;
