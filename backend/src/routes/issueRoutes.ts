import express from "express";
import { createIssue, deleteIssue, getAllIssues, getIssueById, getIssuesForCounter, updateIssueStatus, checkUserIssue, getIssueIdByStatus, closeCounterAndReassignIssues } from "../controllers/issueController";

const router = express.Router();

router.post("/create", createIssue)
router.delete("/delete", deleteIssue)
router.get("/all", getAllIssues)
router.post("/allIssuesfor", getIssuesForCounter)
router.post("/singleIssue", getIssueById)
router.put("/updateIssueStatus", updateIssueStatus)
router.post("/checkuserIssue", checkUserIssue)
router.post("/getIssueIdByStatus", getIssueIdByStatus )

//-------------------
router.put("/closeCounter", closeCounterAndReassignIssues);

export default router;