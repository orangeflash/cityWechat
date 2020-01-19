<template>
  <!-- 砍价首页 -->
  <div clas="assemble">
    <component
      v-for="(com,key) in pageConfig"
      :key="key"
      :is="com.name"
      :class="com.class"
      v-bind="com.value"
      @click="handleMethods"
    />

    <dd-article
      :data="item"
      v-for="(item,key) in activityList"
      :key="'a'+key"
      @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
      class="bg-f"
    >
      <!--<div slot="mask" class="posi-a t0 l0 r0 b0">-->
      <!--<div class="posi-a b0 w100 dh col-f hide-e flex flex-y-center c-b-0-tb-200">-->
      <!--<span class="pad-lr fon-b">{{item.title}}</span></div>-->
      <!--</div>-->
      <div slot="content" class="pad-lr pad-b ">
        <dd-layout-div class="hide-e fon-b fon-wb" :pad="[5,0,30]">{{item.title}}</dd-layout-div>
        <dd-layout-div class="flex-bt flex-y-center">
          <div class="">
            <div><span class="col-price fon-xxll fon-wb mar-r">￥{{item.nowPrice}}</span><em
              class="col-9 t-d-l fon-xss">￥{{item.oldPrice}}</em></div>
            <div class="col-6 fon-xsss mar-t-20">已有<span class="col-f52c2c">{{item.joinNum}}</span>人参与砍价</div>
          </div>

          <dd-layout-div class="flex-g-0 flex-y-center bg-f52c2c col-f" :pad="[18,30,14]" :fillet="40">
            <i class="iconfont icon-huo col-f mar-r-10"></i>去砍价
          </dd-layout-div>
        </dd-layout-div>

      </div>
    </dd-article>
  </div>
</template>


<script>
  import Banner from '@/components/home/banner';
  import DdFormCell from "@/components/template/dd-form/cell"
  import ButtonGroup from '@/components/template/button-group'  // 按钮组
  import DdTab from '@/components/template/other/tab'
  import DdNotice from '@/components/template/other/notice'
  import DdArticle from '@/components/template/dd-article/two'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showLoading} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutAnnounce, Banner, ButtonGroup, DdTab, DdFormCell, DdArticle, DdNotice},
    data() {
      return {
        pageConfig: [{
          name: 'banner',    //组件名
          value: {          //参数值
            swiper: {
              children: []
            }
          }
        },
          // {
          //   name: 'dd-layout-announce',
          //   'class': 'mar-b-20',
          //   value: {
          //     announceType: 'bargain'
          //   }
          // },
          {
            name: 'button-group',
            value: {
              parentClass: 'mar-b-20',
              btns: [],
              deliver: true
            }
          }, {
            name: 'dd-tab',
            value: {
              tabs: [
                {title: '最新'},
                {title: '精选'},
                {title: '最热'},
              ]
            }
          }],
        params: {
          size: 10,
          page: 1,
          sort: 'new', //排序 new 最新 hot最热 good精选
          typePid: null,
        },
        activityList: [],
      }
    },
    methods: {
      ...mapActions(['getInformationAdList']),
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainList", "getBargainCategory", "bargainNotic", "bargainConfig"]),
      handleMethods(e) {
        console.log(e);
        switch (e.name) {
          case "buttonGround":
            let parent = this.pageConfig[2].value.btns
            const obj = parent[e.value.key];

            parent.forEach(item => this.$set(item, 'active', false))

            this.$set(obj, 'active', true);

            this.params.typePid = e.value.id;
            break;
          case 'tabs':
            this.params.sort = e.value == 0 ? 'new' : e.value == 1 ? 'good' : 'hot';
            break;
        }
        this.onrefresh();
      },
      async getData(refresh) {
        showLoading()
        let result = await this.getBargainList(this.params);

        result = result.map(item => {
          return {
            cover: this.getSingleImg(item.logo),
            nowPrice: item.floorPrice,
            oldPrice: item.price,
            title: item.title,
            joinNum: item.receiveNum || 0,
            browseNum: item.viewNum || 0,
            id: item.id
          }
        })
        this.hasMore = result.length >= this.params.size;
        this.activityList = refresh ? result : this.activityList.concat(result);
        hideLoading();
      },
      onrefresh() {
        this.params.page = 1;
        this.getData(true);
      },
      onInfinite() {
        this.params.page++;
        this.getData();
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform,
        userInfo: s => s.user
      }),
    },
    async created() {
      this.pageConfig[2].value.btns = await this.getBargainCategory();

      // 获取广告信息
      this.getInformationAdList({
        type: 17,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.pageConfig[0].value.swiper.children = result.data || [];
          this.pageConfig[0].value.height = this.platform.slideNum;
        }
      })
      this.bargainNotic().then(result => {
        console.log("bargainNotic", result);
        console.log(this.pageConfig[1])
        this.pageConfig[1].value.notices = result.map(item => {
          return item.userName + "砍成了" + item.title
        })
      })
      this.bargainConfig().then(result => {
        console.log("bargainConfig", result);
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '砍价';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        });
      })
      this.getData();
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }

</script>
