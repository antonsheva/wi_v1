import {ref, computed, inject} from "vue";
import {defineStore} from "pinia";
import axios from 'axios';


export const fileStore = defineStore('fileStore', ()=>{
    const options = {
       headers:{
           'Content-Type': 'multipart/form-data',
           'Access-Control-Allow-Origin': 'http://localhost:5000'
       }
    }


    function uploadFile(file:Blob) {
        let formData = new FormData();
        formData.append('fileData', file);
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