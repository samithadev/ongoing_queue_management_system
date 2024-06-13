import { Request, Response } from "express";
import { createCounterService, getAllCountersService, updateCounterAssignUserService, resignCounterAssignUserService, getCounterByAssignUserService } from "../services/counterService";

export const createCounterController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { countername } = req.body;
        const newCounter = await createCounterService(countername);
        res.status(201).json(newCounter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllCountersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const counters = await getAllCountersService();
        res.status(200).json(counters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateCounterAssignUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assignUser } = req.body;
        const updatedCounter = await updateCounterAssignUserService(assignUser);
        if (updatedCounter) {
            res.status(200).json(updatedCounter);
        } else {
            res.status(404).json({ message: "No available counters" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const resignCounterAssignUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assignUser } = req.body;
        const resignedCounter = await resignCounterAssignUserService(assignUser);
        if (resignedCounter) {
            res.status(200).json(resignedCounter);
        } else {
            res.status(404).json({ message: "No user assigned to the counter" });
        }
    } catch (error) {
        console.error(error
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
    
    export const getCounterByAssignUserController = async (req: Request, res: Response): Promise<void> => {
      try {
        const { assignUser } = req.body;
        const counter = await getCounterByAssignUserService(assignUser);
        if (counter) {
          res.status(200).json(counter);
        } else {
          res.status(404).json({ message: "No counter found for the given user" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
    