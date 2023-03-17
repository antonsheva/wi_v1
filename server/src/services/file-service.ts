import {unlink} from "node:fs";
const sharp = require('sharp')
let fileData:any;
class FileService{
      async saveImg(mPath:string, file:any){
        fileData = file;
        try{
            console.log('--1---')
            sharp(fileData.path)
                .jpeg({ quality: 80 })
                .toFile(`${mPath}/big/${ fileData.filename }.jpg`)
                .then(()=>{
                    console.log('--2---')
                    this.saveSmallFile(mPath)
                })
        }catch (e){
            console.log(e)
        }
    }
    async saveSmallFile(path:string){
        try{
            console.log('--3---')
            sharp(fileData.path)
                .resize(240,240)
                .jpeg({ quality: 50 })
                .toFile(`${path}/small/${ fileData.filename }.jpg`)
                .then(()=>{
                    console.log('--4---')
                    this.removeTempFile()
                    console.log('--4-1---')
                })
        }catch (e){
            console.log('--5---')
            console.log(e)
        }
    }
    async removeTempFile(){
        console.log('--6---')
        try{
            await  unlink(fileData.path, (err)=>{
                if(err){
                    console.log('error remove file 1')
                    console.log(err)
                }else{
                    console.log('file removed')
                }
            });
        }catch (e){
            console.log('error remove file 2')
            console.log(e)
        }

    }
}
module.exports = new FileService();