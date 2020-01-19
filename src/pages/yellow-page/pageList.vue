<template>
  <div id="StoreList">
    <div class="list-content">
      <div class="store-list-top">
        <!--这个头部是组件来的 S-->
        <Header :metaTitle="title"></Header>
        <!--这个头部是组件来的 E-->
        <ul class="c-nav">
          <li
            :class="hasModifier('c-nav__item','active',selectedNavIndex===key)"
            :key="key"
            v-for="(item,key) in navList"
            @click="headerClick(key)"
          >
            <em>{{item.label}}</em>
            <i class="iconfont icon-zuojiantou3 arrow-icon"></i>
          </li>
        </ul>
      </div>
      <aside :class="hasModifier('c-popup','show',showSelectTree)" v-show="showSelectTree">
        <div class="c-popup__mask" @click="showSelectTree=!showSelectTree"></div>
        <div class="c-popup__content">
          <van-tree-select
            :height="320"
            v-if="selectedNavIndex===1"
            :items="selectOptions.items"
            :main-active-index="mainActiveIndex"
            :active-id="activeId"
            @navclick="onNavClick"
            @itemclick="onItemClick"
          />
          <section v-if="selectedNavIndex===0" class="c-cell-group" style="height: 320px">
            <van-radio-group v-model="activeLocationId">
              <van-cell-group>
                <van-cell
                  :key="item.id"
                  :class="hasModifier('c-cell-group__item','active',item.id===activeLocationId)"
                  v-for="item in selectOptions.items"
                  :title="item.text"
                  clickable
                  @click="cellClickHandle('activeLocationId',item)"
                ></van-cell>
              </van-cell-group>
            </van-radio-group>
          </section>
          <section v-if="selectedNavIndex===2" class="c-cell-group" style="height: 320px">
            <van-radio-group v-model="activeSortId">
              <van-cell-group>
                <van-cell
                  :key="item.id"
                  :class="hasModifier('c-cell-group__item','active',item.id===activeSortId)"
                  v-for="item in selectOptions.items"
                  :title="item.text"
                  clickable
                  @click="cellClickHandle('activeSortId',item)"
                ></van-cell>
              </van-cell-group>
            </van-radio-group>
          </section>
        </div>
      </aside>
      <article class="l-content">

        <scroller
          v-if="storeList&&storeList.length"
          :on-refresh="onRefresh"
          :on-infinite="loadMore"

        >
          <list-item :store="storeList" :type="0"/>
        </scroller>


        <not-data v-else></not-data>

      </article>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import _ from "lodash";
  import ListItem from "../../components/yellow-page/list-item";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import {getGlobalData} from "../../util";
  import Header from "@/components/header";
  import {updateShareConfig} from "../../util/wechat-util";

  const defaultPage = () => ({pageSize: 10, pageNum: 0});

  export default {
    name: "StoreList",
    components: {ListItem, Header},
    data() {
      const pageOption = defaultPage();
      return {
        PlaceholderImg,
        //排序参数
        ...pageOption,
        activeLocationId: "",
        activeSortId: "",
        navList: [
          {
            label: "区域"
          },
          {
            label: "分类"
          },
          {
            label: "默认排序"
          }
        ],
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
        title: null
      };
    },
    methods: {
      ...mapActions("YellowPage", [
        "getLocationOption",
        "getCategoryOption",
        "getYellowList"
      ]),
      /***
       * 默认第0页，
       * 刷新搜索第1页，并设置当前为第1页
       * 下拉加载只再页面不为0时触发
       * @param done
       * @returns {Promise<void>}
       */
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.storeList = await this.getYellowList({
          page: 1,
          size: this.pageSize,
          lat: this.latLng.latitude,
          lng: this.latLng.longitude,
          sort: this.activeSortId,
          typePid: this.activePId,
          typeId: this.isChildrenActive ? this.activeId : "",
          zoneId: this.zoneId
        });
        this.pageNum++;
        done && done();
      },
      // 加载黄页列表数据
      async loadMore(done) {
        const store = await this.getYellowList({
          page: this.pageNum + 1,
          size: this.pageSize,
          lat: this.latLng.latitude,
          lng: this.latLng.longitude,
          sort: this.activeSortId,
          typePid: this.activePId,
          typeId: this.isChildrenActive ? this.activeId : ""
        });
        for (let i in store) {
          store[i].tel =
            store[i].tel.substr(0, 3) + "****" + store[i].tel.substr(7);
        }
        this.storeList = this.storeList.concat(store);
        this.loading = false;
        this.finished = true;
        // 数据全部加载完成
        if (store.length == 0) {
          this.finished = true;
        } else {
          this.finished = false;
          this.pageNum = this.pageNum + 1;
        }

        done && done(!store.length);


      },
      // async onInfinite(done) {
      //     if (this.pageNum === 0) return done();
      //     this.pageNum++;
      //     const list = await this.getYellowList({
      //         page: this.pageNum,
      //         size: this.pageSize,
      //         lat: this.latLng.latitude,
      //         lng: this.latLng.longitude,
      //         sort: this.activeSortId,
      //         typePid: this.activePId,
      //         typeId: this.isChildrenActive ? this.activeId : ""
      //     });
      //     if (list.length) {
      //         this.storeList = this.storeList.concat(list);
      //     } else {
      //         this.pageNum--;
      //     }
      //     done(!list.length);
      // },
      headerClick(index) {
        if (index === this.selectedNavIndex && this.showSelectTree)
          return (this.showSelectTree = false);
        this.selectedNavIndex = index;
        this.showSelectTree = true;
      },
      initCategoryNav(id) {
        const index = _.findIndex(this.formatCategoryOption, {id});
        this.mainActiveIndex = index;
        const selectNavTarget = this.formatCategoryOption[index];
        const targetIndex = 1;
        this.$set(this.navList[targetIndex], "label", selectNavTarget.text);
        this.title = selectNavTarget.text;
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
        this.activePId = selectNavTarget.id;
        if (!this.hasChildren(selectNavTarget)) {
          const targetIndex = this.selectedNavIndex;
          this.$set(
            this.navList[targetIndex],
            "label",
            selectNavTarget.text
          );
          this.title = selectNavTarget.text;
          this.activeId = selectNavTarget.id;
          this.isChildrenActive = 0;
          this.searchStoreList();
        }
      },
      cellClickHandle(key, {id, text}) {

        this[key] = id;
        const targetIndex = this.selectedNavIndex;
        this.zoneId = id;
        this.$set(this.navList[targetIndex], "label", text);
        this.searchStoreList();
      },
      onItemClick({id}) {
        this.activeId = id;
        const selectNavTarget = this.selectOptions.items[
          this.mainActiveIndex
          ];
        const selectChildrenTarget = _.find(selectNavTarget.children, {
          id
        });
        const targetIndex = this.selectedNavIndex;
        if (id === selectNavTarget.id) {
          this.isChildrenActive = 0;
          this.$set(
            this.navList[targetIndex],
            "label",
            selectNavTarget.text
          );
        } else {
          this.isChildrenActive = 1;
          this.$set(
            this.navList[targetIndex],
            "label",
            selectChildrenTarget.text
          );
        }
        this.searchStoreList();
      },
      hasChildren(item) {
        return item.children.length > 1;
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
      ...mapState({
        platform: state => state.platform
      }),
      ...mapGetters("YellowPage", [
        "formatLocationOption",
        "formatCategoryOption"
      ]),
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
                {id: "hot", text: "常用"},
                {id: "new", text: "最新"},
                {
                  id: "nearest",
                  text: "附近"
                }
              ]
            };
        }
      }
    },

    async created() {
      await this.getLocationOption();
      await this.getCategoryOption({type: 8});
      const activeId = this.$route.query["activeId"];
      this.initCategoryNav(activeId);
      this.searchStoreList();
      //window.addEventListener("scroll", this.onScroll);

      this.onscroll(this.loadMore, this.$route.path)

      updateShareConfig({
        title: document.title,
        imgUrl: this.platform.shareImg,
        desc: this.platform.shareDescription,
        link: window.location.href
      });
    }
  };
