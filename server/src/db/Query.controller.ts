//here the query code is divide into sub-parts as there are may roles and stupidly writing the code is bad idea
import roleToModel from "./role.db.js";
import { ApiError } from "../util/apiError.js";
import prisma from "./database.Postgres.js";
//perfrome sql create option base on the role of user
type UserRole = 'Student' | 'College' | 'Examiner'; // Define a type for user roles

interface User {
    email: string;
    name: string;
    phoneNumber: string;
    address: string;
    role: UserRole; // Enforce role type
    refreshToken: string;
}


// const roleToModel: { [key in UserRole]: any } = {
//     Student: prisma.Student, // Assuming Prisma model types exist
//     College: prisma.College,
//     Examiner: prisma.Examiner,
// };

const createOp = async (user: User, password: string) => {
    try {
        if (!(user.role === 'Student')) {
            return await roleToModel[user.role].create({
                data: {
                    email: user.email,
                    password, // password is hashed before storing
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    refreshToken: " ",
                    collegeVerify: true
                },
            });
        }
        //puting value in studnet table if role is student because it has one to one reffernces to college
        return await roleToModel[user.role].create({
            data: {
                email: user.email,
                password, // password is hashed before storing
                name: user.name,
                phoneNumber: user.phoneNumber,
                address: user.address,
                collegeID: String,
                refreshToken: null,
            },
        });
    } catch (error) {
        return new ApiError(500, "error while creating user");

    }
}
//might have security issues 
const findOp = async (user: User) => {//find user based on the role of user
    try {
        return await roleToModel[user.role].findUnique({
            where: {
                email: user.email
            },
            select: {
                Id:true,
                email: true,
                password: true,
                name: true,
                phoneNumber: true,
                address: true,
            }
        });
    } catch (error) {
        return new ApiError(500, "error while finding user");
    }
}
//update value of user based on the 
//pssing of role is necessary, so the function can select on whic table it should perform operations
const updateOp = async (user: User) => {//user is previous values , current user is new value
    try {
        return await roleToModel[user.role].update({

            where: {
                email: user.email
            },
            data: {
                ...user//updating new value by taking theme from user
            }
        });
    } catch (error) {
        return new ApiError(500, "error while updating ");
    }
}
//it's removes single value/user from that table based on role and email
const deleteOp = async (user: User) => {
    try {
        await roleToModel[user.role].delete({
            where: {
                email: user.email
            }
        });
    } catch (error) {
        return new ApiError(500, "error While deleting ");
    }
}

//it remove all data/user which contians , user selected text aka keyword
const deletMOp = async (user: User, keyword: String) => {
    try {
        return await roleToModel[user.role].deleteMany({
            where: {
                email: {
                    contains: keyword,
                }
            }
        });
    } catch (error) {
        return new ApiError(500, "error while deleting many");
    }
}

const updatePasswordInDB = async (user: User, password: string) => {//update password in database
    return await roleToModel[user.role].update({
        where: {
            email: user.email
        },
        data: {
            password
        }
    });
}

const findCollege=async()=>{//findig college name from college table 
    return await prisma.College.findMany({//it's only checking retrieving college name
        select:{
            name:true
        }
    });
}
export {
    createOp,
    findOp,
    updateOp,
    deleteOp,
    deletMOp,
    updatePasswordInDB,
    findCollege

}