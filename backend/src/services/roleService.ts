import { Request, Response } from "express";
import { RoleDAO } from "../dao/roleDao";

export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const newRole = await RoleDAO.createRole(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await RoleDAO.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedRole = await RoleDAO.updateRole(req.body);
        if (!updatedRole) {
            res.status(404).json({ error: "Role not found" });
            return;
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await RoleDAO.deleteRole(req.body.id);
        if (!deleted) {
            res.status(404).json({ error: "Role not found" });
            return;
        }
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
