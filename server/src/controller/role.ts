// roleMapping.js
import prisma from "../db/database.Postgres.js";

// Define the mapping between user roles and Prisma models
const roleToModel = {
    Student: prisma.student,   // Prisma model for students
    College: prisma.college,   // Prisma model for colleges
    Examiner: prisma.examiner, // Prisma model for examiners
    // Add other roles as needed
};

// Export the lookup table
export default roleToModel;
