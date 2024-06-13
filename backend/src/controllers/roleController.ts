import { Request, Response } from "express";
import { createRole, getAllRoles, updateRole, deleteRole } from "../services/roleService";

export const createRoleController = async (req: Request, res: Response): Promise<void> => {
    await createRole(req, res);
};

export const getAllRolesController = async (req: Request, res: Response): Promise<void> => {
    await getAllRoles(req, res);
};

export const updateRoleController = async (req: Request, res: Response): Promise<void> => {
    await updateRole(req, res);
};

export const deleteRoleController = async (req: Request, res: Response): Promise<void> => {
    await deleteRole(req, res);
};
