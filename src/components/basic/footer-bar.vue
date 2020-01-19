<template>
  <div id="FooterBar">
    <footer class="footer">
      <section class="footer__wrap" v-for="(tab,index) in tabConfig.bottomTabList" :key="index"
               :id="getEntryPath(tab.link)" @click="clickHandle">
        <div class="footer-tab" v-if="prominent(index)">
          <img v-if="(tabConfig.bottomTabStyle===0||tabConfig.bottomTabStyle===1) " class="footer-tab__icon"
               :src="active===getEntryPath(tab.link)?getTabIcon(tab).active:getTabIcon(tab).normal" alt="">
          <em v-if="tabConfig.bottomTabStyle===0||tabConfig.bottomTabStyle===2" class="footer-tab__label"
              :style="active===getEntryPath(tab.link)&&{color:tabConfig.color}">{{tab.legend}}</em>
        </div>
        <div class="footer-tab prominent" v-else @click="clickHandle">
          <div class="footer-tab footer-tab--center">
            <aside class="tab-center over-h">
              <img v-if="(tabConfig.bottomTabStyle===0||tabConfig.bottomTabStyle===1) " class="footer-tab__icon prominent__icon"
                   :src="active===getEntryPath(tab.link)?getTabIcon(tab).active:getTabIcon(tab).normal" alt="">
              <i v-else class="iconfont icon-jia tab-center__icon"></i>

            </aside>
            <i class="footer-tab__icon__placeholder"></i>

            <em v-if="tabConfig.bottomTabStyle===0||tabConfig.bottomTabStyle===2" class="footer-tab__label"
                :style="active===getEntryPath(tab.link)&&{color:tabConfig.color}">{{tab.legend}}</em>
          </div>
        </div>
      </section>

      <!--<section class="footer__wrap" :class="{'footer__wrap&#45;&#45;active':active==='/classification'}" id="/classification"-->
      <!--@click="clickHandle">-->
      <!--<div class="footer-tab">-->
      <!--<i class="iconfont icon-fenlei footer-tab__icon"></i>-->
      <!--<em class="footer-tab__label">分类</em>-->
      <!--</div>-->
      <!--</section>-->
      <!--<section id="/publication" class="footer__wrap" @click="clickHandle">-->
      <!--<div class="footer-tab footer-tab&#45;&#45;center">-->
      <!--<aside class="tab-center">-->
      <!--<i class="iconfont icon-jia tab-center__icon"></i>-->
      <!--</aside>-->
      <!--<i class="footer-tab__icon__placeholder"></i>-->
      <!--<em class="footer-tab__label">发布</em>-->
      <!--</div>-->
      <!--</section>-->
      <!--<section class="footer__wrap" :class="{'footer__wrap&#45;&#45;active':active==='/businessDistrict'}"-->
      <!--id="/businessDistrict" @click="clickHandle">-->
      <!--<div class="footer-tab">-->
      <!--<i class="iconfont icon-shop footer-tab__icon"></i>-->
      <!--<em class="footer-tab__label">商圈</em>-->
      <!--</div>-->
      <!--</section>-->
      <!--<section class="footer__wrap" :class="{'footer__wrap&#45;&#45;active':active==='/personal'}" id="/personal"-->
      <!--@click="clickHandle">-->
      <!--<div class="footer-tab">-->
      <!--<i class="iconfont icon-xiaolian footer-tab__icon"></i>-->
      <!--<em class="footer-tab__label">我的</em>-->
      <!--</div>-->
      <!--</section>-->
    </footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "FooterBar",
    inject: ["refreshActive"],
    data() {
      return {
        active: "",
        prominentIndex: 2,       //突出的tab的下标值
      }
    },
    methods: {
      ...mapActions("home", ["getTabDragLayout"]),
      getTabIcon(tab) {
        return tab.icon || {}
      },
      clickHandle(e) {
        const path = e.currentTarget.id;
        //如果再次点击与上次点击一致则刷新页面
        if (path === this.active) {
          return this.refreshActive();
        }
        this.active = path;
        if (path.indexOf("/publication")) {

          return this.goPointPage({
            path: path
          })
          // return this.$pushRoute(path);
        }
        if (this.user.id) {
          // this.$pushRoute(path);
          return this.goPointPage({
            path: path
          })
        } else {
          //return this.$pushRoute('/login')
          return this.goPointPage({
            path: '/login'
          })
        }
      },
      prominent(index) {

        if (this.tabConfig && this.tabConfig.bottomTabList && this.tabConfig.bottomTabList.length == 5) {

          if (index == 2) {
            return false
          } else {
            return true;
          }
        } else {
          return true;
        }


      }
    },
    computed: {
      ...mapState("home", {
        tabConfig: s => s.tabConfig
      }),
      ...mapState({
        user: state => state.user
      }),

    },
    watch: {
      $route(newVal) {
        this.active = newVal.path;
      }
    },
    async created() {
      this.active = this.$route.path;
      // await this.getTabDragLayout("nav");
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .footer-tab.prominent > img {
    margin-top: -70px;
    width: 120px;
    height: 120px;
  }

  #FooterBar {
    $icon-size: 46px;

    .footer {
      min-height: 92px;
      @include positionAbsolute(null, 0, 0, 0);
      position: fixed;
      color: #838383;
      display: flex;
      background: #fff;
      z-index: 101;
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

        .tab-center {
          position: absolute;
          transform: translateY(-45%);
          border-radius: 50%;
          box-shadow: 0 0 0 10px #fff;
          background: #fff;
          /*中间突起*/
          .prominent__icon{
            margin-top: -0px;
            width: 75px;
            height: 75px;
          }
          &__icon {
            font-size: 74px;
            color: $themeColor;
          }
        }

      }
    }
  }
</style>
