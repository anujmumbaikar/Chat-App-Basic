import mongoose,{Schema} from "mongoose";
import bscrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"",
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bscrypt.genSalt(10);
    this.password = await bscrypt.hash(this.password,salt);
    next();
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bscrypt.compare(enteredPassword,this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshoken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",userSchema);