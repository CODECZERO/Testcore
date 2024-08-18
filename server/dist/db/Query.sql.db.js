var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//here the query code is divide into sub-parts as there are may roles and stupidly writing the code is bad idea
import roleToModel from "./role.db.js";
import prisma from "./database.Postgres.js";
// const roleToModel: { [key in UserRole]: any } = {
//     Student: prisma.Student, // Assuming Prisma model types exist
//     College: prisma.College,
//     Examiner: prisma.Examiner,
// };
const createOp = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(user.role === 'Student')) {
            return yield roleToModel[user.role].create({
                data: {
                    email: user.email,
                    password,
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    refreshToken: " ",
                    collegeVerify: true
                },
            });
        }
        //puting value in studnet table if role is student because it has one to one reffernces to college
        return yield roleToModel[user.role].create({
            data: {
                email: user.email,
                password,
                name: user.name,
                phoneNumber: user.phoneNumber,
                address: user.address,
                collegeID: String,
                refreshToken: null,
            },
        });
    }
    catch (error) {
        return error;
    }
});
//might have security issues 
const findOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield roleToModel[user.role].findUnique({
            where: {
                email: user.email
            },
            select: {
                Id: true,
                email: true,
                password: true,
                name: true,
                phoneNumber: true,
                address: true,
            }
        });
    }
    catch (error) {
        return error;
    }
});
//update value of user based on the 
//pssing of role is necessary, so the function can select on whic table it should perform operations
const updateOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield roleToModel[user.role].update({
            where: {
                email: user.email
            },
            data: Object.assign({}, user //updating new value by taking theme from user
            )
        });
    }
    catch (error) {
        return error;
    }
});
//it's removes single value/user from that table based on role and email
const deleteOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield roleToModel[user.role].delete({
            where: {
                email: user.email
            }
        });
    }
    catch (error) {
        return error;
    }
});
//it remove all data/user which contians , user selected text aka keyword
const deletMOp = (user, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield roleToModel[user.role].deleteMany({
            where: {
                email: {
                    contains: keyword,
                }
            }
        });
    }
    catch (error) {
        return error;
    }
});
const updatePasswordInDB = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield roleToModel[user.role].update({
            where: {
                email: user.email
            },
            data: {
                password
            }
        });
    }
    catch (error) {
        return error;
    }
});
const findCollege = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.College.findMany({
            select: {
                name: true
            }
        });
    }
    catch (error) {
        return error;
    }
});
//find single subject for college,examiner and student
const getSubject = (subjectCode, subjectName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.Subject.findUnique({
            where: {
                OR: [
                    { subjectCode: subjectCode },
                    { subjectName: subjectName }
                ]
            },
            select: {
                Id: true,
                subjectCode: true,
                subjectName: true,
            }
        });
    }
    catch (error) {
        return error;
    }
});
const findStudnet = (studnetData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.Student.findMany({
            where: {
                college: studnetData === null || studnetData === void 0 ? void 0 : studnetData.Id
            },
            select: {
                Id: true,
                name: true,
                phoneNumber: true,
                email: true,
                studentVerify: true,
                collegeID: true,
                address: true
            }
        });
    }
    catch (error) {
        return error;
    }
});
const getQuestionPaper = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.QuestionPaper.findMany({
            where: {
                examID: examId
            },
            select: {
                Id: true,
                examID: true,
                studnetID: true,
                SubjectID: true,
                question: true,
                answer: true,
            }
        });
    }
    catch (error) {
        return error;
    }
});
const getQuestionPaperForExaminer = (examID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.QuestionPaper.findMany({
            where: {
                examID: examID,
            },
            select: {
                Id: true,
                examID: true,
                studnetID: true,
                SubjectID: true,
                question: true,
                answer: true,
            }
        });
    }
    catch (error) {
        return error;
    }
});
export { createOp, findOp, updateOp, deleteOp, deletMOp, updatePasswordInDB, findCollege, getSubject, findStudnet, getQuestionPaper, getQuestionPaperForExaminer };
