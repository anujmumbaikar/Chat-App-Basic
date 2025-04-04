import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessTokens || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_KEY)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user) {
            throw new ApiError(401, "Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }
})