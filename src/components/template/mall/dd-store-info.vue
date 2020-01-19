<template>
  <!--商家简信-->

  <div class="dd-store-info">
    <dd-layout-div class="flex-bt" :pad="[30,30,0]">
      <div class="flex-y-center">
        <dd-layout-img :src="logo" :width="0.85" :height="0.85" :fillet="0.85"/>
        <div class="mar-l">
          <h3 class="fon-lg lineH-38 mar-b-10">{{name}}</h3>
          <van-rate v-model="star" :size="14" readonly/>
        </div>
      </div>
      <dd-layout-div class="flex-y-center flex-g-0 mar-l">
        <dd-layout-div :pad="[15,25,13]" :mar="[0,25,0,0]" :fillet="26" class="look-all col-t br-t"
                       @click.stop="goPointPage('/auxiliary/mall/storeDetails?id='+id)"
        >全部宝贝
        </dd-layout-div>
        <dd-layout-div :pad="[17,25,14]" :fillet="26"
                       bg="linear-gradient(90deg,rgba(255,48,0,1) 0%,rgba(255,183,113,1) 100%)"
                       class="go-store col-f bg_linear"
                       @click.stop="goPointPage('/auxiliary/mall/storeDetails?id='+id)"
        >进店逛逛
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <div class="dd-store-info_down">
      <span>粉丝数：{{fans||0}}</span>
      <span>全部商品：{{goodsNum || 0}}</span>
      <span>商家评价：{{goodsComment || 0}}</span>

    </div>
  </div>

</template>
<script>

  import DdLayoutImg from "../../layout/dd-layout-img";
  export default {
    components: {DdLayoutImg},
    props: ['logo', 'name', 'id', 'fans', 'goodsNum', 'goodsComment'],
    data() {
      return {
        star: 5
      }
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-store-info {
    background: #fff;
    margin-top: 30px;

    &_up {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;

      &_l {
        display: flex;

        &_logo {
          width: 86px;
          height: 86px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
    }

    &_down {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px;

      span {
        color: #999;
        font-size: 26px;
      }
    }
  }
</style>
