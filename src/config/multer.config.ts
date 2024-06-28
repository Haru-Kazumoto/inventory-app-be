import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { extname } from 'path';

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: "./uploads/images",
        filename: (req,file,cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),
    limits: { fileSize: 7 * 1024 * 1024 }, //7MB
    fileFilter(req, file, callback) {
        if(!file.mimetype.match(/\/(jpg|jpeg|png)$/)){
            return callback(new Error("Unsupported file type"), false);
        }

        callback(null, true);
    },
}