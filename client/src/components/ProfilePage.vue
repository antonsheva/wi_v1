<template>
  <div class="container mt-4 mb-4 p-3 d-flex justify-content-center">
    <div class="p-4">
      <div class=" image d-flex flex-column justify-content-center align-items-center">
<!--        <button class="btn btn-secondary">-->
<!--          <img src="https://i.imgur.com/wvxPV9S.png" height="100" width="100" />-->
<!--        </button>-->


        <div class="container">
          <div class="btn btn-secondary">
            <label>

              <img class="avatar" v-bind:src="mStore.smallImg"/>

              <input class="my-fl" type="file" id="file" ref="file"
                     accept=".jpg, .jpeg, .bmp, .ico, .png"
                     v-on:change="uploadFile"/>
            </label>
          </div>
        </div>


        <span class="name mt-3">Eleanor Pena</span>
        <span class="idd">@eleanorpena</span>
        <div class="d-flex flex-row justify-content-center align-items-center gap-2">
          <span class="idd1">Oxc4c16a645_b21a</span>
          <span><i class="fa fa-copy"></i></span>
        </div>
        <div class="d-flex flex-row justify-content-center align-items-center mt-3">
          <span class="number">1069 <span class="follow">Followers</span></span>
        </div>
        <div class=" d-flex mt-2">
          <button class="btn1 btn-dark">Edit Profile</button>
        </div>
        <div class="text mt-3">
          <span>Eleanor Pena is a creator of minimalistic x bold graphics and digital artwork.<br><br> Artist/ Creative Director by Day #NFT minting@ with FND night. </span>
        </div>

        <div class=" px-2 rounded mt-4 date ">
          <span class="join" style="display: inline-block">Joined May,2021</span>
        </div>
      </div>
      <span class="d-flex justify-content-end"
        @click="mStore.signOut">Exit</span>

    </div>
  </div>
</template>

<script>

import {userStore} from "@/stores/userStore";
import {fileStore} from "@/stores/FileStore";
import { ref } from 'vue'
export default {
  name: "ProfilePage",
  setup(){
    const file = ref(null);
    const mStore = userStore();
    const fStore = fileStore();
    const uploadFile = () => {
      console.log('---fileData ---- ')
      console.log(file.value.files);
      fStore.uploadFile(file.value.files[0]);
    }
    return{
      mStore,
      uploadFile,
      file,
      fileStore
    }
  }
}
</script>

<style scoped>
  .my-fl{
    visibility:hidden;
  }
  .avatar{
    height: 100px;
  }
</style>