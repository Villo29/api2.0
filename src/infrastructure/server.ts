import express, { Application } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { MongoStudentRepository } from './repositories/MongoStudentRepository';
import { StudentController } from './controllers/StudentController';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 2929;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Configurar CORS para permitir todos los orígenes
app.use(cors());

// Configurar para parsear JSON
app.use(express.json());

if (!mongoUri || !dbName) {
  console.error('Missing MongoDB credentials');
  process.exit(1);
}

const client = new MongoClient(mongoUri);

client.connect().then(() => {
  console.log('Connected to MongoDB');
  const studentRepository = new MongoStudentRepository(client, dbName, 'students');
  const studentController = new StudentController(studentRepository);

  app.get('/students', (req, res) => studentController.getAll(req, res));
  app.post('/students', (req, res) => studentController.add(req, res));

  app.listen(port, () => {
    console.log(`API running at ${port}`);
  });
}).catch(error => {
  console.error('Failed to connect to MongoDB', error);
});

export { app };
