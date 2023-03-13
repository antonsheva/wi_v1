<template>
        <div class="card shadow-sm container">
            <img :src="product.prod_img"/>
            <div class="card-body">
                <h3>{{product.title}}</h3>
                <p class="card-text">{{product.description}}</p>
            </div>
        </div>
</template>

<script>

    export default {
        name: "ProductPage",



    }
</script>

<style scoped>
    .card img{
        max-width: 100%;
        border-radius: 10px;
    }
</style>