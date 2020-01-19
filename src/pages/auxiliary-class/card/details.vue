<template>

  <dd-layout-div bg="#F9FAFA" mi-h="100vh">
    <Header class="posi-r zIndex99"/>
    <dd-layout-div class="bg-f">
      <dd-layout-div>
        <dd-layout-div :height="296" class="posi-a">
          <dd-layout-div class="bg-t posi-a b0" :fillet="1875" :height="1875" :width="1875" :mar="[0,-(1875-750)/2]"/>
        </dd-layout-div>

        <dd-layout-div class="bg-f posi-r flex-col flex-bt box-sha-4-20"
                       :bg="`url(${cardBg})no-repeat 0 0 / 100% 100% #fff`"
                       :height="400 - 60" :pad="[45,30]" :mar="[30]"
                       :fillet="30">
          <dd-layout-div class="flex-bt">
            <dd-layout-div class="flex-g-1">
              <dd-layout-div class="hide-e col-3 fon-wb fon-xxl" :pad="[5,0,25]">{{getInfo.name}}</dd-layout-div>
              <dd-layout-div class="fon-sm">{{getInfo.department}} | {{getInfo.position}}</dd-layout-div>
            </dd-layout-div>
            <dd-layout-img class="flex-g-0 mar-l" :src="getInfo.face" :width="1.24" :height="1.24" :fillet="1.24"/>
          </dd-layout-div>
          <dd-layout-div class="flex-bt flex-y-center">
            <dd-layout-div class="flex-g-1">
              <dd-layout-div v-if="getInfo.isTel==1" :pad="[0,0,25]" class="flex-y-center fon-b">
                <dd-layout-div class="iconfont icon-dianhua5 fon-sm mar-r" color="#2074F1"/>
                {{getInfo.tel}}
              </dd-layout-div>
              <dd-layout-div v-if="getInfo.isAddress==1" class="flex fon-b">
                <dd-layout-div class="dingwei-bg mar-r flex-g-0 mar-t-10" :width="22" :height="28"/>
                <dd-layout-div class="flex-g-1" :line-height="40" :pad="[5,0,0]">{{getInfo.address}}</dd-layout-div>
              </dd-layout-div>
            </dd-layout-div>
            <dd-layout-div class="iconfont icon-erweima mar-l col-9" @click="previewImage(getInfo.wxImg,[getInfo.wxImg])" v-if="getInfo.wxImg&&getInfo.isWechat==1" :font-size="60"/>
          </dd-layout-div>
        </dd-layout-div>

      </dd-layout-div>

      <dd-layout-div class="flex-center col-9 fon-b" :pad="[30,0,50]" @click="showMoreInfo = !showMoreInfo">
        {{showMoreInfo?'收起全部信息':'展开全部信息'}}<i
        class="iconfont icon-xiajiantou"></i>
      </dd-layout-div>

      <dd-layout-div :pad="[0,30]" :mar="[0,0,50]" class="fon-b tr-du-3 over-h"
                     :height="showMoreInfo?248:0.001">
        <dd-layout-div v-if="getInfo.isTel==1" class="flex flex-bt flex-y-center" :height="60">
          <dd-layout-div :width="100" class="flex-g-0 col-9" :pad="[5,0,0]">电话</dd-layout-div>
          <dd-layout-div class="flex-g-1 " :pad="[5,0,0]">{{getInfo.tel}}</dd-layout-div>
          <i class="iconfont icon-dianhua6 col-9" @click="footerChoice(-1)"></i>
        </dd-layout-div>

        <dd-layout-div v-if="getInfo.isWechat==1" class="flex flex-bt flex-y-center" :height="60">
          <dd-layout-div :width="100" class="flex-g-0 col-9" :pad="[5,0,0]">微信</dd-layout-div>
          <dd-layout-div class="flex-g-1 " :pad="[5,0,0]">{{getInfo.wechat}}</dd-layout-div>
          <i class="iconfont icon-sixin col-9 fon-xxll"></i>
        </dd-layout-div>

        <dd-layout-div v-if="getInfo.isAddress==1" class="flex flex-bt flex-y-center" :height="60">
          <dd-layout-div :width="100" class="flex-g-0 col-9" :pad="[5,0,0]">地址</dd-layout-div>
          <dd-layout-div class="flex-g-1 hide-e" :pad="[5,0,0]">{{getInfo.address}}</dd-layout-div>
        </dd-layout-div>

        <dd-layout-div class="flex flex-bt flex-y-center" :height="60">
          <dd-layout-div :width="100" class="flex-g-0 col-9" :pad="[5,0,0]">公司</dd-layout-div>
          <dd-layout-div class="flex-g-1 hide-e" :pad="[5,0,0]">{{getInfo.company}}</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>


      <dd-layout-div class="flex" :height="90">
        <dd-layout-div class="flex-g-1 option-e t-c flex-col flex-bt">
          <i class="iconfont icon-huo col-r fon-46"></i>
          <dd-layout-div class="fon-xss col-6">浏览({{getInfo.viewNum}})</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex-g-1 option-e t-c flex-col flex-bt" @click="loveCheck">
          <dd-layout-div class="iconfont icon-like-b fon-44 " :color="cardMeal.love?'#3C9CE9':'#999'"/>
          <dd-layout-div class="fon-xss col-6" @click="loveCheck">点赞({{attrInit.loveNum || 0}})</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex-g-1 option-e t-c flex-col flex-bt" @click="followCheck">
          <dd-layout-div class="iconfont icon-collection-b fon-44 col-9" :color="cardMeal.follow?'#E97142':'#999'"/>
          <dd-layout-div class="fon-xss col-6">收藏({{attrInit.followNum || 0}})</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex-g-1 t-c flex-col flex-bt" @click="showMask = !showMask">
          <dd-layout-div class="iconfont icon-fenxiang1 fon-46" color="#5CBC3B"></dd-layout-div>
          <dd-layout-div class="fon-xss col-6">分享({{getInfo.shareNum}})</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>


      <dd-layout-div class="flex-bt" :pad="[68,30,30]">
        <dd-layout-div class="br-t col-t flex-center fon-xll" @click="footerChoice(-1)" :fillet="80" :width="325"
                       :height="80">一键拨号
        </dd-layout-div>
        <dd-layout-div class="br-t bg-t col-f flex-center fon-xll" @click="showMask = !showMask" :fillet="80"
                       :width="325"
                       :height="80">名片分享
        </dd-layout-div>
      </dd-layout-div>

    </dd-layout-div>

    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(cardId,9)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>

    <dd-layout-div class="bg-f mar-b-20" :pad="[40,30]">
      <dd-layout-div class="fon-wb fon-xll" :pad="[0,0,30]">个人简介</dd-layout-div>
      <dd-layout-html class="pad-0" :html="getInfo.body"/>
    </dd-layout-div>

    <dd-layout-div class="bg-f mar-b-20" :pad="[40,0,0]" v-if="getInfo.storeList.length > 0">
      <dd-layout-div class="fon-wb fon-xll" :pad="[0,30]">TA的店铺</dd-layout-div>
      <dd-layout-div class="flex flex-y-center"
                     @click="goPointPage('/shopDetail?storeId='+store.id)"
                     :pad="[30]" v-for="(store,key) in getInfo.storeList" :key="key">
        <dd-layout-img class="mar-r" :src="store.logo" :width="1.66" :height="1.66" :fillet="0.3"/>
        <dd-layout-div class="flex-g-1">
          <dd-layout-div class="flex">
            <dd-layout-div class="fon-wb fon-xll hide-e" :pad="[10,0]" max-w="100%">{{store.storeName}}
            </dd-layout-div>
          </dd-layout-div>

          <dd-layout-div class="flex-bt flex-y-center" :mar="[25,0]">
            <dd-layout-div class="flex-g-1 flex-bt pad-r-20">
              <span class="fon-sm">{{store.followNum }}粉丝</span>
              <span class="fon-sm">{{store.goodsNum }}商品</span>
              <span class="fon-sm"></span>
            </dd-layout-div>
            <i class="iconfont icon-iconfront-"></i>
          </dd-layout-div>
          <dd-layout-div class="flex">
            <dd-layout-div class="iconfont icon-xingxing mar-r-10 fon-xs" v-for="i in 5"
                           :color="i <= (store.star || 5)?'#f7af27':'#eee'"
                           :key="'s'+i"/>
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div class="bg-f" :pad="[40,0,0]">
      <dd-layout-div class="fon-wb fon-xll" :pad="[0,30,30]">TA的动态</dd-layout-div>
      <dd-layout-div v-if="postList.length > 0">
        <basic-note-item :post-data="item" v-for="(item,key) in postList" :key="key"/>
        <More v-if="postList.length > 0" :status="hasMore"/>
      </dd-layout-div>
      <not-data v-else-if="isRequest"/>

    </dd-layout-div>


    <dd-layout-div :height="200">
      <dd-layout-div class="posi-f b0 r0 l0 bg-f flex-bt flex-y-center" :height="200" :pad="[0,30]">
        <dd-layout-div class="br-t col-t flex-center fon-xll" @click="goPointPage('/auxiliary/card')" :width="330"
                       :height="117" :fillet="117">
          <i></i>
          查看更多名片
        </dd-layout-div>
        <dd-layout-div class="br-t bg-t col-f flex-center fon-xll" @click="footerChoice(1)" :width="330" :height="117"
                       :fillet="117">
          <i></i>
          创建我的名片
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <share-mask :show-mask.sync="showMask"/>

  </dd-layout-div>


