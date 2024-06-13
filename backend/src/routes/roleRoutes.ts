import { Router } from "express";
import { createRoleController, getAllRolesController, updateRoleController, deleteRoleController } from "../controllers/roleController";

const router = Router();

router.post("/create", createRoleController);
router.get("/getAll", getAllRolesController);
router.put("/update", updateRoleController);
router.delete("/delete", deleteRoleController);

export default router;
