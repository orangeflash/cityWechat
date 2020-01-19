<template>

  <div class="dd-category">
    <Header/>

    <dd-tree-select
      class="mar-t-100"
      :fixedTop="true"
      @choice="choiceResult"
      :trees="trees"
    ></dd-tree-select>
    <div class="ps-f list">
      <scroller
        class="pad-b-20"
        v-if="activityList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite">
        <dd-article
          :data="item"
          v-for="(item,key) in activityList"
          :key="key"
          @click="choiceArtivity"
        >
          <template slot="mask">
            <div class="activity-mask">
              <div class="star-num flex-center">
                <i class="iconfont icon-dianzan2 col-t"></i>
                <span class="col-f">{{item.count}}人</span>
              </div>
              <div class="activity-over flex-center"
                   v-if="item.isOver"
              >
                <img :src="isEnd">
              </div>
              <div v-else class="start-time bg-t col-f">{{item.startTime}} 开始</div>
            </div>
          </template>
        </dd-article>
      </scroller>
      <not-data class="pad-t mar-t" v-if="activityList.length == 0 && isRequest"></not-data>
    </div>
  </div>


</template>

<script>
  import DdTreeSelect from '@/components/template/dd-tree-select'
  import DdArticle from '@/components/template/dd-article/two'
  import {mapActions, mapState} from 'vuex';
  import {format, hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import isEnd from "@/assets/status/isend.png";       //已结束


  export default {
    mixins: [utilMixins],
    components: {DdTreeSelect, DdArticle},
    data() {
      return {
        isEnd,
        trees: [
          {
            title: '区域',
            items: []
          },
          {
            title: '分类',
            items: []
          },
          {
            title: '报名中',
            items: [
              {text: '报名中', type: 1},
              {text: '活动未开始', type: 2},
              {text: '活动已结束', type: 3},
            ]
          },
          {
            title: '排序',
            items: [
              {text: '最新', sort: 1},
              {text: '最热', sort: 2},
            ]
          },
        ],
        activityList: [],
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          type: 1,     //报名中，2未开始，3已结束   默认1：以为UI上面没有全部这选项
          typeId: null,    //分类Id
          word: null,       //关键字
          sort: 1,
          zoneId: ""
        },
      }
    },
    methods: {
      ...mapActions(["getCityList"]),
      ...mapActions("activity", ["getActivityList", "getActivityConfig", "getActivityList", "getActivityBtns"]),
      choiceResult(item) {
        item.sort && (this.params.sort = item.sort);
        (item.zoneId || item.zoneId == "") && (this.params.zoneId = item.zoneId);
        (item.typeId || item.zoneId == "") && (this.params.typeId = item.typeId);
        (item.type || item.zoneId == "") && (this.params.type = item.type);

        this.onRefresh();

      },
      /** 活动列表点击 */
      choiceArtivity(data) {
        console.log("activity", data);
        this.goPointPage({
          path: '/auxiliary/activity/details',
          query: {
            activityId: data.id
          }
        })
      },
      /** 获取活动列表 */
      async getActivity(refresh) {
        showLoading();
        let result = await this.getActivityList(this.params);
        this.isRequest = true;
        /** 由于组件的字段已经规划好，所以在拿取数据的时候进行重新定义 */
        const now = new Date().getTime()
        result = result.map(item => {
          return {
            cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
            info: item.name,
            time: this.computedDate(item.createdAt),
            tag: item.typeName,
            price: item.originalPrice,
            startTime: format(item.startTime * 1000),
            isOver: now >= item.endTime * 1000,
            id: item.id,
            count: item.count
          }
        })
        this.activityList = refresh ? result : this.activityList.concat(result);
        hideLoading();
        return result.length >= this.params.size;
      },
      /** 刷新列表 */
      async onRefresh(done) {
        this.params.page = 1;
        await this.getActivity(true);
        done && done();
      },
      /** 加载更多 */ async onInfinite(done) {
        this.params.page++;
        const bool = await this.getActivity();
        done && done(!bool);
      },
      /** 获取树信息列表 */
      getTreeList() {
        this.getCityList().then(({city, zone}) => {
            const result = [{
              text: city.cityName,
              zoneId: "",
            }].concat(zone.map(item => {
              return {
                text: item.name,
                zoneId: item.id
              }
            }))
            this.$set(this.trees[0], 'items', result);
          }
        )
        this.getActivityBtns().then(result => {
          console.log("getActivityBtns", result);

          result = [{
            text: '全部',
            typeId: "",
          }].concat(result.map(item => {
            if (+item.id == +this.params.typeId) {
              this.$set(this.trees[1], 'title', item.name);
            }
            return {
              text: item.name,
              typeId: item.id
            }
          }))
          this.$set(this.trees[1], 'items', result);


        })

      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.typeId,
        tips: "缺少类型Id",
        success() {
          this.params.typeId = query.typeId;
          this.getTreeList();
          this.onRefresh();
        }
      })
    }


  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .list {
    height: calc(100% - 200px);
    top: 200px;
  }

  .activity-mask {
    .star-num {
      background: #000;
      position: absolute;
      z-index: 2;
      right: 30px;
      top: 30px;
      padding: 16px 20px 12px;
      border-radius: 30px;

      i {
        height: 25px;
        margin-right: 10px;
      }
    }

    .start-time {
      position: absolute;
      z-index: 2;
      bottom: 0;
      left: 0;
      padding: 16px 20px 12px;
      opacity: 0.9;
      border-top-right-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .activity-over {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: rgba(0, 0, 0, .5);
      top: 0;
      left: 0;

      img {
        width: 260px;
      }
    }
  }


</style>
