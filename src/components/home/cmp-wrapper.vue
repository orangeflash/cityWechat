<template>
  <div id="CmpWrapper"
       :class="addClassName(componentInfo.cmpName)">
    <component
      :ref="componentInfo.cmpName"
      :is="getCmpName(componentInfo.cmpName)"
      :deliver="true"
      @click="(e)=>$emit('click',e)"
      v-bind="getBindParams(getCmpName(componentInfo.cmpName))"
      :pagePath="pagePath"
    />
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getCmpName} from "../../project-config";
  import SearchWithLocation from "../../components/layout/dd-layout-search"; //搜索
  import Banner from './banner'    //首页banner
  import statistics from '../../components/layout/dd-layout-statistics'   //首页 统计
  import entryButtonGroup from '../../components/basic/entry-button-group' //首页 快速导航
  import Notice from '../../components/layout/dd-layout-notice'   //首页 通知
  import textAndImage from "../../components/layout/dd-layout-text-img"
  import activity from "../../components/layout/dd-layout-activity"
  import rushBuy from "../../components/layout/dd-layout-rush-buy"
  import collage from "../../components/layout/dd-layout-collage"
  import bargain from "../../components/layout/dd-layout-bargain"
  import qrcode from "../../components/layout/dd-layout-qrcode"
  import businessRecommendation from "../../components/layout/dd-layout-business"
  import HomeTab from '../../components/home/tab-group' //首页tab切换
  import MagicCube from '../../components/home/magic-cube'  // 魔方图组
  import WhiteSpace from '../../components/home/white-space'              // 空白空间
  import RichText from "../../components/home/rich-text"; //富文本
  import SegmentLine from "../../components/home/segment-line"; //分割线
  import CustomTitle from "../../components/home/custom-title"; //自定义title
  import BigImage from "../../components/home/big-image";   //大图展示
  import Information from "../../components/layout/dd-layout-information";   //资讯
  import ImageGroup from '../../components/home/img-group' //图片组
  import HotBusiness from '../../components/home/hot-business' //热门商家
  import storeMall from '../../components/layout/dd-layout-mall' //热门商家
  import reward from "../../components/layout/dd-layout-reward"//悬赏

  /***
   * 暂不使用拖拽式
   */
  export default {
    name: "CmpWrapper",
    props: ["componentInfo", "pagePath"],
    data() {
      return {}
    },
    methods: {
      getCmpName,
      //给组件添加额外样式
      addClassName(cmpName) {
        switch (cmpName) {
          case "searchBox":
            return 'search-input';
          case "imageGroup":
            return 'image-group'
        }
      },
      // 调用子级的函数
      async useChildMethod(name, item, type) {
        switch (name) {
          case 'tabGroup':
            //上拉加载tabGroup
            if (type == 'refresh') {
              this.$refs.tabGroup.onRefresh();
            } else if (type == 'cancel') {
              this.$refs.tabGroup.onRefresh();
            } else {
              item.hasMore = await this.$refs.tabGroup.onInfinite();
              item.isLoading = false;

            }

        }
      },
      // 调用父组件的函数方法
      callParentMethod(param) {
        switch (param.name) {
          case "topPost":   //置顶帖子
            this.$parent.fillData(param)
            break;
          case "showMore":
            this.$parent.onShowMore(param.param)
            break;
        }
      },
      getBindParams(name) {

        const filterArray = ['Banner', 'statistics', 'entryButtonGroup',
          'HomeTab', 'ImageGroup', 'MagicCube', 'CustomTitle',
          'WhiteSpace', 'richText', 'SegmentLine', 'bigImage', 'HotBusiness']


        return filterArray.indexOf(name) >= 0 ? this.componentInfo.config : this.componentInfo
      }
    },
    components: {
      SearchWithLocation, Banner, statistics, SegmentLine, ImageGroup,
      entryButtonGroup, Notice, textAndImage, CustomTitle, Information,
      activity, rushBuy, collage, bargain, RichText, BigImage,
      businessRecommendation, HomeTab, MagicCube, WhiteSpace,
      HotBusiness, storeMall, qrcode, reward
      // BusinessRecommendation,
      //  WhiteSpace, NoticeWithInfo, ,
      // entryButtonGroup, ImageGroup, HotBusiness,
      // , , SegmentLine, ,
      // CustomTitle, BigImage, Information
    },
    computed: {},
    created() {
    }
  }
</script>


