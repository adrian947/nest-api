import { Request } from "express";



export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {


    if (!file) return callback(new Error('File is empty'), false)


    const fileExtension = file.mimetype.split('/')[1]
    const aceptedExtension = ['jpg', 'jpeg']

    if (!aceptedExtension.includes(fileExtension)) {
        return callback(new Error('error extension'), false)
    }


    callback(null, true)

}