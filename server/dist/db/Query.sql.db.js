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
import { ApiError } from "../util/apiError.js";
// const roleToModel: { [key in UserRole]: any } = {
//     Student: prisma.Student, // Assuming Prisma model types exist
//     College: prisma.College,
//     Examiner: prisma.Examiner,
// };
const createOp = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        switch (user.role) {
            case "College":
                return yield roleToModel[user.role].create({
                    data: {
                        email: (_a = user.email) !== null && _a !== void 0 ? _a : "",
                        password,
                        name: (_b = user.name) !== null && _b !== void 0 ? _b : "",
                        phoneNumber: (_c = user.phoneNumber) !== null && _c !== void 0 ? _c : "",
                        address: (_d = user.address) !== null && _d !== void 0 ? _d : "",
                        refreshToken: " ",
                        collegeVerify: true
                    },
                });
            case "Student":
                return yield roleToModel[user.role].create({
                    data: {
                        email: (_e = user.email) !== null && _e !== void 0 ? _e : "",
                        password,
                        name: (_f = user.name) !== null && _f !== void 0 ? _f : "",
                        phoneNumber: (_g = user.phoneNumber) !== null && _g !== void 0 ? _g : "",
                        address: (_h = user.address) !== null && _h !== void 0 ? _h : "",
                        collegeID: (_j = user.collegeID) !== null && _j !== void 0 ? _j : "",
                        refreshToken: "",
                        studentVerify: true
                    },
                });
            case "Examiner":
                return yield roleToModel[user.role].create({
                    data: {
                        email: (_k = user.email) !== null && _k !== void 0 ? _k : "",
                        password,
                        name: (_l = user.name) !== null && _l !== void 0 ? _l : "",
                        phoneNumber: (_m = user.phoneNumber) !== null && _m !== void 0 ? _m : "",
                        address: (_o = user.address) !== null && _o !== void 0 ? _o : "",
                        refreshToken: "",
                        examinerVerify: true,
                    },
                });
        }
        //puting value in student table if role is student because it has one to one reffernces to college
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
//might have security issues 
const findOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore // the ingore is put here becase there is type error for findunique,but it works 
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
        throw new ApiError(500, error);
    }
});
//update value of user based on the 
//pssing of role is necessary, so the function can select on whic table it should perform operations
const updateOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try { //
        //@ts-ignore
        return yield roleToModel[user.role].update({
            where: {
                email: user.email
            },
            data: Object.assign({}, user //updating new value by taking theme from user
            )
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
//it's removes single value/user from that table based on role and email
const deleteOp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        yield roleToModel[user.role].delete({
            where: {
                email: user.email
            }
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
//it remove all data/user which contians , user selected text aka keyword
const deletMOp = (user, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        return yield roleToModel[user.role].deleteMany({
            where: {
                email: {
                    contains: keyword,
                }
            }
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const updatePasswordInDB = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
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
        throw new ApiError(500, error);
    }
});
const findCollege = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.college.findMany({
            select: {
                name: true
            }
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
//find single subject for college,examiner and student
const getSubject = (subjectCode, subjectName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.subject.findFirst({
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
            },
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const findStudnet = (studnetData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.student.findMany({
            where: {
                collegeID: studnetData === null || studnetData === void 0 ? void 0 : studnetData.Id
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
        throw new ApiError(500, error);
    }
});
const getQuestionPaper = (examId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.questionPaper.findMany({
            where: {
                examID: examId
            },
            select: {
                Id: true,
                examID: true,
                studentID: true,
                SubjectID: true,
                question: true,
                answer: true,
            }
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const getQuestionPaperForExaminer = (examID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.questionPaper.findMany({
            where: {
                examID,
            },
            select: {
                Id: true,
                examID: true,
                studentID: true,
                SubjectID: true,
                question: true,
                answer: true,
            }
        });
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
export { createOp, findOp, updateOp, deleteOp, deletMOp, updatePasswordInDB, findCollege, getSubject, findStudnet, getQuestionPaper, getQuestionPaperForExaminer };
