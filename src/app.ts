import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import passport from "passport";
import mainRouter from "./routes/routes";
import { apiResponse } from "./utils/method-helper/method";
import Database from "./databases/models/index.model";

const app = express();

app.use(compression());
app.disable("x-powered-by");

//CORS Settings
app.use(
  cors({
    origin: "*", // restrict calls to those this address
    methods: "*", // only allow GET requests
  })
);
// Set up cookies
app.use(cookieParser());

app.use(express.json({ limit: 1000000 }));
app.use(express.urlencoded({ extended: true }));

// Initialize Passport and session
app.use(passport.initialize());

//Middleware to verify all request to this microservices
app.use("/", mainRouter);

app.use((err: Error, req: Request, res: Response) => {
  apiResponse(res, 500, "Internal Server Error", err.message);
});



//port increase each service
const appPort = 3001;
const init = async () => {
  try {
    new Database();

    app.listen(appPort, async () => {
      console.log(
        `init-test-app`,
        `Server started at port ${appPort}`
      );
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};
init();

export default app;
