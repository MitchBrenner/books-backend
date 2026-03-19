import "dotenv/config";
import express from "express";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Book routes
app.use("/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
