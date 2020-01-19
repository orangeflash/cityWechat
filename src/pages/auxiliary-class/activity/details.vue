<template>

  <div class="activity-details" v-if="activityInfo.id" style="padding-bottom: 1.5rem">
    <div style="height: 1rem"></div>
    <dd-goods-header
      v-bind="goodsHeader"
      tab-class="fon-w5"
      active-class="fon-wb col-3-i"
    ></dd-goods-header>
    <a hash id="top"></a>
    <div class="posi-r">
      <Banner
        :height="200"
        :showImage="true"
        :swiper="{children:banners}"
      />
      <div class="posi-a t0 r0 pad-r pad-t flex flex-col">
        <span class="bg-0-5 br-r-c flex-center w-56 dh-56 mar-b" @click.stop="collectionFn">
          <i class="iconfont icon-chakantieziguanzhu dh-20 fon-b"
             :class="[getInfo.info.isCollection?'col-price':'col-f']"></i>
        </span>
        <!--<span class="bg-0-5 br-r-c flex-center w-56 dh-56" v-if="getInfo.info.music">-->
        <!--<i class="iconfont icon-musicfill col-f dh-20 fon-sm"></i>-->
        <!--</span>-->
        <ddMusic iconClass="bg-0-5 br-r-c flex-center w-56 dh-56 fon-xxl" :autoPlay="true" v-if="getInfo.info.music"
                 v-model="getInfo.info.music"/>
      </div>
    </div>

    <div class="pad-30 bg-f">
      <span class="col-f bg-FFB849 fon-sm pad-8-4-2 dis-ib mar-r-10 br-r-8" v-if="getInfo.info.isSelected == 1">精</span>
      <span class="fon-xxl fon-wb lineH-60">{{getInfo.info.title}}</span>
    </div>

    <div class="bg-f pad-lr pad-b">
      <div class="flex-bt">
        <div>
          <span class="fon-xxl col-price mar-r">￥{{getInfo.info.price}}</span>
          <span class="col-9 t-d-l">￥{{getInfo.info.money}}</span>
        </div>
        <div class="bg-FFECF2 dis-ib col-FF0E3B pad-8-10-4 br-r-4">{{getInfo.info.typeName}}</div>
      </div>
      <p class="mar-t-20">报名时间：{{getInfo.info.enrollStartTime}} - {{getInfo.info.enrollEndTime}}</p>

      <!--活动暂时没又会员价-->
      <!--<div class="mar-t-20 bg-FFECF2 pad-30 flex-bt flex-y-center br-r-12">-->
      <!--<div>-->
      <!--<div class="fon-w5 fon-xll mar-b-20">-->
      <!--<i class="iconfont icon-huiyuanhuangguanguanjun-xianxing fon-xxl mar-r"></i>超级会员卡-->
      <!--</div>-->
      <!--<div>开通超级会员可<span class="col-t">9.90元购买</span></div>-->
      <!--</div>-->
      <!--<div class="c-b-t-lr-300 pad-17-28-15 br-r-30 col-f sd-t">立即开通</div>-->
      <!--</div>-->
    </div>


    <div class="pad-t-20 bg-f mar-t">
      <div class="pad-30">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">活动简介</span>
          </div>
        </div>
      </div>
      <div class="pad-30">
        <div class="bg-FDDC23 pad-t pad-b mar-b flex-x-center br-r-12 flex flex-y-center">
          <span class="fon-wb pad-r-20 br-r-3 fon-b">活动时间</span>
          <span class="fon-wb pad-l-20 fon-sm">{{getInfo.info.startTime}}</span>
          <span class="fon-xsss pad-8-10-4 br-3 mar-lr-20 br-r-10">至</span>
          <span class="fon-wb fon-sm">{{getInfo.info.endTime}}</span>
        </div>
        <ul class="">
          <li class="br-b-d dh-96 flex-y-center flex-bt" @click="openLocation(getInfo.storeInfo)">
            <div class="bg-589CFD dis-ib col-f pad-t-8 pad-b-4 br-r-4 w-100 pad-lr-10 t-c flex-g-0 mar-r">活动地址</div>
            <div class="flex-g-1 flex-y-center flex-x-end"><span
              class="col-9 lineH-38">{{getInfo.info.address}}</span><i class="iconfont icon-right col-9"></i></div>
          </li>
          <li class="br-b-d dh-96 flex-y-center flex-bt">
            <div class="bg-4ECA53 dis-ib col-f pad-t-8 pad-b-4 pad-lr-10 br-r-4 w-100 t-c  flex-g-0 mar-r">报名情况</div>
            <div><span class="col-9">已有<em class="col-f52c2c">{{getInfo.info.residue}}</em>人参与活动   剩余<em class="col-f52c2c">{{getInfo.info.quota}}</em>个名额</span>
              <!--<i class="iconfont icon-right col-9"></i>-->
            </div>
          </li>
          <li class="br-b-d dh-96 flex-y-center flex-bt">
            <div class="bg-FF6A5A dis-ib col-f pad-t-8 pad-b-4 pad-lr-10 br-r-4 w-100 t-c  flex-g-0 mar-r">主办方</div>
            <div class="flex flex-y-center" @click="goPointPage('/shopDetail?storeId='+getInfo.storeInfo.storeId)">
              <dd-user
                :src="getInfo.storeInfo.logo"
                :name="getInfo.storeInfo.storeName"
                size="22"
                fontSize="30"
                nameClass="fon-wb"
              ></dd-user>
              <i class="iconfont icon-right col-9"></i></div>
          </li>
        </ul>

      </div>
    </div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(getInfo.info.id,10)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>

    <div class="pad-t-20 bg-f pad-b">
      <div class="pad-30">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">活动须知</span>
          </div>
        </div>
      </div>
      <dd-layout-html class="fon-b-i  col-6" :html="activityInfo.notice"/>
    </div>


    <a hash id="details"></a>
    <div class="pad-t-20 bg-f mar-t">
      <div class="pad-30">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">活动详情</span>
          </div>
        </div>
      </div>
      <dd-layout-html class="fon-b-i  col-6" v-html="activityInfo.detail"/>
      <div class="pad-30">
        <video class="base-pad b-box" v-if="activityInfo.video" :src="activityInfo.video" width="100%"
               controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
               x-webkit-airplay="true" x5-video-player-type="h5"
               x5-video-player-fullscreen="" x5-video-orientation="portraint"
        ></video>
        <img
          class="br-r-20 mar-b dis-b mar-a mw100 "
          @click.stop="previewImage(getSingleImg(item.url),activityInfo.detailImgs.map(img=>getSingleImg(img.url)))"
          v-for="(item,key) in activityInfo.detailImgs"
          :src="getSingleImg(item.url)"
          :key="key"/>
      </div>


    </div>
    <a hash id="comment"></a>

    <div class="pad-t-20 bg-f  mar-t">
      <dd-layout-comment-list title="活动评论" :deliver="true" @comment="replyComment" :hide-link="true"
                              :hide-comment="true" :comments="activityInfo.comment">

        <div slot="bottom" class="dh flex-center col-t fon-b"
             @click="goPointPage('/auxiliary/activity/activityCommentList?activityId='+$route.query.activityId)">查看全部评价
        </div>

      </dd-layout-comment-list>
    </div>


    <!--<chunk title="活动评价" br="true">-->
    <!--<div slot="content" class="pad-b-20">-->
    <!--<comment-->
    <!--v-for="(item,key) in activityInfo.comment"-->
    <!--:key="key"-->
    <!--:data="item"-->
    <!--canReply="true"-->
    <!--@reply="replyComment(item.commentId)"-->
    <!--@lookReply="lookReply(item.commentId)"-->
    <!--/>-->
    <!--<div class="dh flex-center fon-b col-9"-->
    <!--v-if="activityInfo.comment.length>=3"-->
    <!--@click="goPointPage('/auxiliary/activity/activityCommentList?activityId='+$route.query.activityId)">查看全部评价-->
    <!--</div>-->
    <!--<not-data v-else-if="activityInfo.comment.length == 0"/>-->
    <!--</div>-->
    <!--</chunk>-->

    <details-footer v-bind="footerConfig" @method="footerChoice"></details-footer>
    <!--弹窗-->
    <Popup v-if="isShowContactCode" :QRCode="null|| platform.contactCode" @close="isShowContactCode = false"
           desc="联系客服"></Popup>
  </div>

