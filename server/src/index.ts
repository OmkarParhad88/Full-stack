import express, { type Application, type Request, type Response } from "express";
import "dotenv/config";
import ejs from "ejs";
import { emailQueue, emailQueueName } from "./jobs/EmailJob";
import router from "./routes";
import { renderEmail } from "./views/helper";
import path from "path";

const app: Application = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dir, `views`));

app.get("/", async (req: Request, res: Response) => {
  const html = await renderEmail("welcome", { name: "Omkar" });
  await emailQueue.add(emailQueueName, { to: "omkarparhad7905@gmail.com", subject: "Welcome", html });
  return res.send("Email added to queue");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


