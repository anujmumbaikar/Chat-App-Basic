import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import {asyncHandler} from '../middlewares/multer.middleware.js'

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        if(!user){
            throw new ApiError(400,'User not found');
        }
        const refreshToken = user.generateRefreshoken();
        const accessToken = user.generateAccessToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,'Error generating tokens');
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const {email,password,fullname} = req.body;
    if(!email || !password || !fullname){
        throw new ApiError(400,'Please provide all the fields');
    }
    const existUser = await User.findOne(
        {$or:[{email},{fullname}]}
    )
    if(existUser){
        throw new ApiError(400,'User already exists');
    }
    const user = await User.create({
        email,
        password,
        fullname
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
    const validPassword = await User.isPasswordMatched(password);
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

export {registerUser,loginUser,logoutUser}