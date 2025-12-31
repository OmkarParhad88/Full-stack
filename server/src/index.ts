import express, { type Application, type Request, type Response } from "express";
import "dotenv/config";
import router from "./routes";
import { GlobalRateLimitter } from "./config/rate-limit";
import cors from "cors";
import path from "path";
const app: Application = express();
const PORT = Bun.env.PORT || 8000;

//middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(GlobalRateLimitter);
app.use(express.static("public"));
app.use(router);

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dir, `views`));

app.get("/", async (req: Request, res: Response) => {
  return res.send("Hello Wojiijrluuuhud!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


