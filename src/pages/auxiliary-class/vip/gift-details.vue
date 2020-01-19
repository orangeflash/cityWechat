<template>
  <div id="GiftDetails" class="pad-b130">
    <Header></Header>
    <div class="bg-f">
      <layout-one :is-last="true" :body="layoutBody" :body-src="getSingleImg(giftDetails.logo)">
        <span  slot="body-bd-f" class="t-o fon-lg">{{giftDetails.storeName}}</span>
        <span slot="body-bd-s" class="card-name col-r mar-t"><span class="iconfont icon-huo mar-r-10"></span>{{giftDetails.view}}</span>
        <span slot="body-bd-t" class="col-9">营业时间:{{giftDetails.businessStartTime}}-{{giftDetails.businessEndTime}}</span>
        <div slot="body-ft" class="flex-col flex-x-end hei100">
          <div class="sylb br-t flex-col t-c br-r-10"><span class="bg-t col-f pad-10">剩余礼包</span><span
            class="pad-20 fon-lg col-t">{{giftDetails.num}}份</span></div>
        </div>
      </layout-one>
      <div class="base-pad">{{giftDetails.title}}</div>
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
    <div class="bg-f mar-t20">
      <div class="flex-x-center pad-30 bor-b"><span class="iconfont icon-shangdian fon-35 col-t mar-r-10"></span><span
        class="fon-lg">商家信息</span></div>
      <div class="pad-tb">
        <CellList @click="callTel(giftDetails.linkTel)" :is-last="true" icon="icon-location col-t" ft-icon="icon-dianhuahover fon-45 col-r" :content="giftDetails.storeName"></CellList>
        <CellList @click="openMap" ft-icon="icon-qunfengfabushangxian fon-45 col-b" :content="giftDetails.address"></CellList>
      </div>
    </div>
    <div class="bg-f mar-t20">
      <div class="flex-x-center pad-30 bor-b"><span class="iconfont icon-card fon-35 col-t mar-r-10"></span><span
        class="fon-lg">商品须知</span></div>
      <div class="pad-tb">
        <CellList :is-last="true" title="可领取用户" :content="`${giftDetails.vipTypeName}可领取此礼包`"></CellList>
        <CellList title="结束时间" :content="formatDateByTimeStamp(giftDetails.endTime)"></CellList>
      </div>
    </div>
    <div class="bg-f mar-t20">
      <div class="flex-x-center pad-30 bor-b"><span class="iconfont icon-jilu fon-35 col-t mar-r-10"></span><span
        class="fon-lg">优惠说明</span></div>
      <div class="details-html" v-html='giftDetails.body'></div>
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
        <!--<img style="width:200px;height: 200px;" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=198160485,1481130401&fm=27&gp=0.jpg">-->
        <div class="pad-t">仅限{{formatDateByTimeStamp(giftDetails.endTime,"YYYY-MM-DD")}}前使用</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import CellList from "../../../components/template/dd-store/cell-list";
  import FaceMap from '../../../components/template/other/face-map';
  import Chunk from '@/components/template/dd-store/chunk';
  import DetailsFooter from '../../../components/template/details-footer'
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "@/project-config/base";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {updateShareConfig,openLocation} from "../../../util/wechat-util";
  import {redirectPath} from "../../../project-config/base";

  export default {
    components: {LayoutOne, CellList, FaceMap, Chunk, DetailsFooter},
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
      ...mapActions('vip', ['getPackageInfo','receivePackage']),
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
        const res = await this.getPackageInfo({id});
        if (res.code == 1) {
          this.giftDetails = res.data
          this.faceMap.faces = res.data.receive.map(item => {
            return item.portrait
          })
          this.$set(this.footerConfig.main, 'name', res.data.state==1?'立即使用':res.data.state==2?'已核销':'立即领取');
          // const url = redirectPath + "/auxiliary/vip/verificationVip?appId="
          //   + localStorage.projectAppId + "&id=" + this.id+"&hxId=" + this.id +"&pageType=giftDetails"
          // this.getQRCode({
          //   dom: this.$refs.qrcode,
          //   width:200,
          //   height:200,
          //   url
          // });
          // 配置转发信息
          updateShareConfig({
            title: this.giftDetails.title,
            imgUrl: this.getSingleImg(this.giftDetails.logo),
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
        this.goPointPage({path:'/auxiliary/vip/receiveList',query:{id:this.giftDetails.id,type:'package'}})
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
              this.dialogShow = true;
              //this.$refs.qrcode.innerHTML = null;
              // console.log('this.$refs.qrcode',this.$refs.qrcode)
              setTimeout(()=>{
                const url = redirectPath + "/auxiliary/vip/verificationVip?appId="
                  + localStorage.projectAppId + "&id=" + this.id+"&hxId=" + this.giftDetails.useId +"&pageType=giftDetails"
                this.getQRCode({
                  dom: this.$refs.qrcode,
                  width:200,
                  height:200,
                  url
                });
              },200)
            }
            else if(this.giftDetails.state==2){
              showText('已核销')
            }
            else if(this.giftDetails.state==3){
              await showDialog('确认领取此礼包吗？')
              showLoading()
              const res=await this.receivePackage({id:this.id})
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
  }
</style>
