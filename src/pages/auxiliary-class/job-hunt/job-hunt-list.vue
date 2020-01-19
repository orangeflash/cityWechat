<template>
  <div id="StoreList">

    <div class="list-content">
      <div class="store-list-top">
        <!--这个头部是组件来的 S-->
        <Header :metaTitle="title"></Header>
        <!--这个头部是组件来的 E-->
        <ul class="c-nav">
          <li :class="hasModifier('c-nav__item','active',selectedNavIndex===key)" :key="key"
              v-for="(item,key) in navList"
              @click="headerClick(key)">
            <em>{{item.label}}</em>
            <i class="iconfont icon-zuojiantou3 arrow-icon"></i>
          </li>
        </ul>
      </div>

      <aside :class="hasModifier('c-popup','show',showSelectTree)" v-show="showSelectTree">
        <div class="c-popup__mask" @click="showSelectTree=!showSelectTree"></div>
        <div class="c-popup__content">

          <section v-if="selectedNavIndex===0" class="c-cell-group" style="height: 320px">
            <van-radio-group v-model="activeLocationId">
              <van-cell-group>
                <van-cell :key="item.id" :class="hasModifier('c-cell-group__item','active',item.id=== params.zoneId)"
                          v-for="item in selectOptions.items"
                          :title="item.text"
                          clickable
                          @click="cellClickHandle('zoneId',item)"
                >
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </section>
          <van-tree-select
            :height="320"
            v-if="selectedNavIndex===1"
            :items="selectOptions.items"
            :main-active-index="mainActiveIndex"
            :active-id="activeId"
            @navclick="onNavClick"
            @itemclick="onItemClick"
          />
          <section v-if="selectedNavIndex===2" class="c-cell-group" style="height: 320px">
            <van-radio-group v-model="activeSortId">
              <van-cell-group>
                <van-cell :key="item.id" :class="hasModifier('c-cell-group__item','active',item.id===params.sort)"
                          v-for="item in selectOptions.items"
                          :title="item.text" clickable @click="cellClickHandle('sort',item)">
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </section>
        </div>
      </aside>
      <article class="l-content">
        <scroller
          v-if="storeList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <!--找工作-->
          <hunt-find :list="storeList" v-if="jobType==2"/>
          <job-find :list="storeList" v-else/>


          <!--<job-tab-item :jobType="jobType==1?2:1" page-type="list" :store-list="storeList"/>-->
        </scroller>
        <not-data v-else></not-data>
        <!--<section class="c-empty" v-else>-->
        <!--<div class="c-empty__wrap">-->
        <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
        <!--<h3 class="c-empty__title">暂无搜索结果</h3>-->
        <!--</div>-->
        <!--</section>-->
      </article>
    </div>

  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import JobTabItem from "../../../components/template/job-hunt/job-tab-item";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";
  import {computedDate, getGlobalData, hideLoading, showLoading} from "../../../util";
  import Header from "@/components/header";
  import {updateShareConfig} from "../../../util/wechat-util";
  import JobFind from "../../../components/template/item/job-find";
  import HuntFind from "../../../components/template/item/hunt-find";

  const defaultPage = () => ({pageSize: 10, pageNum: 0});

  export default {
    name: "StoreList",
    components: {HuntFind, JobFind, JobTabItem, Header},
    data() {
      const pageOption = defaultPage();
      return {
        PlaceholderImg,
        //排序参数
        ...pageOption,
        activeLocationId: "",
        activeSortId: "",
        navList: [{
          label: "区域"
        }, {
          label: "分类"
        }, {
          label: "默认排序"
        }],
        selectedNavIndex: 0,
        showSelectTree: false,
        //选中的子分类id
        activeId: "",
        activePId: "",
        //选中的父分类角标
        mainActiveIndex: -1,
        //1为子类选中 0为父类选中
        isChildrenActive: 0,
        storeList: [],
        title: null,
        params: {
          page: 1,
          size: 10,
          sort: '',
          // lng:'',
          // lat:'',
          // word:'',
          zoneId: '',
          typeId: '',
          typePid: ''
        }
      }
    },
    methods: {
      ...mapActions("businessDistrict", ["getLocationOption", "getCategoryOption", "getStoreList"]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobCategory", "getJobPosition", "getJobList", "getHuntList"]),
      /***
       * 默认第0页，
       * 刷新搜索第1页，并设置当前为第1页
       * 下拉加载只再页面不为0时触发
       * @param done
       * @returns {Promise<void>}
       */
      async onRefresh(done) {
        // Object.assign(this.params, {
        //   lng:this.latLng.latitude,
        //   lat:this.latLng.longitude,
        // });
        this.params.page = 1;
        this.storeList = this.jobType == '1' ? await this.getHuntList(this.params) : await this.getJobList(this.params);
        done && done();
      },
      async onInfinite(done) {
        showLoading()
        this.params.page++;
        let list = this.jobType == '1' ? await this.getHuntList(this.params) : await this.getJobList(this.params);


        // list = list.map(item => {
        //   const label = item.label ? JSON.parse(item.label) : {};
        //   let tag = [];
        //   for (let i in label) tag.push(label[i])
        //   if (this.jobType == '1') {
        //     return {
        //       ...item,
        //       face: this.getSingleImg(item.logo),
        //       sex: item.sex == 1 ? '男' : '女',
        //       tag,
        //       createdAt: computedDate(item.createdAt)
        //     }
        //   } else {
        //     return {
        //       ...item,
        //       tag,
        //       createdAt: computedDate(item.createdAt)
        //     }
        //   }
        // })

        if (list.length) {
          this.storeList = this.storeList.concat(list);
        }
        hideLoading()
        done(!list.length)
      },
      headerClick(index) {
        if (index === this.selectedNavIndex && this.showSelectTree) return this.showSelectTree = false;
        this.selectedNavIndex = index;
        this.showSelectTree = true;
      },
      initCategoryNav(id) {
        const index = _.findIndex(this.formatCategoryOption, {id});
        this.mainActiveIndex = index;
        const selectNavTarget = this.formatCategoryOption[index];
        const targetIndex = 1;
        this.$set(this.navList[targetIndex], "label", selectNavTarget.text);
        this.title = selectNavTarget.text
        this.activeId = selectNavTarget.id;
        this.activePId = selectNavTarget.id;
        const zoonId = getGlobalData("zoneId");
        const zoon = _.find(this.formatLocationOption, {id: zoonId});
        if (zoon) {
          this.$set(this.navList[0], "label", zoon.text);
          this.activeLocationId = zoonId;
        }
      },
      onNavClick(index) {
        this.mainActiveIndex = index;
        const selectNavTarget = this.selectOptions.items[index];
        this.params.typePid = selectNavTarget.id;
        if (!this.hasChildren(selectNavTarget)) {
          const targetIndex = this.selectedNavIndex;
          this.$set(this.navList[targetIndex], "label", selectNavTarget.text);
          this.title = selectNavTarget.text;
          this.activeId = selectNavTarget.id;
          this.isChildrenActive = 0;
          this.searchStoreList();
        }
      },
      cellClickHandle(key, item) {
        this.params.page = 1;
        this[key] = item.id;
        this.params[key] = item.id;
        const targetIndex = this.selectedNavIndex;
        this.$set(this.navList[targetIndex], "label", item.text);
        this.searchStoreList();
      },
      //二级分类
      onItemClick(item) {
        this.params.page = 1;
        const id = item.id
        this.activeId = id;
        this.params.typeId = item.text == '全部' ? '' : id;
        const selectNavTarget = this.selectOptions.items[this.mainActiveIndex];
        const selectChildrenTarget = _.find(selectNavTarget.children, {id});
        const targetIndex = this.selectedNavIndex;
        if (id === selectNavTarget.id) {
          this.isChildrenActive = 0;
          this.$set(this.navList[targetIndex], "label", selectNavTarget.text);
        } else {
          this.isChildrenActive = 1;
          this.$set(this.navList[targetIndex], "label", selectChildrenTarget.text);

        }
        this.searchStoreList();
      },
      hasChildren(item) {
        return item.children.length > 1
      },
      async searchStoreList() {
        this.showSelectTree = false;
        this.onRefresh();
      }
    },
    computed: {
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      // ...mapState({
      //   platform: state => state.platform
      // }),
      ...mapState("jobHunt", {
        jobConfig: state => state.jobConfig,
        jobCategory: state => state.jobCategory,
      }),
      ...mapGetters("businessDistrict", ["formatLocationOption",]),
      ...mapGetters("jobHunt", ["formatCategoryOption"]),
      selectOptions() {
        switch (this.selectedNavIndex) {
          case 0:
            return {items: this.formatLocationOption};
          case 1:
            return {items: this.formatCategoryOption};
          case 2:
            return {
              items: [
                {id: "", text: "默认排序"},
                // {id: "nearest", text: "距离最近"},
                {id: "hot", text: "最热"},
                {id: "new", text: "最新"}
              ]
            };
        }
      }
    },

    async created() {
      //获取query参数
      this.jobType = this.$route.query.jobType
      // console.log(this.$route.query.jobType)
      document.title = this.$route.query.title
      //获取地区和分类数据
      await this.getLocationOption();
      await this.getJobPosition();
      // console.log('latLng',this.latLng,)
      //这里只有类型没有分类id传进来
      // let activeId = this.$route.query.activeId;
      // if(activeId.indexOf(',') >= 0){
      //   this.typePid = activeId.split(',')[0];
      //   this.params.typeId = activeId.split(',')[1];
      // }else{
      //   this.params.typePid = activeId
      // }
      this.params.zoneId = this.$route.query.zoneId
      this.initCategoryNav(this.params.typePid);
      this.searchStoreList();
      //设置分享数据
      let data = await this.getJobConfig();
      updateShareConfig({
        title: data.title,
        imgUrl: data.shareImg,
        desc: data.shareDescription,
        link: window.location.href
      });
    }
  }
</script>
<style lang="scss">
  @import "../../../assets/theme";

  .van-tree-select__item {
    padding: 0 15px;
  }

  .van-icon.van-tree-select__selected {
    margin-right: 15px;
  }

  .van-tree-select__content {
    border-left: 1PX solid #f4f4f4;
    padding: 0;
  }

  .van-tree-select__item--active, .van-tree-select__nitem--active {
    color: $themeColor;

    &:active {
      color: $themeColor;
    }
  }

  .van-tree-select__nitem, .van-tree-select__item {
    border-bottom: 1PX solid #f4f4f4;

    &:active {
      color: $themeColor;
    }
  }

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

    .l-content {
      position: relative;
      height: calc(100vh - 95px);
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
  }
</style>
