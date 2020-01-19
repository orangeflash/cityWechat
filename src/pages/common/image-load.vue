<template>
    <img class="onload-image"  :src="src" :onload="load(this)" />
</template>

<script>

  export default {
    name: "onloadImage",
    props: ["src"],
    data(){
      return{
}
    },
    methods:{
      load(item){
      }
    }
  }


</script>
