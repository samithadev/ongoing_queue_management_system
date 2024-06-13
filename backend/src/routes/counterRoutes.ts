import express from "express";
import { createCounterController, getAllCountersController, updateCounterAssignUserController, resignCounterAssignUserController, getCounterByAssignUserController } from "../controllers/counterController";

const router = express.Router();

router.post("/create", createCounterController);
router.get("/getAll", getAllCountersController);
router.put("/assign_user", updateCounterAssignUserController);
router.put("/resign_user", resignCounterAssignUserController);
router.post("/getcounterassign", getCounterByAssignUserController);

export default router;
