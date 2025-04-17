import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
export function authmiddleware(req:Request,res:Response,next:NextFunction){
    const token=req.headers.authorization??"";
    if(token){
        const decoded=jwt.verify(token,JWT_SECRET);
        
        if(decoded){
            // @ts-ignore TODO: fix this
            req.userId=decoded.userId;
            next();
        } 
        else{
            res.status(401).json({message:"Invalid token"});
        }
    }




}