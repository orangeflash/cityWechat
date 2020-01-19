<template>
  <div id="PostDetail" class="bg-f" v-if="postDetail.postId">
    <Header :isMore="true" :childrenTitle="`${postDetail.newTypeName} ${postConfig.field}`"></Header>

    <div class="flex-bt mar-30 br-b-F0 pad-b">
      <dd-layout-user
        :size="0.76"
        :src="getInfo.user.face"
        :name="getInfo.user.name"
        :desc="getInfo.post.releaseTime"
      >
        <div slot="icon">
          <img :src="renzheng" class="w-100 mar-r-10" v-if="getInfo.user.isAuth == 1">
          <img :src="top" class="w-88" v-if="getInfo.post.isTop == 1">
        </div>
        <img slot="desc" :src="redBag" v-if="getInfo.post.isRedBag == 1" class="w-109">
      </dd-layout-user>
      <div class="mar-t-10 flex-g-0">
        <span class="bg-E3F2FF col-058DFF pad-8-14-4 br-r-16 fon-wb">{{getInfo.post.newTypeName}}</span>
      </div>
    </div>
    <ys-title :type="rewardType" :data-info="rewardInfo" v-if="rewardInfo.offerReward==1"></ys-title>
    <dd-layout-html class="fon-w3 let-space-2 " :html="getInfo.post.context"/>
    <dd-layout-html class="fon-w3  let-space-2" v-if="getInfo.post.wechatContent" :html="getInfo.post.wechatContent"/>
    <div class="mar-t flex-wrap flex pad-lr" v-if="getInfo.post.tag&&getInfo.post.tag.length > 0">
        <span class="bg_search_bg col-597EB2 mar-b-10 pad-8-10-6 mar-r-10 br-r-4" v-for="(item,key) in getInfo.post.tag"
              :key="key">#{{item}}</span>
    </div>
    <div class="info-body pad-lr pad-t t-c"
         v-if="getInfo.post.pictures&&getInfo.post.pictures.length > 0 && !getInfo.post.isVideo">
      <img
        class="br-r-20 mar-b dis-b mar-a mw100 "
        @click.stop="previewImage(url,getInfo.post.pictures)"
        v-for="(url,key) in getInfo.post.pictures"
        :src="url"
        :key="key"/>
    </div>
    <div v-else-if="getInfo.post.isVideo" class="pad-lr mar-t">
      <img class="w100 h-550"
           v-if="showMoreFeature"
           :src="getInfo.post.pictures[0]"/>
      <video
        v-else
        class="w100 h-550"
        controls :poster="getInfo.post.pictures[0]" :src="getInfo.post.videoSrc"></video>

    </div>

    <dd-layout-div class="mih-80 flex-y-center col-9 fon-sm" :pad="[0,30]">
      <dd-layout-div class="dingwei-bg" :width="20" :height="25" :mar="[-3,10,0,0]"/>

      {{getInfo.post.address}}
    </dd-layout-div>

    <div class="pad-lr flex-bt mar-t col-6 flex-y-center fon-b pad-b-20">
      <div @click="likeHandle" :class="getInfo.post.isLove&&'col-t'">
        <i class="iconfont icon-buoumaotubiao15 mar-r-10"></i>{{getInfo.post.love}}
      </div>
      <div>
        <span>
          <i class="iconfont icon-yanjing2 mar-r-10 fon-46"></i>{{getInfo.post.browse}}
        </span>
        <span class="mar-l" v-if="postConfig.comment == '1'">
          <i class="iconfont icon-biaoqing1 mar-r-10"></i>{{getInfo.post.comment}}
        </span>
        <span class="mar-l" @click="showMask = !showMask">
          <i class="iconfont icon-fenxiang-tianchong col-t mar-r-10"></i>{{getInfo.post.share}}
        </span>
      </div>
    </div>
    <div class="bg-F2F3F5 pad-t-20 pad-b-20 br-r-20 flex mar-lr mar-t-20 mar-b"
         v-if="getInfo.post.faceMap.faces&&getInfo.post.faceMap.faces.length > 0">
      <dd-layout-img
        class="mar-l"
        :width="0.5" :height="0.5"
        v-for="(src,key) in getInfo.post.faceMap.faces"
        :key="key"
        :fillet="0.5"
        :src="src"
      />
    </div>
    <div class="mar-30 br-r-30 bg-FF4A19 flex-y-center flex-bt pad-lr dh-98"
         @click="goPointPage({path:'/redAndWhite',query:{postId:postDetail.postId}})"
         v-if="getInfo.post.isRedBag == 1">
      <div class="flex-y-center">
        <img :src="redBag2" class="w-40 mar-r">
        <span class="fon-wb col-f fon-xxl"> ￥{{moneyList.redMoney}} <em class="fon-xs fon-w4">已抢{{moneyList.data&&moneyList.data.length}}/{{getInfo.post.redNum}}份</em></span>
      </div>
      <div class="col-f">看看大家的手气<i class="iconfont icon-youjiantou2"></i></div>
    </div>
    <div class="bg-F2F3F5 col-9" style="padding: 0.3rem 0.3rem 0">注：联系我时，请说明是在{{$store.state.platform.name}}平台看到发布的信息</div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(postDetail.postId,1)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><img :src="report" class="w-26 mar-r-10 mar-t-05">点此举报</div>
    </div>
    <dd-tab v-if="tabs.length" :tabs="tabs" class="posi-r br-b-e" @click="tabsMethod"/>
    <div v-show="activeTab==0">
      <ys-list v-if="rewardType.type" :type="rewardType.type" :postuid="postDetail.userId" :reward-info='rewardInfo'
               @fxzq="fxzq"
               :comments="rewardInfo.offerRewardInfo"></ys-list>
    </div>
    <div v-show="activeTab==1">
      <dd-layout-comment-list

        v-if="postConfig.comment == '1'"

        :comments="postComments"
        :total="getInfo.post.comment"
        @comment="commentHandle"
        @open="showMoreFeature = true"
        @cancel="showMoreFeature = false"
        :postId="+getInfo.post.postId"/>
    </div>
    <dd-layout-store-list :stores="getInfo.storeInfo"/>

    <div class="dh" v-if="isSelfPost"></div>

    <dd-layout-div :height="150"></dd-layout-div>
    <footer class="posi-f b0 r0 l0 bg-f" v-if="isSelfPost">
      <span class="bg-t flex-center fon-lg col-f mar-30 br-r-20 dh" @click="showMore(postDetail)">我要扩散信息</span>
    </footer>

    <details-footer v-else-if="postDetail.userId != user.id" v-bind="footerConfig"
                    @method="footerChoice"></details-footer>

    <!--红包操作-->
    <img :src='getRedMoney("/wechatimg/receive/receive.gif")' class="posi-f w-200 b30 r-50 zIndex999"
         @click="showResult"
         v-if="+postDetail.isRedBag==1&& +postDetail.redmoney > 0"/>


    <van-popup v-model="show" class="bg-tran" style="background-color: transparent;">
      <div class="w-760 h-847 posi-r hot-bag-bg">
          <span @click="show=!show">
               <img-wrapper :src="clone" class="clone-bag"/>
          </span>
        <em class="posi-a l50 t59 tar-050 fon-sm col-D53A19 lineH-48">{{getInfo.user.name}}埋了一个红包</em>
        <strong class="posi-a t35 l50 fon-46 fon-wb col-EC4D35 lineH-58 tar-050">{{getInfo.post.redmoney}}</strong>
        <span @click="receiveClick" class="posi-a tar-050 b-100 l50 w-247 dh-73">
               <img-wrapper :src="pullDowm" alt=""/>
          </span>
        <p class="w-393 dh-60 b-200 l50 tar-050 t-c fon-b col-FFEA97 lineH-38 posi-a">领取的红包将存入您的平台余额可前往查看</p>
      </div>
    </van-popup>

    <van-popup v-model="showMoney" class="money-container" style="background-color: transparent;">
      <div class="w-623 h-744 red-bag-bg">
          <span @click="showMoney=!showMoney">
               <img-wrapper :src="clone" class="posi-a w-60 r-80 t-40"/>
          </span>
        <strong class="posi-a l50 t-150 tar-x-050 fon-xxl col-f lineH-22">{{oldTitle}}</strong>
        <em class="posi-a l50 t-220 tar-x-050 fon-50 fon-wb col-FFE762 lineH-22">{{moneyNum}}元</em>
        <span class="posi-a l50 t10 tar-050 w-643 h-494 res-money-bag-bg"></span>
        <em class="tag-message posi-a l50 b23 dis-ib tar-050 fon-b col-f lineH-40">红包已自动存入到您的平台余额内</em>
        <div class="t-c posi-a l50 b16 tar-050 lineH-20"
             @click="goPointPage({path:'/redAndWhite',query:{postId:postDetail.postId}})">
          <span class="money-icon"></span>
          <em class="hand fon-sm col-FFE762 lineH-20">去看看大家的手气<i
            class="iconfont icon-youjiantou1 col-FFE762 fon-sm"></i></em>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="lowShow" class="w-623 h-744 red-bag-bg" style="background-color: transparent;">
      <div class="h-744 w-600 posi-a l50 tar-x-050 red-low-bg">
        <strong class="posi-a t55 l50 tar-050 w-330 dh-100 col-f t-c fon-40 lineH-64">您来晚了<br/>红包已经被抢光了</strong>
        <div class="t-c posi-a l50 b16 tar-050 lineH-20"
             @click="goPointPage({path:'/redAndWhite',query:{postId:postDetail.postId}})">
          <span class="w-30 dh-32 res-money-bg dis-ib"></span>
          <em class="hand  fon-sm col-FFE762 lineH-20">去看看大家的手气<i
            class="iconfont icon-youjiantou1 col-FFE762 fon-sm"></i></em>
        </div>
      </div>
    </van-popup>
    <dd-poster-btn
      v-if="!getInfo.post.hidePoster"
      :nickname="postDetail.linkMan||'神秘人'"
      :body="postDetail.body.replace(/↵/g, '\r\n')"
      :tag="postDetail.newTypeName"
      :desc="'注：联系我时，请说明是在'+$store.state.platform.name+'上看到的...'"
      :photos="posterParams.photos"
      :isVideo="posterParams.isVideo"
      :logo="getInfo.user.face"
      :rewardInfo="rewardInfo"
    ></dd-poster-btn>
    <share-mask :show-mask.sync="showMask"/>

  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {backendPath, PlaceholderAvatar, PlaceholderImg} from "../../project-config/base";
  import {utilMixins} from "../../plugins/util-mixins";
  import _ from 'lodash'
  import {computedDate, hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../util";
  import redBagObtain from "../../assets/img/post-datail/红包动图5.gif";
  import {logo} from "@/project-config/base";
  import {Toast} from 'vant';

  import {getUrlParams} from "@/util";
  import DdLayoutUser from "../../components/layout/dd-layout-user";
  import DdPosterBtn from '../../components/template/dd-poster-btn'
  import top from '../../assets/img/city-information/top.png'
  import renzheng from '../../assets/img/attest/prz.png'
  import redBag from '../../assets/img/city-information/red-bag.png'
  import redBag2 from '../../assets/img/city-information/redBag2.png'
  import clone from "../../assets/img/post-datail/clone.png"
  import report from '@/assets/img/other/report.png'
  import vip from '../../assets/img/attest/vip.png'
  import DdLayoutHtml from "../../components/layout/dd-layout-html";
  import DdLayoutImg from "../../components/layout/dd-layout-img";
  import DdLayoutCommentList from "../../components/layout/dd-layout-comment-list";
  import YsList from "../../components/template/ying-shang/ys-list";
  import YsTitle from "../../components/template/ying-shang/ys-title";
  import DdLayoutStoreList from "../../components/layout/dd-layout-store-list";
  import DetailsFooter from '@/components/template/details-footer'
  import DdTab from '@/components/template/other/tab'
  import {openLocation, updateShareConfig} from "../../util/wechat-util";
  import pullDowm from "../../assets/img/post-datail/down.png"

  import ShareMask from "@/components/publication/share-mask";

  export default {
    name: "PostDetail",
    components: {
      DdLayoutImg,
      DdLayoutCommentList,
      DdLayoutStoreList,
      DetailsFooter,
      DdTab,
      YsList, YsTitle,
      DdLayoutHtml, DdLayoutUser, DdPosterBtn, ShareMask
    },
    data() {
      return {
        top, redBag, vip, redBag2, report, renzheng, redBagObtain, clone, pullDowm,
        showMask: false,
        postDetail: {},
        storeInfo: [],
        postComments: [],
        posterParams: {    //海报的配置参数
          logo: null,      //用户的头像
          nickname: null,  //用户的名称
          body: null,      //内容描述
          tag: null,       //分类标签
          desc: null,      //描述
          photos: [],      //内容图片
          isVideo: false,  //是不是视频
        },
        moneyList: {},
        moneyNum: 0,
        showMoreFeature: false,
        oldTitle: '',
        show: false,
        showMoney: false,
        lowShow: false,
        operationLove: false,
        isCollect: false,  //是否收藏
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
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '',
            childrenName: '',
          }
        },
        tabs: [],
        activeTab: 0,
        rewardInfo: {},
        rewardType: {},
      }
    },
    methods: {
      ...mapActions("post", [
        "getRedMoneyById",
        'likePostAction',
        "getPostDetailById",
        "getPostListByParams",
        "submitComment",
        "checkCollection",
        "collectPost",
        "cancelPostAction",
        "getToppingOptions",
        "getRedListById",
        "deletePostAction",
        "PayPostRefreshAction",
        "recrodBrowser",
        "postCommentList",
        "plusShare",
        "getFreeLookTelNum",
        "getFreeRefreshNum"
      ]), ...mapActions("shop", [
        "getShopInfoByParams",
      ]),
      ...mapActions("wxPay", ["payCallAction"]),
      ...mapActions("yS", ["getRewardType", "rewardBind", "getRewardInfo"]),
      getReward(e) {
        this.getRewardInfo({postId: this.postId}).then(res => {
          this.rewardInfo = res.offerReward || {}
          if (e) return//判断是ys-list触发
          if (this.rewardInfo.offerReward == 1) {
            this.tabs = [
              {title: '应赏'},
              {title: '评论'},
            ]
            this.getRewardType({postId: this.postId}).then(res => {
              this.rewardType = res
            })
          } else {
            this.activeTab = 1
          }
        })
      },
      fxzq() {
        this.shareHandle()
        // updateShareConfig({
        //   title: document.title,
        //   imgUrl: this.shareInfo.imgUrl,
        //   desc: this.shareInfo.div.innerText,
        //   link: window.location.href,
        // });
      },
      tabsMethod(v) {
        this.activeTab = v.value
        //console.log(v)
      },
      async receiveClick() {
        if (this.postDetail.redmoney == 0) return

        if (+this.postDetail.getRedmoney == 0) {
          const res = await this.getRedMoneyById({postId: this.$route.query.postId})

          if (!res.data) {
            return showDialog(res.msg, '提示', false);
          }

          this.moneyNum = res.money;
          await this.getMoneyList();
          this.show = !this.show;
          this.showMoney = !this.showMoney;
          this.index++
        } else if (this.postData.getRedmoney.length > 0 || this.index != 0) {
          this.show = !this.show;
          this.lowShow = !this.lowShow;
        } else {
          this.show = !this.show
          Toast("红包领取异常，请稍后再试")
        }
      },
      getRedMoney(path) {
        return `${backendPath}${path}`
      },
      async likeHandle() {
        await this.likePostAction({
          postId: this.postDetail.postId,
          userId: this.user.id,
          type: 1
        });

        if (this.getInfo.post.isLove) {
          this.postDetail.love--;
          this.postDetail.isLove = false
        } else {
          this.postDetail.love++;
          this.postDetail.isLove = true
        }
        this.operationLove = true;

      },
      showMore(item) {
        this.showMoreFeature = false;
        return this.$root.$children[0].openArticleMore(item, (tips) => {

        }, false);
      },
      findUser(list) {
        return _.find(list.data, ({userName}) => {
          return userName === this.$store.state.user.userName
        })
      },
      async showResult() {
        const bool = await this.checkBindTel({
          callBack: true
        })
        if (!bool) return

        if (this.findUser(this.moneyList)) {
          this.moneyNum = this.findUser(this.moneyList).money
          this.oldTitle = "你已瓜分到"
          this.showMoney = !this.showMoney;
          console.log("---------*************----------")
        } else if (+this.moneyList.allcount === +this.moneyList.getcount) {
          console.log("-------------------")
          this.lowShow = !this.lowShow;
        } else if (+this.moneyList.allcount > +this.moneyList.getcount) {
          console.log("**************")
          this.show = !this.show
        } else {
          Toast("红包领取异常，请稍后再试")
        }
      },
      canPay() {
        let money = 0;
        if (+this.postDetail.cityId == 0) {
          console.log("this.publicationPrice", this.publicationPrice)
          if (+this.publicationPrice['countryContactCharge'] > 0) {

            money = +this.publicationPrice['countryContactCharge']
          }
        } else if (+this.postDetail.cityId > 0) {
          if (+this.publicationPrice["contactCharge"] > 0) {

            money = +this.publicationPrice['contactCharge']
          }
        }


        return money == 0;

      },
      async footerChoice(index) {
        if (index > 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮


            if (this.postConfig.phoneShowed == 1) {
              if (this.isCanCall || this.canPay()) {
                this.callTel(`tel://${this.postDetail.linkTel}`)
              } else {
                this.callTel()
              }
            }

            return;
          case 0:       //首页
            this.goPointPage("/home")
            return;
          case 1:       //发布
            this.goPointPage({path: '/publication'})

            return;
          case 2:       //收藏

            this.collectHandle()
            return;
        }
      },
      ...mapActions("publication", ["createToppingOrder", "payToppingAction", "getPublicationPrice", "getRedEnvelopesConfig"]),
      ...mapActions("common", ["getPostConfig"]),
      ...mapActions("wxPay", ["isCanCallAction"]),
      openMap() {
        openLocation({
          lat: this.postDetail.lat,
          lng: this.postDetail.lng,
          name: this.postDetail.linkMan || '发布位置',
          address: this.postDetail.address
        })
      },
      async callTel(tel) {
        if (!tel) {

          let money = 0;

          if (this.getInfo.post.cityId == 0) {
            if (+this.publicationPrice['countryContactCharge'] > 0) {

              money = +this.publicationPrice['countryContactCharge']
            }
          } else if (this.getInfo.post.cityId > 0) {
            if (+this.publicationPrice["contactCharge"] > 0) {

              money = +this.publicationPrice['contactCharge']
            }
          }


          if (money > 0) {
            if (this.platform.openVip && this.userInfo.isVip) {
              showLoading();
              const res = await this.getFreeLookTelNum({
                postId: this.postDetail.postId
              });
              hideLoading();


              if (res.isFree == 1 && res.freeNum > 0) {
                try {
                  await showDialog("会员免费查看号码，剩余次数：" + res.freeNum, '会员');
                  const {data} = await this.payCallAction({
                    postId: this.postDetail.postId,
                  });
                  if (data == 200) {
                    this.callTel(`tel://${this.postDetail.linkTel}`)
                  }
                } catch (e) {

                }
                return false;
              }
            }

            try {
              await showDialog(`查看此电话需要支付${money.toFixed(2)}元`, "温馨提示");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 9,
                  param: {
                    postId: this.postDetail.postId,
                    money,
                  },
                  info: {
                    money,
                    type: "电话付费",
                    isCall: true
                  },
                }
              });
            } catch (e) {
              console.log("老板，" + money + "元都不愿给我，电话号码这件事，我很难帮你办啊！");
            }
          } else {
            this.callTel(`tel://${this.postDetail.linkTel}`)
          }
        } else {
          location.href = tel;
        }
      },
      getMoneyList() {
        this.getRedListById({
          postId: this.$route.query.postId
        }).then(result => {
          this.moneyList = result
        })
      },
      shareHandle() {
        this.showMask = true;
      },
      async commentHandle(bool) {
        bool && this.initPostDetail();
        this.getComments();
      },
      async goSettled() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.goPointPage({path: '/publication'})
      },
      async collectHandle() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        showLoading()
        const {data: {status}, code} = await this.collectPost({
          postId: this.postDetail.postId,
          type: 1
        });
        this.isCollect = (status === 1);
        hideLoading();
        showHandleStatusByFlag(code, this.isCollect ? "收藏成功" : "取消成功");
        this.footerConfig.menu[2].useActive = this.isCollect
      },
      async confirmComment() {
        if (!this.message) {
          return showDialog("评论不能为空！", "提示", false)
        }
        showLoading();
        const {code} = await this.submitComment({
          postId: this.postDetail.postId,
          body: this.message,
          ...this.replayConfig
        });
        hideLoading();
        showHandleStatusByFlag(code);
        if (code) {
          this.showCommentMask = false;
          this.initPostDetail();
        }
        this.getComments();
      },
      replayComment({commentId, userId}) {
        this.message = '';
        this.replayConfig = {
          commentId,
          userId
        };
        this.showCommentMask = true;

      },
      async initPostDetail() {
        const postId = this.postId;
        if (postId) {
          showLoading();
          this.checkCollection({
            postId,
            type: 1
          }).then(({data: isCollect}) => {
            this.isCollect = (+isCollect === 1)
            this.footerConfig.menu[2].useActive = this.isCollect
          });

          this.getPostInfo();
        }
      },
      getComments() {
        this.postCommentList({
          postId: this.postId
        }).then(result => {
          this.postComments = result.data;
        })
      },
      async isShare() {
        if (this.$route.query.isShare) {
          await this.plusShare({
            postId: this.postId
          })
          this.getPostInfo();
          if (this.$route.query.partnerId) {
            this.rewardBind({postId: this.postId, shareUserId: this.$route.query.partnerId})
          }
        }
      },
      getPostInfo() {
        this.getPostDetailById({postId: this.postId}).then(({code, data, comment, dz, count, msg}) => {


          if (code != 1) return showDialog(msg);

          this.postDetail = data[0];
          this.postDetail.dz = dz;

          const media = this.getMediaList(this.postDetail.media);
          this.posterParams.isVideo = media && media.video && media.video.length > 0;

          this.posterParams.photos = this.posterParams.isVideo ? [this.getPathByAssetPath(JSON.parse(this.postDetail.media)[0].preview)] : media.img || [];

          this.getPublicationPrice({
            cid: this.postDetail.typeId
          });
          this.getShopInfoByParams({
            adminId: this.postDetail.userId, status: 1
          }).then(storeInfo => {
            this.storeInfo = storeInfo
          });

          /** 创建这个原因是过滤转发的文字标签 */
          const div = document.createElement('div');
          div.innerHTML = this.postDetail.body;

          let ImageURL = this.getMediaList(this.postDetail.media);

          if (typeof ImageURL === 'object') {
            if (ImageURL.video) {
              let obj = JSON.parse(this.postDetail.media)[0];
              ImageURL = this.getSingleImg(obj.preview) || this.platform.shareImg
            } else {
              ImageURL = ImageURL.img ? ImageURL.img[0] : this.platform.shareImg;
            }
          } else if (ImageURL == 'undefined') {
            ImageURL = logo;
          }

          this.shareInfo = {ImageURL, div}
          this.getRewardInfo({postId: this.postId}).then(res => {
            this.rewardInfo = res.offerReward || {}
            if (this.rewardInfo.offerReward == 1) {
              document.title = (this.postDetail.newTypeName ? "【" + this.postDetail.newTypeName + "】" : '') + `内有赏金${this.rewardInfo.money}元，求转发，成交后系统自动打赏。`
            } else {
              document.title = (this.postDetail.newTypeName ? "【" + this.postDetail.newTypeName + "】" : '') + div.innerText
            }
            updateShareConfig({
              title: document.title.replace(/↵/g, ""),
              imgUrl: ImageURL,
              desc: div.innerText.replace(/↵/g, ""),
              link: window.location.href,
            });
          })
          hideLoading();
        })
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      }),
      ...mapState("post", {
        toppingOptions: state => state.toppingOptions
      }),
      ...mapState("publication", {
        publicationPrice: state => state.publicationPrice
      }),
      ...mapState("common", {
        postConfig: state => state.postConfig,
      }),
      ...mapState("wxPay", {
        // 是否允许拨打电话，该变量值是在wxPay里面设置的
        isCanCall: state => {
          //console.log('wxPay', state)
          return state.isCanCall
        }
      }),
      ...mapState({
        platform: state => state.platform,
        userInfo: s => s.user
      }),
      isSelfPost() {


        return this.postDetail.isEnd != 1 && this.postDetail.userId ? this.postDetail.userId === this.user.id : false
      },
      postLatLng() {
        return {
          latitude: this.postDetail.lat,
          longitude: this.postDetail.lng,
        }
      },
      formatLinkTel() {
        const tel = this.postDetail.linkTel;
        if (tel) {
          const telArr = tel.split("");
          telArr.splice(3, 5, '*****');
          return telArr.join("");
        }
        return tel || '暂无'
      },
      segmentLineWidth() {
        if (this.testArr.length < 5) {
          return 375 / this.testArr.length - 20;
        }
        return 70;
      },
      storeLogo() {
        return this.storeInfo.storeLogo && this.getMediaList(this.storeInfo.storeLogo).img[0];
      },
      getInfo() {

        if (!this.operationLove) {
          this.postDetail.isLove = this.postDetail.dz && _.find(this.postDetail.dz, {
            userId: this.user.id
          }) ? true : false
        }


        let data = this.postDetail,
          user = {
            name: data.customUser || data.linkMan || data.userName || '神秘人',
            face: (data.customPortrait && data.customPortrait != '[]' && JSON.parse(data.customPortrait).length > 0 && this.getPathByAssetPath(JSON.parse(data.customPortrait)[0].url)) || data.portrait || PlaceholderAvatar,
            userId: data.userId,
            isVip: +data.isVip,
            isAuth: +data.isAuth,
            linkTel: data.linkTel
          },
          post = {}, pictures = [], isVideo = false, videoSrc = null;

        if (data.media && data.media.length > 2) {
          let mediaImg = this.getMediaList(data.media).img
          if (mediaImg && mediaImg.length > 0) {
            pictures = this.getMediaList(data.media).img || []
          }
          let mediaVideo = this.getMediaList(data.media).video
          if (mediaVideo) {
            try {
              pictures = JSON.parse(data.media).map(item => {
                return this.getPathByAssetPath(item.preview)
              })

              videoSrc = JSON.parse(data.media).map(item => {
                return this.getPathByAssetPath(item.url)
              })
              videoSrc = videoSrc[0]

              isVideo = true
            } catch (e) {
              console.log(e)
            }

          }
        }

        //console.log("data.dz", data)

        data.body = data.body.replace(/↵/g, '<br/>')

        post = {
          context: data.body,
          cityId: +(data.cityId || 0),
          wechatContent: data.wechatContent || '',
          tag: data.tag ? data.tag.split(",") : [],
          pictures: pictures || [],
          releaseTime: computedDate(data.creatTime) + '发布',
          typeName: data.typeName,
          browse: data.browse,
          comment: data.comment ? +data.comment : 0,
          love: data.love || 0,
          postId: data.postId,
          share: data.share,
          typeId: data.typeId,
          typePid: data.typePid,
          newTypeName: data.newTypeName,
          isTop: +data.isTop,
          isRedBag: +data.isRedBag,
          redNum: +data.redNum || 0,
          redmoney: +data.redmoney,
          address: data.address,
          hidePoster: data.expireTime * 1000 < new Date().getTime() || +data.isEnd == 1,
          faceMap: {
            faces: data.dz ? data.dz.map(item => {
              return item.portrait
            }) : [],
            size: 32 / 2,
            max: 10
          },
          videoSrc,
          isVideo,
          isLove: data.isLove

        }
        try {
          this.footerConfig.main.name = this.stringIntercept(user.name, 6);

          if (this.postConfig.phoneShowed == 1) this.footerConfig.main.childrenName = this.isCanCall || this.canPay() ? user.linkTel : this.hideTelNumber(user.linkTel);


        } catch (e) {
          console.log(e)
        }

        //
        // document.title = this.postDetail.newTypeName + ' 信息'

        return {
          user, post, storeInfo: this.storeInfo
        }
      }
    },
    mixins: [utilMixins],
    created() {
      this.postId = this.$route.query.postId;
      this.getPostConfig();
      this.isShare()
      this.getComments();

      // 获取红包的配置参数
      // this.getRedEnvelopesConfig().then(result => {
      //   if (result) this.redEnvelopesConfig = result;
      // });
      // this.recrodBrowser({
      //   postId: this.postId
      // })
      this.initPostDetail();
      this.getMoneyList();
      this.getReward();

    },
    destroyed() {
      // 用离开当前页面就会执行
      if (this.isCanCall) {
        this.isCanCallAction();
      }
    }
  }
</script>
