<template>
  <div>
    <router-view></router-view>
    <Footer
      v-bind="footerConfig"
      v-if="$route.meta.defaultTab"
      @choiceReleasType="choiceReleasType"
    ></Footer>
  </div>
</template>

<script>
  import Operation from "@/components/template/operation"
  import Footer from '@/components/template/footer'                 //页脚


  import {mapActions, mapState} from 'vuex';
  import {showDialog} from "../../../util";

  export default {
    components: {Footer, Operation},
    data() {
      return {
        showOperation: false,
        actions: [],
        footerConfig: {
          color: '#818181',
          activeColor: 'red',
          prominent: true,
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              icon: 'icon-huodong1',
              name: '同城活动',
              activeIcon: '',
              link: '/auxiliary/activity',
              active: 'active'
            },
            // {
            //   icon: 'icon-jiahao',
            //   name: '发布',
            //   method: 'choiceReleasType'
            // },
            {
              icon: 'icon-jilu',
              name: '我的收藏',
              link: '/auxiliary/activity/collection',
            }, {
              icon: 'icon-ren3',
              name: '我的',
              link: '/auxiliary/activity/order',
            }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      })
    },
    methods: {
      ...mapActions("shop", ["getShopInfoByParams"]),
      async choiceReleasType() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.getShopInfoByParams({
          adminId: this.user.id
        }).then(async result => {


          if (result.length > 0) {
            this.goPointPage({
              path: '/auxiliary/activity/release'
            })
          } else {
            try {
              await showDialog("您还不是商家，是否入驻？");
              this.goPointPage({
                path: '/publication/businessEnterForm'
              })
            } catch (e) {
              console.log("老板，功能要求是这样的，我也没办法啊！")
            }

          }
        })
      },
    },
  }
</script>
