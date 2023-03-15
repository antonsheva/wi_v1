import * as path from "path";
import { unlink } from 'node:fs';
const tokenService = require('../services/token-service')
import {NextFunction, Request, Response} from "express";
const sharp = require('sharp')
const def = require('../define')
import ApiError from '../exceptions/api-error'

let fileData:any;
interface MulterRequest extends Request {
    file: any;
}
class FileController{
    async uploadSingleFile(req:Request, res:Response,next:NextFunction ){
        //  = req.file;
        fileData = (req as MulterRequest).file;
        console.log('---- fileData ----')
        console.log(fileData)
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
        const refreshToken1 = null;
        if(!refreshToken1)throw ApiError.AuthorisationError();
        const userData = tokenService.validateRefreshToken(refreshToken);
        if(!userData)throw ApiError.AuthorisationError();

        await FileController.saveBigFile(mPath)


            .then(()=>{ FileController.editUserAvatar(refreshToken)})

        if (fileData)res.status(200).json({'message': 'file was upload'});
        else res.status(204).json({'message': 'error upload file'});
    }

    private static editUserAvatar(refreshToken:string){
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log('=-=-=-=-=-=-=-=')
        console.log(userData);
        console.log('=-=-=-=-=-=-=-=')

    }
    private static async saveBigFile(mPath:string){
        try{

            sharp(fileData.path)
                .jpeg({ quality: 80 })
                .toFile(`${mPath}/big/${ fileData.filename }.jpg`)
                .then(()=>{ FileController.saveSmallFile(mPath) })
        }catch (e){
            console.log(e)
        }
    }
    private static async saveSmallFile(path:string){
        try{
            sharp(fileData.path)
                .resize(240,240)
                .jpeg({ quality: 50 })
                .toFile(`${path}/small/${ fileData.filename }.jpg`)
                .then(()=>{ FileController.removeTempFile() })
        }catch (e){
            console.log(e)
        }
    }
    private static async removeTempFile(){
        unlink(fileData.path, (err)=>{
            if (err){
                console.log('error remove file')
                console.log(err)
            }else console.log('remove file')
        });
    }
}

module.exports = new FileController();