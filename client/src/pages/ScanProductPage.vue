<template>
    <div>
      <div class="container">
        <div class="btn btn-secondary">
          <label>

            <img class="avatar" src="https://i.imgur.com/wvxPV9S.png"/>

            <input class="my-fl" type="file" id="file" ref="file"
                   accept=".jpg, .jpeg, .bmp, .ico, .png"
                   v-on:change="uploadFile"/>
          </label>
        </div>
      </div>
    </div>

</template>

<script>
    import axios from "axios";

    export default {
        name: "ScanProductPage",

    }

</script>

<style scoped>

</style>