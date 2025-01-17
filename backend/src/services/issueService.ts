import { IssueDAO } from "../dao/issueDao";
import { Issue } from "../entities/Issue";
import { Counter } from "../entities/Counter";
import { Status } from "../entities/Issue";
import { IssueStatus } from "../entities/Issue";
import { json } from "stream/consumers";

export const IssueService = {
    createIssue: async (issueDetails: Partial<Issue>): Promise<Issue> => {
        const existingIssue = await IssueDAO.findUnresolvedIssueByUser(issueDetails.userId as number);
        if (existingIssue) throw new Error("User already has an unresolved issue");

        const counters = await IssueDAO.getOnlineCountersWithIssues();
        if (counters.length === 0) throw new Error("No online counters available");

        console.log("Counters with issues", counters);

        const counterWithMinIssues = counters.reduce((prev, curr) => {
            if (prev.issues?.length === 0) return prev;
            if (curr.issues?.length === 0) return curr;
            return prev.issues?.length  < curr.issues?.length ? prev : curr
        }
        );

        console.log("Counter with min issues", counterWithMinIssues);


        const maxTokenIssue = await IssueDAO.findMaxTokenForCounter(counterWithMinIssues.counterId);
        const tokenNo = maxTokenIssue ? maxTokenIssue.tokenNo + 1 : 1;

        const newIssueDetails = {
            ...issueDetails,
            counterId: counterWithMinIssues.counterId,
            tokenNo,
        };

        return await IssueDAO.createIssue(newIssueDetails);
    },

    deleteIssue: async (issueId: number): Promise<void> => {
        await IssueDAO.deleteIssueById(issueId);
    },

    getAllIssues: async (): Promise<Issue[]> => {
        return await IssueDAO.getAllIssues();
    },

    getIssuesForCounter: async (counterId: number): Promise<Issue[]> => {
        return await IssueDAO.getIssuesForCounter(counterId);
    },

    getIssueById: async (issueId: number): Promise<Issue | null> => {
        return await IssueDAO.findIssueById(issueId);
    },

    updateIssueStatus: async (issueId: number, issueStatus: IssueStatus, status: Status): Promise<Issue | null> => {
        const existingIssue = await IssueDAO.findIssueById(issueId);
        if (!existingIssue) throw new Error("Issue not found");

        existingIssue.issueStatus = issueStatus;
        existingIssue.status = status;
        existingIssue.tokenNo = null;

        return await IssueDAO.updateIssue(existingIssue);
    },

    checkUserIssue: async (userId: number): Promise<Issue | null> => {
        return await IssueDAO.findUnresolvedIssueByUser(userId);
    },

    getIssueIdByStatus: async (userId: number, issueStatus: IssueStatus, status: Status): Promise<number | null> => {
        return await IssueDAO.getIssueIdByStatus(userId, issueStatus, status);
    },

    // ---------------------------------------
    reassignIssuesForClosedCounter: async (counterId: number): Promise<Issue[]> => {
        const issues = await IssueDAO.getPendingIssuesForCounter(counterId);
        const allcounters = await IssueDAO.getOnlineCountersWithIssues();
        const reAssignedIssues = [];

        const counters = allcounters.filter(counter => counter.counterId !== counterId);

        console.log("Counters with issues", counters);


        if (counters.length === 0) throw new Error("No online counters available");

        for (const issue of issues) {
            const counterWithMinIssues = counters.reduce((prev, curr) => {
                if (prev.issues?.length === 0) return prev;
                if (curr.issues?.length === 0) return curr;
                return (prev.issues?.length || 0) < (curr.issues?.length || 0) ? prev : curr
            }
            );

            console.log("Counter with min issues", counterWithMinIssues)

            issue.counterId = counterWithMinIssues.counterId;

            const maxTokenIssue = await IssueDAO.findMaxTokenForCounter(counterWithMinIssues.counterId);
            issue.tokenNo = maxTokenIssue ? maxTokenIssue.tokenNo + 1 : 1;

            await IssueDAO.updateIssue(issue);
            reAssignedIssues.push(issue);
        }
        return reAssignedIssues;
    }
};
