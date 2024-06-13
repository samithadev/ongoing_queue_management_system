import connectDB from "../typeorm";
import { User } from "../entities/User";

export const UserDAO = {
    findByUsername: async (username: string): Promise<User | null> => {
        const userRepository = connectDB.getRepository(User);
        return await userRepository.findOne({ where: { username } });
    },

    createUser: async (userDetails: Partial<User>): Promise<User> => {
        const userRepository = connectDB.getRepository(User);
        const newUser = userRepository.create(userDetails);
        return await userRepository.save(newUser);
    },
};
