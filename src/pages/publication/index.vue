<template>
  <div id="Publication">
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="'发布'+this.publicationConfig.field"></Header>
    <!--这个头部是组件来的 E-->
    <aside class="tip" style="background: #f0f7fd">
      <!--<i class="iconfont icon-jinggao tip__icon"></i>-->
      <em class="tip__text" v-if="publicationConfig">
        <!--免责声明：-->
        <span v-html="publicationConfig.disclaimer"></span></em>
    </aside>
    <figure class="enter-entry">
      <figcaption class="enter-entry__item" @click="navigateEnterBusiness"
                  v-if="this.storeConfig&&+this.storeConfig.enter === 1">
        <i class="iconfont icon-tubiaolunkuo- enter-entry__icon"></i>
        <div class="enter-entry__content">
          <!--<h1 class="enter-entry__content__title">我是{{storeConfig.field}},入驻{{platform.name}}</h1>-->
          <h1 class="enter-entry__content__title">我是{{storeConfig.field}},入驻{{platform.name}}</h1>
          <em class="enter-entry__content__desc">超低成本，网络宣传，简单有效，方便快捷！</em>
        </div>
        <i class="iconfont icon-jiantouarrow487 arrow"></i>
      </figcaption>
      <!--<figcaption class="enter-entry__item">-->
      <!--<i class="iconfont icon-mingpian enter-entry__icon"></i>-->
      <!--<div class="enter-entry__content">-->
      <!--<h1 class="enter-entry__content__title">我是个人，入驻名片</h1>-->
      <!--<em class="enter-entry__content__desc">超低成本，网络宣传，简单有效，方便快捷！</em>-->
      <!--</div>-->
      <!--<i class="iconfont icon-jiantouarrow487 arrow"></i>-->
      <!--</figcaption>-->
    </figure>
    <article class="publication-category">
      <h2 class="publication-category__title"><em class="select col-6">请选择您要发布的栏目</em></h2>
      <section v-if="!postCategoriesChunk.length" class="loading-wrap">
        <van-loading size="50px"/>
      </section>
      <ul v-else class="category-list" :class="index===0&&'category-list--border'"
          v-for="(list,index) in postCategoriesChunk"
          :key="index">
        <li class="category-list__item" @click="openCategoryMask(item.id)" v-for="(item,index) in list"
            :key="index">
          <div class="category-list__icon">
            <img-wrapper :src="getIconImage(item)" alt="" width="42" height="42"/>
          </div>

          <em class="category-list__label col-3">{{item.name||'暂无内容'}}</em>
        </li>
      </ul>
    </article>
    <article v-if="auxiliaryArrChunk.length" class="publication-category pad-b130">
      <h2 class="publication-category__title"><em class="select col-6">更多栏目</em></h2>
      <ul class="category-list" :class="index===0&&'category-list--border'"
          v-for="(list,index) in auxiliaryArrChunk"
          :key="index">
        <li class="category-list__item" @click="openAuxiliaryMask(item)" v-for="(item,index) in list"
            :key="index">
          <div class="category-list__icon">
            <img-wrapper :src="item.icon" alt="" width="42" height="42"/>
          </div>
          <em class="category-list__label  col-3">{{item.name||'暂无内容'}}</em>
        </li>
      </ul>
    </article>
    <van-popup position="bottom" v-model="showCategoryList" class="category-popup">
      <ul class="category-children">
        <li class="category-children__item active">{{`发布“${targetCategory.name}”${publicationConfig.field}`||'暂无内容'}}</li>
        <li class="category-children__item" v-for="(item,key) in categoryChildren"
            @click="postHandle(item.pid,item.id,item.name)"
            :key="key">{{item.name}}
        </li>
        <li class="category-children__item cancel" @click="showCategoryList=!showCategoryList">取消</li>
      </ul>
    </van-popup>
    <van-popup position="bottom" v-model="showAuxiliaryList" class="category-popup">
      <ul class="category-children">
        <li class="category-children__item active">{{"发布“"+auxiliaryName+"”"||'暂无内容'}}</li>
        <li class="category-children__item" v-for="(item,key) in auxiliaryChildren" @click="actionsOperation(item)"
            :key="key">{{item.name}}
        </li>
        <li class="category-children__item cancel" @click="showAuxiliaryList=!showAuxiliaryList">取消</li>
      </ul>
    </van-popup>
  </div>

</template>

