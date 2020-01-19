<template>

  <div class="dd-article bg-f pad-30 flex">
    <div class="dd-article_cover">
      <img-wrapper :src="img"/>
    </div>
    <div class="dd-article_info" @click.stop="$emit('click')">
      <div class="title">
        <h3 class="title__bold">
          <em>{{storeName||'加载中'}}</em>
          <em class="title__tag" v-if="isTop&&isTop===1">置顶</em>
          <em class=" title__tag" v-if="isRedbag&&isRedbag">红包</em>

          <img class="personal-icon mini-icon" v-if="+isAuth === 1"
               :src="backendPath+'/wechatimg/img/qyrz.png'"/>
          <img class="enterprise-icon mini-icon" v-if="+isEnsure === 1"
               :src="backendPath+'/wechatimg/img/bzj.png'"/>
        </h3>

        <strong class="title__desc">{{viewNum}}次浏览</strong>
        <strong class="title__desc" v-if="0">{{time}}入驻</strong>
        <strong class="title__desc" v-if="0"></strong>

      </div>
      <div class="category">
        <div>
          <em class="category__tag" v-if="typeName">{{typeName}}</em>
          <em class="category__tag" v-if="newName">{{newName}}</em>

        </div>

      </div>
      <div class="introduction">
        <em class="introduction__content" style="margin-left: 0">营业时间: {{openTime}} - {{closeTime}}</em>
      </div>
      <div class="location">
        <i class="iconfont icon-location location__icon"></i>
        <em class="location__content">{{address}}</em>
      </div>
    </div>
  </div>

</template>

<script>
  import {backendPath, isDev, redirectPath, appId, version} from "@/project-config/base";

  export default {
    components: {},
    props: {
      address: "",
      openTime: "",
      closeTime: "",
      typeName: '',
      img: "",
      storeName: "",
      isTop: null,
      isRedbag: null,
      label: "",
      newName: "",
      viewNum: "",
      time: "",
      isAuth:"",
      isEnsure:""
    },
    data() {
      return {
        backendPath
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-article {
    &_cover {
      width: 180px;
      height: 180px;
      overflow: hidden;
      margin-right: 20px;
      border-radius: 10px;
    }

    &_info {
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
          color: rgba(0, 0, 0, 1);
          margin-right: 8px;
          @include t-overflow;
          line-height: 28px;
      overflow: hidden;
          em {
            float: left;
          }
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
        margin-top: 10px;
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
        margin-top: 10px;
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

  .mini-icon {
    width: 28px;
    height: 28px;
    float: left;
    margin: 0 0 0 10px;
  }
</style>
