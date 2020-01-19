<template>
  <div id="notice" :style="color&&{backgroundColor:color}">
    <aside class="symbol">
      <img :src="icon" v-if="icon" class="symbol__img">
      <em v-else-if="label" class="symbol__label">{{label}}</em>
      <i v-else class="iconfont icon-xiaolaba symbol__icon"></i>
    </aside>
    <van-swipe
      class="seamless-warp"
      v-if="dataList.length"
      :autoplay="3000"
      :show-indicators="false"
      vertical
    >
      <van-swipe-item v-for="(i,key) in dataList" :key="key">
        <h1 class="notice-title" @click="noticeInfo(i)">{{i.name||'暂无信息'}}</h1>
      </van-swipe-item>
    </van-swipe>
    <div v-else class="seamless-warp"></div>
    <button
      v-if="featureLabel"
      class="feature-btn"
      @click.stop="$emit('featureClick')"
    >{{featureLabel}}
    </button>
    <van-popup style="z-index:40000000" v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="body"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">我已知晓</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import VueSeamlessScroll from "../../components/basic/VueSeamlessScroll";
  import _ from "lodash";

  export default {
    name: "notice",
    props: ["notice", "icon", "color", "label", "featureLabel", "direction", 'suffix'],
    data() {
      return {
        show: false,
        body: ''
      };
    },
    components: {
      VueSeamlessScroll
    },
    methods: {
      noticeInfo(e) {
        console.log(e);
        switch (e.label) {
          case "公告":
            console.log("点击了公告");
            this.body = e.name;
            this.show = true
            break;
          case "入驻":
            console.log("这里需要跳转链接");
            this.$router.push({
              path: "/yellowPage/yellowInfo",
              query: {id: e.id}
            });
            break;
        }
      }
    },
    computed: {
      dataList() {
        // console.log('传递过来的值为',this.notice)
        this.notice.announce && this.notice.announce.map(function (item) {
          item.label = "公告";
          item.name = item.title;
        });
        const self = this;
        this.notice.yellow && this.notice.yellow.map(function (item) {
          item.label = "入驻";
          item.name =
            (item.name.length >= 8
              ? item.name.slice(0, 8) + "..."
              : item.name) + "入驻了"+ (self.suffix || "便民黄页");
        });
        const noticeList = [...this.notice.announce || [], ...this.notice.yellow || []];
        return noticeList.lenth >= 10
          ? noticeList.slice(0, 10)
          : noticeList;
        console.log("传递过来的值为", this.notice.yellow);
        // return _.map(this.notice, ({ content, title }) => title) || [];
      },
      optionLeft() {
        return {
          direction: this.direction || 1,
          step: 0.1,
          // autoPlay: false,
          limitMoveNum: this.dataList.length
        };
      }
    },
    watch: {},
    created() {
    }
  };
</script>
<style lang="scss">
  @import "../../assets/common";

  #notice .van-swipe-item {
    @include alignCenter;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #notice {
    height: 76px;
    line-height: 60px;
    @include alignCenter;
    display: flex;
    align-content: center;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;
    border-radius: 35px;
    background-color: #fff;
    margin: 1px 0;

    .seamless-warp {
      height: 100%;
      flex: 1;
    }

    .symbol {
      font-size: 0;
      // line-height: 76px;
      @include alignCenter;
      position: relative;

      &:after {
        content: "";
        display: inline-block;
        height: 50%;
        //  line-height: 76px;
        @include positionAbsolute(50%, -23px, 0, null);
        transform: translateY(-50%);
        width: 1px;
        background-color: #f4f4f4;
      }

      &__img {
        height: 100%;
      }

      &__label {
        color: $themeColor;
        font-size: 30px;
        font-weight: 900;
      }

      &__icon {
        color: #eb6262;
        font-size: 35px;
      }
    }

    .notice-title {
      font-size: 28px;
      color: #767676;
      width: 100%;
      padding-left: 52px;
      box-sizing: border-box;
      @include t-overflow;
    }

    .feature-btn {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      color: $themeColor;
      font-size: 30px;
      font-weight: 900;
      background-color: transparent;
      border-radius: 12px;
    }

  }

  .popupPact {
    width: 100%;
    border-radius: 8px;
    height: 100%;
    // top:0;
    // padding-bottom:250px;
    background-color: #f9f9f9;
  }

  .pactBody {
    line-height: 40px;
    margin-top: 20px;
    overflow-y: scroll;
    min-height: 90%;
    padding: 0 30px;
    font-size: 30px;
    height: calc(100vh - 150px);
  }

  // .doc {
  //     color: $themeColor;
  // }

  .cancel {
    width: 100%;
    height: 100px;
    text-align: center;
    color: #fff;
    position: absolute;
    bottom: 150px;
    background-color: #fff;

    .cancel-text {
      display: inline-block;
      text-align: center;
      height: 60px;
      line-height: 60px;
      padding: 5px 0px;
      width: 80%;
      font-size: 28px;
      background-color: $themeColor;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, 50%);
    }
  }

</style>
