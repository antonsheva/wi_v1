import * as path from "path";
import { unlink } from 'node:fs';
const sharp = require('sharp')
const def = require('../define')

let fileData:any;

class FileController{
    async uploadSingleFile(req:any, res:any,next:any){
        fileData = req.file;
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
        await FileController.saveBigFile(mPath);
        if (fileData)res.status(200).json({'message': 'file was upload'});
        else res.status(204).json({'message': 'error upload file'});
    }
    private static async saveBigFile(path:string){
        try{
            sharp(fileData.path)
                .jpeg({ quality: 80 })
                .toFile(`${path}/big/${ fileData.filename }.jpg`)
                .then(()=>{
                    FileController.saveSmallFile(path);
                })
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
                .then(()=>{
                    FileController.removeTempFile();
                })
        }catch (e){
            console.log(e)
        }
    }
    private static async removeTempFile(){
        unlink(fileData.path, (err)=>{
            if (err){
                console.log('error remove file')
                console.log(err)
            }
        });
    }
}

module.exports = new FileController();