<template>
  <div class="flex-g-1 flex-col">
    <dd-layout-div class="posi-r flex-g-1 flex-col">
      <router-view></router-view>
    </dd-layout-div>
    <Footer
      v-bind="footerConfig"
      v-if="$route.meta.defaultTab"
    ></Footer>
  </div>
</template>

<script>
  import Operation from "@/components/template/operation"
  import Footer from '@/components/template/footer'                 //页脚

  import friednIcon from "../../../assets/img/other/friedn.png"
  import friednIconActive from "../../../assets/img/other/friend-active.png"
  import commentIcon from "../../../assets/img/other/comment.png"
  import commentIconActive from "../../../assets/img/other/comment-active.png"
  import circleIcon from "../../../assets/img/other/circle.png"
  import circleIconActive from "../../../assets/img/other/circle-active.png"
  import myIcon from "../../../assets/img/other/my.png"
  import myIconActive from "../../../assets/img/other/my-acitve.png"


  import {mapActions, mapState} from 'vuex';
  import {showDialog} from "../../../util";

  export default {
    components: {Footer, Operation},
    data() {
      return {
        showOperation: false,
        path: '/auxiliary/cityLove',
        actions: [],
        footerConfig: {
          color: '#818181',
          activeColor: 'red',
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              // icon: 'icon-qiqiu',
              url: friednIcon,
              urlActive: friednIconActive,
              name: '交友',
              activeIcon: '',
              link: '/auxiliary/cityLove',
              active: 'active'
            },
            {
              // icon: 'icon-qunfenggerenziliao',
              url: circleIcon,
              urlActive: circleIconActive,
              name: '圈子',
              link: '/auxiliary/cityLove/circle',
            },
            // {
            //   icon: ' icon-biaoqing1',
            //   name: '聊天',
            //   link: '/auxiliary/cityLove/myMessage',
            // },
            {
              // icon: 'icon-xiaolian',
              url: myIcon,
              urlActive: myIconActive,
              name: '我的',
              link: '/auxiliary/cityLove/myInfo',
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveRegister", 'cityLoveCategory', 'cityLoveConfig']),
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo
      }),
    },
    watch: {
      async $route(e) {
        if (!this.registerInfo.id && e.path != this.path && e.path != this.path + '/' && e.path.indexOf("/auxiliary/cityLove/register") < 0) {
          try {
            await showDialog("您还有没有填写交友信息,需填写后才可进行浏览详情。是否填写？");
            this.goPointPage("/auxiliary/cityLove/register")
          } catch (e) {
            this.$router.go(-1)
          }
        }
      }
    },
    async created() {


      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return

      this.cityLoveConfig().then(config => {

        this.footerConfig.footerInfo[1].name = config.field || '交友'
      })

      await this.cityLoveRegister({
        userId: this.user.id
      });


      try {
        if (!this.registerInfo.id && this.$route.path != this.path && this.$route.path != this.path + '/') {
          this.goPointPage("/auxiliary/cityLove/register")
        }
      } catch (e) {
        console.log(e)
      }

    }
  }
</script>
