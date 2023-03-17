import {unlink} from "node:fs";
import ApiError from "../exceptions/api-error";
const sharp = require('sharp')

class FileService{



      async saveBigImg(mPath:string, fileData:any){
        return new Promise(resolve=>{

            try{
                console.log('--1---')
                sharp(fileData.path)
                    .jpeg({ quality: 80 })
                    .toFile(`${mPath}/big/${ fileData.filename }.jpg`)
                    .then(()=>{
                        console.log('--2---')

                        resolve(true)
                    })
                    .catch(()=>{
                        console.log('saveImg error')
                        resolve(false)
                    })
            }catch (e){
                console.log(e)
            }
        })

    }
    async saveSmallImg(path:string, fileData:any){
        return new Promise(resolve=>{
            try{
                console.log('--3---')
                sharp(fileData.path)//this.fileData.path
                    .resize(240,240)
                    .jpeg({ quality: 50 })
                    .toFile(`${path}/small/${ fileData.filename }.jpg`)
                    .then(()=>{
                        console.log('--4---')

                        resolve(true)

                    })
                    .catch(()=>{
                        console.log('saveSmallImg error')
                        resolve(false)
                    })
            }catch (e){

                console.log(e)
            }
        })

    }
    async removeFile(path:string){
        return new Promise(resolve=>{
            console.log('--5---')
            try{
                unlink(path, (err)=>{
                    if(err){
                        console.log('error remove file 1')
                        console.log(err)
                        resolve(false);
                    }else{
                        console.log('--6---')
                        resolve(true);
                    }
                });
            }catch (e){
                console.log('error remove file 2')
                console.log(e)
                resolve(false);
            }
        })
    }
}
module.exports = new FileService();