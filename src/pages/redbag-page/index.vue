<template>
  <div id="RedBag">
    <Header moreName="福利排名" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <scroller
      v-if="dataList.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite"
      class="scrollermt"
    >
      <div class="redbaghd">
        <div class="redbaghd_imgdiv">
          <img-wrapper not-load="true" :src="config.bgImg || bgimg" class="redbaghd_img"/>
        </div>
        <div class="redbaghd_cells">
          <div class="redbaghd_cell" v-for="(item, index) in reabagData" :key="index">
            <div class="redbaghd_celltext">{{item.name}}</div>
            <div class="redbaghd_cellnum">{{item.num||0}}</div>
          </div>
        </div>
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
    </scroller>
    <section class="c-empty" v-else>
      <div class="c-empty__wrap">
        <img :src="PlaceholderImg" alt class="c-empty__img">
        <h3 class="c-empty__title">暂无相关内容</h3>
      </div>
    </section>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams
  } from "../../util";
  import {Toast} from "vant";
  import bgimg from "../../assets/img/redbag/bg.png";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";

  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    name: "RedBag",
    components: {BasicNoteItem},
    data() {
      const pageOption = defaultPage();
      return {
        ...pageOption,
        hasMore: true,
        dataList: [],
        bgimg,
        config: {
          bgImg: null
        },
        PlaceholderImg,
        reabagData: []
      };
    },
    method() {
    },
    methods: {
      ...mapActions("post", [
        "getPostListByParams",
        "getRedRank",
        "likePostAction",
        "cancelPostAction",
        "getToppingOptions",
        "PayPostRefreshAction",
        "deletePostAction"
      ]),
      ...mapActions("publication", [
        "createToppingOrder",
        "payToppingAction",
        "getPublicationPrice",
        "getRedEnvelopesConfig"
      ]),
      //红包数据
      async redbagData() {
        let {data} = await this.getRedRank();
        console.log(data);
        this.reabagData = [
          {name: "总撒福利", num: data.money},
          {name: "总浏览量", num: data.redVisit},
          {name: "提现总额", num: data.cash}
        ];
      },
      // 刷新的函数
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.getPostListByParams({
          page: this.pageNum,
          size: this.pageSize,
          sort: "nearest",
          isRed: "1",
          lat: this.latLng.latitude,
          lng: this.latLng.longitude
        });
        // this.pageNum++;
        done && done();
      },
      async onInfinite(done) {
        if (this.pageNum === 0) return done();
        this.pageNum++;
        const list = await this.getPostListByParams({
          page: this.pageNum,
          size: this.pageSize,
          sort: "nearest",
          isRed: "1",
          lat: this.latLng.latitude,
          lng: this.latLng.longitude
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        done(!list.length);
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      ...mapState({
        user: state => state.user
      })
      // ...mapState("home", {
      //   defaultConfig: state => state.defaultConfig,
      // }),
      //
      // ...mapState({
      //   platform : state => state.platform
      // }),
      // pageConfig() {
      //   //搜索框只允许出现一次
      //   return this.defaultConfig && this.defaultConfig.filter(cmp => cmp.cmpName !== "searchBox")
      // },
      // searchBoxConfig() {
      //   return this.getConfigByCmpName("searchBox") || {}
      // },
      // hasSearchBoxConfig() {
      //   return Object.keys(this.searchBoxConfig).length;
      // },
      // featureActions() {
      //
      //   let arr = [
      //     {
      //       name: `信息ID：${this.postId}`,
      //       className: "action-sheet-topic",
      //     }, {
      //       id: 0,
      //       name: '红包扩散'
      //     }, {
      //       id: 1,
      //       name: '分享扩散'
      //     }, {
      //       id: 2,
      //       name: '编辑'
      //     }, {
      //       id: 3,
      //       name: '结束信息',
      //     },
      //     {
      //       id: 4,
      //       name: '删除',
      //     }
      //   ]
      //   if(this.redEnvelopesConfig.redEnvelopes == 'close'){
      //     arr.splice(1, 1);
      //   }
      //   return arr
      // },
    },

    async created() {
      // 获取红包帖子列表
      this.redbagData();
      this.onRefresh();
      this.getRedEnvelopesConfig().then(result => {
        console.log("红包配置信息", result);
        this.config = result;

        // 配置转发信息
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      })
    }
  };
</script>
<style scoped lang="scss">
  @import "../../assets/common";

  #RedBag {
    /*min-height: calc(100vh - 80px);*/
    position: fixed;
    width: 100%;
    height: calc(100vh - 80px);

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
        background: url(../../assets/img/redbag/white.png) no-repeat;
        background-size: cover;
        height: 0.5rem;
        animation: anim_wave 5s linear infinite;
      }

      .wrap__uc-waves .w2 {
        background: url(../../assets/img/redbag/white.png) no-repeat;
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