</template>

<script>
  import Banner from '@/components/home/banner';
  import DdGoodsHeader from '@/components/template/mall/dd-goods-header';
  import DdStoreTitle from "@/components/template/dd-store/title";
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdStoreInfo from '@/components/template/mall/dd-store-info';
  import FaceMap from '@/components/template/other/face-map';
  import Comment from '@/components/template/dd-article/comment';
  import Chunk from '@/components/template/dd-store/chunk';
  import DetailsFooter from '@/components/template/details-footer'
  import ddUser from '@/components/template/user'
  import Popup from '@/components/popup'       // 弹窗
  import {mapActions, mapState} from 'vuex';
  import {utilMixins} from "@/plugins/util-mixins";
  import {Toast} from 'vant'
  import {computedDate, format, hideLoading, showLoading} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import DdMusic from "@/components/template/other/music"
  import DdLayoutPartList from "../../../components/layout/dd-layout-part-list";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutCommentList from "../../../components/layout/dd-layout-comment-list";

  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutCommentList,
      DdLayoutImg,
      DdLayoutHtml,
      DdLayoutPartList,
      DdGoodsHeader,
      Banner,
      DdStoreTitle,
      DdStoreDataList,
      DdStoreInfo,
      FaceMap,
      Comment,
      Chunk,
      DetailsFooter,
      ddUser,
      Popup,
      DdMusic
    },
    data() {
      return {
        isShowContactCode: false,
        activityInfo: {},
        collectionState: {
          state: true
        },
        storeInfo: {},
        tips: [],
        formTwo: {
          height: 60,
          form: [],
        },
        formThree: {
          fontSize: 28,
          height: 50,
          form: [
            {icon: 'icon-dian2', label: '支付开团并邀请好友拼团，人数不足可进行退款'},
            {icon: 'icon-dian2', label: '商品截止时间：'},
            {icon: 'icon-dian2', label: '该拼团优惠不可与其他优惠同享'},
          ],
        },
        faceMap: {
          faces: [],
          size: 28,
          max: 10
        },
        banners: [],
        goodsHeader: {
          tabs: [
            {name: '活动', active: true, id: 'top'},
            {name: '详情', id: 'details'},
            {name: '评论', id: 'comment'},
          ]
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-ren111',
              name: '我的',
              color: '#818181',
            }, {
              icon: 'icon-kefu',
              name: '客服',
              color: '#818181',
            },
          ],
          main: {
            name: '立即报名',
            childrenName: '',
          }
        },
      }
    },
    methods: {
      ...mapActions(['getInformationAdList', 'collectionPost']),
      ...mapActions('activity', ['getActivityInfo', 'commentActivity']),
      /** 收藏 */
      async collectionFn() {

        const res = await this.collectionPost({
          postId: this.$route.query.activityId,
          type: 11
        });

        this.activityInfo.follow = +res.status == 1;
        this.collectionState.state = +res.status == 1;
        if (+res.status == 1) {
          Toast({
            message: '已收藏',
            duration: 1000
          });
        } else if (+res.status == 2) {
          Toast({
            message: '已取消',
            duration: 1000
          })
        } else {
          Toast.fail({
            message: '操作失败',
            duration: 1500
          })
        }

      },
      choiceFace(index) {

      },
      /** 回复评论 */
      async replyComment(comment) {
        const res = await this.commentActivity({
          body: comment.body,
          activityId: this.$route.query.activityId,
          commentId: comment.commentId,
          replyUserId: comment.userId,
        });


        if (res.code == 1) {
          Toast.success({
            message: '评论成功',
            duration: 1500
          });
          this.init(this.$route.query)
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }

        //
        // console.log("commentId", commentId)
        // this.isFailParams({
        //   field: commentId,
        //   tips: '缺少评论id',
        //   noBack: true,
        //   success() {
        //     this.goPointPage({
        //       path: '/auxiliary/activity/comment',
        //       query: {
        //         title: '回复评论',
        //         commentId,
        //         isReply: true,
        //         activityId: this.$route.query.activityId
        //       }
        //     })
        //   }
        // })
      },
      /** 查看所有的回复 */
      lookReply(commentId) {

        this.goPointPage({
          path: "/auxiliary/activity/commentDetails",
          query: {
            commentId,
            activityId: this.$route.query.activityId

          }
        })


      },
      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮
            if (this.activityInfo.isJoin) {

              location.href = `tel://${this.activityInfo.linkTel}`
            } else {
              this.goPointPage({
                path: '/auxiliary/activity/enroll',
                query: this.$route.query
              })
            }

            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/activity'
            })
          case 1:       //我的报名
            return this.goPointPage({
              path: '/auxiliary/activity/order',
            });
          case 2:       //收藏

            this.isShowContactCode = !this.isShowContactCode;
            // Toast({
            //   message: '敬请期待',
            //   duration: 1500
            // })
            return;
        }
      },
      async init(query) {
        if (query.activityId) {
          showLoading();
          const info = await this.getActivityInfo(query);
          hideLoading();
          if (info.id) {
            this.activityInfo = info;

            info.showImgs.forEach(v => v.notHost = true)
            this.banners = info.showImgs || []

            this.tips = [
              {
                label: this.activityInfo.typeName,
                html: `已有<em class="col-t">${this.activityInfo.residue || 0}</em>人参与活动   剩余<em class="col-t">${this.activityInfo.num - this.activityInfo.residue}</em>个名额`
              }
            ]

            this.faceMap.faces = this.activityInfo.enroll.map(item => {
              return item.portrait
            })

            this.formTwo.form = [
              {icon: 'icon-huo', label: '浏览人数：' + this.activityInfo.browse || 0},
              {
                icon: 'icon-Group-',
                label: '报名时间：' + format(this.activityInfo.enrollStartTime * 1000)
                  + ' - ' + format(this.activityInfo.enrollEndTime * 1000)
              },
              {
                icon: 'icon-shijian2',
                label: '活动时间：' + format(this.activityInfo.startTime * 1000)
                  + ' - ' + format(this.activityInfo.endTime * 1000)
              },
              {icon: 'icon-dizhi3', label: '活动地址：' + this.activityInfo.address},
            ]

            this.activityInfo.comment.forEach(item => {

              item.src = item.portrait,
                item.nickname = item.userName,
                item.comment = item.body,
                item.time = computedDate(+item.creatTime),
                item.replySize = item.reply.length
            });

            this.collectionState.state = this.activityInfo.follow

            this.footerConfig.main.name = this.activityInfo.isJoin ? '联系主办方' : '立即报名';
            updateShareConfig({
              title: this.activityInfo.name,
              imgUrl: this.getSingleImg(this.activityInfo.showImgs[0].url),
              desc: this.activityInfo.detail,
            })

          }

        } else {
          Toast.fail({
            message: '缺少活动id',
            duration: 1500,
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      }
    },
    computed: {
      ...mapState({
        user: s => s.user,
        platform: s => s.platform
      }),
      getInfo() {
        const data = this.activityInfo

        const info = {
            id: data.id,
            title: data.name,
            price: data.currentPrice,
            money: data.originalPrice,
            typeName: data.typeName,
            residue: data.residue || 0,
            quota: (data.num - data.residue) || 0,
            enrollStartTime: format(data.enrollStartTime * 1000),
            enrollEndTime: format(data.enrollEndTime * 1000),
            startTime: format(data.startTime * 1000),
            endTime: format(data.endTime * 1000),
            address: data.address,
            music: data.music,
            isCollection: data.follow,
            isSelected: data.isSelected
          },
          storeInfo = {
            logo: data.storeLogo[0] && this.getSingleImg(data.storeLogo[0].url),
            storeName: data.storeName,
            name: data.name,
            storeId: data.storeId,
            address: data.address,
            lat: data.lat,
            lng: data.lng,
          }

        return {
          info, storeInfo
        }
      }
    },
    created() {
      this.init(this.$route.query)
    }
  }

</script>
