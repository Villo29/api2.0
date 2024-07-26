"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const GetAllStudents_1 = require("../../domain/use-cases/GetAllStudents");
const AddStudent_1 = require("../../domain/use-cases/AddStudent");
class StudentController {
    constructor(studentRepository) {
        this.getAllStudents = new GetAllStudents_1.GetAllStudents(studentRepository);
        this.addStudent = new AddStudent_1.AddStudent(studentRepository);
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield this.getAllStudents.execute();
            res.json(students);
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = req.body;
            yield this.addStudent.execute(student);
            res.status(201).send();
        });
    }
}
exports.StudentController = StudentController;
