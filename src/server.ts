import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT;

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
