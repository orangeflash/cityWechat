<template>
  <div id="help">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div v-if="helpListInfo.data&&helpListInfo.data.length">
    <!--<header class="help-header">帮助中心</header>-->
    <div class="help-body" >
      <ul class="help-store">
        <li class="help-list" @click="clickHelp(item.content)" v-for="item in helpListInfo.data" :key="item.id">
          <em>{{item.title}}</em>
          <em class="iconfont icon-youjiantou1"></em>
        </li>
      </ul>
    </div>
    </div>
    <EmptyView v-else/>
    <van-popup v-model="isShow" position="bottom" :overlay="false">
      <article class="props-container">
        <p class="props-text" v-html="helpDetails"></p>
        <div class="cancel-btn-container">
          <div class="cancel-btn" @click="peopsRemove" >关闭</div>
        </div>
      </article>
    </van-popup>
  </div>
</template>

<script>
  import {Popup} from 'vant';
  import {mapState, mapActions, mapGetters} from "vuex";
  import EmptyView from "../../components/basic/empty-view";
  import Header from "@/components/header";
  export default {
    components: {EmptyView,Header},
    data() {
      return {
        isShow: false,
        helpDetails: '',
        helpListInfo: [],
      }
    },
    methods: {
      ...mapActions("common", ["getHelp"]),
      // 获取帮助列表
      async getHelpInfo() {
        this.helpListInfo = await this.getHelp();
      },
      clickHelp(content) {
        this.isShow = !this.isShow;
        this.helpDetails = content;
      },
      peopsRemove() {
        this.isShow = !this.isShow;
      },

    },
    created() {
      this.getHelpInfo();
    },
    mounted() {
    },
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common.scss";
  @import '../../assets/theme.scss';

  #help {
    height: 100vh;
    position: relative;
    .help-header {
      padding: 20px 30px;
      font-size: $font-size-xl;
      color: #666;
    }
    .help-body {
      background-color: #fff;
    }
    .help-list {
      color: #666;
      padding: 20px 30px;
      display: flex;
      line-height: 40px;
      font-size: $font-size-lg;
      justify-content: space-between;
      border-top: 1PX solid #eee;
    }
    .props-container {
      background-color: #fff;
      height: 94vh;
      position: relative;
      bottom: 0px;
      padding: 30px 30px 40px 30px;
      line-height: 40px;

      .props-text {
        height: 100%;
        word-wrap: break-word;
        overflow-y: scroll;
        font-size: 28px;
      }
      .cancel-btn-container {
        height: 140px;
        width: 100%;
        padding: 0px 70px;
        box-sizing: border-box;
        position: fixed;
        bottom:0px;
        left: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        .cancel-btn {
          position: absolute;
          bottom: 20px;
          left: 50%;
          text-align: center;
          line-height: 80px;;
          transform: translateX(-50%);
          border-radius: 15px;
          height: 80px;
          width: 90%;
          margin: 0px auto;
          background-color: $themeColor;
          font-size: $font-size-base;
          color: #fff;
        }
      }
    }
  }
</style>
