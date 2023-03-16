import * as path from "path";
import { unlink } from 'node:fs';
const tokenService = require('../services/token-service')
import {NextFunction, Request, Response} from "express";
const sharp = require('sharp')
const def = require('../define')
import ApiError from '../exceptions/api-error'
const fileService = require('../services/file-service')

let fileData:any;
interface MulterRequest extends Request {
    file: any;
}
class FileController{
    async uploadSingleFile(req:Request, res:Response,next:NextFunction ){
        try{

        }catch (e){
            next(e)
        }

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
            if(!userData){
                throw ApiError.AuthorisationError();
            }
            console.log('--- start ---')
        await fileService.saveBigFile(mPath, fileData);




        console.log('=-=-=-=-=-=-=-=')
        console.log(userData);


        if (fileData)res.status(200).json({'message': 'file was upload'});
        else res.status(204).json({'message': 'error upload file'});
    }






}

module.exports = new FileController();