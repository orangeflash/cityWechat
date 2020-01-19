<template>
  <div id="Home" class="bg-f">


    <cmp-wrapper
      v-for="(item,key) in pageConfig"
      :ref="item.cmpName"
      pagePath="home"
      :key="key"
      :deliver="true"
      @click="(e)=>handle(e,key)"
      :componentInfo="item"/>
    <!--弹窗-->
    <Popup class="zIndex999999 l0"
           v-if="popupConfig.showCode"
           :QRCode="popupConfig.qrcode"
           @close="popupConfig.showCode = false"
           :desc="popupConfig.desc"/>

  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getUrlParams, parseObjToParams, showDialog, showLoading} from "../../util";
  import {updateShareConfig} from "../../util/wechat-util";
  import CmpWrapper from "../../components/home/cmp-wrapper";
  import Popup from '../../components/popup'

  export default {
    name: "Home",
    components: {CmpWrapper, Popup},
    data() {
      return {
        popupConfig: {
          showCode: false,
        },
        showPage: false,
        isResize: false,
        homeTop: 0,
      }
    },
    methods: {
      ...mapActions("home", ["getPageDragLayout", 'getPlatformInfo']),
      async init() {
        if (this.$route.query.init) {
          let currentParams = getUrlParams(window.location.href)
          delete currentParams.init;
          // 重新加载页面
          window.location.href = window.location.href.split('?')[0] + parseObjToParams(currentParams)
        }


        this.initPage()


        //配置转发信息
        let data = await this.getPlatformInfo();
        if (data.data) {
          updateShareConfig({
            title: data.data.title,
            imgUrl: data.data.shareImg,
            desc: data.data.shareDescription,
            link: window.location.href,
          });
        } else {
          console.error("获取转发信息失败", data)
        }

      },
      // 获取页面的数据
      async initPage(option) {
        this.showPage = false;

        (option || this.defaultConfig.length == 0) && !this.isResize && await this.getPageDragLayout();
        if (option) {
          this.isResize = true;
        }
        this.showPage = true;
      },
      handle(e) {
        console.log(e)

        switch (e.name) {
          case "dd-layout-search":
            this.popupConfig = {
              qrcode: e.value.qrcode[0].url,
              desc: e.value.desc,
              showCode: true
            }
            break;
        }

      }
    },
    computed: {
      ...mapState("home", {
        defaultConfig: state => state.defaultConfig,
      }),
      ...mapState({
        platform: state => state.platform
      }),
      pageConfig() {
        //搜索框只允许出现一次
        let i = this.defaultConfig.findIndex(v => v.cmpName == 'entryButtonGroup') || 3
        let arr = JSON.parse(JSON.stringify(this.defaultConfig))
        arr.splice(i + 1, 0, {cmpName: "reward", config: {}});
        //console.log('pageConfigpageConfigpageConfig',i)
        return arr
      },
    },
    //在页面离开时记录滚动位置
    beforeRouteLeave(to, from, next) {
      let position = document.documentElement.scrollTop || document.body.scrollTop
      this.$store.commit('changeRecruitScrollY', position)
      // console.log('%c app.beforeRouteLeave ', 'color: white; background-color: #34aaff', position)
      next()
    },
    //进入该页面时，用之前保存的滚动位置赋值
    beforeRouteEnter(to, from, next) {
      setTimeout(() => {
        next(vm => {
          document.body.scrollTop = document.documentElement.scrollTop = vm.$store.state.recruitScrollY
          // console.log('%c app.beforeRouteEnter ', 'color: white; background-color: #f44444', vm.$store.state.recruitScrollY)
        })
      }, 100)
    },
    // activated() {
    //   //console.log('%c activated ', 'color: white; background-color: #95B46A', this.homeTop)
    //   document.body.scrollTop = document.documentElement.scrollTop = this.homeTop
    // },
    // beforeRouteLeave(to, from, next) {
    //   this.homeTop = document.documentElement.scrollTop || document.body.scrollTop || 0
    //   // console.log('%c app.scrollTop ', 'color: white; background-color: #34aaff', this.homeTop)
    //   next()
    // },
    //beforeRouteEnter  (to, from, next) {
    //   next(vm => {
    //     vm.onscroll(() => {
    //       let obj = vm.$refs.tabGroup[0].$refs.tabGroup;
    //       if (obj.hasMore && !obj.requesing) obj.onInfinite()
    //     }, vm.$route.path);
    //     console.log('%c GraphQL ',
    //       'color: white; background-color: #95B46A',
    //       'homeIndex');
    //     // 通过 `vm` 访问组件实例
    //   })
    // },
    created() {
      this.goPointPage({path: "/home",});
      this.init();
      this.onscroll(() => {
        let obj = this.$refs.tabGroup[0].$refs.tabGroup;
        if (obj.hasMore && !obj.requesing) obj.onInfinite()
      }, this.$route.path);
    }
  }
</script>
