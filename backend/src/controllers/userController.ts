import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/userService";

export const registerUserController = async (req: Request, res: Response): Promise<void> => {
    await registerUser(req, res);
};

export const loginUserController = async (req: Request, res: Response): Promise<void> => {
    await loginUser(req, res);
};
