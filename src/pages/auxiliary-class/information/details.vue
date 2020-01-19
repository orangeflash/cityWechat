<template>

  <div class="xxDetail">
    <Header></Header>
    <div class="banner-box">
      <Banner v-bind="banner"
              :showImage="true"></Banner>
    </div>
    <div class="bg-f">
      <div class="base-pad flex-x-bt br-b-e">
        <div class="flex-y-center">
          <!--<span class="yuan cbblue">卖</span>-->
          <span class="yuan cbred" v-if="XxInfo.buyType=='1'">{{stateName(XxInfo.buyType)}}</span>
          <span class="yuan cbblue" v-else>{{stateName(XxInfo.buyType)}}</span>
          <span class="fon-xl mar-l-30">{{XxInfo.typeName}}</span>
        </div>
        <div class="fon-sm fon-w6 col-r">￥{{XxInfo.price}}元/{{XxInfo.unit}}</div>
      </div>
      <div class="base-pad fon-sm">
        <div class="flex pad-b-20 pad-t-10 w100">
          <div class="flex-g-0 col-6 flex-col-end">品&nbsp&nbsp&nbsp&nbsp牌：</div>
          <div class="flex-g-1 col-3">{{XxInfo.brand}}</div>
        </div>
        <div class="flex pad-b-20 w100">
          <div class="flex-g-0 col-6 flex-col-end">数&nbsp&nbsp&nbsp&nbsp量：</div>
          <div class="flex-g-1 col-3">{{XxInfo.number}}{{XxInfo.unit}}</div>
        </div>
        <div class="flex pad-b-20 w100">
          <div class="flex-g-0 col-6 flex-col-end">交货地：</div>
          <div class="flex-g-1 col-3">{{XxInfo.address}}</div>
        </div>
        <div class="flex pad-b-20 w100">
          <div class="flex-g-0 col-6 flex-col-end">规&nbsp&nbsp&nbsp&nbsp格：</div>
          <div class="flex-g-1 col-3">{{XxInfo.spec}}</div>
        </div>
        <div class="flex-col-end">
          <span class="col-9 fon-xs mar-l flex-y-center"><i class="iconfont icon-Group- fon-xxl mar-r-10"></i>{{formatDateByTimeStamp(XxInfo.createdAt,"YYYY-MM-DD HH:mm")}}</span>
        </div>
      </div>
    </div>
    <div class="mar-t20 mar-b-20 bg-f">
      <div class="flex base-pad br-b-e">
          <div class="flex-g-1 br-r-d pad-r w50">
            <div class="flex flex-g-1 flex-y-center" @click="goPointPage({path:'/auxiliary/xx/zlxq',query:{postId:XxInfo.id}})">
              <div> <dd-layout-img class="flex-g-0 mar-r imgwidth" :src="XxInfo.portrait"
                                   :fillet="0.95"></dd-layout-img></div>
              <div class="flex-col">
                <div class="fon-35 mar-b-10">{{XxInfo.userName}}</div>
                <div class="col-9 fon-b">{{XxInfo.typeName}}</div>
              </div>
            </div>
          </div>
          <div class="flex-g-1 flex-x-bt pad-lr-20 w50">
              <div class="flex-y-center">
                <i class="iconfont icon-dianhua3 mar-t-5 fon-45 mar-r-10" :style="{color:$themeColor}"></i>
                <span class="fon-40 col-6">{{this.footerConfig.main.childrenName}}</span>
              </div>
          </div>
      </div>
      <div class="base-pad">
        <div class="fon-xss flex-y-center">
          <span v-if="XxInfo.guarantee=='1'" class="flex-y-center">
            <span class="textbox mar-r-5 mar-l col-activeb">保</span><span class="fon-sm col-3">担保</span>
          </span>
          <span v-else class="flex-y-center">
            <span class="textbox mar-r-5 mar-l col-9">保</span><span class="fon-sm col-9">非担保</span>
          </span>
          <span v-if="XxInfo.isAuth=='1'" class="flex-y-center">
            <span class="textbox mar-r-5 mar-l col-activeg">实</span><span class="fon-sm col-3">实名</span>
          </span>
          <span v-else class="flex-y-center">
            <span class="textbox mar-r-5 mar-l col-9">实</span><span class="fon-sm col-9">非实名</span>
          </span>

          <!--<span class="textbox mar-r-5 mar-l col-9">实</span><span class="fon-sm col-9">非实名</span>-->
          <!--<span class="textbox mar-r-5 mar-l col-activeh">V</span><span class="fon-sm col-3">合作会员</span>-->
        </div>
      </div>
    </div>
    <DetailsFooter v-bind="footerConfig" @method="footerChoice"></DetailsFooter>
  </div>
</template>

