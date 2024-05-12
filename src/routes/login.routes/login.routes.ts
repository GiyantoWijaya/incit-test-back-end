import { Router } from "express";
import { login } from '../../controllers/login.controller/login.controller';
import { loginByGoogle } from "../../controllers/login.controller/loginByGoogle.controller";

const loginRoutes = Router();

loginRoutes.post("/", login);
loginRoutes.post("/google-auth-verify", loginByGoogle);
loginRoutes.post("/facebook/callback", loginByGoogle);


export default loginRoutes;
