<template>
  <div id="ClassPage">
    <scroller
      v-if="store.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite"
      class="scrollermt"
    >
      <list-item :store="store" :type="0"/>
    </scroller>
    <not-data v-else notShowTips="true"></not-data>
    <!-- <section class="c-empty" v-else>
        <div class="c-empty__wrap">
            <img :src="PlaceholderImg" alt class="c-empty__img">
            <h3 class="c-empty__title">暂无相关内容</h3>
        </div>
    </section> -->
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import _ from "lodash";
  import ListItem from "../../components/yellow-page/list-item";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import {hideLoading, showDialog, showLoading} from "../../util";

  const defaultPage = () => ({pageSize: 10, pageNum: 0});

  export default {
    name: "ClassfyPage",
    components: {
      ListItem
    },
    data() {
      return {
        store: [],
        pageNum: 0,
        PlaceholderImg
      };
    },
    methods: {
      ...mapActions("YellowPage", ["getYellowList"]),
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.store = [];
        showLoading("加载中...");
        let storeList = await this.getYellowList({
          sort: "hot",
          page: 1,
          size: 10,
          typeId: this.$route.query.id
        });
        storeList.forEach(item => {
          item.tel = this.hideTelNumber(item.tel)
        })
        this.store = storeList;
        this.num = this.store.length;
        hideLoading();
        this.pageNum++;
        done && done();
      },
      async onInfinite(done) {
        console.log("上拉加载");
        const length = await (this.store.length == this.num && this.store.length > 10);
        if (length) {
          this.pageNum++;
          showLoading("加载中...");
          const storeList = await this.getYellowList({
            sort: "hot",
            page: 1,
            size: 10,
            typeId: this.$route.query.id
          });

          storeList.forEach(item => {
            item.tel = this.hideTelNumber(item.tel)
          })

          hideLoading();
          if (storeList.length > 0) {
            this.num += storeList.length;
            this.store = this.store.concat(storeList);
          } else {
            this.pageNum--;
          }
          this.hasMore = !!storeList.length;

        }
        done && done(!this.hasMore);
      }
    },
    async created() {
      console.log("执行了");
      this.onRefresh();
    },
    computed: {}
  };
</script>
<style scoped lang="scss">
  @import "../../assets/common";

  #ClassPage {
    position: fixed;
    height: 100%;
    width: 100%;
  }

  .scrollermt {
    height: 100%;
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
</style>
