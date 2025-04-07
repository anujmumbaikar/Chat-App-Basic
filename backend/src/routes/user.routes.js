import express from 'express';
import { Router } from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import { registerUser,loginUser,logoutUser,updateUserProfile,getUserProfileData,checkAuth } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken,logoutUser);
router.route("/update-profile").put(verifyToken,upload.single('avatar'),updateUserProfile);
router.route("/profile").get(verifyToken,getUserProfileData);
router.route("/check").get(verifyToken,checkAuth);
export {router as userRouter} 