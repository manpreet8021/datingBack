import { verifyToken } from "../config/jwtTojen.js";
import asyncHandler from "./asyncHandler.js";
import { getUser } from "../model/userModel.js";

const protect = asyncHandler(async(req, res, next) => {
    let token = '';
    console.log(req)
    token = verifyToken(req.headers.authorization)
    if(token) {
        const user = await getUser(token.id);
        if(user) {
            req.user = user
            next();
        } else {
            res.status(401);
            throw new Error("Unauthorized")
        }
    } else {
        res.status(401);
        throw new Error("Token is not valid please login again")
    }
})

export {protect}