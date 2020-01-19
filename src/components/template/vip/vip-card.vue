<template>
  <div id="VipCard">
    <div class="vip-bg"></div>
    <div class="vip-con">
      <div class="vip-card">
        <div class="bg-img">
          <img-wrapper :src="vipImg"></img-wrapper>
          <div v-if="user" class="vip-text">
            <div class="flex-x-end level">
              <span>{{user.vipTypeName||'普通用户'}}</span>
            </div>
            <div class="user flex-row">
              <div class="tx">
                <img-wrapper :src="user.portrait||PlaceholderAvatar"></img-wrapper>
              </div>
              <div class="flex-y-ad col-f">
                <div class="fon-xl">{{user.userName||'神秘人'}}</div>
                <div class="fon-xs">{{user.vipTypeName&&`到期时间:${formatDateByTimeStamp(user.vipEndTime,"YYYY-MM-DD")}`||`您还没加入${platform.name}专属会员`}}</div>
              </div>
            </div>
            <div v-if="!hideBtn" class="flex-x-end open" @click="openMethod">
              <span class="btn">{{user.isVip?'立即续费':'立即开通'}}</span>
            </div>
            <!--<div class="flex-x-end number fon-lg" :style="{marginTop:hideBtn&&'80px'}">NO. 0011 4422 5544 5566</div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapMutations, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import vipImg from "../../../assets/img/auxiliary/vip/vipbg.png"
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";

  export default {
    name: "VipCard",
    props: ['hideBtn'],
    data() {
      return {
        vipImg,
        PlaceholderAvatar,
      }
    },
    methods: {
      async openMethod(){
        const bool=await this.checkBindTel({callBack: true})
        if(!bool) return
        this.goPointPage({path:'/auxiliary/vip/enterVip'})
      },
    },
    mixins: [utilMixins],
    computed: {
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #VipCard {
    font-size: $font-size-base;
    background: #fff;
    .vip-bg {
      /*position: fixed;*/
      position: relative;
      z-index: 1;
      width: 120%;
      margin-left: -10%;
      border-bottom-left-radius: 70%;
      border-bottom-right-radius: 70%;
      overflow: hidden;
      height: 280px;
      background: #000;
    }

    .vip-con {
      margin-top: -280px;
      position: relative;
      z-index: 9;
      padding-top: 40px;
    }

    .vip-card {
      padding: 20px 30px;
      box-sizing: border-box;
      height: 414px;
      overflow: hidden;

      .bg-img {
        box-sizing: border-box;
        @include widhei;
        overflow: hidden;
        position: relative;

        img {
          @include widhei;
        }

        .vip-text {
          overflow: hidden;
          color: #8F6F39;
          position: absolute;
          top: 0;
          @include widhei;
          display: flex;
          flex-direction: column;

          .level {
            span {
              border-top-right-radius: 20px;
              border-bottom-left-radius: 20px;
              padding: 10px 20px;
              background: linear-gradient(-45deg, #FFF0DC, #F6D9B8);
            }
          }

          .user {
            padding: 0 30px;

            .tx {
              border-radius: 50%;
              width: 110px;
              height: 110px;
              margin-right: 20px;
            }
          }

          .open {
            margin: 50px 0;

            .btn {
              padding: 20px 30px;
              border-radius: 20px;
              border: 1.1px solid #8F6F39;
              margin-right: 30px;
            }
          }

          .number {
            font-weight: 500;
            margin: 0 30px 20px 0;
          }
        }
      }
    }
  }
</style>
