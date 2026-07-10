import multer from "multer";
import { ResponseError } from "../utils/response-error.util";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage()

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter(_req, file, cb){
        if(
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/webp"
        ){
            return cb(new ResponseError(StatusCodes.NOT_ACCEPTABLE, `File format for ${file.originalname} not accepted`))
        }
        cb(null, true)
    }
})