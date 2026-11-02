import express, { Express } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";

// ROUTES
import RootRoutes from "./routes/index";
import { initializeDatabase } from "./config/mariadb";
import { AppError } from "./utils/app_error";
import { errorHandler } from "./middleware/error_handler";

dotenv.config();
const PORT = process.env.PORT;
const corsOptions: CorsOptions = {
  origin: [process.env.CORS_ORIGINS ?? "http://localhost:5173"],
  methods: "GET, POST, PUT, PATCH, DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", RootRoutes);

app.use((req, res, next) => next(new AppError(404, "Kaynak bulunamadı")));
app.use(errorHandler);

const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`[server]: Server is running on port `, PORT);
  });
};

startServer();