<script>
  import DetailsFooter from '../../../components/template/details-footer'
  import Banner from '@/components/home/banner';
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import {mapState, mapActions} from "vuex"
  import {Toast} from 'vant'
  import {hideLoading, showDialog, showLoading} from "@/util";
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {updateShareConfig, openLocation} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {DetailsFooter, Banner,DdLayoutImg},
    data() {
      return {
        showMapDialog: false,
        banner: {          //参数值
          height: 240,
          swiper: {
            children: []
          }
        },
        XxInfo: {},
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-fabudianjizhuangtai-',
              name: '发布',
              color: '#818181',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              useActive: false,
              color: '#818181',
              colorActive: this.$themeColor,
            },
          ],
          main: {
            name: '联系电话',
            childrenName: '',
          }
        },
      }
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      ...mapActions("Xx", ["getXxInfo"]),
      // openMap() {
      //   openLocation({
      //     lat: this.info.lat,
      //     lng: this.info.lng,
      //     name: this.info.area,
      //     address: this.info.address
      //   })
      // },
      stateName(buyType) {
        let s
        switch (buyType) {
          case '1':
            s = '买'
            break
          case '2':
            s = '卖'
            break
        }
        return s
      },
      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮
            this.callTel();
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/xx'
            })
          case 1:       //发布
            return this.goPointPage({
              path: '/auxiliary/xx/releasexx',
            });
          case 2:       //收藏
            this.collection();
            return;
        }
      },
      // 打电话
      async callTel() {
        if (this.XxInfo.isVip) {
          location.href = `tel://${this.XxInfo.userTel}`
        } else {
            try {
              await showDialog("需开通会员才能查看电话");
              this.goPointPage({
                path: '/auxiliary/xx/kt',
              });
            } catch (e) {
              console.log('用户没同意进入开通会员页面')
            }

        }
      },
      // 收藏开关
      async offOnCollection() {
        showLoading();
        let res = await this.collectPost({
          postId: this.id,
          type: 13,
        });
        //this.getInfo(this.id)
        if (res.code == 1) {
          res = res.data;
          if (res.status == 2) {
            Toast({
              message: '已取消',
              duration: 1000
            })

          } else {
            Toast({
              message: '已收藏',
              duration: 1000
            })
          }
        } else {
          hideLoading();
        }
        return res.status == 1
      },
      async getInfo(params) {
        showLoading();
        const res = await this.getXxInfo(params)
        hideLoading();
        this.findInfo(res)
        this.banner.swiper.children = res.media.map(item => {
          return {url: this.getSingleImg(item.url)}
        })
        this.XxInfo = {
          address: res.address,
          id: res.id,
          brand: res.brand,
          createdAt: res.createdAt,
          number: res.number,
          price: res.price,
          spec: res.spec,
          typeName: res.typeName,
          buyType: res.buyType,
          unit: res.unit,
          isAuth: res.isAuth,
          isVip: res.isVip,
          userTel: res.userTel,
          userName: res.userName,
          portrait: res.portrait,
          media: res.media,
          guarantee: res.guarantee,
        }
        this.$set(this.footerConfig.menu[2], 'colorActive', this.$themeColor);
        this.$set(this.footerConfig.menu[2], 'useActive', res.love);
        res.userTel && this.$set(this.footerConfig.main, 'childrenName',
          res.isVip ?
            res.userTel :
            this.hideTelNumber(res.userTel));
        // 配置转发信息
        updateShareConfig({
          title: `【${this.XxInfo.buyType=='1'?'买':'卖'}】 ${this.XxInfo.typeName}`,
           imgUrl: this.getSingleImg(this.XxInfo.media[0].url),
           desc: `价格:${this.XxInfo.price};数量:${this.XxInfo.number}${this.XxInfo.unit};交货地:${this.XxInfo.address};规格:${this.XxInfo.spec};`,
           link: window.location.href,
        })
      },
      // 收藏
      async collection() {
        const bool = await this.offOnCollection();
        this.$set(this.footerConfig.menu[2], 'useActive', bool);
      }
    },
    created() {
      let query = this.$route.query;
      this.isFailParams({
        field: query.id,
        tips: '缺少信息id',
      }, async () => {
        this.getInfo({id: query.id})
        this.id = query.id;
      })
    },
    computed: {}
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  @import "../../../assets/theme";
  .xxDetail{
    padding-bottom: 120px;
  }
  .yuan{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
  }
  .cbred{
    color: #f00;
    border:1.1px solid #f00;
  }
  .cbblue{
    color: #1C9BFC;
    border:1.1px solid #1C9BFC;
  }
  .ckxx{
    border:1.1px solid #69A3F8;
    color: #69A3F8;
    padding:16px 15px;
    line-height: 15px;
  }
  .textbox{
    border-radius: 5px;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border:1.1px solid #999;
  }
  .col-activeg{
    color: #6EB7BE;
    border:1.1px solid #6EB7BE;
  }
  .col-activeh{
    color: #5A94E9;
    border:1.1px solid #5A94E9;
  }
  .col-activeb{
    color: #4DBFC6;
    border:1.1px solid #4DBFC6;
  }
  .imgwidth{
    width: 90px !important;
    height: 90px !important;
  }
</style>