</template>

<script>

  import Header from "@/components/header";
  import DetailsFooter from '../../../components/template/details-footer'
  import DdArticle from '../../../components/template/dd-article'
  import DdCardThree from '../../../components/template/card/three';
  import {mapActions, mapState, mapGetters} from 'vuex';
  import {hideLoading, showLoading, showHandleStatusByFlag, format} from "../../../util";
  import ShareMask from "../../../components/publication/share-mask";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdArticleFour from '../../../components/template/dd-article/four'
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";

  import cardBg from '../../../assets/img/card/card-bg.png'


  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutHtml,
      DdLayoutImg, DetailsFooter, DdArticle, DdCardThree, Header, ShareMask, DdArticleFour, BasicNoteItem
    },
    data() {
      return {
        cardBg,
        isRequest: false,
        active: 0,
        cardId: "",
        hasMore: true,
        attrInit: {
          follow: false,    //是否关注
          love: false,      //是否点赞
        },
        love: {},
        follow: {},
        checkMeal: "",
        queryParams: {
          page: 1,
          size: 10,
          status: "display",
          userId: "",
        },

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
        postList: {},//发帖请求的数据
        storeInfoList: [],
        boolmeal: true,
        cardMeal: {},
        showMoreInfo: false,
        showMask: false,
        storeId: null,
      }
    },
    methods: {
      ...mapActions("card", ["getCardInfo", "loveCard", "followCard", "orderShareNum"]),
      ...mapActions("personal/homePage", ["getMyPostList", "getMyStoreList"]),
      ...mapActions("shop", ["getShopInfoByParams"]),
      showMore(item) {
        return this.$root.$children[0].openArticleMore(item.postId);
      },
      async getData() {
        //showLoading();
        const result = await this.getCardInfo({
            id: this.cardId,
          }
        );
        this.cardMeal = result;
        if (this.cardMeal.isTel == 2) {
          this.cardMeal.tel = this.hideTelNumber(this.cardMeal.tel);
        }
        this.attrInit = {
          follow: this.cardMeal.follow,
          love: this.cardMeal.love,
          followNum: this.cardMeal.followNum,
          loveNum: this.cardMeal.loveNum,
        }
        console.log("this.attNum", this.attNum)
        this.hideNumber();
        this.$set(this.footerConfig.menu[2], 'useActive', this.cardMeal.follow);
        // this.changefollowStatus();

        console.log("this.cardMeal", this.cardMeal)
        updateShareConfig({
          title: this.cardMeal.name,
          imgUrl: this.cardMeal.logo[0] && this.getSingleImg(this.cardMeal.logo[0].url),
          desc: this.cardMeal.body,
          link: window.location.href,
        });

        hideLoading();
      },
      call(tel) {
        location.href = `tel://${tel}`;
      },
      async hideNumber() {
        if (this.cardMeal.isTel == 2) {
          this.footerConfig.main.childrenName = this.hideTelNumber(this.cardMeal.tel)
          this.footerConfig.main.name = this.cardMeal.name
        } else {
          this.footerConfig.main.childrenName = this.cardMeal.tel
          this.footerConfig.main.name = this.cardMeal.name
        }
      },

      async loveCheck() {
        this.love.type = "3";
        this.love.postId = this.cardMeal.id;
        console.log(this.love)
        let res = await this.loveCard({
          ...this.love
        })
        if (res == 1) {
          this.cardMeal.love = !this.cardMeal.love;
          this.changeloveStatus();
        }
      },
      async followCheck() {
        this.follow.type = "10";
        this.follow.postId = this.cardMeal.id;
        console.log(this.follow)
        let res = await this.followCard({
          ...this.follow
        })
        if (res == 1) {
          showHandleStatusByFlag(true, '操作成功')
          this.cardMeal.follow = !this.cardMeal.follow;
          this.$set(this.footerConfig.menu[2], 'useActive', this.cardMeal.follow);
          this.changefollowStatus();
        }
      },

      async shareOther() {
        this.showMask = true;
      },

      onInfinite() {
        if (!this.hasMore) return false;
        this.queryParams.page++;
        this.getPostList();
      },

      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮
            this.call(this.footerConfig.main.childrenName)
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/card'
            })
          case 1:       //发布
            return this.goPointPage({
              path: '/auxiliary/card/createCard',
            });
          case 2:       //收藏
            //this.collection();
            this.followCheck();
            // followCheck()
            return;
        }
      },
      async offOnCollection() {
        //showLoading();
        let res = await this.followCard({
          ...this.follow
        })
        if (res == 1) {
          this.changefollowStatus();
          showHandleStatusByFlag(true, '操作成功')
        } else {
          hideLoading();
        }

        return this.cardMeal.follow == false
      },
      async collection() {
        const bool = await this.offOnCollection();
        this.$set(this.footerConfig.menu[2], 'useActive', !bool);
      },

      async getPostList() {
        this.queryParams.userId = this.cardMeal.userId;
        let result = await this.getMyPostList({
          ...this.queryParams,
          status: 'display'
        })

        this.hasMore = result.length >= this.queryParams.size;

        this.postList = this.queryParams.page == 1 ? result : this.postList.concat(result);
      },
      async getStoreInfoList() {
        let res = await this.getShopInfoByParams({
          adminId: this.cardMeal.userId,status:1,
        });
        this.storeInfoList = res;
      },
      changefollowStatus() {
        if (this.attrInit.follow) {     //本身就已经关注过
          if (this.cardMeal.follow) {   // 没有改变状态
            this.attrInit.followNum++;
          } else {
            this.attrInit.followNum--;
          }
        } else {
          if (this.cardMeal.follow) {   // 没有改变状态
            this.attrInit.followNum++;
          } else {
            this.attrInit.followNum--;
          }
        }
        return this.attrInit.followNum;
      },

      changeloveStatus() {
        if (this.attrInit.love) {     //本身就已经关注过
          if (this.cardMeal.love) {   // 没有改变状态
            this.attrInit.loveNum++;
          } else {
            this.attrInit.loveNum--;
          }
        } else {
          if (this.cardMeal.love) {   // 没有改变状态
            this.attrInit.loveNum++;
          } else {
            this.attrInit.loveNum--;
          }
        }
        return this.attrInit.loveNum;
      }

    },
    computed: {
      getInfo() {
        const
          data = this.cardMeal,
          storeList = this.storeInfoList.map(item => {
            return {
              ...item,
              logo: item.storeLogo && item.storeLogo.length > 10 ? this.getSingleImg(JSON.parse(item.storeLogo)[0].url) : ''
            }
          });
        return {
          ...data,
          face: data.logo && data.logo.length > 0 ? this.getSingleImg(data.logo[0].url) : '',
          shareNum: data.shareNum || 0,
          loveNum: data.loveNum || 0,
          followNum: data.followNum || 0,
          viewNum: data.viewNum || 0,
          wxImg: data.wxImg && data.wxImg[0] ? this.getSingleImg(data.wxImg[0].url) : '',
          storeList
        }
      }
    },
    async created() {
      const query = this.$route.query;
      console.log("query", query)
      const that = this;
      this.isFailParams({
        field: query.id,
        tips: "缺少名片Id",
        async success() {
          this.cardId = query.id;
          // console.log(this.cardId)
          await that.getData();
          if (query.isShare) {
            this.orderShareNum(query).then(result => {
              console.log("orderShareNum", result);
            })
          }

          that.getPostList(0);
          that.getStoreInfoList();
          that.onscroll(that.onInfinite, that.$route.path);
        }
      })
    }
  }

</script>
