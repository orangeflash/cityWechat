<template>
  <div class="dd-footer">
    <footer class="footer">
      <section class="footer__wrap"
               @click.stop="item.link?jumpPage(item.link,key):item.method&&$emit(item.method)"
               v-for="(item,key) in footerInfo"
               :key="key">
        <div class="footer-tab" v-if="isProminent(key)">
          <img v-if="item.url" :src="$route.path == item.link?item.urlActive:item.url"
               alt="" class="footer-tab__icon">
          <i class="iconfont" v-if="item.icon" :class="[item.icon,$route.path == item.link&&'active']"></i>
          <em
            class="footer-tab__label" :class="[$route.path == item.link&&'active']">{{item.name}}</em>
        </div>
        <div class="footer-tab prominent" v-else>
          <div class="footer-tab footer-tab--center">
            <aside class="tab-center"><i
              class="iconfont icon-jia tab-center__icon"></i></aside>
            <i class="footer-tab__icon__placeholder"></i> <em
            class="footer-tab__label" :style="{color:color}">{{item.name}}</em></div>
        </div>
      </section>
    </footer>
  </div>
</template>

<script>
  // import _ from 'lodash'
  /**
   * color : 默认值字体颜色 没有就是#333
   * activeColor : 点击后的字体颜色
   * footerInfo : 配置信息
   *
   * [
   *  {
      icon: 'https://app.zhycms.com/file/2/png/2018/12/07/QSMnzil7MZSLEc1W.png',        图标 目前是img
      name: '首页',         名称
      activeIcon: '',       点击后的图标
      link: '/home',        点击的路由链接
    },
   *
   * ]
   * */

  export default {
    props: ["color", "activeColor", "footerInfo", "prominent"],
    inject: ["refreshAuxActive"],
    methods: {
      jumpPage(link, key) {
        // this.footerInfo.map((v, index) => {
        //   // console.log(v)
        //   if (key == index) {
        //     this.$set( this.footerInfo[index],'active','active')
        //   } else {
        //     this.$set( this.footerInfo[index],'active','')
        //   }
        // })
        //console.log("如果路由相同刷新，否则跳转", link + "/" == this.$route.path, link + "/", this.$route.path)
        //如果路由相同刷新，否则跳转
        if (link == this.$route.path || link + "/" == this.$route.path) {
          //(this.$route.path)
          // return
          //console.log(this.refreshAuxActive)
          this.refreshAuxActive && this.refreshAuxActive();
        } else {
          this.goPointPage({
            path: link
          })
        }
        // return
      },
      isProminent(key) {
        // console.log(key)
        return this.prominent ? this.footerInfo.length == 5 && key == 2 ? false : true : true

      }
    },
    watch: {
      $route(newVal) {
        // const activeindex= _.findIndex(this.footerInfo, function(o) { return o.link == newVal.path; });
        // // console.log(newVal,activeindex)
        // this.footerInfo.map((v, index) => {
        //   // console.log(v)
        //   if (activeindex == index) {
        //     this.$set( this.footerInfo[index],'active','active')
        //   } else {
        //     this.$set( this.footerInfo[index],'active','')
        //   }
        // })
        // return
        // this.active = newVal.path;
      }
    },
    computed: {}
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .iconfont {
    font-size: 40px;
  }

  .footer-tab.prominent > img {
    margin-top: -70px;
    width: 120px;
    height: 120px;
  }

  .dd-footer {
    $icon-size: 46px;
    min-height: 92px;
    filter: drop-shadow(0 -2px 6px rgba(0, 0, 0, .3));
    @include positionAbsolute(null, 0, 0, 0);
    position: fixed;
    color: #838383;
    display: flex;
    background: #fff;
    z-index: 99;
    @include alignCenter;

    .footer {
      min-height: 92px;
      filter: drop-shadow(0 -2px 6px rgba(0, 0, 0, .3));
      @include positionAbsolute(null, 0, 0, 0);
      position: fixed;
      color: #838383;
      display: flex;
      background: #fff;
      z-index: 99;
      @include alignCenter;

      &__wrap {
        flex: 1;
        padding: 12px 0;

        &--active {
          transition: background-color .1s linear;
          color: $themeColor;
          background: #fafafa;
        }
      }

      &-tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        position: relative;

        &__icon {
          width: $icon-size;
          height: $icon-size;

          &__placeholder {
            content: "";
            display: inline-block;
            width: $icon-size;
            height: $icon-size;
          }
        }

        &__label {
          margin-top: 7px;
          font-size: 24px;

        }

        .active {
          color: $themeColor;
        }

        .tab-center {
          position: absolute;
          transform: translateY(-40%);
          border-radius: 50%;
          box-shadow: 0 0 0 10px #fff;
          background: #fff;

          &__icon {
            font-size: 55px;
            color: $themeColor;
          }
        }

      }
    }
  }
</style>
