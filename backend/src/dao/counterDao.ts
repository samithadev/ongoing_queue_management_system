import connectDB from "../typeorm";
import { Counter } from "../entities/Counter";
import { User } from "../entities/User";
import { IsNull } from "typeorm";

export const CounterDAO = {
    createCounter: async (countername: string): Promise<Counter> => {
        const counterRepository = connectDB.getRepository(Counter);
        const newCounter = counterRepository.create({ counterName: countername });
        return await counterRepository.save(newCounter);
    },

    getAllCounters: async (): Promise<Counter[]> => {
        const counterRepository = connectDB.getRepository(Counter);
        return await counterRepository.find();
    },

    updateCounterAssignUser: async (assignUser: number): Promise<Counter | null> => {
        const counterRepository = connectDB.getRepository(Counter);
        const counter = await counterRepository.findOne({ where: { assignUser: IsNull() } });

        if (counter) {
            counter.assignUser = assignUser;
            counter.status = 'online';
            return await counterRepository.save(counter);
        }

        return null;
    },

    resignCounterAssignUser: async (assignUser: number): Promise<Counter | null> => {
        const counterRepository = connectDB.getRepository(Counter);
        const counter = await counterRepository.findOne({ where: { assignUser } });

        if (counter) {
            counter.assignUser = null;
            counter.status = 'offline';
            return await counterRepository.save(counter);
        }

        return null;
    },

    getCounterByAssignUser: async (assignUser: number): Promise<Counter | null> => {
        const counterRepository = connectDB.getRepository(Counter);
        return await counterRepository.findOne({ where: { assignUser } });
    },
};
