import asyncHandler from "./asyncHandler.js";
//import {getUserBySessionToken} from "../models/userModel.js";

const adminProtect = asyncHandler(async(req, res, next) => {
    // let token = '';
    // token = req.cookies['PEPRELIER-AUTH'];

    // if(token) {
    //     const user = await getUserBySessionToken(token);
    //     if(user && user.isAdmin) {
    //         req.user = user;
    //         next();
    //     } else {
    //         res.status(401);
    //         res.clearCookie('PEPRELIER-AUTH');
    //         throw new Error("Unauthorized")
    //     }
    // } else {
    //     res.status(401);
    //     throw new Error("Token is not valid please login again")
    // }
}) 

const protect = asyncHandler(async(req, res, next) => {
    // let token = '';
    // token = req.cookies['PEPRELIER-AUTH'];

    // if(token) {
    //     const user = await getUserBySessionToken(token);
    //     if(user) {
    //         req.user = user
    //         next();
    //     } else {
    //         res.status(401);
    //         res.clearCookie('PEPRELIER-AUTH');
    //         throw new Error("Unauthorized")
    //     }
    // } else {
    //     res.status(401);
    //     throw new Error("Token is not valid please login again")
    // }
})

export {protect, adminProtect}