import {ref, computed, inject} from "vue";
import {defineStore} from "pinia";
import axios from 'axios';
import def from '../define'

export const fileStore = defineStore('fileStore', ()=>{
    const options = {
       headers:{
           'Content-Type': 'multipart/form-data',
           'Access-Control-Allow-Origin': 'http://localhost:5000'
       }
    }


    function uploadFile(file:Blob, fileType:number) {
        let formData = new FormData();
        formData.append('fileData', file);
        formData.append('fileType', def.FILE_TYPE_AVATAR);
        axios.post('http://localhost:5000/api/upload',formData, options)//
            .then((response)=>{
                console.log(response.data)
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    return{
        uploadFile
    }
})