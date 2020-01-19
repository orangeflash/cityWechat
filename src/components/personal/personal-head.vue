<template>

  <dd-layout-div
    :pad="[0,30]"
    class="flex flex-bt flex-col bg-t"
    :bg="`url(${bg})no-repeat 0 0 /100% 4.73rem ${$themeColor}`"
  >
    <dd-layout-div class="flex flex-bt" :height="140" :pad="[50,0]">
      <dd-layout-div class="flex-g-1 flex flex-y-center">
        <dd-layout-img :src="getInfo.portrait" :width="1.4" :height="1.4" :fillet="1.4"/>
        <dd-layout-div :mar="[0,0,0,26]" @click="goPointPage(getInfo.id?'/personal/homepage':'/login')">
          <dd-layout-div class="col-f fon-wb flex-g-1 flex" :line-height="50">
            <dd-layout-div :mar="[0,23,0,0]" :font-size="30" :max-w="290"
                           class="hide-e-3"
            >
              {{getInfo.userName ||'登录/注册'}}
            </dd-layout-div>
            <i class="iconfont col-f icon-iconfront- fon-w5"></i>
          </dd-layout-div>
          <dd-layout-div class="col-f" :mar="[15,0,0]" :line-height="26">
            {{getInfo.id?`uid:${getInfo.id}`:`尚未关联手机号，点击绑定`}}
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div :mar="[0,0,0,60]">
        <dd-layout-div class="iconfont icon-setting col-f" @click="goPointPage('/personal/setting?id='+getInfo.id)"
                       :font-size="50"/>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div :mar="[0,0,40,0]" class="flex">
      <dd-layout-div class="t-c flex-g-1" @click="goPointPage(item.path)" v-for="(item,key) in tabList" :key="key">
        <dd-layout-div class="col-f fon-b fon-wb" :mar="[0,0,23,0]">{{item.value}}</dd-layout-div>
        <dd-layout-div class="col-f" :op="0.6">{{item.label}}</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div
      v-if="platform.openVip == true"
      class="flex flex-y-center flex-bt" :pad="[0,30,0,20]"
      bg="linear-gradient(-90deg,rgba(255,225,171,1) 0%,rgba(255,240,209,1) 100%)"
      :height="93" :fillet="[30,30,0,0]">
      <dd-layout-div class="flex flex-y-center">
        <dd-layout-img class="bg-tran" :src="king"/>
        <dd-layout-div color="#6D5C3E" :font-size="30" :mar="[0,15]">{{platform.vipField || `同城会员卡`}}</dd-layout-div>
        <dd-layout-div :font-size="22" color="#8B5A39">享专属会员特权</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div color="#EABB7A" bg="#333333" :pad="[15,26,13]" :fillet="30"
                     @click="goPointPage({path:'/auxiliary/vip'})">{{getInfo.isVip?'立即续费':'开通会员'}}
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {PlaceholderAvatar} from "../../project-config/base";
  import bg from '../../assets/img/personal/new/bg.png'
  import king from '../../assets/img/personal/new/king.png'


  import DdLayoutImg from "../layout/dd-layout-img";

  export default {
    name: "PersonalHead",
    components: {DdLayoutImg},
    data() {
      return {
        king,
        bg,
        PlaceholderAvatar,
        myNum: {},
        userInfo: {},
        signInRuleInfo: {},
        vipConfig: {},
        tabList: [
          {
            value: 0,
            label: '我的发布',
            path: '/personal/myPublication'
          }, {
            value: 0,
            label: '我的余额',
            path: '/personal/myBalance'
          }, {
            value: 0,
            label: '我的积分',
            path: '/sign/signInPointsDetails'
          }, {
            value: 0,
            label: '我的收藏',
            path: '/personal/myAttention'
          }
        ]
      }
    },
    methods: {
      ...mapActions("personal", ["getMyNun", 'getUserInfoById']),
      ...mapActions("signIn", ["signInRule"]),
      ...mapActions('vip', ['getVipConfig',]),
      goPage(param) {
        if (typeof param === "string") {
          this.goPointPage({
            path: this.user.userTel ? param : '/login',
          })
        } else {
          this.goPointPage({
            ...param,
          })
        }
        // !this.user.userTel ? this.$pushRoute('/login') : this.$pushRoute(url);
      },
      async getMyMoney() {
        if (!this.user.userTel) return 0;
        this.userInfo = await this.getUserInfoById(this.$store.state.user.id);
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        platform: state => state.platform
      }),
      getInfo() {
        return {
          ...this.user,
          portrait: this.user.portrait || this.PlaceholderAvatar
        }
      }
    },
    async created() {
      this.getMyMoney()
      this.signInRule().then(result => {
        this.signInRuleInfo = result.data;
      })
      this.getMyNun().then(val => {
        this.tabList[0].value = val.post ? val.post : 0
        this.tabList[1].value = val.balance ? val.balance : 0
        this.tabList[2].value = val.integral ? val.integral : 0
        this.tabList[3].value = val.collection ? val.collection : 0
      });
      //会员设置
      this.getVipConfig().then(res => {
        this.vipConfig = res
      })
      // console.log(this.platform)
    }
  }
</script>
