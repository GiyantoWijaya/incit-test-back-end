import { Router } from "express";
import { logout } from "../../controllers/logout.controller/logout.controller";
import { verifyAuth } from "../../middlewares/auth.middleware/auth.middleware";

const logoutRoutes = Router();

logoutRoutes.post("/", verifyAuth, logout);

export default logoutRoutes;
