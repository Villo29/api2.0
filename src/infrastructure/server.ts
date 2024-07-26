import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import express, { Application } from "express";
import { MongoStudentRepository } from "./repositories/MongoStudentRepository";
import { StudentController } from "./controllers/StudentController";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 2929;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
app.use(express.urlencoded({ extended: true }));
if (!mongoUri || !dbName) {
  console.error("Missing MongoDB credentials");
  process.exit(1);
}
const client = new MongoClient(mongoUri);

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const studentRepository = new MongoStudentRepository(
      client,
      dbName,
      "students"
    );
    const studentController = new StudentController(studentRepository);

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.get("/students", (req, res) => studentController.getAll(req, res));
    app.post("/students", (req, res) => studentController.add(req, res));

    app.listen(port, () => {
      console.log(`API running at ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

export { app };
