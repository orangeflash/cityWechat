<template>
  <div id="Yellow">
    <router-view></router-view>
    <Footer v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Footer from "@/components/template/footer";


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
              name: "电话本",
              link: "/yellowPage",
              icon: "icon-dianhuaben-copy",
              active: 'active'
            },
            {
              name: "分类",
              link: "/yellowPage/classfy",
              icon: "icon-category"
            },
            {
              name: "我的记录",
              link: "/yellowPage/yellowMine",
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

<style scoped lang="scss">
</style>
