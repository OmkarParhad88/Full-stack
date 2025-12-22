import express, { type Application, type Request, type Response } from "express";
import "dotenv/config";
import ejs from "ejs";
import { sendMail } from "./config/mail";
import { emailQueue, emailQueueName } from "./jobs/EmailJob";


const __dirname = import.meta.dir;
// That's it! No imports needed.

const app: Application = express();
const PORT = process.env.PORT || 7000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//set view engine
app.set("view engine", "ejs");
app.set("views", `${import.meta.dir}/views`);

app.get("/", async (req: Request, res: Response) => {
  // const html = await ejs.renderFile(`${import.meta.dir}/views/emails/welcome.ejs`, { name: "Omkar" });
  // await sendMail("omkarparhad7905@gmail.com", "Welcome", html);
  // res.send(html);
  await emailQueue.add(emailQueueName, { name: "Omkar", age: 22 });
  return res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


