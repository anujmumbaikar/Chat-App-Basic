import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        if(!user){
            throw new ApiError(400,'User not found');
        }
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,'Error generating tokens');
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const {email,password,fullName} = req.body;
    if(!email || !password || !fullName){
        throw new ApiError(400,'Please provide all the fields');
    }
    const existUser = await User.findOne(
        {$or:[{email},{fullName}]}
    )
    if(existUser){
        throw new ApiError(400,'User already exists');
    }
    const user = await User.create({
        email,
        password,
        fullName
    })
    if(!user){
        throw new ApiError(400,'User not created');
    }
    return res.status(200).json(new ApiResponse(200,'User created successfully'))
})

const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,'Please provide all the fields');
    }
    const existUser = await User.findOne({email})
    if(!existUser){
        throw new ApiError(400,'User not found');
    }
    const validPassword = await existUser.isPasswordMatched(password);
    if(!validPassword){
        throw new ApiError(400,'Invalid credentials');
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existUser._id);
    const loggedInUser = await User.findById(existUser._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,loggedInUser,"login successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(
        req.user._id,
        {refreshToken:""},
        {new:true}
    )
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,'Logout successfully'))
})
const updateUserProfile = asyncHandler(async (req, res) => {
    const {fullName,password,email} = req.body;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(400,'User not found');
    }
    if(email && email !== user.email){
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            throw new ApiError(400,'Email already exists');
        }
    }
    const  updates = {};
    if (req.file?.path) {
        const avatarLocalFilePath = req.file.path;
        const uploadAvatar = await uploadOnCloudinary(avatarLocalFilePath);
    
        if (!uploadAvatar) {
            throw new ApiError(400, "Unable to upload avatar on Cloudinary!");
        }
        updates.avatar = uploadAvatar.url;
    }
    if(fullName){
        updates.fullName = fullName;
    }
    if(email){
        updates.email = email;
    }
    if(password){
        updates.password = password;
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {$set:updates},
        {new:true}
    ).select("-password -refreshToken")
    if(!updatedUser){
        throw new ApiError(400,'User not updated');
    }
    return res.status(200).json(new ApiResponse(200,updatedUser,'User updated successfully'))
})
const getUserProfileData = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select("-password")
    if(!user){
        throw new ApiError(400,"User not found")
    }
    return res.status(200).json(new ApiResponse(200,user,"User profile data"))
})
export {registerUser,loginUser,logoutUser,updateUserProfile,getUserProfileData}