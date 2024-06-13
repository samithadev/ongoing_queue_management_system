import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDAO } from "../dao/userDao";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: number, role: number, username: string): string => {
    return jwt.sign({ userId, role, username }, JWT_SECRET);
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, ...otherDetails } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await UserDAO.findByUsername(username);
        if (existingUser) {
            res.status(409).json({ error: "Username already in use" });
            return;
        }

        const newUser = await UserDAO.createUser({
            ...otherDetails,
            username,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await UserDAO.findByUsername(username);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = generateToken(user.userId, user.roleId, user.username);

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
