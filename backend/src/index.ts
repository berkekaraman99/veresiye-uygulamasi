import express, { Express } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

// ROUTES
import RootRoutes from "./api/_routes";

dotenv.config();
const PORT = process.env.PORT || 3000;
const corsOptions: CorsOptions = {
    origin: "http://localhost:5173",
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200
}

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   next();
// });
app.use("/api", RootRoutes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running on port`, PORT);
});