<script>
  import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
  import example from '../../project-config/example'
  import _ from 'lodash'
  import {utilMixins} from "../../plugins/util-mixins";
  import {hideLoading, showDialog, showLoading} from "../../util";
  import Header from "@/components/header";

  export default {
    name: "Publication",
    components: {Header},
    data() {
      return {
        targetId: null,
        showCategoryList: false,
        showAuxiliaryList: false,
        auxiliaryName: '',
        auxiliaryChildren: [],
      }
    },
    methods: {
      ...mapActions("publication", ["getPostCategoriesByType", "getPostCategoriesAggregate"]),
      ...mapActions("common", ["getPostConfig", "getStoreConfig"]),
      ...mapActions("businessDistrict", ["getStoreByAdminId"]),
      ...mapMutations("businessDistrict", ["SET_STOREID"]),
      ...mapActions("post", ["getUserSentPostNum"]),
      ...mapActions('freeRide', ['getCarCategory']),
      ...mapActions("jobHunt", ["getJobConfig", "getJobCategory",]),
      ...mapActions("houingDeal", ["housingDealRentCategory", 'housingDealConfig']),
      async navigateEnterBusiness() {
        if (+this.storeConfig.enter === 2) {
          return showDialog("暂未开启商铺入驻", "提示", false);
        }
        if (!await this.checkBindTel()) return
        // console.log(await this.checkBindTel())
        this.goPointPage("/publication/businessEnterForm")
      },
      async openCategoryMask(targetId) {
        if (!await this.checkBindTel()) return
        this.showCategoryList = true;
        this.targetId = targetId;
      },
      async postHandle(pid, cid, childrenTitle) {
        const count = await this.getUserSentPostNum();
        // if (this.publicationConfig.limit === "open" && count >= this.publicationConfig.postNum) {
        //   return showDialog("已超过最大发帖数量！")
        // }
        this.$router.push({
          path: "/publication/editInformation",
          query: {
            pid,
            cid,
            title: this.targetCategory.name + " - " + this.platform.name,
            childrenTitle: `发布“${childrenTitle}”${this.publicationConfig.field}`
          }
        })
      },
      getIconImage(item) {
        const icons = this.getMediaList(item.icon).img || [];
        return icons.length ? icons[0] : ''
      },
      //插件点击
      async openAuxiliaryMask(item) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.auxiliaryName = item.name;
        this.auxiliaryType = item.type;


        this.showAuxiliaryList = ['yellow', 'activity', 'coupon', 'vip', 'rush'].indexOf(item.type) < 0;

        //
        // if (item.type != 'yellow' && item.type != 'activity' && item.type != 'coupon' && item.type != 'vip') {
        //
        // }
        switch (item.type) {
          case 'car':
            this.auxiliaryChildren = this.CarCategory;
            break;
          case 'job':
            this.auxiliaryChildren = this.JobCategory;
            break;
          case 'renting':
            this.auxiliaryChildren = this.rentCategory;
            break;
          case 'yellow':
            this.goPointPage({path: '/yellowPage/yellowPageSettled'})
            break;
          case 'activity':
            this.goPointPage({path: '/storeAuxiliary/storeActivity/storeActivityRelease'})
            break;
          case 'coupon':
            this.goPointPage({path: '/storeAuxiliary/storeCoupon/storeCouponRelease'})
            break;
          case 'vip':
            this.goPointPage({path: '/storeAuxiliary/storePrivilege/storeReleasePrivilege'})
            break;
          case 'rush':
            this.goPointPage({path: '/storeAuxiliary/storeRushbuy/storeReleaseRushbuy'});
            break;
          case 'group':
            this.goPointPage({path: '/storeAuxiliary/storeAssemble/release'});
            break;
          case 'bargain':
            this.goPointPage({path: '/storeAuxiliary/storeBargain/release'});
            break;
          case 'cropsPost':
            this.goPointPage({path: '/auxiliary/xx/releasexx'})
            break;
        }
        console.log(item, this.auxiliaryChildren)
      },
      actionsOperation(item) {
        if (this.auxiliaryType == 'car') {
          this.goPointPage({
            path: "/auxiliary/freeRide/release",
            query: {...item}
          })
        }
        if (this.auxiliaryType == 'job') {
          item.data == 1 ? this.goPointPage({
            name: 'JobJobSettled',
            params: {huntType: item.id}
          }) : this.goPointPage({name: 'JobHuntSettled', params: {huntType: item.id}})
        }
        if (this.auxiliaryType == 'renting') {
          let type = '',
            path = +item.identifying <= 4 ? "/auxiliary/housingDeal/release" : "/auxiliary/housingDeal/releaseSale";
          switch (+item.identifying) {
            case 3:
              type = 'lease';
              break;
            case 4:
              type = 'rentSeeking';
              break;
            case 5:
              type = 'unused';
              break;
            case 6:
              type = 'used';
              break;
          }

          this.goPointPage({
            path,
            query: {
              type,
              ...item
            }
          })
        }
        console.log(item)
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("publication", {
        postCategories: state => state.postCategories,
        auxiliaryArr: state => state.auxiliaryArr,
      }), ...mapState("common", {
        publicationConfig: state => state.postConfig,
        storeConfig: state => state.storeConfig,
      }), ...mapState({
        platform: state => state.platform,
      }), ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
      postCategoriesChunk() {
        return _.chunk(this.postCategories, 5) || []
      },
      auxiliaryArrChunk() {
        // console.log('11111',_.chunk(this.auxiliaryArr, 4))
        return _.chunk(this.auxiliaryArr, 5) || []
      },
      targetCategory() {
        return _.find(this.postCategories, {id: this.targetId}) || {};
      },
      categoryChildren() {
        return this.targetCategory["son"]
      }
    },
    async created() {
      showLoading();
      Promise.all([this.getStoreConfig(), this.getPostConfig()]);
      this.getPostCategoriesByType({type: 1});
      //获取插件分类集合
      this.getPostCategoriesAggregate()
      if (this.storeId) {
        hideLoading()
      } else {
        //console.log('没有storeId缓存',this.user)
        this.SET_STOREID(this.user.storeInfo&&this.user.storeInfo.storeId);
        hideLoading();
        // 这里获取用户拥有的店铺数组，
        // this.getStoreByAdminId({adminId: this.user.id}).then(res => {
        //   const storeInfo = res.length == 0 ? {id: null} : res[0];
        //   this.SET_STOREID(storeInfo.id);
        //   hideLoading();
        // });
      }
      this.getCarCategory().then(res => {
        this.CarCategory = res.data
      })
      this.getJobCategory().then(res => {
        this.JobCategory = res
      })
      this.housingDealRentCategory().then(res => {
        this.rentCategory = res
      })
      await this.checkBindTel({callBack: true})
      document.title='发布'+this.publicationConfig.field
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #Publication {
    background-color: #FFFFFF;
    min-height: 90vh;

    .tip {
      display: flex;
      padding: 26px 30px;
      background-color: #f9f9f9;

      &__icon {
        font-size: 32px;
        color: #0AB9F5;
        margin-right: 14px;
        margin-top: 4px;
      }

      &__text {
        font-size: 26px;
        color: #666;
        line-height: 35px;
      }
    }

    .enter-entry {
      &__item {
        // background-color: #E4FFEA;
        margin-bottom: 1PX;
        padding: 36px 30px;
        @include flex-center($justify: space-between);
        border-top: 1Px solid #eee;
        border-bottom: 1PX solid #eee;
      }

      &__icon {
        font-size: 48px;
        color: #666;
        margin-right: 35px;
      }

      &__content {
        display: flex;
        flex-direction: column;
        flex: 1;

        &__title {
          font-size: 30px;
          color: #333;
        }

        &__desc {
          font-size: 24px;
          color: #666;
          margin-top: 14px;
        }

      }

      .arrow {
        font-size: 30px;
        color: #999999;
      }
    }

    .publication-category {
      &__title {
        font-size: 28px;
        color: #333;
        padding: 32px 0;
        text-align: center;
        // display: inline-block;
      }

      .select::after, .select::before {
        content: '';
        display: inline-block;
        width: 130px;
        height: 1PX;
        background-color: #ccc;
        vertical-align: middle;
      }

      .select::before {
        margin-right: 20px;
      }

      .select::after {
        margin-left: 20px;
      }

      .loading-wrap {
        width: 100%;
        height: 300px;
        @include flex-center;
      }

      .category-list {
        display: flex;
        flex-wrap: wrap;


        &__item {
          width: 20%;
          height: 138px;
          @include flex-center;
          flex-direction: column;
          box-sizing: border-box;


        }

        &__icon {
          width: 84px;
          height: 84px;
          overflow: hidden;
          border-radius: 6px;
        }

        &__label {
          margin-top: 17px;
        }
      }
    }

    .category-popup {
      background-color: #eee;
    }

    .category-children {
      &__item {
        height: 81px;
        @include flex-center;
        font-size: 32px;
        font-weight: normal;
        color: #666;
        border-bottom: 1PX solid #f9f9f9;
        background-color: #fff;
      }

      &__item.cancel {
        background-color: #fff;
        margin-top: 20px;
      }

      &__item.active {
        color: #fff;
        background: $themeColor;
      }
    }
  }
</style>
