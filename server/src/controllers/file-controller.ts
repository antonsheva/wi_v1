import ApiError from '../exceptions/api-error'
const tokenService = require('../services/token-service')
import {NextFunction, Request, Response} from "express";
const def = require('../define')
const userService = require('../services/user-service')
const fileService = require('../services/file-service')

let fileData:any;
interface MulterRequest extends Request {
    file: any;
}
class FileController{
    async uploadSingleFile(req:Request, res:Response,next:NextFunction ){
        try{
            fileData = (req as MulterRequest).file;
            console.log('---- fileData ----')
            console.log(fileData.originalname)
            let mPath = '';
            switch(req.body.fileType){
                case def.FILE_TYPE_AVATAR:
                    console.log('--- FILE_TYPE_AVATAR ---')
                    mPath = `avatars`
                    break;
                case def.FILE_TYPE_PROD_IMG:
                    console.log('--- FILE_TYPE_AVATAR ---')
                    mPath = `prod_img`
                    break;
            }
            const {refreshToken} = req.cookies;
            const userData = tokenService.validateRefreshToken(refreshToken);
            if(!userData)return next(ApiError.UnauthorisedError());



            let err = false;
            let newImg = 'images/tmp_avatars/profile_man.jpg';
            if(await fileService.saveBigImg(mPath, fileData)){
                if(!await fileService.saveSmallImg(mPath, fileData)){
                    err = true;
                    await fileService.removeFile(`${mPath}/big/${ fileData.filename }.jpg`);
                }
            }
            await fileService.removeFile(fileData.path)
            if (!err){
               newImg = await userService.updateAvatar(userData.id, fileData.filename);
               newImg = process.env.API_URL+newImg;
            }
            else{
                console.log('stage error')
                return next(ApiError.SaveFileError());
            }


            if (fileData)res.status(200).json({'message': 'file was upload', 'new_mg':newImg});
            else res.status(204).json({'message': 'error upload file'});
        }catch (e){
            next(e)
        }
    }






}

module.exports = new FileController();