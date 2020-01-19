<template>
  <div id="Info">
    <Header :childrenTitle="yellowInfo.name"></Header>
    <div class="basicInfo">
      <div class="pageList">
        <div class="listHeads">
          <div class="flex-grow-1 flex-y-center">
            <!-- 黄页的logo -->
            <div class="listImg dis_in vertical">
              <img :src="getPathByAssetPath(yellowInfo.logo||'')" alt>
            </div>
            <!-- 黄页名字——类型——浏览量 -->
            <div class="dis_in vertical">
              <p class="vertical">
                <span class="listName">{{yellowInfo.name}}</span>
                <!-- 是否入驻过商家 -->
                <i
                  class="iconfont icon-dian"
                  v-if="yellowInfo.isStore!=0"
                  :style="{color:$themeColor}"
                ></i>
              </p>
              <p
                class="vertical listType"
              >{{yellowInfo.typeName}}·{{yellowInfo.nTypeName}}</p>
            </div>
          </div>
        </div>
        <!-- 黄页列表的电话和地址 -->
        <div class="yellowInfo">
          <p class="listTel">
            <i class="iconfont icon-landline"></i>
            {{yellowInfo.tel}}
          </p>
          <p class="listAddress">
            <i class="iconfont icon-icon-"></i>
            {{yellowInfo.address}}
          </p>
          <div class="infoNum">
            <div>
              <p class="infoNumFont">{{yellowInfo.viewNum}}</p>
              <p class="fon_26 color_3 icon">
                <i
                  class="iconfont infoNumIcon icon-huo"
                  :style="{color:$themeColor}"
                ></i>浏览
              </p>
            </div>
            <div>
              <p class="infoNumFont">{{yellowInfo.followNum}}</p>
              <p class="fon_26 color_3 icon">
                <i
                  class="iconfont infoNumIcon icon-shoucang"
                  :style="{color:'#666'}"
                ></i>收藏
              </p>
            </div>
            <div>
              <p class="infoNumFont">{{yellowInfo.shareNum}}</p>
              <p class="fon_26 color_3 icon">
                <i
                  class="iconfont infoNumIcon icon-fenxiang1"
                  :style="{color:'#666'}"
                ></i>分享
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="userReport">
      <div>
        <p @click="claimShow=true,presentationType=1">纠错</p>
      </div>
      <div>
        <p @click="claimShow=true,presentationType=3">认领</p>
      </div>
      <div>
        <p @click="claimShow=true,presentationType=2">举报</p>
      </div>
    </div>
    <!--<div class="dh-96 bg-F2F3F5 flex-bt mar-t flex-y-center pad-lr col-9" @click="openReport(yellowInfo.id,16)">-->
    <!--如遇无效、虚假等信息，请立即举报哦！-->
    <!--<div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>-->
    <!--</div>-->
    <article class="personal-body" v-if="setUp.photoList=='open'||setUp.introduce=='open'">
      <van-tabs :color="$themeColor" @click="changeTab">
        <van-tab title="商家简介" v-if="storeContent&&setUp.introduce=='open'">
          <div class="storeContent">{{yellowInfo.introduce}}</div>
        </van-tab>
        <van-tab title="商家相册" v-if="setUp.photoList=='open'&&yellowInfo.photoList&&yellowInfo.photoList.length">
          <div class="storeImgs">
            <div v-for="(item,index) in yellowInfo.photoList" :key="index">
              <img-wrapper :src="getPathByAssetPath(item.url||'')" :isShowView="true" :pictures="getPictures"/>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </article>

    <div class="rightNav">
      <div class="topNav animation_bottom">
        <div
          style="background:#FF3838;color:#fff"
          v-if="yellowInfo.isStore!=0"
          @click="goPointPage({path:'/shopDetail',query:{storeId:yellowInfo.isStore}})"
        >进店
        </div>
        <div style="background:#00A0E9;color:#fff" @click="openMap">导航</div>
        <div
          style="background:#51D22F;color:#fff"
          v-if="setUp.code=='open'&&yellowInfo.qrcode&&yellowInfo.qrcode.length"
          v-on:click="showImage"
        >微信
        </div>
      </div>
      <!-- <div class="bottomNav"></div> -->
    </div>


    <!-- 二维码弹框 -->
    <van-popup v-model="isShowView" v-if="setUp.code=='open'&&yellowInfo.qrcode&&yellowInfo.qrcode.length">
      <div class="qrcode">
        <!-- <img :src="" :isShowView="true" alt> -->
        <img-wrapper
          not-load="true"
          class="codeImg"
          :prevent="true"
          :isShowView="true"
          :src="getPathByAssetPath(yellowInfo.qrcode&&yellowInfo.qrcode[0].url||'')"
          alt
        />
        <div class="distinguish">长按识别二维码</div>
        <div class="confim" @click="showImage">确定</div>
      </div>
    </van-popup>
    <!-- 纠错认领举报 -->
    <van-popup v-model="claimShow" class="claimPopup">
      <div class="claim">
        <div class="claimHeader">
          <span v-if="presentationType==1">我要纠错</span>
          <span v-if="presentationType==2">我要举报</span>
          <span v-if="presentationType==3">我要认领</span>
        </div>
        <div class="userFormInfo">
          <van-cell-group>
            <van-field
              v-model="userName"
              label="姓名："
              icon="question-o"
              placeholder="请输入姓名"
            />

            <van-field
              v-model="userTel"
              type="tel"
              label="联系电话："
              placeholder="请输入联系电话"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              v-model="message"
              label="详细说明："
              type="textarea"
              placeholder="请输入100字以内详细说明"
              rows="6"
              maxlength="100"
              autosize
            />
          </van-cell-group>
          <div class="submission" @click="submission">提交</div>
        </div>
      </div>
    </van-popup>
    <!-- 底部状态栏 -->
    <!--<info-foot-->
    <!--v-if="showMap==false"-->
    <!--:footList="footList"-->
    <!--:info-right="infoRight"-->
    <!--@callShop="callShop"-->
    <!--@listClick="listClick"-->
    <!--/>-->
    <!-- 导航 -->
    <DetailsFooter v-bind="footerConfig" @method="listClick"></DetailsFooter>

    <van-popup position="bottom" v-model="showMap" v-if="postLatLng!=''">
      <custom-map
        @close="showMap=false"
        @confirm="showMap=false"
        :lat-lng="postLatLng"
        :symbol="1"
      />
    </van-popup>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import {openLocation, previewImage} from "../../util/wechat-util";
  import CustomMap from "../../components/basic/custom-map";
  import Header from "@/components/header";
  import InfoFoot from "../../components/yellow-page/info-foot";

  import DetailsFooter from "../../components/template/details-footer";


  import {
    backendPath,
    isDev,
    redirectPath,
    appId
  } from "../../project-config/base";
  import {Toast, Dialog} from "vant";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showLoading, showDialog} from "../../util";
  //   import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../util";
  export default {
    name: "Info",
    components: {
      InfoFoot,
      CustomMap,
      DetailsFooter
    },
    data() {
      return {
        userName: "",
        userTel: "",
        message: "",
        claimShow: false,
        postLatLng: "",
        setUp: {},
        isShowView: false,
        yellowInfo: [],
        showMap: false,
        presentationType: 1,
        footList: [
          {
            name: "首页",
            path: "",
            type: 0,
            state: 0,
            icon: "icon-shouye",
            color: "",
            click: "goPathIndex",
            seleColor: ""
          },
          {
            name: "入驻",
            path: "",
            state: 0,
            type: 0,
            click: "goPathSettled",
            icon: "icon-category",
            color: "",
            seleColor: ""
          },
          {
            name: "收藏",
            path: "",
            state: 0,
            click: "goCollection",
            type: 1, //1为收藏 0 为普通   Welcome the successors to continue to improve
            icon: "icon-shoucang",
            color: "",
            seleColor: ""
          },
          {
            name: "我的记录",
            path: "",
            state: 0,
            click: "mine",
            type: 0, //1为收藏 0 为普通   Welcome the successors to continue to improve
            icon: "icon-wodejilu",
            color: "",
            seleColor: ""
          }
        ],
        infoRight: {
          name: "一键拨号",
          content: "",
          size: "14px"
        },
        storeImg: true,
        storeContent: true,
        tel: false,
        store: {
          name: "肯德基",
          type: "餐饮·美食",
          tel: "13277915655",
          address: "武汉市洪山区街道口鹏程国际",
          type: 1,
          body: "这是商家详情",
          view: "62",
          collection: "24",
          share: "73"
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-fabudianjizhuangtai-',
              name: '入驻',
              color: '#818181',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '一键拨号',
            childrenName: '',
          }
        },
      };
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("wxPay", {
        // 是否允许拨打电话，该变量值是在wxPay里面设置的
        isCanCall: state => state.isCanCall
      }),
      getPictures() {
        let a = [];
        this.yellowInfo.photoList.map(v => {
          if (v.url) a.push(this.getPathByAssetPath(v.url))
        });
        return a
      },

    },
    methods: {
      ...mapActions("YellowPage", [
        "getYellowInfo",
        "collectStore",
        "presentation",
        "share"
      ]),
      ...mapActions("publication/yellowEnter", ["getYellowPageSetUp"]),
      ...mapActions("wxPay", ["isCanCallAction"]),
      openMap() {
        openLocation({
          lat: this.yellowInfo.lat,
          lng: this.yellowInfo.lng,
          name: `${this.yellowInfo.name || '信息'}-位置`,
          address: this.yellowInfo.address
        })
      },
      changeTab(e) {
      },
      goPathIndex(e) {
        console.log("点了");
      },
      // 提交认领 接错或者举报
      async submission(e) {
        if (this.userName == "") {
          showDialog("请填写您的姓名");
        } else if (this.userTel == "") {
          showDialog("请填写您的联系方式");
        } else if (this.message == "") {
          showDialog("请填写详细说明");
        } else {
          const data = await this.presentation({
            storeId: this.$route.query.id,
            details: this.message,
            tel: this.userTel,
            name: this.userName,
            type: this.presentationType
          });
          if (this.presentationType == 3) {
            this.claimPay(data);
          }
          this.claimShow = false;
          Toast.success({
            message: "提交成功",
            duration: 800
          });
        }
      },
      // 呼起电话
      phoneCall(e) {
        location.href = `tel://${this.yellowInfo.tel}`;
      },
      // 查看黄页微信图片
      showImage() {
        if (this.setUp.code == "open" && this.yellowInfo.qrcode != []) {
          this.isShowView = !this.isShowView;
        }
      },
      // 底部导航的点击事件
      async listClick(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {

          case -1:
            this.callShop();
            break;
          case 0:
            this.goPointPage({
              path: '/home'
            });
            break;
          case 1:
            this.goPointPage({
              path: '/yellowPage/yellowPageSettled'
            });
            break;
          case 2:
            this.isFollow(index);
            break;
          case "收藏":
            this.isFollow();
            break;
          case "已收藏":
            this.isFollow();
            break;
          case "入驻":
            this.$router.push("/yellowPage/yellowPageSettled");
            break;
          case "首页":
            break;
          case "我的记录":
            this.$router.push("/yellowPage/yellowMine");
            break;
        }
      },
      // 点击收藏黄页
      async isFollow(index) {
        console.log("用户的信息为", this.user);
        showLoading();
        const {status} = await this.collectStore({
          postId: this.$route.query.id,
          userId: this.user.id,
          type: 6
        });
        hideLoading();
        let message = "已取消收藏";
        if (status === 1) {
          // this.footList[2].state = 1;
          // this.footList[2].name = "已收藏";
          message = "收藏成功";
          this.$set(this.footerConfig.menu[index], 'useActive', true)
          this.$set(this.footerConfig.menu[index], 'colorActive', this.$themeColor)
        } else {
          // this.footList[2].state = 0;
          // this.footList[2].name = "收藏";
          this.$set(this.footerConfig.menu[index], 'useActive', false)
        }
        Toast.success({
          duration: 800,
          message
        });
        // this.getShopInfoWithUserId({ id: this.$route.query.id });
      },
      // 设置初始收藏状态
      setFoot() {
        // this.footList[2].name = !this.yellowInfo.follow ? "收藏" : "已收藏";
        // this.footList[2].state = !this.yellowInfo.follow ? "0" : "1";

        this.$set(this.footerConfig.menu[2], 'useActive', this.yellowInfo.follow);
        this.$set(this.footerConfig.menu[2], 'colorActive', this.$themeColor);


      },
      //进入店铺
      goPage(param) {
        this.goPointPage({
          obj: this,
          ...param
        });
      },
      canShowPhone() {

        // 用户已付费
        if (this.isCanCall) return true;
        //没有价格就是免费拨打
        if (!this.yellowInfo.data || !this.yellowInfo.data.contactCharge || +this.yellowInfo.data.contactCharge <= 0) return true;
        // 后台没有设置，默认可以拨打
        if (!this.setUp.see) return true;
        // 先判断是不是一次性收费，不是的话就返回false，次次都要收费


        return +this.setUp.see == 1 ? (+this.yellowInfo.look == 1 ? true : false) : false;

      },
      // 设置电话星号
      lookTel() {
        if (!this.canShowPhone()) {
          this.infoRight.content = this.yellowInfo.tel = this.hideTelNumber(this.yellowInfo.tel);
        } else {
          this.infoRight.content = this.yellowInfo.tel;
        }
        this.$set(this.footerConfig.main, 'childrenName', this.yellowInfo.tel)

      },
      // 设置电话星号以及收藏状态
      async seeYellowInfo(id) {
        const info = await this.getYellowInfo({
          id: id
        });
        info.logo = info.logo.length && info.logo[0].url || '';
        this.yellowInfo = info;
        var coordinates = {
          latitude: this.yellowInfo.lat,
          longitude: this.yellowInfo.lng
        };
        this.postLatLng = coordinates;
        this.setFoot();
        if (info.data != null) {
          this.lookTel();
        }
        updateShareConfig({
          title: info.name,
          imgUrl: this.getPathByAssetPath(info.logo),
          desc: this.user.userName+'邀请你来看看'+info.name,
        });
      },
      // 查看电话收费
      async callShop() {
        if (this.canShowPhone()) {
          this.phoneCall();
        } else {
          if (!this.tel && this.yellowInfo.data.contactCharge && +this.yellowInfo.data.contactCharge > 0) {
            try {
              await showDialog(
                `查看此电话需要支付${
                  this.yellowInfo.data.contactCharge
                  }元`,
                "温馨提示"
              );
              this.$router.push({
                name: "cashier",
                params: {
                  type: 9,
                  param: {
                    yellowId: this.yellowInfo.id,
                    money: +this.yellowInfo.data.contactCharge,
                    type: 2
                  },
                  info: {
                    money: +this.yellowInfo.data.contactCharge,
                    type: "黄页电话付费",
                    isCall: true
                  }
                }
              });
            } catch (e) {
              console.log(
                "老板，" +
                this.yellowInfo.data.contactCharge +
                "元都不愿给我，电话号码这件事，我很难帮你办啊！"
              );
            }
          } else {
            this.phoneCall();
          }
        }
      },
      // 查看电话收费
      async claimPay(data) {
        if (data.money != null && +data.money > 0) {
          try {
            await showDialog(`认领需要支付${data.money}元`, "温馨提示");
            this.$router.push({
              name: "cashier",
              params: {
                type: 15,
                param: {
                  id: data.id
                },
                info: {
                  money: +data.money || 0,
                  type: "黄页认领"
                }
              }
            });
          } catch (e) {
            console.log(
              "老板，" +
              data.money +
              "元都不愿给我，电话号码这件事，我很难帮你办啊！"
            );
          }
        }
      }
    }
    ,
    async created() {


      // console.log(data, redirectPath, this.user);
      // 判断用户是否是转发进来的
      if (this.$route.query.isShare) {
        await this.share({
          id: this.$route.query.id
        });
      }
      this.seeYellowInfo(this.$route.query.id);

      this.setUp = await this.getYellowPageSetUp();
    },
    destroyed() {
      // 用离开当前页面就会执行
      if (this.isCanCall) {
        this.isCanCallAction();
      }
    }
  }
  ;
