import { Request, Response } from "express";
import { IssueService } from "../services/issueService";
import { Status } from "../entities/Issue";
import { IssueStatus } from "../entities/Issue";

export const createIssue = async (req: Request, res: Response): Promise<void> => {
    try {
        const issueDetails = req.body;
        const newIssue = await IssueService.createIssue(issueDetails);
        res.status(201).json(newIssue);
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error.message });
    }
};

export const deleteIssue = async (req: Request, res: Response): Promise<void> => {
    try {
        const { issueId } = req.body;
        await IssueService.deleteIssue(Number(issueId));
        res.status(200).json({ message: "Issue deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllIssues = async (req: Request, res: Response): Promise<void> => {
    try {
        const issues = await IssueService.getAllIssues();
        res.status(200).json(issues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getIssuesForCounter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { counterId } = req.body;
        const issues = await IssueService.getIssuesForCounter(Number(counterId));
        res.status(200).json(issues);
    } catch (error) {
        console.error("Failed to retrieve issues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { issueId } = req.body;
        const issue = await IssueService.getIssueById(Number(issueId));
        if (!issue) {
            res.status(404).json({ error: "Issue not found" });
            return;
        }
        res.status(200).json(issue);
    } catch (error) {
        console.error("Failed to retrieve issue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateIssueStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { issueId, issueStatus, status } = req.body;
        const updatedIssue = await IssueService.updateIssueStatus(Number(issueId), issueStatus, status);
        res.status(200).json({ message: "Issue status updated successfully", updatedIssue });
    } catch (error) {
        console.error("Error updating issue status", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const checkUserIssue = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        const unresolvedIssue = await IssueService.checkUserIssue(Number(userId));
        if (unresolvedIssue) {
            res.status(200).json(unresolvedIssue);
        } else {
            res.status(200).json({ pending: false });
        }
    } catch (error) {
        console.error("Error checking user issue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getIssueIdByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, issueStatus, status } = req.body;
        const issueId = await IssueService.getIssueIdByStatus(userId, issueStatus, status);
        if (issueId) {
            res.status(200).json({ issueId });
        } else {
            res.status(404).json({ error: "Issue not found" });
        }
    } catch (error) {
        console.error("Error fetching issue ID by status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//------------------------------------
export const closeCounterAndReassignIssues = async (req: Request, res: Response): Promise<void> => {
    try {
        const { counterId } = req.body;
        const reAssignIssues = await IssueService.reassignIssuesForClosedCounter(Number(counterId));
        res.status(200).json({ reAssignIssues  });
    } catch (error) {
        res.status(500).json({ error: "Can not reassign" });
    }
};
