<template>
  <ul id="follow-shop">
    <li class="follow-shop_single" v-for="(item,index) in data" :key="index">
      <div class="follow-shop_single_log">
        <img-wrapper :src="getStoreLogo(item.storeLogo)"></img-wrapper>
      </div>
      <div class="follow-shop_single_info" @click="goPointPage({path:'/shopDetail',query:{storeId:item.id}})">
        <p class="follow-shop_single_info_name">{{item.storeName?item.storeName:'一个神秘的小店'}}</p>
        <div class="follow-shop_single_info_label">
          <span><em>{{item.typeName?item.typeName:'一个神奇的标签'}}</em></span>
          <span><em>{{item.newName?item.newName:'一个神奇的二级标签'}}</em></span>
        </div>
      </div>
      <div class="follow-shop_single_operation">
        <span class="cancel-follow" @click.stop="$emit('offCollection',{type:'store',id:item.id})">取消收藏</span>
      </div>
    </li>
  </ul>
</template>

<script>
  import {utilMixins} from "../../plugins/util-mixins";

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    mixins: [utilMixins],
    methods: {
      getStoreLogo(item) {
        const imgs = this.getMediaList(item).img;
        return imgs ? imgs[0] : '';
      },
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #follow-shop {
    background: #fff;
    margin-top: 20px;

    .follow-shop_single {
      border-bottom: 1.1px solid #ddd;
      padding: 32px 30px;
      overflow: hidden;
      display: flex;
      @include flex-center($justify: space-between);

      &_log {
        width: 108px;
        height: 108px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 30px;
      }

      &_info {
        width: 420px;

        &_name {
          font-size: 28px;
          margin-bottom: 16px;
        }

        &_label {
          height: 40px;
          overflow: hidden;

          span {
            height: 36px;
            float: left;
            border: 1.1px solid #9CAFC0;
            color: #9CAFC0;
            line-height: 36px;
            margin-right: 10px;
            padding: 0 8px;
            border-radius: 4px;
          }
        }
      }

      &_operation {
        display: flex;
        align-items: center;
        border: 1.1px solid #FF6B01;
        border-radius: 4px;
        height: 50px;
        width: 126px;

        span {
          color: #FF6B01;
          margin: 0 auto;
        }
      }
    }
  }
</style>
