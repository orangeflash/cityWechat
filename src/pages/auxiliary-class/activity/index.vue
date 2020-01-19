<template>
  <div class="activity">
    <dd-layout-search :config="searchConfig" search-type="9"/>

    <Banner
      :height="platform.slideNum"
      :swiper="{children:banners}"
    ></Banner>

    <button-group
      class="bg-f"
      :btns="buttonGroup"
      @click="choiceBtn"
    ></button-group>


    <dd-layout-announce announce-type="activity" class="mar-b-20"/>

    <div class="flex over-a pad-b bg-f pad-t" v-if="selectedList.length > 0">
      <dd-layout-part
        v-for="(item,key) in selectedList"
        :key="key"
        class="mar-l"
        :src="item.src"
        :title="item.title"
        @click="goPointPage('/auxiliary/activity/details?activityId='+item.id)"
      >
        <span class="flo-r col-9 fon-xss fon-w4" slot="tips">{{item.browse}}浏览</span>
        <div slot="cover" class="tips-bg h-42 w-77 flex-center posi-a mar-l b0 mar-b-010 fon-xss fon-wb">精选</div>
      </dd-layout-part>

    </div>


    <dd-layout-part-list info-title="全部活动" class="mar-t">
      <div class="flex-bt dh flex-bt w100 flex-y-center">
        <div v-for="(item,key) in tabConfig"
             :key="key"
             :class="params.type == item.type?'col-3 fon-wb fon-xll':'fon-lg col-9'"
             class=" dh flex-y-center posi-r mar-lr"
             @click="changeType(item.type)"
        >
          {{item.name}}
          <span v-if="params.type == item.type" class="dh-8 posi-a b0 flex-center w100">
            <em class="bg-t dh-8 w-48 br-r-16"></em>
          </span>
        </div>
      </div>
    </dd-layout-part-list>

    <div>

      <activity-item :infoData="item" v-for="(item,key) in activityList" :key="key"/>

    </div>

  </div>

</template>

<script>

  import Banner from '@/components/home/banner';
  import ButtonGroup from '@/components/template/button-group'  // 按钮组
  import DdArticle from '@/components/template/dd-article/dd-article-activity'
  import isEnd from "@/assets/status/isend.png";       //已结束
  import SearchWithLocation from "../../../components/home/search-with-location";

  import DdLayoutSearch from '../../../components/layout/dd-layout-search'


  import {mapActions, mapState} from 'vuex';
  import {hideLoading, showLoading, format} from "@/util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {utilMixins} from "@/plugins/util-mixins";
  import DdLayoutPart from "../../../components/layout/dd-layout-part";

  import activityItem from '../../../components/template/item/activity'

  import DdLayoutPartList from "../../../components/layout/dd-layout-part-list";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutAnnounce,
      DdLayoutPart,
      Banner,
      ButtonGroup,
      DdArticle,
      SearchWithLocation,
      DdLayoutSearch,
      DdLayoutPartList,
      activityItem
    },
    data() {
      return {
        isEnd,

        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        tabConfig: [
          {name: '最新', type: 1},
          {name: '精选', type: 2},
          {name: '最热', type: 3},
        ],
        banners: [],
        testData: {
          cover: "http://img.juimg.com/tuku/yulantu/130315/234522-13031511144283.jpg",
          info: "“世界那么大，都属于我”的感觉，去一个陌生的地方走一走，喝一口小酒，感受一份别样的愉悦吧！",
          time: "",
          tag: "旅行",
          price: "99.99",
        },
        selectedList: [],
        buttonGroup: [],
        params: {
          page: 1,
          size: 10,
          type: 1,     //1最新，2精选，3最热   默认1：UI上面没有全部这选项
          typeId: null,    //分类Id
          word: null       //关键字
        },
        activityList: [],
        hasMore: true,
        isRequest: false,  // 加上这个原因是为了更好的体验，就是为了防止用户在进入页面的时候，还没有开始请求信息，就提示暂无数据
      }
    },
    methods: {
      ...mapActions(['getInformationAdList']),
      ...mapActions("activity", ["getActivityList", "getActivityConfig", "getActivityBtns"]),
      async changeType(type) {
        this.params.type = type;
        showLoading()
        await this.onRefresh();
        hideLoading();
      },
      /** 活动列表点击 */
      choiceArtivity(data) {
        this.goPointPage({
          path: '/auxiliary/activity/details',
          query: {
            activityId: data.id
          }
        })
      },
      /** 按钮组点击 */
      choiceBtn(item) {
        console.log(item);
        this.goPointPage({
          path: '/auxiliary/activity/category',
          query: {
            typeId: item.id
          }
        })
      },
      /** tab选项 */
      tabsMethod(index) {
        this.params.type = index + 1;
        this.hasMore = true
        this.onRefresh();
      },
      /** 获取活动列表 */
      async getActivity(refresh) {
        showLoading();
        let result = await this.getActivityList(this.params);
        /** 由于组件的字段已经规划好，所以在拿取数据的时候进行重新定义 */
        const now = new Date().getTime()
        result = result.map(item => {
          let status = 0;
          if (item.startTime * 1000 > now) { //未开始
            status = 3
          } else if (item.endTime * 1000 > now) {//进行中
            status = 1
          } else { //已结束
            status = 2
          }


          return {
            cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
            info: item.name,
            time: this.computedDate(item.createdAt),
            tag: item.typeName,
            price: item.originalPrice,
            money: item.currentPrice,
            startTime: format(item.startTime * 1000),
            isOver: now >= item.endTime * 1000,
            id: item.id,
            count: item.count,
            residue: item.residue,
            status,
            isSelected: +item.isSelected
          }
        })


        this.activityList = refresh ? result : this.activityList.concat(result);
        this.isRequest = true;
        /** 判断是否还有更多的数据 */
        this.hasMore = result.length >= this.params.size;
        hideLoading();
      },
      async getIsSelected() {
        let result = await this.getActivityList({
          page: 1,
          size: 10,
          isSelected: 1
        });

        this.selectedList = result.map(item => {
          return {
            src: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
            title: item.name,
            id: item.id,
            browse: item.browse || 0
          }
        })
      },
      /** 刷新列表 */
      onRefresh() {
        this.params.page = 1;
        this.getActivity(true);
      },
      /** 加载更多 */
      onInfinite() {
        if (this.hasMore) {
          this.params.page++;
          this.getActivity();
        }

      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      searchOptions() {
        return {
          "position": 0,
          "shape": 3,
          "height": 42,
          "borderStyle": 0,
          "fontStyle": "left",
          "recommendSearch": 1,
          "searchBoxList": [
            {
              "id": 1545381832,
              "icon": "http://static.shanjiezhifu.com/zhihui/cert.png",
              "typesetting": 0,
              "style": 0,
              "link": ""
            }
          ],
          "keyWords": ""
        }
      },
    },
    created() {
      // 获取广告信息
      this.getInformationAdList({
        type: 12,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners = result.data || []
        }
      })
      this.getIsSelected();

      this.onRefresh();
      this.getActivityBtns().then(reuslt => {

        this.buttonGroup = reuslt;
      })
      this.getActivityConfig().then(result => {

        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '同城活动';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      })
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }


</script>
