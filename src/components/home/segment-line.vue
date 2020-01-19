<template>
  <div class="segment-line" v-if="+segmentLineStyle==2"
       :style="{height:`${height}px`,backgroundSize:'6px 100%',backgroundImage:`linear-gradient(to right, ${color} 50%, transparent 50%)`,marginTop:`${topMargin}`,opacity:`${opacity/100}`}">
  </div>
  <div class="segment-line" v-else-if="+segmentLineStyle==1"
       :style="{height:`${height}px`,background:`${color}`,marginTop:`${topMargin}`,opacity:`${opacity/100}`}">
  </div>
  <div class="segment-line" v-else-if="+segmentLineStyle==3"
       :style="{height:`${height}px`,backgroundSize:'16px 100%',backgroundImage:`linear-gradient(to right, ${color} 50%, transparent 50%)`,marginTop:`${topMargin}`,opacity:`${opacity/100}`}">
  </div>
</template>

<script>

  export default {
    props:["color","height","maxLimit","minLimit","opacity","segmentLineStyle","topMargin"],
    data(){
      return{

      }
    }
  }

</script>

<style scoped lang="scss">

</style>
