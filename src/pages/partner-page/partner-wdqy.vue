<template>
  <div id="PartnerWdqy">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <section class="banner__wrap" v-if="bannerList.length">
      <Banner
        :height="platform.slideNum"
        :notHost="false" :swiper="{children:bannerList}"></Banner>
    </section>
    <header class="form-head">您当前等级: <em class="col-t">{{hhrmeal.name}}</em></header>
    <van-cell @click="pickerChoice({field:'gradeType',name:'合伙人等级'})" class="hhr-name" :title="gradeInfo.name" is-link/>
    <header class="form-head">费用及等级特权</header>
    <div class="Partnerhomemainbox">
      <van-row>
        <van-col v-for="(item,index) in partnerarr" span="8" :key="index">
          <!--<img-wrapper  not-load="true":src="timg" class="topimg"></img-wrapper>-->
          <!--<div @click="goPointPage({name: `${item.url}`,params:item.param})" class="vancolitem">-->
          <div class="vancolitem">
            <i class="topimg iconfont" :class="[item.icon]" :style="{color:item.color}"></i>
            <em>{{item.title}}</em>
            <div class="one-grade">{{item.oneGrade}}%</div>
            <div v-if="partnerConfig.class=='2'" class="two-grade">（二级{{item.secGrade}}%)</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <!--<van-radio-group v-model="mealId">-->
    <!--<van-cell-group>-->
    <!--<van-cell center v-for="item in businessPackages" :key="item.id"  @click="radioChange(item.id)">-->
    <!--<van-radio slot="icon" :name="item.id"/>-->
    <!--<van-cell>-->
    <!--<template slot="title">-->
    <!--<div class="hhrdj">-->
    <!--<div>{{item.name}}<span class="hhrdjzq">账期：{{item.days}}天</span></div>-->
    <!--<div class="hhmoney">{{item.money||'免费'}}元</div>-->
    <!--</div>-->
    <!--<div class="hhrdj" style="margin-top: 5px;">-->
    <!--<div @click="gradeInfoshow=true" class="hhjrfy">提成比例:<span class="hhrdjtcbl">查看</span></div>-->
    <!--<div class="hhjrfy">加入费用</div>-->
    <!--</div>-->
    <!--</template>-->
    <!--</van-cell>-->
    <!--</van-cell>-->
    <!--</van-cell-group>-->
    <!--</van-radio-group>-->
    <header class="form-head">提成比例及说明</header>
    <div class="tcblsm">
      <ul>
        <li><span>{{chooseMeal.name}}</span>加入费用<span>¥{{chooseMeal.money}}</span></li>
        <!--<li>您的粉丝付费发布、置顶、刷新、入驻商户、加入合伙人等操作，您可获得提成<span>8%（二级6%）</span>，躺着就能赚钱。</li>-->
        <li>您的粉丝付费发布、置顶、刷新、入驻商户、加入合伙人等操作，您可获得提成，躺着就能赚钱。</li>
        <li style="margin-top: 10px;">收益账期为<span>T+{{chooseMeal.days}}天</span>，产生的收益会在<span>{{chooseMeal.days}}天</span>后自动转入您的钱包。
        </li>
      </ul>
    </div>
    <footer class="submit__container">
      <!--<button class="feature-btn" :disabled="!checked" @click="partnerFormSubmit">-->
      <!--{{+chooseMeal.money?`支付金额 ${+chooseMeal.money}`:'确认'}}-->
      <!--</button>-->
      <button class="feature-btn" :disabled="!checked" @click="partnerFormSubmit">
        立即升级
      </button>
    </footer>
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        :title="pickerTitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Banner from '../../components/home/banner'    //首页banner
  import InputWithCmp from "../../components/publication/input-with-cmp";
  import BasicForm from "../../components/publication/basic-form";
  import CheckBox from "../../components/basic/check-box";
  import {
    hideLoading,
    randomNumber,
    showDialog,
    showLoading,
    showHandleStatusByFlag,
    validFormNotEmpty, showText
  } from "../../util";
  import PayMask from "../../components/publication/pay-mask";
  import _ from 'lodash'
  import {Popup, Dialog} from 'vant';
  import {chooseWXPay} from "../../util/wechat-util";
  import Header from "@/components/header";
  import {Toast} from 'vant';

  export default {
    name: "PartnerEnterForm",
    components: {Banner, CheckBox, BasicForm, InputWithCmp, PayMask, Header},
    data() {
      return {
        checked: true,
        shopIntroduction: "",
        mealId: 0,            //选择的套餐
        bannerList: [],
        gradeInfo: '',
        hhrmeal:{},
        partnerarr: [
          {
            title: "加入比例",
            icon: "icon-hehuoren",
            color: "#50CB70",
            // url: "Rule",
            // param:{rulefrom:"partnerWdtq",rulequery:0},
            url: "PartnerWdqy",
          },
          {
            title: "信息比例",
            icon: "icon-xinxi",
            color: "#FE6033",
            url: "PartnerWdfs"
          },
          {
            title: "商家比例",
            icon: "icon-shangjia1",
            color: "#0BB7F7",
            url: "PartnerWdsr"
          },
        ],
        //picker
        pickerShow: false,
        pickerTitle: '标题',
        columns: [],
        columnsData: {
          gradeType: [],
          goodType: {},
        },
        pickerData: {
          coupon: [
            {
              name: '抢购标题',
              desc: '',
              type: 'text',
              placeholder: '限时抢购标题',
              field: 'title'
            },
          ],
          goodType: [
            {
              name: '商品分类',
              desc: '请选择',
              field: 'goodType'
            },
          ],
          dateData: [
            {
              name: '抢购开始时间',
              desc: '请选择',
              field: 'startTime'
            },
            {
              name: '抢购结束时间',
              desc: '请选择',
              field: 'endTime'
            },
          ],
          dateDataTwo: [
            {
              name: '消费截止时间',
              desc: '请选择',
              field: 'expireTime'
            },
          ],
        },
        params: {},
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getPartnergrade", "getPartnerconfig", "getPartnergradeInfo", "getPartnerstatus"]),
      ...mapActions('personal', ['getUserInfoById']),
      ...mapActions("partner/partnerEnter", ["submitPartnerForm", "getpartnerMyBoss", "getFindsuperior", "postpartnerUpgrade"]),
      pickerChoice(item, index) {
        console.log(item, index)
        this.pickerField = item.field
        this.pickerIndex = index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
          case 'expireTime':
            this.showDatetime = !this.showDatetime;
            return
          case 'week':
          case 'month':
            this.checkboxPicker[item.field].show = !this.checkboxPicker[item.field].show;
            console.log('this.checkboxPicker', this.checkboxPicker)
            return
          case 'goodType':
            this.columns = this.columnsData[item.field].columns;
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'gradeType':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        let desc = '', format = 'YYYY-MM-DD HH:mm';
        console.log(this.pickerField, this.pickerIndex)
        switch (this.pickerField) {
          case 'startTime':
          case 'endTime':
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
            this.params[this.pickerData.dateData[this.pickerIndex].field] = Math.round(new Date(value).getTime() / 1000);
            break;
          case 'expireTime':
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateDataTwo[this.pickerIndex], 'desc', desc);
            this.params[this.pickerData.dateDataTwo[this.pickerIndex].field] = Math.round(new Date(value).getTime() / 1000);
            break;
          case 'week':
          case 'month':
            this.checkboxPicker[this.pickerField].selected = value
            this.checkboxPicker[this.pickerField].show = false
            break;
          case 'goodType':
            this.$set(this.pickerData.goodType[this.pickerIndex], 'desc', value[0].name);
            this.params.typeId = value[0].id
            break;
          case 'gradeType':
            this.params[this.pickerField] = value;
            this.radioChange(value.id)
            break;
        }
        console.log(value, this.params)
      },
      // 提交
      async partnerFormSubmit() {
        const bool = await this.checkBindTel()
        if (!bool) return
        const meal = this.chooseMeal, mealId = this.mealId, hhrzt = this.hhrzt,
          hhrmeal = this.hhrmeal;
        console.log(meal, mealId, hhrzt, hhrmeal)
        if (mealId == hhrzt.gradeId) {
          return showDialog("请选择非当前等级!", "提示", false);
        }
        const form = {
          gradeId: mealId
        }
        const needPay = Number(meal.money) - Number(hhrmeal.money) > 0
        if (needPay) {
          try {
            await showDialog("需要支付" + (Number(meal.money) - Number(hhrmeal.money)) + "元");
          } catch (e) {
            console.log('老板，我是要赚钱的啊~')
            return false;
          }
        } else {
          try {
            await showDialog("确定修改为" + meal.name + "?");
          } catch (e) {
            return false;
          }
        }
        // console.log(this.params)
        // return
        showLoading()
        const res = await this.postpartnerUpgrade(form);
        if (res.code) {
          showHandleStatusByFlag([true, '提交成功'])
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 41,
                param: {
                  id: res.data
                },
                info: {
                  money: Number(meal.money) - Number(hhrmeal.money),
                  type: "升级支付",
                  callLink: '/partner/partnerWdqy',
                }
              }
            });
          } else {
            setTimeout(() => {
              this.$popRoute()
            }, 1000)
          }
        } else {
          showText(res.msg, 2000, true);
        }
      },
      async getUserInfo() {
        this.userinfo = await this.getUserInfoById()
        console.log(this.userinfo)
        if (this.userinfo.isPartner == '1') {
          await showDialog("您已成为合伙人", "提示", false);
          this.$replaceRoute({name: 'PartnerIndex'});
        }
      },
      async banner() {
        this.bannerList = await this.getBannerList({
          type: 8, adType: 2
        });
      },
      async getGrade() {
        // 默认选中第一个
        await this.getPartnergrade();
        this.radioChange(this.mealId)
        hideLoading()
      },
      async gethhrpz() {
        await this.getPartnerconfig();
        // console.log(this.partnerConfig)
      },
      async gethhrzt() {
        this.hhrzt = await this.getPartnerstatus()
        this.mealId = this.hhrzt.gradeId
        // console.log(this.hhrzt,this.mealId)
      },
      async getMyboss() {
        this.myboss = await this.getpartnerMyBoss();
        console.log('myboss', this.myboss)
      },
      async getCmpInitializationData() {
        showLoading()
        //获取用户信息
        // this.getUserInfo();
        //获取轮播图
        this.banner();
        //合伙人配置
        this.gethhrpz();
        //获取合伙人状态
        // console.log(this.gethhrzt())
        await this.gethhrzt()
        //获取等级
        await this.getGrade();
        //我的上线
        // this.getMyboss()
      },
      async radioChange(id) {
        this.mealId = id;
        const gradeInfo = await this.getPartnergradeInfo({gradeId: id})
        this.gradeInfo = gradeInfo
        this.partnerarr[0].oneGrade = gradeInfo.partnerFirst
        this.partnerarr[0].secGrade = gradeInfo.partnerSecond
        this.partnerarr[1].oneGrade = gradeInfo.postFirst
        this.partnerarr[1].secGrade = gradeInfo.postSecond
        this.partnerarr[2].oneGrade = gradeInfo.storeFirst
        this.partnerarr[2].secGrade = gradeInfo.storeSecond
        console.log(this.gradeInfo)
      },
    }
    ,
    computed: {
      ...
        mapState("partner", {
          partnerConfig: state => state.partnerConfig,
          businessPackages: state => state.businessPackages,
        }),
      chooseMeal() {
        // if (+this.storeConfig.charge === 2) return {};
        return _.find(this.businessPackages, {id: this.mealId}) || {};
      }
      ,
    }
    ,
    async created() {
      await this.getCmpInitializationData();
      this.columnsData.gradeType = this.businessPackages
      this.hhrmeal = _.find(this.businessPackages, {id: this.hhrzt.gradeId}) || {}
      console.log(this.businessPackages)
    }
  }
