<template>
  <div id="StoreTabItem">
    <ul class="near__container">
      <li class="near-list__item" v-for="(item) in storeList" :key="item.id"
          @click="goPage({path:'/shopDetail',query:{storeId:item.id}})">
        <div class="item__left">
          <img-wrapper  :src="getImageList(item.storeLogo)[0]" alt=""/>
        </div>
        <figure class="item__right">
          <figcaption class="title">
            <h3 class="title__bold">
              <em>{{item.storeName||'加载中'}}</em>
              <em class="title__tag" v-if="item.isTop===1">置顶</em>
              <em class=" title__tag" v-if="item.isRedbag">红包</em>

              <img class="personal-icon mini-icon"  v-if="+item.isAuth === 1"
                   :src="backendPath+'/wechatimg/img/qyrz.png'"/>
              <img class="enterprise-icon mini-icon"  v-if="+item.isEnsure === 1"
                   :src="backendPath+'/wechatimg/img/bzj.png'"/>
            </h3>

            <strong class="title__desc" v-if="sort==='hot'">{{item.viewNum||0}}次浏览</strong>
            <strong class="title__desc" v-if="sort==='new'">{{computedDate(item.enterTime)||0}}入驻</strong>
            <strong class="title__desc" v-if="sort==='nearest'">{{item.distance}}</strong>
          </figcaption>
          <figcaption class="category">
            <div>
              <em class="category__tag" v-if="item.typeName">{{item.typeName}}</em>
              <em class="category__tag" v-if="item.newName">{{item.newName}}</em>
            </div>
            <!--<i class="iconfont icon-dianhua3 category__icon" @click.stop="callTel(`tel://${item.linkTel}`)" ></i>-->
          </figcaption>
          <figcaption class="introduction">
            <!--<i class="iconfont icon-like-b introduction__icon"></i>-->
            <em class="introduction__content" style="margin-left: 0">营业时间: {{item.businessStartTime}} -
              {{item.businessEndTime}}</em>
          </figcaption>
          <figcaption class="location">
            <i class="iconfont icon-location location__icon"></i>
            <em class="location__content">{{item.address||'加载中'}}</em>
          </figcaption>
          <!--<figcaption class="favorable">-->
          <!--<section class="favorable-item">-->
          <!--<i class="favorable-item__icon">抢</i>-->
          <!--<em class="favorable-item__content">{{item.description}}</em>-->
          <!--</section>-->
          <!--<section class="favorable-item">-->
          <!--<i class="favorable-item__icon">助</i>-->
          <!--<em class="favorable-item__content">{{item.description}}</em>-->
          <!--</section>-->
          <!--</figcaption>-->
        </figure>
      </li>
    </ul>
  </div>

</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {Dialog} from 'vant';
  import {PlaceholderImg,backendPath} from "../../project-config/base";
  import {utilMixins} from "../../plugins/util-mixins";
  export default {
    name: "StoreTabItem",
    props: ['storeList','sort'],
    data() {
      return {
        backendPath
      }
    },
    methods: {
      ...mapActions("post", ["getPostListByParams"]),

      getImageList(obj) {
        return this.getMediaList(obj).img || []
      },
      callTel(tel){
        location.href = tel;
      },
      goPage(param){
        this.goPointPage({
          obj:this,
          ...param
        })
      }
    },
    computed: {


    },

    mixins: [utilMixins],
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #StoreTabItem {
    .near__container {
      .near-list__item {
        display: flex;
        padding: 30px;
        background: #fff;
        margin-bottom: 1PX;
        box-sizing: border-box;
        overflow: hidden;
        .item__left {
          width: 180px;
          height: 180px;
          border-radius: 10px;
          overflow: hidden;
        }
        .item__right {
          flex: 1;
          margin-left: 19px;
          overflow: hidden;
          .title {
            display: flex;
            align-items: center;
            &__bold {
              flex: 1;
              font-size: 28px;
              font-weight: bold;
              height: 28px;
              color: rgba(0, 0, 0, 1);
              margin-right: 8px;
              @include t-overflow;
              line-height: 28px;
            }
            &__tag {
              margin-left: 8px;
              border-radius: 4px;
              padding: 7px 8px;
              font-size: 22px;
              display: inline-block;
              &:nth-child(2n+1) {
                color: #FF4A22;
                background: #FFDA77;
              }
              &:nth-child(2n+2) {
                color: #FFDA77;
                background: rgba(255, 93, 56, 1);
              }
            }
            .title__desc {
              font-size: 22px;
              margin-left: 40px;
              color: rgba(183, 183, 183, 1);
            }
          }
          .category {
            display: flex;
            align-items: center;
            height: 42px;
            margin-top: 17px;
            justify-content: space-between;
            &__tag {
              font-size: 24px;
              color: rgba(156, 175, 192, 1);
              border: 1PX solid rgba(156, 175, 192, 1);
              border-radius: 4px;
              padding: 4px 8px;
              &:not(:first-child) {
                margin-left: 10px;
              }
            }
            &__icon {
              color: $themeColor;
              font-size: 42px;
              padding: 30px;
              transform: rotateY(180deg);
            }
          }
          .introduction, .location, .favorable-item {
            font-size: 24px;
            color: rgba(255, 101, 101, 1);
            margin-top: 20px;
            display: flex;
            align-items: center;
            &__icon {
              font-size: 22px;
            }
            &__content {
              flex: 1;
              margin-left: 12px;
              @include t-overflow;
            }
          }
          .location {
            color: #C5A166;
          }
          .favorable-item {
            color: #999999;
            &__icon {
              background: rgba(245, 203, 89, 1);
              border-radius: 4px;
              font-size: 22px;
              color: rgba(255, 255, 255, 1);
              display: inline-block;
              padding: 5px;
            }
            &:nth-child(3n+2) {
              .favorable-item__icon {
                background: #DB6845
              }
            }
          }
        }
      }
    }
    .mini-icon {
      width: 0.28rem;
      height: 0.28rem;
      margin: 0;
    }
  }
</style>
