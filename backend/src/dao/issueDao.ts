import connectDB from "../typeorm";
import { Issue } from "../entities/Issue";
import { Counter } from "../entities/Counter";
import { Status } from "../entities/Issue";
import { Not, IsNull } from "typeorm";
import { IssueStatus } from "../entities/Issue";

export const IssueDAO = {
    createIssue: async (issueDetails: Partial<Issue>): Promise<Issue> => {
        const issueRepository = connectDB.getRepository(Issue);
        const newIssue = issueRepository.create(issueDetails);
        return await issueRepository.save(newIssue);
    },

    findUnresolvedIssueByUser: async (userId: number): Promise<Issue | null> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.findOne({ where: { userId, status: Status.ONLINE } });
    },

    getOnlineCountersWithIssues: async (): Promise<Counter[]> => {
        const counterRepository = connectDB.getRepository(Counter);
        const counters = await counterRepository.find({ 
            relations: ["issues"],
            where: { status: "online"}
        });

        counters.forEach(counter => {
            counter.issues = counter.issues.filter(issue => issue.issueStatus === "pending");
        });

        return counters;
    },

    findMaxTokenIssue: async (): Promise<Issue | null> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.findOne({
            select: ["tokenNo"],
            order: { tokenNo: "DESC" },
            where: { tokenNo: Not(IsNull()) }
        });
    },

    deleteIssueById: async (issueId: number): Promise<void> => {
        const issueRepository = connectDB.getRepository(Issue);
        const issue = await issueRepository.findOne({ where: { issueId } });
        if (issue) await issueRepository.remove(issue);
    },

    getAllIssues: async (): Promise<Issue[]> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.find({ relations: ["counter"] });
    },

    getIssuesForCounter: async (counterId: number): Promise<Issue[]> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.find({
            where: { counter: { counterId } },
            relations: ["counter"]
        });
    },

    findIssueById: async (issueId: number): Promise<Issue | null> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.findOne({
            where: { issueId },
            relations: ["counter"]
        });
    },

    updateIssue: async (issue: Issue): Promise<Issue> => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.save(issue);
    },

    getIssueIdByStatus: async (userId: number, issueStatus: IssueStatus, status: Status): Promise<number | null> => {
        const issueRepository = connectDB.getRepository(Issue);
        const issue = await issueRepository.findOne({
            select: ["issueId"],
            where: { userId, issueStatus, status }
        });
        return issue ? issue.issueId : null;
    },
//  -------------------------------------------------------------------------------------------
    findMaxTokenForCounter: async (counterId: number): Promise<Issue | null> => {
        const issueRepository = connectDB.getRepository(Issue);
        const maxTokenIssue = await issueRepository
            .createQueryBuilder("issue")
            .where("issue.counterId = :counterId", { counterId })
            .orderBy("issue.tokenNo", "DESC")
            .getOne();
        return maxTokenIssue;
    },

    getPendingIssuesForCounter: async (counterId: number) => {
        const issueRepository = connectDB.getRepository(Issue);
        return await issueRepository.find({
          where: {
            counterId,
            issueStatus: IssueStatus.PENDING,
          }
        });
      },
};