</script>


<style lang="scss">
  @import "../../assets/common";

  #PartnerWdqy {
    .van-radio {
      font-size: 0;
    }

    .van-icon-check {
      color: $themeColor;
    }

    .van-icon-checked {
      color: $themeColor;
    }
  }

  /*.van-cell__title {*/
  /*color: #666;*/
  /*}*/
</style>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #PartnerWdqy {
    padding-bottom: 120px;

    .hhr-name {
      color: #000;
    }

    .Partnerhomemainbox {
      margin-top: 30px;
      font-size: $font-size-base;
      background: #fff;

      .topimg {
        font-size: 50px;
      }

      .vancolitem {
        box-sizing: border-box;
        border-right: 1.1px solid #f5f5f5;
        border-bottom: 1.1px solid #f5f5f5;
        @include flex-center($direction: column);
        padding: 30px 20px;

        em {
          margin-top: 20px;
          color: #666;
        }

        div {
          color: $themeColor;
          margin-top: 20px;
        }
      }
    }

    .banner__wrap {
      font-size: 0;

      img {
        width: 100%;
      }
    }

    .form-head {
      color: #777777;
      padding: 25px 29px;
      font-size: $font-size-base;
      @include flex-between;

      &__legend {
        font-size: $font-size-base;
      }

      &__version-info {
        color: $themeColor;
      }
    }

    .van-cell {
      font-size: 15px;
    }

    .yqm {
      color: #666;
    }

    .hhrdj {
      @include flex-between;

      .hhmoney {
        color: $themeColor;
        font-size: $font-size-xl;
      }

      .hhjrfy {
        color: #999;
        font-size: $font-size-sm;
      }

      &tcbl {
        color: #FF5669;
      }

      &zq {
        font-size: $font-size-sm;
        background: #FF5669;
        padding: 2px 10px;
        margin-left: 10px;
        border-radius: 10px;
        color: #fff;
      }
    }

    .tcblsm {
      background: #fff;
      padding: 25px 29px;
      line-height: 40px;

      span {
        color: $themeColor;
      }
    }

    .protocol__container {
      display: flex;
      align-items: center;
      height: 74px;
      padding: 0 30px;
      background-color: #fff;

      .checkbox {
        padding-right: 20px;
        padding-left: 4px;
      }

      .desc {
        font-size: 24px;
        color: #999999;

      }

      .doc {
        color: $themeColor;
      }
    }

    .submit__container {
      position: fixed;
      width: 100%;
      bottom: 0;
      @include flex-center;
      background-color: #fff;
      padding: 0;

      .feature-btn {
        flex: 1;
        height: 90px;
        background-color: $themeColor;
        border-radius: 0px;
        @include flex-center;
        font-size: 34px;
        color: rgba(255, 255, 255, 1);

        &:disabled {
          background-color: #ccc;

        }
      }
    }

    .popupPact {
      width: 100%;
      height: 100%;
      background-color: #f9f9f9;
    }

    .pactBody {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      line-height: 40px;
      overflow-Y: scroll;
      height: calc(100% - 130px);
      padding: 30px 30px 0;
      font-size: 28px;
    }

    .cancel {
      width: 100%;
      height: 130px;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      background-color: #fff;
      @include flex-center;

      .cancel-text {
        display: inline-block;
        height: 88px;
        line-height: 88px;
        width: 80%;
        font-size: 30px;
        background-color: $themeColor;
        border-radius: 10px;
      }
    }

    .dialogyqm {
      margin: 20px 10%;
      width: 80%;
      box-sizing: border-box;
      border: 1PX solid #ddd;
    }

    .dialogts {
      font-size: $font-size-xss;
      color: #FF8D39;
      padding-bottom: 40px;
    }

    .gradeInfo {
      padding: 50px 20px;
      font-size: $font-size-base;

      li {
        margin-bottom: 20px;
      }

      span {
        color: #FF5669;
        margin-left: 10px;
      }
    }
  }
</style>
