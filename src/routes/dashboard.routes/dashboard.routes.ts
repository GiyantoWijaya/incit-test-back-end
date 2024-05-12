import { Router } from "express";
import { verifyAuth } from "../../middlewares/auth.middleware/auth.middleware";
import { showAllDashboard } from "../../controllers/dashboard.controller/dashboard.controller";
import { customDashboard } from "../../controllers/dashboard.controller/customDashboard.controller";

const dashboardRoutes = Router();

dashboardRoutes.get("/", verifyAuth, showAllDashboard);

dashboardRoutes.get("/custom", verifyAuth, customDashboard);


export default dashboardRoutes;