</script>
<style lang="scss">
  @import "../../assets/common";

  .claimPopup {
    width: 80%;

    .claim {
      width: 100%;
      height: auto;
      background: #fff;

      .claimHeader {
        text-align: center;
        height: 90px;
        background: #f1f2f6;
        line-height: 90px;
        color: #333;
        font-size: 30px;
      }

      .submission {
        background: $themeColor;
        color: #fff;
        padding: 30px;
        text-align: center;
        font-size: 32px;
      }
    }
  }

  .flex-grow-0 {
    min-width: 0;
    -webkit-box-flex: 0;
    -webkit-flex-grow: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .flex-grow-1 {
    min-width: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -webkit-flex-shrink: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
  }

  .flex {
    display: flex;
  }

  .flex-y-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    -ms-grid-row-align: center;
    align-items: center;
  }

  .vertical {
    vertical-align: middle;
  }

  .dis_in {
    display: inline-block;
  }

  #Info {
  }

  .basicInfo {
    padding: 20px 20px 0 20px;
  }

  .color_3 {
    color: #333;
  }

  .fon_26 {
    font-size: 26px;
  }

  .qrcode {
    width: 500px;
    height: 650px;
    overflow: hidden;
    text-align: center;
    border-radius: 10px;

    .codeImg {
      width: 100%;
      height: 500px;
      border-radius: 10px;
    }

    .distinguish {
      height: 70px;
      line-height: 70px;
      color: #888;
    }

    .confim {
      font-size: 30px;
      height: 80px;
      border-top: 1px solid #f9f9f9;
      background: #f9f9f9;
      color: $themeColor;
      line-height: 80px;
    }
  }

  .pageList {
    background-image: url("../../assets/img/yellow-page/yellowBack.png");
    background-size: 100%;
    // padding: 20px;
    height: auto;
    position: relative;
    // margin-top: 20px;
    // background: #fff;
    border-radius: 10px;

    .listHeads {
      padding: 40px;
      display: flex;
      width: 100%;
      border-bottom: 1px solid #f9f9f9;
      padding-bottom: 20px;

      .listImg {
        width: 90px;
        height: 90px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .listType {
        font-size: 24px;
        padding-top: 20px;
        color: #818181;
      }

      .listName {
        color: #333;
        font-size: 36px;
      }
    }

    .yellowInfo {
      padding: 0 20px;

      .listTel,
      .listAddress {
        color: #999;
        font-size: 28px;
        padding-top: 30px;
      }

      .infoNum {
        // height: 200px;
        display: flex;
        margin-top: 40px;
        padding: 60px 0;
      }

      .infoNum div {
        flex: 3;
        text-align: center;
        display: inline-block;

        .infoNumFont {
          font-size: 34px;
          color: #333;
        }

        .infoNumIcon {
          font-size: 30px;
        }

        .icon {
          margin-top: 30px;
        }
      }
    }
  }

  .userReport {
    display: flex;
    padding-top: 40px;

    div {
      flex: 3;
      text-align: center;

      p {
        display: inline-block;
        padding: 20px 60px;
        border-radius: 40px;
        border: 1px solid #666;
        color: #333;
      }
    }
  }

  .personal-body {
    background: #fff;
    margin-top: 40px;

    .storeContent {
      font-size: 28px;
      color: #333;
      padding: 20px;
      line-height: 50px;
    }

    .storeImgs {
      // width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 20px 20px 150px;

      div {
        width: 220px;
        height: 220px;
        margin-bottom: 20px;
        border-radius: 8px;
        background-color: #fff;
        border: 1px solid #eee;
      }
    }
  }

  .rightNav {
    width: 90px;
    height: auto;
    position: fixed;
    right: 20px;
    bottom: 300px;
    z-index: 500;
    overflow: hidden;

    .topNav {
      width: 100%;
      height: auto;

      div {
        width: 100%;
        height: 90px;
        border-radius: 50%;
        line-height: 90px;
        text-align: center;
        background: orange;
        margin-bottom: 20px;
      }
    }

    .bottomNav {
      width: 100%;
      height: 90px;
      background: #999;
      border-radius: 50%;
    }

    .animation_bottom {
      animation: slide_down 1s linear;
      // transform-origin: 200% 100%;
    }

    @keyframes slide_down {
      from {
        margin-top: 0;
      }
      to {
        margin-top: 400%;
      }
    }
  }
</style>
