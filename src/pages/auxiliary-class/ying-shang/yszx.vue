<template>
  <div id="Partnerhome">
    <Header :is-fixed="true"></Header>
    <!--<Notice-->
    <!--class="notice"-->
    <!--label="最新收益"-->
    <!--:notice="noticeList"-->
    <!--@featureClick="storeCanEnter&&featureClick()"-->
    <!--/>-->
    <div class="Partnerhomemainbox">
      <van-row>
        <van-col v-for="(item,index) in partnerarr" span="8" :key="index">
          <!--<img-wrapper  not-load="true":src="timg" class="topimg"></img-wrapper>-->
          <div @click="goPointPage({path: `${item.url}`})" class="vancolitem">
            <i class="topimg iconfont" :class="[item.icon]" :style="{color:item.color}"></i>
            <em>{{item.title}}</em>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Notice from "../../../components/business-district/notice";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams
  } from "../../../util";
  import {Toast} from "vant";
  import Popup from '@/components/popup'       // 弹窗
  import timg from "@/assets/img/partner/timg.png";
  import tjjl from "@/assets/img/partner/tjjl.png";
  import sstx from "@/assets/img/partner/sstx.png";
  import jdry from "@/assets/img/partner/jdry.png";
  import srys from "@/assets/img/partner/srys.png";

  export default {
    name: "PartnerHome",
    components: {Notice, Popup},
    data() {
      return {
        timg,
        tjjl,
        sstx,
        jdry,
        srys,
        isShowContactCode: false,
        hhrsj: '',
        noticeList: [],
        partnerarr: [
          {
            title: "悬赏钱包",
            icon: "icon-shourumingxi",
            color: "#F3AC3C",
            url: "/auxiliary/ys/ysye"
          },
          {
            title: "我的粉丝",
            icon: "icon-fensi",
            color: "#FF6666",
            url: "/auxiliary/ys/wdfs"
          },
          {
            title: "我的应赏",
            icon: "icon-wodeqianbao",
            color: "#4BA4FF",
            url: "/auxiliary/ys/wdys"
          },
        ],
      };
    },
    methods: {},
    mixins: [utilMixins],
    computed: {},

    async created() {
    }
  };
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #Partnerhome {
    font-size: $font-size-base;
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    padding-bottom: 130px;

    .headbox {
      position: relative;
      margin-top: 92px;
      height: 300px;
      background: $themeColor;

      &_top {
        position: absolute;
        top: 30px;
        width: 100%;
        font-size: $font-size-base;
        color: #fff;
        text-align: center;

        span {
          font-size: 60px;
        }

        &_jrsr {
          margin-top: 20px;
        }
      }

      &_btm {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 130px;
        color: #fff;

        ul {
          height: 130px;
          @include flex-center($direction: column);

          :nth-child(1) {
            font-size: $font-size-lg;
          }

          :nth-child(2) {
            margin-top: 10px;
            font-size: $font-size-xs;
          }
        }
      }
    }

    .notice {
      border-radius: 0;
    }

    .Partnerhomemainbox {
      margin-top: 112px;
      font-size: $font-size-base;
      background: #fff;

      .topimg {
        font-size: 50px;
      }

      .vancolitem {
        box-sizing: border-box;
        border-right: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        @include flex-center($direction: column);
        height: 160px;

        em {
          margin-top: 20px;
          color: #666;
        }
      }
    }

    .Partnerhomefootbox {
      margin-top: 30px;
      background: #fff;
      padding: 10px 0;

      .topimg {
        font-size: 40px;
      }

      .vancolitem {
        box-sizing: border-box;
        @include flex-center;
        height: 70px;

        &:nth-child(1) {
          border-right: 1px solid #f5f5f5;
        }

        em {
          color: #666;
          margin-left: 20px;
        }
      }
    }
  }
</style>
