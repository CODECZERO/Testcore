import prisma from "./database.Postgres.js";
// Define the mapping between user roles and Prisma models
const roleToModel = {
    Student: prisma.student,
    College: prisma.college,
    Examiner: prisma.examiner, // Prisma model for examiners
    // Add other roles as needed
};
export default roleToModel;
