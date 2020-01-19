<template>
  <div id="SaveShareImg">
    <figure class="header">
      <figcaption class="header__left">
        <h3 class="header__title">招聘</h3>
        <ul class="header__tips">
          <li class="header__tips__date">2018-09-22 12:00 发布</li>
          <li class="header__tips__record">1000人浏览</li>
        </ul>
      </figcaption>
      <figcaption class="header__right">
        <img class="header__logo" :src="PlaceholderImg" alt="">
        <em class="desc">长按识别二维码</em>
      </figcaption>
    </figure>
    <article class="content">
      <p class="content__text">招聘！招聘！招聘！
现急招巨人健身会所推广人员15人！
工作地点：高盛星河湾（巨人健身会所）
工作时间：6天；
工作内容：俱乐部店内，手机操作；
薪资待遇：日薪200以上（底薪+提成）。
没有工作经验的您也可以加入！！（有销售经验的，积极向上，活泼外向自带正能量的优先）
联系电话：17633719668微信同号
      </p>
      <div class="content__list__wrap">
        <ul class="content__list">
          <li class="content__list__item" v-for="i in 4" :key="i"><img :src="PlaceholderImg" alt=""></li>
        </ul>
      </div>
    </article>
    <button class="save-btn">保存图片</button>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {PlaceholderImg} from "../../project-config/base";

  export default {
    name: "SaveShareImg",
    data() {

      return {PlaceholderImg}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #SaveShareImg {
    .header {
      padding: 67px 29px;
      @include flex-between;
      background: #fff;
      &__left {
        flex: 1;
        overflow: hidden;
      }
      &__right {
        @include flex-center;
        flex-direction: column;
      }
      &__title {
        font-size: 36px;
        color: rgba(51, 51, 51, 1);
        @include t-overflow;
      }
      &__tips {
        margin-top: 40px;
        font-size: 24px;
        color: rgba(153, 153, 153, 1);
        line-height: 1.6;
      }
      &__logo {
        width: 168px;
        height: 168px;
      }
      &__right {
        .desc {
          font-size: 24px;
          color: rgba(153, 153, 153, 1);
          margin-top: 14px;
        }
      }
    }
    .content {
      padding: 28px 32px;
      background: #fff;
      margin: 17px 0;

      &__text{
        white-space: pre-wrap;
        font-size:28px;
        color:rgba(51,51,51,1);
        line-height:1.6;
      }
      &__list__wrap {
        height: 190px;
        overflow: hidden;
        margin-bottom: 26px;
      }
      &__list {
        overflow-x: auto;
        overflow-y: hidden;
        @include flex-center($justify: null);
        &__item {
          img {
            width: 190px;
            height: 190px;
            border-radius: 8px;
          }
          &:not(:first-child) {
            margin-left: 12px;
          }
        }
      }
    }
    .save-btn{
      @include positionAbsolute(null,0,0,0);
      position: fixed;
      height:88px;
      background:$themeColor;
      line-height: 88px;
      text-align: center;
      font-size:34px;
      width: 100%;
      display: block;
      color:rgba(255,255,255,1);
    }
  }
</style>
