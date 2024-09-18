//here the query code is divide into sub-parts as there are may roles and stupidly writing the code is bad idea
import roleToModel from "./role.db.js";
import prisma from "./database.Postgres.js";
import { ApiError } from "../util/apiError.js";
//perfrome sql create option base on the role of user
type UserRole = 'Student' | 'College' | 'Examiner'; // Define a type for user roles

interface User {
    email?: string;
    name?: string;
    phoneNumber?: string;
    address?: string;
    role: UserRole; // Enforce role type
    refreshToken?: string;
    collegeID?: string;
}


// const roleToModel: { [key in UserRole]: any } = {
//     Student: prisma.Student, // Assuming Prisma model types exist
//     College: prisma.College,
//     Examiner: prisma.Examiner,
// };

const createOp = async (user: User, password: string) => {
    console.log(user)
    try {
        switch (user.role) {
            case "College":
                return await roleToModel[user.role].create({
                    data: {
                        email: user.email ?? "",
                        password, // password is hashed before storing
                        name: user.name ?? "",
                        phoneNumber: user.phoneNumber ?? "",
                        address: user.address ?? "",
                        refreshToken: " ",
                        collegeVerify: true
                    },
                });
            case "Student":
                return await roleToModel[user.role].create({
                    data: {
                        email: user.email ?? "",
                        password, // password is hashed before storing
                        name: user.name ?? "",
                        phoneNumber: user.phoneNumber ?? "",
                        address: user.address ?? "",
                        collegeID: user.collegeID ?? "",
                        refreshToken: "",
                        studentVerify: true
                    },
                });
            case "Examiner":
                return await roleToModel[user.role].create({
                    data: {
                        email: user.email ?? "",
                        password, // password is hashed before storing
                        name: user.name ?? "",
                        phoneNumber: user.phoneNumber ?? "",
                        address: user.address ?? "",
                        refreshToken: "",
                        examinerVerify: true,
                    },
                });
        }
        //puting value in student table if role is student because it has one to one reffernces to college

    } catch (error) {
        throw new ApiError(500, error)

    }
}
//might have security issues 
const findOp = async (user: User) => {//find user based on the role of user
    try {
        //@ts-ignore // the ingore is put here becase there is type error for findunique,but it works 
        return await roleToModel[user.role].findUnique({
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
    } catch (error) {
        throw new ApiError(500, error)
    }
}
//update value of user based on the 
//pssing of role is necessary, so the function can select on whic table it should perform operations
const updateOp = async (user: User, role: UserRole) => {//user is previous values , current user is new value
    try {
        //@ts-ignore
        return await roleToModel[role].update({
            where: {
                email: user.email
            },
            data: {
                ...user//updating new value by taking theme from user
            }
        });
    } catch (error) {
        throw new ApiError(500, error)
    }
}
//it's removes single value/user from that table based on role and email
const deleteOp = async (user: User) => {
    try {
        //@ts-ignore

        await roleToModel[user.role].delete({
            where: {
                email: user.email
            }
        });
    } catch (error) {
        throw new ApiError(500, error)
    }
}

//it remove all data/user which contians , user selected text aka keyword
const deletMOp = async (user: User, keyword: String) => {
    try {
        //@ts-ignore

        return await roleToModel[user.role].deleteMany({
            where: {
                email: {
                    contains: keyword,
                }
            }
        });
    } catch (error) {
        throw new ApiError(500, error)
    }
}

const updatePasswordInDB = async (user: User, password: string) => {//update password in database
    try {
        //@ts-ignore
        return await roleToModel[user.role].update({
            where: {
                email: user.email
            },
            data: {
                password
            }
        });
    } catch (error) {
        throw new ApiError(500, error)
    }
}

const findCollege = async () => {//findig college name from college table 
    try {
        return await prisma.college.findMany({//it's only checking retrieving college name
            select: {
                Id:true,
                name: true
            }
        });
    } catch (error) {
        throw new ApiError(500, error)
    }
}

//find single subject for college,examiner and student


const getSubject = async (subjectCode: string, subjectName: string) => {//this function get all the subject in the database
    try {
        return await prisma.subject.findFirst({//first subject which it finds

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
    } catch (error) {
        throw new ApiError(500, error)
    }
}

const findStudnet = async (studnetData: { Id: string }) => {//findt students for college
    try {
        await prisma.student.findMany({//find all the studnet 
            where: {
                collegeID: studnetData?.Id
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

    } catch (error) {
        throw new ApiError(500, error)
    }


}

const getQuestionPaper = async (examId: string) => {//get question paper form data base
    try {
        return await prisma.questionPaper.findMany({//find all question with exam id
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
    } catch (error) {
        throw new ApiError(500, error)
    }
}


const getQuestionPaperForExaminer = async (examID: string) => {//get question paper for college with smae exam id
    try {
        return await prisma.questionPaper.findMany({
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
        })
    } catch (error) {
        throw new ApiError(500, error)
    }
}


const getStudnetNumber = async (collegeID: string, SubjectID: string) => {//get student number , so they can recive notififcation
    try {
        return await prisma.student.findMany({
            where: {
                collegeID,
                subject: {
                    some: {
                        Id: SubjectID
                    }
                }
            },
            select: {
                phoneNumber: true
            }
        })
    } catch (error) {
        throw new ApiError(500, `something went wrong while searching number ${error}`)
    }
}
export {
    createOp,
    findOp,
    updateOp,
    deleteOp,
    deletMOp,
    updatePasswordInDB,
    findCollege,
    getSubject,
    findStudnet,
    getQuestionPaper,
    getQuestionPaperForExaminer,
    getStudnetNumber

}