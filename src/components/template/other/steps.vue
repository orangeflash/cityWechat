<template>

  <!--步骤条-->

  <div class="dd-steps bg-f pad-30">

    <div class="dd-steps_list flex-center posi-r">
      <div class="line br-b-d posi-a" v-if="steps.length > 1" :class="lineClass"></div>
      <div class="flex-bt w100">
        <div class="steps posi-r" v-for="(item,key) in steps" :key="key">
          <div class="point br-d br-r-c flex-center col-f"
               :class="{'success':key<active}"
               :style="{width:item.width/100+'rem',height:item.height/100+'rem'}"
          ><i class="iconfont" :class="item.icon" v-if="item.icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="steps flex-bt">
      <p class="fon-b mar-t" v-for="(item,key) in steps" :key="key" :class="{'col-t':key<active}">{{item.name ||
        item}}</p>
    </div>
  </div>

</template>


<script>

  export default {
    props: {
      active: {
        type: Number,
        default: 0,
      },
      steps: {
        type: Array,
        default: []
      },
      lineClass: {
        type: String,
      }

    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-steps {
    text-align: center;

    &_list {

      .point {
        background: #fff;
        width: 50px;
        height: 50px;
        margin: 0 auto;
      }

      .success {
        background: $themeColor;
        border: 1px solid $themeColor;
      }
    }

    .line {
      /*margin: 50px auto;*/
      width: calc(100% - 100px);
    }
  }
</style>
