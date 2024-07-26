"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const MongoStudentRepository_1 = require("./repositories/MongoStudentRepository");
const StudentController_1 = require("./controllers/StudentController");
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)(); // Asegúrate de que `app` es de tipo `Application`
exports.app = app;
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
if (!mongoUri || !dbName) {
    console.error('Missing MongoDB credentials');
    process.exit(1);
}
const client = new mongodb_1.MongoClient(mongoUri);
client.connect().then(() => {
    console.log('Connected to MongoDB');
    const studentRepository = new MongoStudentRepository_1.MongoStudentRepository(client, dbName, 'students');
    const studentController = new StudentController_1.StudentController(studentRepository);
    app.use(express_1.default.json());
    app.get('/students', (req, res) => studentController.getAll(req, res));
    app.post('/students', (req, res) => studentController.add(req, res));
    app.listen(port, () => {
        console.log(`API running at http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
});
