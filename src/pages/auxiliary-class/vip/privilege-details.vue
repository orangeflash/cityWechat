<template>
  <div id="GiftDetails" class="pad-b130">
    <Header></Header>
    <Banner
      v-if="giftDetails.logo"
      :height="platform.slideNum"
      :showImage="true"
      :swiper="{children:giftDetails.logo}"
    ></Banner>
    <div class="bg-f">
      <CellList :after-right="true">
        <div slot="content" class="flex-row">
          <div class="date mar-r br-t br-r-10 flex-row flex-g-0"><span class="flex-center bg-t col-f">{{new Date().getMonth()+1}}月</span><span class="flex-center col-t">{{new Date().getDate()}}日</span></div>
          <div>{{giftDetails.title}}</div>
        </div>
        <div slot="content" class="mar-t col-t">{{giftDetails.subheading}}</div>
      </CellList>
      <CellList v-if="giftDetails.label&&giftDetails.label.length!=0">
        <div slot="content" class="flex-row flex-wrap">
          <div v-for="(item,index) in giftDetails.label" class="flex-y-center mar-r col-t"><span class="iconfont icon-gouxuan mar-r"></span><span>{{item}}</span></div>
        </div>
      </CellList>
    </div>
    <div v-if="platform.openVip" class="bg-f9 pad-30 flex-bt flex-y-center" @click="goPointPage({path:'/auxiliary/vip/enterVip'})">
      <div class="flex-y-center">
        <div class="pad-10 bg-t col-f mar-r br-r-10"><span class="iconfont icon-tianchongxing- mar-r-10"></span><span
          class="fon-xs">超级会员卡</span></div>
        <div>还不是会员?</div>
      </div>
      <div class="col-t"><span>立即开通</span><span class="ljkt-jt"></span></div>
    </div>
    <CellList v-if="giftDetails.receive&&giftDetails.receive.length>0" :is-last="true" icon="icon-yufukuanyufukuanjil fon-40 col-t">
      <div slot="content" class="flex-y-center">
        <div class="flex-g-1">已领取<span class="col-t">{{giftDetails.receiveNum}}份</span></div>
        <face-map v-bind="faceMap" @click="choiceFace"/>
      </div>
    </CellList>
    <div class="mar-t20">
      <CellList :no-after-left="true" icon="icon-location fon-40 col-t" title="使用流程"></CellList>
      <CellList>
        <div slot="content" class="flex-row flex-wrap">
          <div class="flex-y-center mar-r col-t fon-sm"><div class="mar-r-10 f-text">{{1}}</div><div>开通会员</div></div>
          <div class="flex-y-center mar-r col-t fon-sm"><div class="mar-r-10 f-text">{{2}}</div><div>选择商家</div></div>
          <div class="flex-y-center mar-r col-t fon-sm"><div class="mar-r-10 f-text">{{3}}</div><div>领取优惠</div></div>
          <div class="flex-y-center mar-r col-t fon-sm"><div class="mar-r-10 f-text">{{4}}</div><div>到店核销</div></div>
          <!--<div v-for="(item,index) in ['1','2','3','1',]" class="flex-y-center mar-r col-t fon-sm"><span class="mar-r-10 f-text">{{index+1}}</span><span>选择商家</span></div>-->
        </div>
      </CellList>
    </div>
    <div class="mar-t20">
      <CellList :no-after-left="true" icon="icon-shangdian fon-40 col-t" title="商家信息"></CellList>
      <layout-one @click="callTel(giftDetails.linkTel)" class="pad-t-20" :body="{ bd: 1,ft: 1,ftcenter:1}">
        <div slot="body-bd-f">
          <span class="iconfont icon-location col-t mar-r-10"></span><span>{{giftDetails.storeName}}</span>
        </div>
        <template slot="body-bd-t">
          <span class="col-9 fon-sm">营业时间:{{giftDetails.businessStartTime}}-{{giftDetails.businessEndTime}}</span>
        </template>
        <template slot="body-ft">
          <span class="iconfont icon-dianhuahover fon-45 col-r"></span>
        </template>
      </layout-one>
      <CellList @click="openMap" ft-icon="icon-qunfengfabushangxian fon-45 col-b" :content="giftDetails.address"></CellList>
    </div>
    <div class="bg-f mar-t20">
      <CellList :no-after-left="true" icon="icon-card fon-45 col-t" title="使用须知"></CellList>
      <CellList :is-last="true" :not-center="true">
        <div slot="icon" class="f-text40 bg-r">折</div>
        <div slot="content" class="mar-l col-3">会员卡可享受<span class="col-t">{{giftDetails.discount}}</span>折优惠，(满<span class="col-t">￥{{giftDetails.condition}}</span>可用)</div>
      </CellList>
      <CellList v-if="giftDetails.week" :is-last="true" :not-center="true">
        <div slot="icon" class="f-text40 bg-b">周</div>
        <div slot="content" class="mar-l">{{giftDetails.week}}<span class="col-3 mar-l">可用</span></div>
      </CellList>
      <CellList v-if="giftDetails.month" :is-last="true" :not-center="true">
        <div slot="icon" class="f-text40 bg-y">月</div>
        <div slot="content" class="mar-l">{{giftDetails.month}}<span class="col-3 mar-l">可用</span></div>
      </CellList>
      <CellList :is-last="true" :not-center="true">
        <div slot="icon" class="f-text40 bg-9">限</div>
        <div slot="content" class="mar-l col-3">1个会员仅可领取<span class="col-t">{{giftDetails.max}}</span>次优惠</div>
      </CellList>
      <CellList :is-last="true" :not-center="true">
        <div slot="icon" class="f-text40 bg-9">注</div>
        <div slot="content" class="mar-l col-3">{{giftDetails.explain}}</div>
      </CellList>
    </div>
    <div class="bg-f mar-t20">
      <CellList :no-after-left="true" title="优惠详情"></CellList>
      <dd-layout-html class="base-pad" :html='giftDetails.details'></dd-layout-html>
      <div class="details-imgs">
        <img-wrapper :isShowView="true" :pictures="getMediaList(giftDetails.media).img" v-for="(item,index) in getMediaList(giftDetails.media).img" :key="index" :src="item" not-load="true"/>
      </div>
    </div>
    <DetailsFooter v-bind="footerConfig" @method="footerChoice"></DetailsFooter>
    <!--弹出框-->
    <van-dialog
      style="width: 70%"
      :title="giftDetails.title"
      v-model="dialogShow"
    >
      <div class="pad-30 flex-col-center">
        <div id="qrcode" ref="qrcode"></div>
        <!--<div class="pad-t">仅限{{formatDateByTimeStamp(giftDetails.endTime,"YYYY-MM-DD")}}前使用</div>-->
        <div class="pad-t">仅限特权日使用</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Banner from '../../../components/home/banner';
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import CellList from "../../../components/template/dd-store/cell-list";
  import FaceMap from '@/components/template/other/face-map';
  import Chunk from '@/components/template/dd-store/chunk';
  import DetailsFooter from '../../../components/template/details-footer'
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "@/project-config/base";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {updateShareConfig,openLocation} from "../../../util/wechat-util";
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";
  import {redirectPath} from "../../../project-config/base";

  export default {
    components: {Banner,LayoutOne, CellList, FaceMap, Chunk, DetailsFooter,DdLayoutHtml},
    data() {
      return {
        PlaceholderAvatar,
        giftDetails: {},
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-shangjia',
              name: '店铺',
              color: '#818181',
            }, {
              icon: 'icon-ren111',
              iconActive: 'icon-collection-b',
              name: '我的',
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '没有特权',
            childrenName: '',
          }
        },
        faceMap: {
          faces: [],
          size: 28,
          max: 10
        },
        layoutBody: {
          hd: 1,
          bd: 1,
          ft: 1,
          img: {
            center: 1,
            wid: 1.5,
            hei: 1.5,
          },
        },
        dialogShow:false,
      }
    },
    methods: {
      ...mapActions('vip', ['getPackageInfo','receivePrivilege','getPrivilegeInfo']),
      openMap(){
        openLocation({
          lat: this.giftDetails.lat,
          lng: this.giftDetails.lng,
          name: this.giftDetails.storeName,
          address: this.giftDetails.address
        })
      },
      async load(id) {
        showLoading();
        const res = await this.getPrivilegeInfo({id});
        if (res.code == 1) {
          res.data.logo.forEach(v => (v.notHost = true));
          res.data.week=res.data.week?res.data.week.split(',').map(item=>{return changeWeek(item)}).toString():''
          res.data.month=res.data.month?res.data.month.split(',').map(item=>{return item+'日'}).toString():''
          this.giftDetails = res.data
          this.faceMap.faces = res.data.receive.map(item => {
            return item.portrait
          })
          this.$set(this.footerConfig.main, 'name', res.data.state==1?'立即使用':'立即领取');
          const url = redirectPath + "/auxiliary/vip/verificationVip?appId="
            + localStorage.projectAppId + "&id=" + this.giftDetails.id +"&hxId=" + this.giftDetails.useId + "&pageType=privilegeDetails";
          this.getQRCode({
            dom: this.$refs.qrcode,
            width: 200,
            height: 200,
            url
          });
          // 配置转发信息
          updateShareConfig({
            title: this.giftDetails.title,
            imgUrl: this.getSingleImg(this.giftDetails.logo[0].url),
            desc: '来'+this.giftDetails.storeName + '领取' + this.giftDetails.title,
            link: window.location.href,
          })
        } else {
          showText('数据获取失败')
          return
        }
        hideLoading();
      },
      choiceFace(index) {
        this.goPointPage({path:'/auxiliary/vip/receiveList',query:{id:this.giftDetails.id,type:'privilege'}})
        console.log('choiceFace', index);
      },
      async footerChoice(index) {
        // if(index!=0){
        //   const bool=await this.checkBindTel({callBack:true})
        //   if(!bool) return
        // }
        switch (index) {
          case -1:      //按钮
            const bool=await this.checkBindTel({callBack: true})
            if(!bool) return
            if(!this.user.isVip){
              try {
                await showDialog('请开通会员')
                this.goPointPage({path:'/auxiliary/vip/enterVip'})
              }catch (e) {
              }
              return
            }
            if(this.giftDetails.state==1){
              //this.giftDetails.useId&&this.giftDetails.useId!='0'&&(this.dialogShow = true);
              if (this.giftDetails.useId && this.giftDetails.useId != '0') {
                this.dialogShow = true
                //this.$refs.qrcode.innerHTML = null;
                setTimeout(() => {
                  const url = redirectPath + "/auxiliary/vip/verificationVip?appId="
                    + localStorage.projectAppId + "&id=" + this.giftDetails.id +"&hxId=" + this.giftDetails.useId + "&pageType=privilegeDetails";
                  this.getQRCode({
                    dom: this.$refs.qrcode,
                    width: 200,
                    height: 200,
                    url
                  });
                }, 200)
              }
            }
            else if(this.giftDetails.state==2){
              await showDialog('确认领取此特权吗？')
              showLoading()
              const res=await this.receivePrivilege({privilegeId:this.id})
              showHandleStatusByFlag(res.code,res.msg,res.msg,)
              if(res.code){
                this.goPointPage({path:'/auxiliary/vip/myVip'})
                // this.$set(this.footerConfig.main, 'name', '立即使用')
                // this.$set(this.giftDetails, 'state', '1')
              }
            }
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/vip'
            })
          case 1:       //店铺
            return this.goPointPage({path:'/shopDetail',query:{storeId:this.giftDetails.storeId}});
          case 2:       //我的
            return this.goPointPage({
              path: '/auxiliary/vip/myVip'
            });
        }
      },
    },
    computed: {},
    mixins: [utilMixins],
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.load(this.id);
        console.log(this.id)
      } else {
        showHandleStatusByFlag([false, '缺少参数'])
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #GiftDetails {
    color: #666;
    font-size: $font-size-base;
    line-height: 35px;
    .sylb {
      width: 150px;
      box-sizing: border-box;
    }

    .ljkt-jt {
      margin-left: 20px;

      &:after {
        @include triangle($width: 12px, $direction: right, $color: $themeColor);
      }
    }
    .date{
      height: 40px;
      :nth-child(1){
        width: 70px;
      }
      :nth-child(2){
        width: 80px;
      }
    }
  }
</style>
