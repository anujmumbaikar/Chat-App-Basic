import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import { Message } from '../models/message.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { getRecieverSocketId ,io} from '../app.js'

const getUsersForSidebar = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password -__v -createdAt -updatedAt").sort({updatedAt:-1});
    return res.status(200).json(new ApiResponse(200,filteredUsers,"Users fetched successfully"));
})
const getMessages = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
        $or:[
            {sender:loggedInUserId,receiver:userId},
            {sender:userId,receiver:loggedInUserId}
        ]
    })
    return res.status(200).json(new ApiResponse(200,messages,"Messages fetched successfully"));

})
const sendMessage = asyncHandler(async (req, res) => {
    const {text,image} = req.body;
    const {userId} = req.params;
    const loggedInUserId = req.user._id;
    const sendContent = {};
    if (req.files && req.files.images && req.files.images.length > 0) {
        const uploadedImages = [];
        for (const file of req.files.images) {
            const imageUrl = await uploadOnCloudinary(file.path);
            if (!imageUrl) {
                throw new ApiError(400, 'One or more images failed to upload');
            }
            uploadedImages.push(imageUrl.url);
        }
        sendContent.images = uploadedImages;
    }    
    if(text){
        sendContent.text = text;
    }
    sendContent.sender = loggedInUserId;
    sendContent.receiver = userId;
    const message = await Message.create(sendContent);
    if(!message){
        throw new ApiError(400,'Message not sent');
    }
    const recieverSocketId = getRecieverSocketId(userId);
    if(recieverSocketId){
        io.to(recieverSocketId).emit("message",message)
    }

    
    return res.status(200).json(new ApiResponse(200,message,"Message sent successfully"));
})
export {getUsersForSidebar,getMessages,sendMessage}