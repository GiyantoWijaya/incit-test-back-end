import { Router } from "express";
import registrationRoutes from "./registration.routes/registration.routes";
import loginRoutes from "./login.routes/login.routes";
import logoutRoutes from "./logout.routes/logout.routes";
import changePasswordRoutes from "./changePassword.routes/changePassword.routes";
import profileRoutes from "./profile.routes/profile.routes";
import dashboardRoutes from "./dashboard.routes/dashboard.routes";
import { customDashboard } from "../controllers/dashboard.controller/customDashboard.controller";


const MainRouter = Router();

MainRouter.use("/sign-up", registrationRoutes);

MainRouter.use("/sign-in", loginRoutes);

MainRouter.use("/sign-out", logoutRoutes);

MainRouter.use("/change-password", changePasswordRoutes);

MainRouter.use("/profile", profileRoutes);

MainRouter.use("/dashboard", dashboardRoutes);


export default MainRouter;