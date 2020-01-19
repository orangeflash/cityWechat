<template>
  <div>
    <router-view></router-view>
    <Footer v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>
  </div>

</template>

<script>
  import { mapActions,mapMutations, mapState, mapGetters } from "vuex";
  import Footer from '../../../components/template/footer'
  import {hideLoading, showLoading} from "../../../util";
  //页脚
  export default {
    name: "Yellow",
    components: {
      Footer
    },
    provide() {
      return {
        refreshAuxActive: this.refreshAuxActive,
      }
    },
    data() {
      return {
        fullPath: [],
        footerConfig: {
          footerInfo: [
            {
              name: "首页",
              link: "/home",
              icon: "icon-shouye"
            },
            {
              name: "信息",
              link: "/auxiliary/xx",
              icon: "icon-dianhuaben-copy",
              active: 'active'
            },
            {
              name: "开通",
              link: "/auxiliary/xx/kt",
              icon: "icon-category"
            },
            {
              name: "我的记录",
              link: "/auxiliary/xx/wd",
              icon: "icon-wodejilu"
            },
            {
              name: "个人中心",
              link: "/personal",
              icon: "icon-gerenzhongxin"
            }

          ]
        },

      };
    },
    methods: {
      refreshAuxActive() {
        this.active = false;
        setTimeout(() => this.active = true, 50)
      },
    },
    computed: {},
    created() {
      this.fullpath = this.$router.history.current.path;
    }
  };
</script>
