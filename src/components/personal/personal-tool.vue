<template>
  <dd-layout-div :pad="[40,30,20]" class="bg-f">
    <dd-layout-div class="flex flex-bt flex-y-center">
      <dd-layout-div class="fon-wb fon-xxl">我的工具</dd-layout-div>
    </dd-layout-div>
    <dd-layout-div :mar="[40,0,0]" class="flex flex-wrap">
      <dd-layout-div width="25%" :mar="[0,0,30,0]" v-for="(item,key) in getArr" :key="key"
                     @click="goPointPage(item.path)" v-if="item.show">
        <dd-layout-img :src="item.icon" class="mar-a bg-tran" :width="0.56" :height="0.56"/>
        <dd-layout-div class="col-6 t-c" :mar="[22,0,0]">{{item.label}}</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  import address from '../../assets/img/personal/new/location.png'
  import collection from '../../assets/img/personal/new/collection.png'
  import comment from '../../assets/img/personal/new/comment.png'
  import authentication from '../../assets/img/personal/new/authentication.png'
  import DdLayoutImg from "../layout/dd-layout-img";


  export default {
    name: "PersonalTool",
    components: {DdLayoutImg},
    data() {
      return {
        testArr: [
          {
            icon: authentication,
            label: "认证中心",
            path: "/attestIndex?type=personal",
            field: 'identOpen',
            show: false,
          }, {
            icon: collection,
            label: "我的关注",
            path: "/personal/myAttention",
            show: true,
          }, {
            icon: comment,
            label: "我的评论",
            path: "/notFound",
            show: false,
          }, {
            icon: address,
            label: "我的地址",
            path: "/personal/shippingAddress",
            show: true,
          }]
      }
    },
    methods: {
      goPage(url) {

        const path = this.user.userTel ? url : '/login';
        this.goPointPage({
          obj: this,
          path: path,
        })

        //!this.user.userTel ? this.$pushRoute('/login') : this.$pushRoute(url);
      },
    },
    computed: {
      ...mapState({
        user: state => state.user,
        configSwitch: state => state.configSwitch
      }),
      getArr() {

        this.testArr[0].show = this.configSwitch.identOpen

        return this.testArr
      }
    }
  }
</script>

