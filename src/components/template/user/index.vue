<template>

  <div class="dd-user" @click="$emit('click')">
    <Face :src="src" :size="size" :borderRadius="borderRadius"></Face>
    <div class="user-info">
      <span
        :style="{color:color||'#333',maxWidth:'calc(100% - size * 2.1)','fontSize':(fontSize/100 || 0.24)+'rem'}"
        :class="nameClass"
        v-html="name"></span>
      <p v-if="info" :style="{color:infoColor||'#333'}" v-html="info"></p>
    </div>

  </div>

</template>
<script>

  import Face from "@/components/template/face";


  export default {
    components: {Face},
    props: ['size', 'src', 'name', 'color', 'borderRadius', 'info', 'fontSize', 'infoColor','nameClass']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-user {
    display: flex;
    align-items: center;

    .user-info {
      margin-left: 20px;

      p {
        margin-top: 20px;
      }
    }
  }

</style>
