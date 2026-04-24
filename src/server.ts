import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_ORIGIN = "http://localhost:3000";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use(routes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
