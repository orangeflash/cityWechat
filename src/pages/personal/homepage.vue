<template>
  <div class="homepage">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="home-page-header">
      <div class="personal-info">
        <div class="personal-header-img">
          <img-wrapper :src="userInfo.portrait" alt="" srcset="" class="header-img"/>
        </div>
        <h3 class="personal-name">{{userInfo.userName||'神秘人'}}
          <img class="personal-icon mini-icon" v-if="+userInfo.isAuth === 1"
               :src="backendPath+'/wechatimg/img/grrz.png'"/>
          <img class="enterprise-icon mini-icon" v-if="+userInfo.isEnsure == 1"
               :src="backendPath+'/wechatimg/img/bzj.png'"/>
        </h3>
        <h1 class="registration-time">注册时间：{{formatDateByTimeStamp(userInfo.registerTime)}}</h1>
        <div class="personal-hot">
          <span class="hot-info"> 浏览量 <em class="hot-text"> {{userInfo.viewNum}} </em> </span>
          <span class="hot-info"> 发布量 <em class="hot-text"> {{userInfo.articleNum}} </em> </span>
          <span class="hot-info"> 访客量 <em class="hot-text">{{userInfo.visitorNum}}</em>  </span>
        </div>
        <h2 class="personal-signature">{{userInfo.sign||'此人很懒，暂无个性签名...'}}</h2>
      </div>
    </header>
    <article class="personal-body">
      <van-tabs :color="$themeColor" @click="changeTab">
        <van-tab title="发布">
          <section v-if="postList&&postList.length" class="l-list" v-for="item in postList" :key="item.postId">
            <basic-note-item :hideExpansionBar="true" @like="likeHandle(item)"
                             :postData="item"/>
          </section>
          <not-data v-else></not-data>

          <!--<section class="c-empty" v-if="!postList.length">-->
          <!--<div class="c-empty__wrap">-->
          <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
          <!--<h3 class="c-empty__title">暂无搜索结果</h3>-->
          <!--</div>-->
          <!--</section>-->
        </van-tab>
        <van-tab title="店铺">
          <store-tab-item v-if="storeInfo&&storeInfo.length!==0" :store-list="storeInfo"/>

          <not-data v-else></not-data>
          <!--<section class="c-empty" v-else>-->
          <!--<div class="c-empty__wrap">-->
          <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
          <!--<h3 class="c-empty__title">暂无搜索结果</h3>-->
          <!--</div>-->
          <!--</section>-->
        </van-tab>
        <van-tab title="浏览">
          <ul v-if="visitorList&&visitorList.length" class="c-member">
            <li v-for="(visitor,index) in visitorList" class="c-member__item" :key="index">
              <div class="l-left">
                <img class="c-member__avatar" :src="visitor.portrait" alt="">
                <strong class="c-member__name">{{visitor.userName}}</strong>
              </div>
              <em class="c-member__time">{{computedDate(visitor.createAT)}}</em>
            </li>
          </ul>
          <not-data v-else></not-data>
          <!--<section class="c-empty" v-else>-->
          <!--<div class="c-empty__wrap">-->
          <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
          <!--<h3 class="c-empty__title">暂无搜索结果</h3>-->
          <!--</div>-->
          <!--</section>-->
        </van-tab>
      </van-tabs>
    </article>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import StoreTabItem from "../../components/business-district/store-tab-item";
  // import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import Header from "@/components/header";

  import {PlaceholderAvatar, PlaceholderImg, publishUrl, backendPath} from "../../project-config/base";

  const defaultPage = () => ({pageSize: 10, pageNum: 0});

  export default {
    components: {StoreTabItem, BasicNoteItem, Header},
    data() {
      return {
        PlaceholderImg,
        publishUrl,
        backendPath,
        titleList: [
          {id: 0, title: "发布"},
          {id: 1, title: "店铺"},
          {id: 2, title: "首页"},
        ],
        homepageId: 2,
        userInfo: {},
        postList: [],
        storeInfo: [],
        visitorList: [],
      }
    },
    methods: {
      ...mapActions("personal/homePage", ["getUserById", "getMyPostList", "getMyStoreList", "getMyVisitorList"]),
      ...mapActions("post", ["getPostListByParams", 'likePostAction']),
      async getUserInfo(userId) {
        this.userInfo = await this.getUserById(userId);
      },
      changeTab(index) {
        switch (index) {
          case 0:
            return this.onRefreshPost();
          case 1:
            return this.getMyStore();
          case 2:
            return this.getVisitorList()
        }
      },
      async onRefreshPost(done) {
        Object.assign(this, defaultPage());
        this.postList = [];

        this.postList = await this.getMyPostList({
          page: 1,
          size: this.pageSize,
          status: 'display',
          userId: this.userId
        });
        this.pageNum++;
        done && done(true);
      },
      async getMyStore() {
        this.storeInfo = await this.getMyStoreList({
          adminId: this.userId,status:1
        });
      }, async getVisitorList() {
        this.visitorList = await this.getMyVisitorList({
          id: this.userId,
          size: 10,
          page: 1
        });
      },
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    mixins: [utilMixins],
    async created() {
      const {userId} = this.$route.query;
      this.userId = userId || this.user.id;
      await this.getUserInfo(this.userId);
      this.onRefreshPost();
    }
  }
</script>

<style scoped lang='scss'>
  @import '../../assets/common.scss';
  @import "../../assets/theme";

  .hot-text {
    margin: 0px 15px;
  }

  .homepage {
    background-color: white;
    min-height: 100vh;

    .home-page-header {
      background: url(../../assets/img/personal/personal_bg.png) $themeColor;
      background-size: 100% 100%;
      padding: 40px 30px;

      .registration-time {
        text-align: right;
        font-size: 24px;
        margin: 4px 0;
        color: rgba(255, 255, 255, 1);
      }

      .personal-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        // margin-top: 20px;
        .header-img {
          display: inline-block;
          border: 4px solid #fff;
          border-radius: 50%;
          width: 108px;
          overflow: hidden;
          height: 108px;
        }

        .personal-header-img {
          position: relative;
          display: flex;
          justify-content: center;

          .enterprise-Certification {
            position: absolute;
            display: inline-block;
            right: -60px;
            bottom: 0px;
            padding: 2px 2px;
            border-radius: 5px;
            background-color: rgba(0, 0, 0, .22);
          }

          .Certification-iconfont {
            color: #ff7f2d;
          }

          .certification-text {
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }

      .personal-name {
        font-size: 36px;
        color: rgba(255, 255, 255, 1);
        margin: 20px 0px 24px 0px;
      }

      .personal-hot {
        margin: 23px 0px;
        width: 100%;
        text-align: center;

        .hot-info {
          color: #fff;
          font-size: $font-size-base;

          &::after {
            content: '';
            margin: 0px 5px;
            display: inline-block;
            align-items: center;
            width: 1PX;
            height: 20px;
            background-color: #fff;
            margin-right: 25px;
          }

          &:last-of-type::after {
            display: inline;
          }
        }
      }

      .personal-signature {
        color: rgba(255, 255, 255, .8);
      }
    }

    .c-member {
      .l-left {
        @include flex-center;
      }

      &__item {
        @include flex-between;
        padding: 26px 30px;

        &:not(:last-child) {
          border-bottom: 1PX solid #f4f4f4;
        }
      }

      &__avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        border: 1PX solid #f4f4f4;
      }

      &__name {
        margin-left: 70px;
        font-size: 28px;
        color: #383838;
      }

      &__time {
        color: #ccc;
        font-size: 28px;
      }
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
        margin-top: 35px;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  .mini-icon {
    width: 28px;
    height: 28px;
    margin: 0;
  }
</style>
