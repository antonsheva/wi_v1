<template>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 my_list">
        <product-card v-for="product in products"
                      v-bind:key="product.id"
                      :product="product"/>
    </div>
</template>

<script>


    export default {
        name: "ProductList",

    }
</script>

<style scoped>
    .my_list{
        overflow: scroll;
        height: 100%
    }
    .my_list img{
        border-radius: 10px;

    }
</style>