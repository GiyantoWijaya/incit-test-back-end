import { Router } from "express";
import { verifyAuth } from "../../middlewares/auth.middleware/auth.middleware";
import { updateProfile } from "../../controllers/profile.controller/updateProfile.controller";
import { showProfile } from "../../controllers/profile.controller/showOwnProfile.controller";

const profileRoutes = Router();

profileRoutes.post("/", verifyAuth, updateProfile);
profileRoutes.get("/", verifyAuth, showProfile);

export default profileRoutes;
