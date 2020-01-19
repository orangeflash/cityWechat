<template>
  <div id="footer">
    <div
      class="footerChildren"
      v-for="(item,index) in footer"
      :key="index"
      v-on:click="yellowRouter(item.path)"
      :style="{color:item.path==fullpath?$themeColor:''}"
    >
      <p>
        <i class="iconfont" :class="item.icon"></i>
      </p>
      <p class="footerName">{{item.name}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Footer",
    props: ["fullpath"],
    data() {
      return {
        footer: [
          {
            name: "首页",
            path: "/home",
            icon: "icon-shouye"
          },
          {
            name: "电话本",
            path: "/yellowPage",
            icon: "icon-dianhuaben-copy"
          },
          {
            name: "分类",
            path: "/yellowPage/classfy",
            icon: "icon-category"
          },
          {
            name: "我的记录",
            path: "/yellowPage/yellowMine",
            icon: "icon-wodejilu"
          },
          {
            name: "个人中心",
            path: "/personal",
            icon: "icon-gerenzhongxin"
          }
        ]
      };
    },
    methods: {
      yellowRouter(e) {
        console.log("点击了");
        this.$replaceRoute(e);
      }
    },
    created() {
      console.log(this.$route.path)
      // this.fullpath = this.$router.history.current.path
    },
  };
</script>
<style lang="scss">
  @import "../../assets/common";

  #footer {
    width: 100%;
    height: 70px;
    position: fixed;
    bottom: 0;
    z-index: 500000;
    display: flex;
    justify-content: space-around;
    background: #fff;
    text-align: center;
    padding: 30px 0;

    .footerChildren {
      height: 100%;
      // line-height: 100px;
      color: #818181;

      .iconfont {
        font-size: 45px;
      }

      .footerName {
        padding-top: 15px;
      }
    }
  }
</style>
