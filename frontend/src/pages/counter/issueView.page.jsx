import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function IssueViewPage() {
  const { id: issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [counterId, setCounterId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/issue/singleIssue",
          {
            issueId,
          }
        );
        setIssue(response.data);
      } catch (error) {
        console.error("Error fetching issue", error);
      }
    };

    const fetchCounterId = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/issue/singleIssue",
          {
            issueId,
          }
        );
        fetchIssuesForCounter(response.data.counterId);
      } catch (error) {
        console.error("Error fetching counterId", error);
      }
    };

    const fetchIssuesForCounter = async (counterId) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/issue/allIssuesfor",
          {
            counterId,
          }
        );
        setIssues(
          response.data.filter(
            (issue) =>
              issue.issueStatus === "pending" && issue.status === "online"
          )
        );
      } catch (error) {
        console.error("Error fetching issues for counter", error);
      }
    };
    fetchIssue();
    fetchCounterId();
  }, [issueId]);

  const handleDone = async () => {
    try {
      await axios.put("http://localhost:3000/issue/updateIssueStatus", {
        issueId,
        issueStatus: "done",
        status: "offline",
      });
      alert("Issue mark as done!!");
      navigate("/counter/allissues");
    } catch (error) {
      console.error("Error updating issue status", error);
    }
  };

  const handleDoneAndCallNext = async () => {
    try {
      await axios.put("http://localhost:3000/issue/updateIssueStatus", {
        issueId,
        issueStatus: "done",
        status: "offline",
      });
      alert("Issue mark as done!!");

      const updatedIssues = issues.filter((issue) => issue.issueId != issueId);
      console.log(issueId);
      setIssues(updatedIssues);
      console.log(updatedIssues);
      if (updatedIssues.length > 0) {
        const nextIssue = updatedIssues[0];
        // setAssignUser(nextIssue.user.userId);
        console.log(nextIssue);
        navigate(`/counter/issueView/${nextIssue.issueId}`);
        socket.emit("callUser", {
          userId: nextIssue.userId,
          counterName: nextIssue.counter.counterName,
        });
        socket.emit("curruntToken", {
          tokenNo: nextIssue.tokenNo,
          counterName: nextIssue.counter.counterName,
        });
        socket.emit("callNotification", {
          message: `Token ${nextIssue.tokenNo} is being called at ${nextIssue.counter.counterName}`,
        });
      } else {
        // setAssignUser("");
        navigate("/counter/allissues");
      }
    } catch (error) {
      console.error("Error updating issue status", error);
    }
  };

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-16">
      <Header />
      <div className=" border-2 border-solid p-10">
        <div className=" flex items-center gap-5 pb-5">
          <div className=" border-2 border-solid rounded-full p-2 font-bold text-red-600">
            <p>{issue.tokenNo}</p>
          </div>
          <div>
            <p>{issue.name}</p>
            <p className=" font-bold text-blue-700">{issue.phoneNo}</p>
          </div>
        </div>
        <div>
          <h1 className=" text-xl font-bold ">Issue</h1>
          <p className=" mb-3">Email: {issue.email}</p>
          <p>{issue.issue}</p>
        </div>
      </div>
      <div className=" flex justify-end gap-5 mt-10">
        <button
          onClick={handleDone}
          className="p-2 bg-purple-700 text-white rounded-lg"
        >
          Done
        </button>
        <button
          onClick={handleDoneAndCallNext}
          className="p-2 bg-red-500 text-white rounded-lg"
        >
          Done & Call Next
        </button>
      </div>
    </div>
  );
}

export default IssueViewPage;
