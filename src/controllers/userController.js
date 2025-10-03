import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken

    console.log(userId);

    await user.save({ validateBeforeSave: false })


    return { accessToken, refreshToken }




  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });


  }
  console.log("user exists");
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log(newUser);


  if (!newUser) {
    return res.status(500).json({ message: "User registration failed" });
  }

  // 5. Send success response
  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // ✅ Find user by email (case insensitive)
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  // ✅ Check password
  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new ApiError(402, "Your password is incorrect");
  }

  // ✅ Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  // ✅ Get user info without sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  console.log("Logged in user:", loggedInUser);

  // ✅ Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // ✅ Send response with cookies and JSON
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});


const logout = asyncHandler(async (req, res) => {
  const {refreshToken} = req.cookies;
  if(!refreshToken){
    throw new ApiError(400,"Refresh token is required")
  }
  const user = await User.findOne({ refreshToken });
  if(!user){
    throw new ApiError(400,"Invalid refresh token")
  }
  user.refreshToken = null;
   await user.save({ validateBeforeSave: false });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200,null,"User logged out successfully"))
})


const profile = asyncHandler(async (req, res) => {
  const userId = req.user._id; // user must be set in auth middleware

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});


 



export {
  registerUser,
  Login,
  logout,
  profile,
  generateAccessAndRefereshTokens,
  
 
};
