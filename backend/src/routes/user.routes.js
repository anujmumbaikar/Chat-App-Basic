import express from 'express';
import { Router } from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import { registerUser,loginUser,logoutUser } from '../controllers/user.controller';
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