</script>
<style lang="scss">
  @import "../../assets/common";

  .van-tree-select__item {
    padding: 0 15px;
  }

  .van-icon.van-tree-select__selected {
    margin-right: 15px;
  }

  .van-tree-select__content {
    border-left: 1.1px solid #f4f4f4;
    padding: 0;
  }

  .van-tree-select__item--active,
  .van-tree-select__nitem--active {
    color: $themeColor;

    &:active {
      color: $themeColor;
    }
  }

  .van-tree-select__nitem,
  .van-tree-select__item {
    border-bottom: 1.1px solid #f4f4f4;

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
      border-bottom: 1.1px solid #f4f4f4;
      @include flex-center;

      &__item {
        flex: 1;
        @include flex-center;
        font-size: 30px;
        color: rgba(102, 102, 102, 1);

        .arrow-icon {
          margin-left: 12px;
          transform: rotate(0.75turn);
          transition: transform 0.2s;
        }

        &--active {
          @extend .c-nav__item;
          color: $themeColor;

          .arrow-icon {
            transform: rotate(0.25turn);
          }
        }
      }
    }

    .l-content {
      position: fixed;
      height: calc(100% - 290px);
      width: 100%;
    }

    .c-empty {
      // overflow: hidden;

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
      top: 190px;

      &__mask {
        background-color: rgba(0, 0, 0, 0.6);
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
        animation: slide-in 0.3s ease-in;

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
