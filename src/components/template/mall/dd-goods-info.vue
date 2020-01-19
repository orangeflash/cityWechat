<template>

  <div class="goods" v-if="storeInfo.storeName">
    <div class="goods_up">
      <user
        size="24"
        borderRadius="24"
        :src="getSingleImg(storeInfo.storeLogo[0].url)"
        :name="storeInfo.storeName"
      >
      </user>
      <div class="goods_list" style="margin-top: 10px;">
        <div class="goods_list_single"
             v-for="(item,key) in storeInfo.goods"
             :key="key"
        >
          <div class="goods_cover">
            <img-wrapper :src="item.img"></img-wrapper>
          </div>
          <div class="goods_info">
            <div class="goods_info_title">{{item.name}}</div>
            <div class="goods_info_spec"><span>{{item.data}}</span></div>
            <div class="goods_info_attr">
              <span>￥{{item.money}}</span>
              <em>x{{item.num}}</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>

  import User from '@/components/template/user';
  import {utilMixins} from "@/plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {User},
    props: ['storeInfo'],
    data() {
      return {}
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .goods {
    margin: 30px;
    background: #fff;
    border-radius: 20px;
    padding: 30px;

    &_list {
      &_single {
        display: flex;

        .goods_cover {
          width: 196px;
          height: 196px;
          overflow: hidden;
        }

        .goods_info {
          width: calc(100% - 226px);
          margin-left: 30px;

          &_title {
            font-size: 26px;
            height: 70px;
            line-height: 36px;
            overflow: hidden;
          }

          &_spec {

            margin: 20px 0;

            span {
              background: #eee;
              color: #999;
              padding: 8px 10px 4px;
              border-radius: 4px;
              display: inline-block;
            }
          }

          &_attr {
            display: flex;
            justify-content: space-between;
            font-size: 28px;

            span {
              color: $themeColor;
            }

            em {
              color: #999;
            }
          }
        }
      }

    }
  }

</style>
