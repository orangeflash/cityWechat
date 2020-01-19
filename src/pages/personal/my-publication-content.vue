<template>
  <div id="myPublicationContent">
    <van-tabs sticky @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab :title="label" v-for="(label,key) in labelArr" :key="key">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <section class="l-list" v-for="item in dataList" :key="item.postId">

            <basic-note-item :postData="item" :showOperation="true"></basic-note-item>

            <!--<list-note-item-->
            <!--@refresh="onRefresh"-->
            <!--:hide-expansion-bar="key===3"-->
            <!--@showToppingOption="showToppingOptionHandle"-->
            <!--@showMoreFeature="showMoreFeatureHandle"-->
            <!--:postData="item" :mark='1'/>-->
          </section>
        </scroller>
        <not-data v-else/>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";
  import BasicNoteItem from "../../components/post/note-item/basic-note-item";

  const defaultPage = () => ({pageSize: 10, pageNum: 1});

  export default {
    name: "MyPublication",
    components: {BasicNoteItem},
    data() {
      const pageOption = defaultPage();
      return {
        showTopOption: false,
        PlaceholderImg,
        active: 0,
        targetPostId: null,
        ...pageOption,
        dataList: [],
        labelArr: ["全部", "显示中", "待审核", "已失效"],
        isRedBag: '',
        isEnd: '',
        toppingOptions: [],      //置顶选项
        postId: null,           //置顶帖子的id
        redEnvelopesConfig: {},   // 红包配置
        page: 1
      }
    },
    methods: {
      ...mapActions("post", [
        "getMyPostListByParams",
        "likePostAction",
        "cancelPostAction",
        "getToppingOptions",
        "PayPostRefreshAction",
        "deletePostAction"]),
      ...mapActions("publication", ["createToppingOrder", "payToppingAction", "getPublicationPrice", "getRedEnvelopesConfig"]),

      // 刷新的函数
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.getMyPostListByParams({
          page: this.page,
          size: this.pageSize,
          status: this.activeStatus,
          userId: this.user.id
        });
        done && done();
      },
      async onInfinite(done) {
        if (this.pageNum === 0) return done();
        this.pageNum++;
        const list = await this.getMyPostListByParams({
          page: this.pageNum,
          size: this.pageSize,
          status: this.activeStatus,
          userId: this.user.id
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        done(!list.length)
      },
      changeTab(active) {
        this.page = 1;
        this.pageNum = 1;
        this.onRefresh();
      }
    },
    computed: {
      // ...mapState("post", {
      //   toppingOptions: state => state.toppingOptions
      // }),
      ...mapState({
        user: state => state.user
      }),
      activeStatus() {
        const statusArr = ["all", "display", "waitAudit", "overdue"];
        return statusArr[this.active]
      },
    },
    mixins: [utilMixins],
    async created() {
      // 获取红包的配置参数
      let config = await this.getRedEnvelopesConfig();
      if (config) this.redEnvelopesConfig = config;
      this.onRefresh();
      document.documentElement.scrollTop = 0;
    }
  }
</script>
<style>
  #MyPublication .van-tab__pane {
    min-height: calc(100vh - 80px);
    position: relative;
  }
</style>
<style lang="scss" scoped>
  @import "../../assets/common";

  #myPublicationContent {
    .l-list {
      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 16px;
        background: #F4F4F4;
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
        margin-top: 35px;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
</style>
