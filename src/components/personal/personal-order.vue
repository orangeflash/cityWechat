<template>
  <dd-layout-div :pad="[40,30]" class="bg-f">


    <!--不想再创建新的文件，我就把签到和任务放在这里了-->
    <dd-layout-div class="flex flex-bt" :pad="[0,0,configSwitch.shop?40:0]"
                   v-if="taskShow || signInRuleInfo&&signInRuleInfo.signSwitch == 'open'">
      <dd-layout-div class="bg-t flex-bt flex-col over-h" @click="goPointPage('/sign')"
                     v-if="signInRuleInfo&&signInRuleInfo.signSwitch == 'open'" :width="330" :height="140" :fillet="30"
                     :op="0.9">
        <dd-layout-div class="flex flex-bt flex-y-center" :pad="[25,8,0,25]">
          <dd-layout-div class="col-f fon-wb fon-lg flex flex-y-center">
            <dd-layout-div class="col-f" bg="#FFD632" :pad="[12,12,8]" :mar="[0,7,0,0]" :fillet="20" :font-size="23">
              签到
            </dd-layout-div>
            签到中心
          </dd-layout-div>
          <i class="iconfont icon-right col-f mar-t-5"></i>
        </dd-layout-div>
        <dd-layout-div :pad="[0,20,0,25]" class="col-f fon-w5 flex-bt flex-y-center">
          连续签到有惊喜！
          <dd-layout-img class="bg-tran" :src="sign" :width="0.76" :height="0.69"/>
        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div class="bg-t flex-bt flex-col over-h" v-if="taskShow"
                     @click="goPointPage({path:'/personal/integralMall/task'})"
                     :width="330" :height="140" :fillet="30" :op="0.9">
        <dd-layout-div class="flex flex-bt flex-y-center" :pad="[25,8,0,25]">
          <dd-layout-div class="col-f fon-wb fon-lg flex flex-y-center">
            <dd-layout-div class="col-f" bg="#FFD632" :pad="[12,12,8]" :mar="[0,7,0,0]" :fillet="20" :font-size="23">
              任务
            </dd-layout-div>
            任务中心
          </dd-layout-div>
          <i class="iconfont icon-right col-f mar-t-5"></i>
        </dd-layout-div>
        <dd-layout-div :pad="[0,20,0,25]" class="col-f fon-w5 flex-bt flex-y-center">
          做任务领积分！
          <dd-layout-img class="bg-tran" :src="pig" :width="0.76" :height="0.69"/>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div v-if="configSwitch.shop">
      <dd-layout-div class="flex flex-bt flex-y-center">
        <dd-layout-div class="fon-wb fon-xxl">商城订单</dd-layout-div>
        <dd-layout-div class="col-9" @click="goPointPage('/auxiliary/mall/order')">全部订单<i
          class="iconfont icon-right col-9 fon-xss"></i></dd-layout-div>
      </dd-layout-div>
      <dd-layout-div :mar="[40,0,0]" class="flex">
        <dd-layout-div class="flex-g-1" v-for="(item,key) in testArr" :key="key" @click="goPointPage(item.path)">
          <dd-layout-img :src="item.icon" class="mar-a bg-tran" :width="0.56" :height="0.56"/>
          <dd-layout-div class="col-6 t-c" :mar="[22,0,0]">{{item.label}}</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

  </dd-layout-div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  import list from '../../assets/img/personal/new/list.png'
  import wallet2 from '../../assets/img/personal/new/wallet2.png'
  import gift from '../../assets/img/personal/new/gift.png'
  import comment2 from '../../assets/img/personal/new/comment2.png'
  import money from '../../assets/img/personal/new/money.png'
  import pig from '../../assets/img/personal/new/pig.png'
  import sign from '../../assets/img/personal/new/sign.png'


  import DdLayoutImg from "../layout/dd-layout-img";

  export default {
    name: "PersonalOrder",
    components: {DdLayoutImg},
    data() {
      return {
        sign, pig,
        taskShow: false,
        signInRuleInfo: {},
        testArr: [
          {
            icon: list,
            label: "待付款",
            path: "/auxiliary/mall/order?status=1&from=personal"
          },
          {
            icon: wallet2,
            label: "待收货",
            path: "/auxiliary/mall/order?status=2&from=personal"
          }, {
            icon: comment2,
            label: "待评价",
            path: "/auxiliary/mall/order?status=3&from=personal"
          }, {
            icon: gift,
            label: "已完成",
            path: "/auxiliary/mall/order?status=4&from=personal"
          }, {
            icon: money,
            label: "退款/售后",
            path: "/auxiliary/mall/order?status=5&from=personal"
          },
        ]
      }
    },
    methods: {
      ...mapActions('signIn', ["signInRule"]),
      ...mapActions('personal/task', ["getTaskSet"]),
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
        configSwitch: state => state.configSwitch,
      })
    },
    created() {
      this.signInRule().then(result => {
        this.signInRuleInfo = result.data;
      })
      this.getTaskSet().then(result => {
        this.taskShow = result.data.task == 'open'
      })
    }
  }
</script>
