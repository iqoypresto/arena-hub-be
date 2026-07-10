import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary.config";
import { Readable } from "stream";

export class CloudinaryUtil {
    static async uploadImage(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse>{
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                },
                (error, result) => {
                    if(error) return reject(error)

                    resolve(result!)
                }
            )
            Readable.from(file.buffer).pipe(uploadStream)
        })
    }

    static async destroy(publicId: string){
        return cloudinary.uploader.destroy(publicId)
    }
}