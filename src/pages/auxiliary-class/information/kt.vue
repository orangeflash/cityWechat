<template>

  <div id="kt">
    <div class="w100">
      <Header/>
      <van-tabs class="mar-t20" :line-width="65" @click="changeTab" :color="$themeColor" v-model="active">
        <van-tab class="br-t-e br-b-e" :title="label" v-for="(label,key) in tabList" :key="key">
          <template v-if="!active">
            <van-radio-group v-model="mealId">
              <van-cell-group>
                <van-cell center v-for="item in vipList" :key="item.id" @click="radioChange(item.id)">
                  <van-radio :checked-color="$themeColor" slot="icon" :name="item.id"/>
                  <van-cell>
                    <template slot="title">
                      <div class="flex-x-bt">
                        <div>
                          <span class="nameWidth">{{item.name}}</span>
                          <span class="zq">账期：{{item.data.vipTime}}天</span></div>
                        <div class="col-t fon-xl">{{+item.data.vipMoney?item.data.vipMoney+'元':'免费'}}</div>
                      </div>
                    </template>
                  </van-cell>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>
          <template v-else>
            <van-radio-group v-model="mealIdTwo">
              <van-cell-group>
                <van-cell center v-for="item in myVip" :key="item.typeId" @click="radioChangetwo(item.typeId)">
                  <van-radio :checked-color="$themeColor" slot="icon" :name="item.typeId"/>
                  <van-cell>
                    <template slot="title">
                      <div class="flex-x-bt">
                        <div>
                          <span class="nameWidth">{{item.typeName}}</span>
                          <span class="zq">账期：{{item.data.vipTime}}天</span></div>
                        <div class="col-t fon-xl">{{+item.data.vipMoney?item.data.vipMoney+'元':'免费'}}</div>
                      </div>
                      <div class="flex-x-bt" style="margin-top: 10px;">
                        <div @click="gradeInfoshow=true" class="col-9 fon-sm"><span class="mar-r">到期时间</span>{{item.endTime}}</div>
                      </div>
                    </template>
                  </van-cell>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>
        </van-tab>
      </van-tabs>
      <div class="foot-mar-btn rel">
        <button @click="confirm" v-if="!active">{{openingMoney>0?'开通需支付'+(+openingMoney).toFixed(2)+"元":'立即开通'}}</button>
        <button @click="confirm" v-else>{{renewMoney>0?'续费需支付'+(+renewMoney).toFixed(2)+"元":'立即续费'}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {},
    data() {
      return {
        vipList:[],
        myVip:[],
        active: 0,
        mealId: 0,
        mealIdTwo: 0,
        mealInfo: {},
        mealInfoTwo: {},
        openingMoney: 0,   //开通金额  默认0
        renewMoney: 0,    //续费金额  默认0
      }
    },
    methods: {
      ...mapActions("Xx", ["XxCardList","XxActivation"]),
      changeTab(active) {
        console.log(active)
      },
      async radioChange(id) {
        this.mealId = id;
        this.mealInfo = this.vipList.find((item) => item.id == id)
        this.openingMoney = this.mealInfo.data.vipMoney
        //console.log(id, this.mealInfo,this.openingMoney)
      },
      async radioChangetwo(id) {
        this.mealIdTwo = id;
        this.mealInfoTwo = this.myVip.find((item) => item.typeId == id)
        this.renewMoney = this.mealInfoTwo.data.vipMoney
        //console.log(id, this.mealInfoTwo,this.renewMoney)
      },
      async getData() {
        showLoading()
        let result = await this.XxCardList();
        this.vipList = result.vipList;
        this.myVip = result.myVip;
        hideLoading()
        this.mealId = this.vipList.length>0 ? this.vipList[0].id:0;
        //this.openingMoney = value.data.publishMoney
        this.radioChange(this.mealId)
      },
      async judgeData() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        //console.log(this.mealId, this.active)
        let res = {}, msg = '';
        if (!this.active && !this.mealId) msg = "请选择开通类型";
        else if (this.active && !this.mealIdTwo) msg = '请选择续费类型';
        if (!msg) {
          res.status = true
        }
        res.msg = msg;
        return res;
      },
      async confirm() {
        const result = await this.judgeData()
        // console.log(result,this.active,this.mealId,this.mealInfo)
         //return
        if (result.status) {
          showLoading();
          let result = await this.XxActivation({
            typeId: this.active ? this.mealIdTwo:this.mealId
          });
          console.log(result)
          if (result.code) {
            let money = this.active ? +this.renewMoney:+this.openingMoney
            if (money > 0 && !this.active) {
              try {
                hideLoading();
                await showDialog("需要支付" + money + "元", "提示");
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 45,
                    param: {
                      orderId: result.data,
                    },
                    info: {
                      money: this.openingMoney,
                      type: "会员支付",
                      callLink: "/auxiliary/xx/kt"
                    }
                  }
                });
              } catch (e) {
              }
            } else {
              showHandleStatusByFlag([true, '提交成功'])
              setTimeout(() => {
                this.$popRoute()
              }, 1000)
            }
          } else {
            showText(result.msg, 2000, true);
          }
        } else {
          showText(result.msg);
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      tabList() {
        return ['未开通', '已开通',]
      },
    },
    created() {
      this.getData();
    }
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";
  .zq {
    font-size: $font-size-sm;
    background: #FF5669;
    padding: 2px 10px;
    margin-left: 10px;
    border-radius: 10px;
    color: #fff;
  }
  .nameWidth{
    display: inline-block;
    width:200px;
  }
</style>
