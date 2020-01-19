<template>
  <div id="RedBag">
    <Header></Header>
    <scroller
      :on-refresh="onRefresh"
      :on-infinite="onInfinite"
      class="scrollermt"
    >
      <div class="redbaghd">
        <div class="redbaghd_imgdiv">
          <img-wrapper not-load="true" :src="postConfig.openImg || bgimg" class="redbaghd_img"/>
        </div>
        <!--<div class="redbaghd_cells">-->
        <!--<div class="redbaghd_cell" v-for="(item, index) in reabagData" :key="index">-->
        <!--<div class="redbaghd_celltext">{{item.name}}</div>-->
        <!--<div class="redbaghd_cellnum">{{item.num||0}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--css3实现波纹-->
        <div class="wrap__uc-waves">
          <i class="wave w1"></i>
          <i class="wave w2"></i>
        </div>
      </div>
      <section
        v-if="dataList.length"
        class="l-list"
        v-for="item in dataList"
        :key="item.postId"
      >
        <basic-note-item
          :hideExpansionBar="true"
          :hidecomment="true"
          :showredmoney="true"
          @refresh="onRefresh"
          :postData="item"
        ></basic-note-item>
      </section>
      <not-data v-else></not-data>
    </scroller>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
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
  import bgimg from "../../../assets/img/redbag/bg.png";

  export default {
    name: "RedBag",
    components: {BasicNoteItem},
    data() {
      return {
        bgimg,
        config: {
          bgImg: null
        },
        dataList: [],
        reabagData: [],
        params: {
          page: 1,
          size: 10,
        }
      };
    },
    method() {
    },
    methods: {
      ...mapActions("common", ['getPostConfig']),
      ...mapActions("publication", ["getRedEnvelopesConfig"]),
      ...mapActions("yS", ["rewardList"]),
      //红包数据
      // async redbagData() {
      //   let {data} = await this.getRedRank();
      //   console.log(data);
      //   this.reabagData = [
      //     {name: "总撒福利", num: data.money},
      //     {name: "总浏览量", num: data.redVisit},
      //     {name: "提现总额", num: data.cash}
      //   ];
      // },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh) {
        let result = await this.rewardList(this.params);
        result.forEach(v => {
          v.offerReward = 1
        })
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.params.size;
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      ...mapState("common", {
        postConfig: state => state.postConfig
      }),
    },

    async created() {
      // 获取红包帖子列表
      this.onRefresh();
      // 配置转发信息
      //this.redbagData();
      // this.getRedEnvelopesConfig().then(result => {
      //   console.log("红包配置信息", result);
      //   this.config = result;
      //
      //   // 配置转发信息
      //   updateShareConfig({
      //     title: result.title,
      //     imgUrl: result.shareImg,
      //     desc: result.shareDescription,
      //   })
      // })
      await this.getPostConfig()
      updateShareConfig({
        title: this.postConfig.rewardTitle || '悬赏中心',
        imgUrl: this.postConfig.rewardShareImg,
        desc: this.postConfig.rewardShareDescription || '快来参与悬赏分钱啦',
      })
    }
  };
</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  #RedBag {
    min-height: calc(100vh - 80px);
    position: fixed;
    width: 100%;
    /*height: 100%;*/

    .scrollermt {
      margin-top: 88px;
    }

    background: #fff;

    .redbaghd {
      height: 73vw;
      position: relative;
      color: #fff;

      &_imgdiv {
        position: absolute;
        width: 100%;
        height: 73vw;

        .redbaghd_img {
          @include widhei;
        }
      }

      /*css3波纹*/
      .wrap__uc-waves {
        overflow: hidden;
        height: 1rem;
        width: 100%;
        position: absolute;
        bottom: 0;
      }

      .wrap__uc-waves .wave {
        width: 15rem;
        transform-origin: center bottom;
        position: absolute;
        left: 0;
        bottom: 0;
      }

      .wrap__uc-waves .w1 {
        background: url(../../../assets/img/redbag/white.png) no-repeat;
        background-size: cover;
        height: 0.5rem;
        animation: anim_wave 5s linear infinite;
      }

      .wrap__uc-waves .w2 {
        background: url(../../../assets/img/redbag/white.png) no-repeat;
        opacity: 0.6;
        background-size: cover;
        height: 0.7rem;
        animation: anim_wave 5s linear infinite;
      }

      @keyframes anim_wave {
        0% {
          transform: translateX(0) translateZ(0) scaleY(1);
        }
        50% {
          transform: translateX(-25%) translateZ(0) scaleY(0.55);
        }
        100% {
          transform: translateX(-50%) translateZ(0) scaleY(1);
        }
      }

      &_cells {
        position: absolute;
        bottom: 60px;
        @include flex-center($justify: flex-start);
        @include widhei($height: 100px);
      }

      &_cell {
        @include flex-center($direction: column);
        flex: 1;

        &text {
          font-size: 30px;
        }

        &num {
          font-size: 28px;
          margin-top: 22px;
        }
      }
    }

    .l-list {
      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 16px;
        background: #f4f4f4;
      }
    }

    .c-empty {
      overflow: hidden;

      &__wrap {
        margin-top: 180px;
        @include alignCenter;
        flex-direction: column;
      }

      &__img {
        width: 335px;
        height: 200px;
      }

      &__title {
        margin: 25px 0;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
</style>
