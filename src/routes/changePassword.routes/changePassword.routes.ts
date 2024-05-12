import { Router } from "express";
import { changePassword, validatorChangePassword } from "../../controllers/changePassword.controller/changePassword.controller";
import { verifyAuth } from "../../middlewares/auth.middleware/auth.middleware";

const changePasswordRoutes = Router();

changePasswordRoutes.patch("/", verifyAuth, validatorChangePassword, changePassword);

export default changePasswordRoutes;
