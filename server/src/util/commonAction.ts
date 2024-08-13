import prisma from "../db/database.Postgres.js";
import AsyncHandler from "./ayscHandler.js";
import { ApiError } from "./apiError.js";
import { ApiResponse } from "./apiResponse.js";

const getExam=()