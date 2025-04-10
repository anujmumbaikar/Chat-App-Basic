import express from 'express';
import { Router } from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { getUsersForSidebar,getMessages,sendMessage } from '../controllers/message.controller.js';
const router = Router();
router.route("/chat-users").get(verifyToken,getUsersForSidebar);
router.route("/:userId/messages").get(verifyToken,getMessages);
router.route("/:userId/send-message").post(verifyToken,upload.fields([{name:'image',maxCount:10}]),sendMessage);


export {router as messageRouter}