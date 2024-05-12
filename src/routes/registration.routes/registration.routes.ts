import { Router } from "express";
import { registration, validatorRegistration } from "../../controllers/registration.controller/registration.controller";
import { generateEmailTokenVerified, verifyEmailToken } from "../../controllers/emailConfirmation.controller.js/emailConfirmation.controller";


const registrationRoutes = Router();

registrationRoutes.post("/", validatorRegistration, registration);

registrationRoutes.post("/request-verify-email", generateEmailTokenVerified);
registrationRoutes.post("/verify-email-code", verifyEmailToken);

export default registrationRoutes;

