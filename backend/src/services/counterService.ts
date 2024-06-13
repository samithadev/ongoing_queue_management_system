import { Counter } from "../entities/Counter";
import { CounterDAO } from "../dao/counterDao";

export const createCounterService = async (countername: string): Promise<Counter> => {
    return await CounterDAO.createCounter(countername);
};

export const getAllCountersService = async (): Promise<Counter[]> => {
    return await CounterDAO.getAllCounters();
};

export const updateCounterAssignUserService = async (assignUser: number): Promise<Counter | null> => {
    return await CounterDAO.updateCounterAssignUser(assignUser);
};

export const resignCounterAssignUserService = async (assignUser: number): Promise<Counter | null> => {
    return await CounterDAO.resignCounterAssignUser(assignUser);
};

export const getCounterByAssignUserService = async (assignUser: number): Promise<Counter | null> => {
    return await CounterDAO.getCounterByAssignUser(assignUser);
};
