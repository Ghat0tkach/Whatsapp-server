import { sign } from "../utils/tokenutil.js";

export const generateToken=async(payload,expiresIn,secret)=>{
    let token=await sign(payload,expiresIn,secret);
    return token;
}

