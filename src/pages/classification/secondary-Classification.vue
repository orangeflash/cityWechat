<template>
  <div id="StoreList">
    <!--这个头部是组件来的 S-->
    <div class="store-list-top">
      <Header childrenTitle="分类列表"></Header>
      <!--这个头部是组件来的 E-->
      <ul class="c-nav">
        <li :class="hasModifier('c-nav__item','active',selectedNavIndex===key)" :key="key" v-for="(item,key) in navList"
            @click="headerClick(key,item)">
          <em>{{item.label}}</em>
          <i class="iconfont icon-zuojiantou3 arrow-icon"></i>
        </li>
      </ul>
    </div>

    <aside :class="hasModifier('c-popup','show',showSelectTree)" v-show="showSelectTree">
      <div class="c-popup__mask" @click="showSelectTree=!showSelectTree"></div>
      <div class="c-popup__content">
        <!--👇👇👇👇👇👇👇👇👇👇👇👇  分类选择  👇👇👇👇👇👇👇👇👇👇👇👇👇👇-->
        <van-tree-select
          :height="320"
          v-show="selectOptions.isTree"
          :items="selectOptions.items"
          :main-active-index="mainActiveIndex"
          :active-id="activeId"
          @navclick="onNavClick"
          @itemclick="onItemClick"
        />

        <!--👇👇👇👇👇👇👇👇👇👇👇👇👇👇   区域选择和排序   👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇-->
        <section v-show="!selectOptions.isTree" class="c-cell-group" style="height: 320px">
          <van-radio-group>
            <van-cell-group>
              <van-cell
                :key="item.id"
                v-for="item in selectOptions.items"
                clickable
                @click="onSelect(item.id,item.text,item)">
                <!--👇👇👇👇👇👇👇👇👇👇👇👇这里真的很坑的，PC端是的时候颜色可以显示出来，当发布之后却不行了，所以只能单独弄一个span标签来进行色值👇👇👇👇👇👇👇👇👇👇👇👇-->
                <span
                  :style="{'color':item.id === param.zoneId || (selectedNavIndex == 2&&item.id == param.sort)?$themeColor:'#323233'}"
                >{{item.text}}</span>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </section>
      </div>
    </aside>
    <!--<div class="noThing" v-show="!dataList.length">-->
    <!--<img-wrapper :src="myPublicationPlaceholder" not-load="true" alt="" srcset="" class="myPublicationPlaceholder"/>-->
    <!--<em>暂无相关内容</em>-->
    <!--</div>-->
    <div class="storeList-content">
      <scroller
        v-if="dataList.length > 0 "
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
      >
        <section class="l-list" v-for="item in dataList" :key="item.postId">
          <basic-note-item hideExpansionBar="true" :postData="item"/>
        </section>
      </scroller>
      <not-data v-else></not-data>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import {TreeSelect} from 'vant';
  import myPublicationPlaceholder from "../../assets/img/personal/my_publication_placeholder.jpg"
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {showLoading, hideLoading, getGlobalData} from '../../util';
  import {getLocation, updateShareConfig} from "../../util/wechat-util";
  import Header from "@/components/header";


  const defaultPage = () => ({pageSize: 10, pageNum: 1});


  export default {
    name: "SecondaryClassification",
    components: {BasicNoteItem, Header},
    data() {
      const pageOption = defaultPage();
      return {
        //排序参数
        sortRadio: 1,
        navList: [{
          label: "区域"
        }, {
          label: "分类"
        }, {
          label: "排序"
        }],
        selectedNavIndex: 0,
        showSelectTree: false,
        //选中的子分类id
        activeId: '',
        //选中的父分类角标
        mainActiveIndex: -1,
        //1为子类选中 0为父类选中
        isChildrenActive: 0,
        myPublicationPlaceholder,
        totalList: [],
        dataList: [],
        itemOne: [],
        itemTwo: [],
        primaryID: '',
        secondaryID: '',
        pageNum: 1,
        sortList: [],
        sequence: {},
        initial: [],
        FatherId: '',
        hasMore: 0,
        param: {           //搜索的参数值
          zoneId: JSON.parse(localStorage.getItem('GlobalData')).zoneId || '',    //城市id,默认空字符串（全部）
          typeId: '',    //二级分类的id，默认空（全部）
          typePid: '',    //一级分类的id，默认空（全部）
          sort: 'new',       //排序方式
          page: 1,        //当前页数，默认为第一页
          size: 10,   //每页的数量，默认10条
          lat: 0,         // 坐标纬度
          lng: 0,         // 坐标经度
          word: '',        //查询的关键字
          lastZoneId: null,   //上次选择的城市id
        }
      }
    },
    methods: {
      ...mapActions("post", ["getPostListByParams", 'likePostAction']),
      ...mapActions("classification", ["getCityList", 'getCategroyList', 'getListNoNeedFilter']),
      // 通过key值来是置顶的列表显示
      headerClick(index, item) {
        if (index === this.selectedNavIndex && this.showSelectTree) {
          return this.showSelectTree = false;
        }
        this.selectedNavIndex = index;
        this.showSelectTree = true;
      },
      // 一级分类的事件
      async onNavClick(index) {
        //this.FatherId = this.initial[index].id;
        this.param.typePid = this.initial[index].id;
        this.mainActiveIndex = index;
        const selectNavTarget = this.selectOptions.items[index];
        this.primaryID = selectNavTarget.id;
        const targetIndex = this.selectedNavIndex;
        this.$set(this.navList[targetIndex], "label", selectNavTarget.text);
        this.$route.meta.title = selectNavTarget.text;
        this.activeId = selectNavTarget.id;
        this.isChildrenActive = 0;
      },
      // 二级分类的事件 回调的是二级分类的id
      async onItemClick(data) {
        this.param.typeId = data.id;
        // 每次切换的时候，页数重新为 1 ;
        this.param.page = 1;
        this.dataList = await this.inItDataList();

        if (data.id) document.title = this.navList[this.selectedNavIndex].label = data.text;

      },

      //初始化分类数据
      initCategoryNav(param) {
        const target = _.find(this.itemTwo, target => {
          return +target.id === +param.pid
        });
        if (!target) return false;
        const index = +target.id;
        this.mainActiveIndex = index;

        const selectNavTarget = target;
        const targetIndex = 1;
        this.$set(this.navList[targetIndex], "label", selectNavTarget && selectNavTarget.text);
        this.activeId = selectNavTarget.id;
        this.activePId = selectNavTarget.id;
        const zoonId = getGlobalData("zoneId");
        const zoon = _.find(this.itemOne, {id: zoonId});
        if (zoon) {
          this.$set(this.navList[0], "label", zoon.text);
          this.activeLocationId = zoonId;
        }
      },
      cellClickHandle(key, {id, text}) {
        this[key] = id;
        const targetIndex = this.selectedNavIndex;
        this.$set(this.navList[targetIndex], "label", text);
      },
      hasChildren(item) {
        return item.children.length > 1
      },
      /**请求数据列表 */
      async inItDataList(options) {
        //隐藏选项类表
        this.showSelectTree = false;
        showLoading("请稍等！")
        this.sortList = []
        let list = [];


        list = await this.getPostListByParams(this.param);
        hideLoading();
        return list
      },
      /**初始化数据 */
      async onRefresh(done) {
        // Object.assign(this, defaultPage());
        // this.dataList = [];
        this.param.page = 1;

        this.dataList = await this.getPostListByParams(this.param);
        done && done();
      },
      // 获取到所有可选择的城市列表
      // itemTwo用来初始化页面数据
      async getCityListInfo() {
        this.itemOne = await this.getCityList();
        this.itemTwo = await this.getCategroyList({type: 1});
        this.initCategoryNav({
          pid: this.param.typePid
        });
      },
      //获取到所有的二级分类
      async getlistInfo() {
        this.initial = await this.getListNoNeedFilter({type: 1})
      },

      /**
       * 选中城市区域触发 id，当前城市的id，当前城市的名字，当前数据
       * */
      async onSelect(id, text, item) {
        if (this.selectedNavIndex === 0) {
          this.param.zoneId = id;
        } else {
          this.param.sort = id;
        }

        // 每次切换的时候，页数重新为 1 ;
        this.param.page = 1;
        const data = await this.inItDataList();
        this.navList[this.selectedNavIndex].label = text;
        if (data) this.dataList = data;
        /*
        this.sortRadio = id
        this.$set(this.navList[this.selectedNavIndex], "label", text);
        this.showSelectTree = false
        */
      },
      async onInfinite(done) {
        this.param.page++;
        const list = await this.getPostListByParams(this.param);
        if (list.length > 0) {
          this.dataList = this.dataList.concat(list)
        } else {
          this.param.page--;
        }
        done && done(!list.length);
      }
    },
    computed: {
      ...mapGetters("businessDistrict", ["formatLocationOption"]),
      ...mapState({
        platform: state => state.platform
      }),
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      selectOptions() {
        switch (this.selectedNavIndex) {
          case 0:
            this.itemOne.forEach((item, index) => {
              // if(item.text == this.navList[this.selectedNavIndex].label)this.param.zoneId = item.id;
            })
            return {isTree: false, items: this.itemOne};
          case 1:
            this.itemTwo.forEach((item, index) => {
              if (item.text == this.navList[this.selectedNavIndex].label) this.mainActiveIndex = index;
            })
            return {isTree: true, items: this.itemTwo};
          case 2:
            return {
              items: [{id: "new", text: "最新"}, {id: "hot", text: "最热"}, {id: "nearest", text: "距离最近"}]
            };
        }
      }
    },
    async created() {


      this.param.typePid = this.$route.query.pid || null;

      console.log("this.param.typePid", this.param.typePid)

      if (this.param.typePid && this.param.typePid.indexOf(',') >= 0) {
        this.param.typeId = this.param.typePid.split(",")[1]
        this.param.typePid = this.param.typePid.split(",")[0]
        console.log("this.param", this.param)
      }


      if (this.$route.query.id) {
        this.param.typeId = +this.$route.query.id;
      }
      // 获取用户当前的坐标
      try {
        let latLng = await getLocation();
        this.param.lat = latLng.latitude;
        this.param.lng = latLng.longitude;
      } catch (e) {
        console.log(e)
      }
      await this.onRefresh();
      await this.getCityListInfo();
      this.getlistInfo();
      document.title = this.$route.query.title || '分类';

      updateShareConfig({
        title: document.title,
        imgUrl: this.platform.shareImg,
        desc: this.platform.shareDescription,
        link: window.location.href,
      })

    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";

  #StoreList {
    overflow: hidden;
    padding-top: 190px;

    .store-list-top {
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 99;
    }

    .c-nav {
      height: 95px;
      position: relative;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 9999;
      border-bottom: 1PX solid #f4f4f4;
      @include flex-center;

      &__item {
        flex: 1;
        @include flex-center;
        font-size: 30px;
        color: rgba(102, 102, 102, 1);

        .arrow-icon {
          margin-left: 12px;
          transform: rotate(.75turn);
          transition: transform .2s;
        }

        &--active {
          @extend .c-nav__item;
          color: $themeColor;

          .arrow-icon {
            transform: rotate(.25turn);
          }
        }
      }
    }

    .c-empty {
      overflow: hidden;

      &__wrap {
        margin-top: 180px;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -webkit-box-align: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
      }

      &__img {
        display: block;
        margin: 0 auto;
      }

      &__title {
        margin-top: 35px;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }

    .c-popup {
      /*@include absoluteFull(fixed);*/
      z-index: 1;
      position: fixed;
      width: 100%;
      height: 100%;

      &__mask {
        background-color: rgba(0, 0, 0, .6);
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
        /*@include absoluteFull;*/
      }

      @keyframes slide-in {
        from {
          transform: translate3d(0, -100%, 0);
        }
      }

      &__content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        z-index: 3001;
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        background-color: white;
        animation: slide-in .3s ease-in;

        .c-cell-group {
          overflow-y: auto;

          &__item {
            padding-left: 60px;
            font-size: 30px;

            &--active {
              @extend .c-cell-group__item;
              color: $themeColor;
            }
          }
        }
      }
    }

    .storeList-content {
      position: fixed;
      width: 100%;
      height: calc(100% - 190px - 105px);
    }
  }
</style>
