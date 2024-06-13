import { Router } from "express";
import { registerUserController, loginUserController } from "../controllers/userController";

const router = Router();

router.post("/create", registerUserController);
router.post("/login", loginUserController);

export default router;