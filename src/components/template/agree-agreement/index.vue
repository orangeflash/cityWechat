<template>

  <div class="dd-agreement">
    <div
      @click="(deliver?$emit('click',{name:'agreement',value:{name,bool:!value}}):$emit('choice'))&&$emit('input',!value)">
      <i class="iconfont mar-r-10"
         :style="{'color':color|| $themeColor }"
         :class="[value || status?'icon-fuxuankuang agree':'icon-fangxing ash']"></i>
      <span class="col-bb lineH-38"><span v-if="before">{{before}}</span>同意并遵守《<em class="t-d-u" @click.stop="showAgreement = !showAgreement"
      >{{name}}</em>》</span>
    </div>
    <agreement @hide="showAgreement = false" v-if="showAgreement" :con="con"></agreement>

  </div>
</template>

<script>
  import Agreement from "@/components/publication/agreement";

  export default {
    props: ['status', 'name', 'con', 'color', 'deliver', 'value','before'],
    data() {
      return {
        showAgreement: false
      }
    },
    components: {Agreement},
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-agreement {
    display: flex;
    padding: 20px 30px;
    align-items: center;
    height: 50px;
    font-size: $font-size-base;

    .iconfont {
      font-size: $font-size-xll;
    }

    div {
      display: flex;

      i {
        margin-top: 6px;
      }

      .ash {
        color: #999;
      }

      .agree {
        color: $themeColor;
      }
    }

  }

</style>
