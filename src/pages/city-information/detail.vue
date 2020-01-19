<template>
  <div id="InformationDetails" class="bg-f" v-if="detailInfo">
    <Header :childrenTitle="detailInfo.title||'匿名标题'"/>

    <div class="pad-30 ">
      <span class="col-f bg-FFB849 fon-sm pad-8-4-2 dis-ib mar-r-10 br-r-8" v-if="getInfo.info.attribute == 1">置</span>
      <span class="col-f bg-FF8AD6 fon-sm pad-8-4-2 dis-ib mar-r-10 br-r-8" v-if="getInfo.info.attribute == 2">精</span>
      <span class="fon-xxl fon-wb lineH-60">{{getInfo.info.title}}</span>
    </div>
    <div class="pad-lr pad-b">
      <dd-layout-user
        :src="getInfo.user.face"
        :name="getInfo.user.name"
        :desc="getInfo.user.desc"
        :size="0.85"
        :fillet="0.85"
      />
    </div>
    <video class="base-pad b-box" v-if="getInfo.info.video" :src="getInfo.info.video" width="100%"
           controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
           x-webkit-airplay="true" x5-video-player-type="h5"
           x5-video-player-fullscreen="" x5-video-orientation="portraint"
    ></video>
    <dd-layout-html :html="getInfo.info.context" @load="textLoad"/>
    <p class="col-9 t-r pad-30 fon-xs">{{getInfo.info.releaseTime}}</p>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(getInfo.info.id,3)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>
    <div class="pad-30 t-c" v-if="hasPrice">
      <div class="fon-xl pad-30">优质内容，值得打赏</div>
      <div class="mar-a w-180 dh-180">
        <dd-layout-img
          @click="goPointPage({path:'/cityInformation/rewardauthor',query:{informationId:$route.query.id,face:getInfo.user.face,name:getInfo.user.name}})"
          class="bg-tran" :width="1.8" :height="1.8" :src="award"/>
      </div>
      <p class="col-9 fon-b">已有{{getInfo.info.people}}次打赏</p>
    </div>

    <div class="flex-bt pad-lr flex-y-center pad-t">
      <div class="flex-y-center">
        <dd-layout-img :width="0.59" :height="0.59" :fillet="0.59" :src="item.avatar"
                       v-for="(item,key) in getInfo.info.loveUser"
                       class="mar-r-10"
                       v-if="key < 4"
                       :key="key"/>
        <div class="bg-d w-59 h-59 br-r-c flex-center col-f fon-40 over-h" v-if="getInfo.info.loveUser.length > 4"><span
          class="mar-t-020">...</span></div>
      </div>
      <div class="flex-y-center col-6">
        <span class="br-r-30 pad-10-20-6 br-d mar-l" @click="likeClick" :class="isLike&&'col-t br-t'">
          <i class="iconfont icon-buoumaotubiao15 mar-r-10"></i>{{getInfo.info.loveNum}}
        </span>
        <span class="br-r-30 pad-10-20-6 br-d mar-l" @click="showMask = !showMask">
          <i class="iconfont iconfont icon-fenxiang-tianchong mar-r-10"></i>{{getInfo.info.share}}
        </span>
      </div>
    </div>

    <dd-layout-comment-list
      :comments="commentList"
      :hideComment="true"
      :hideLink="true"
      :hide-total="true"
      :limit="false"
      :deliver="true"
      @comment="releaseComment"
    />
    <dd-layout-comment-tool @comment='commentHandle' :isLike="isLike" @click="operation"/>

    <share-mask :show-mask.sync="showMask"/>

  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import {Field, Button, ImagePreview} from 'vant';
  import {utilMixins} from "../../plugins/util-mixins";
  import {computedDate} from "../../util/index"
  import Comment from '../../components/basic/comments'
  import noComment from '../../assets/img/city-information/no-comment.png'  //暂无评论图片
  // import adImg from "../../assets/img/city-information/ad-one.png";
  import postCard from "../../components/post/post-cord.vue";
  import infoLeft from "../../assets/img/city-information/info-left.png";
  import infoRight from "../../assets/img/city-information/info-right.png";
  import ShareMask from "@/components/publication/share-mask";
  import Header from "@/components/header";
  import {updateShareConfig} from "../../util/wechat-util";
  import {PlaceholderAvatar} from "../../project-config/base";
  import ArticleAttrInfo from '../../components/template/article-attr-info'
  import {Toast} from 'vant'
  import {showHandleStatusByFlag, showLoading} from "../../util";
  import DdComment from '../../components/template/dd-form/comment'
  import DdLayoutUser from "../../components/layout/dd-layout-user";
  import DdLayoutHtml from "../../components/layout/dd-layout-html";
  import DdLayoutCommentList from "../../components/layout/dd-layout-comment-list";
  import DdLayoutCommentTool from "../../components/layout/dd-layout-comment-tool";


  import DdLayoutImg from "../../components/layout/dd-layout-img";
  import award from "../../assets/img/city-information/award.png"

  export default {
    name: "InformationDetails",
    components: {
      DdLayoutImg,
      DdLayoutCommentList, DdLayoutCommentTool,
      DdLayoutHtml, DdLayoutUser, postCard, Comment, ShareMask, Header, ArticleAttrInfo, DdComment
    },
    mixins: [utilMixins],
    data() {
      return {
        award,
        aditem: '',
        showMask: false,
        quickListImg: infoLeft,
        quicktext: '快速导航',
        changeRed: 0,
        quickLinks: 'quick-links',
        quickActive: 'quick-active',
        index: [0, 1, 2],
        isactive: -1,
        PlaceholderAvatar,
        desc: '',
        noComment,
        isComment: false,
        detailInfo: '',
        commment: '',
        isCollection: false,
        isLike: false,
        recommendList: [],
        allComment: false,
        isDisplayShow: true,
        isRelease: false,
        showMask: false,
        pageSize: 1,
        photolist: [],
        images: [],
        hasPrice: false,
        AttrInfo: {},
        comment: '',
        commentList: [],
        commentId: null,
        replyId: null,
        showComment: false,
      };
    },
    methods: {
      textLoad(e) {
        console.log("load", e)
        this.desc = e.text;
      },
      operation(e) {
        switch (e) {
          case 0:
            this.likeClick();
            break;
          case 1:
            this.showMask = !this.showMask
            break;
          case 2:
            this.goPointPage("/cityInformation")
            break;
        }
      },
      commentHandle(value) {
        console.log("value", value)
        this.comment = value
        this.releaseComment()
      },

      onSwitch() {
        this.changeRed = this.changeRed ? 0 : 1;
        if (this.changeRed) {
          this.changeRed = 1;
          this.quicktext = '收起';
          this.quickListImg = infoRight;
        } else if (!this.changeRed) {
          this.changeRed = 0;
          this.quicktext = '快速导航';
          this.quickListImg = infoLeft;
        }
      },
      getTime(time) {
        return computedDate(time)
      },
      loveClick(index) {
        this.isactive = detail;
      },
      ...mapActions("cityInformation", ['getInformationDetail', 'keepMyLove', 'getCityInfoList', 'rewardPrice', 'informationShare', "informationComment", "getZxConfig"]),
      ...mapActions("common", ['getBannerListByType']),
      ...mapActions("post", ['likePostAction', 'collectPost']),
      /* 获取帖子详情*/
      async getInfoDetail() {
        const {data, comment} = await this.getInformationDetail({
          id: this.$route.query.id
        });
        this.detailInfo = data;
        this.commentList = comment;
        console.log("comment", comment);


        this.isLike = this.detailInfo.love

        this.AttrInfo = {
          lover: {
            num: this.detailInfo.loveNum,
            status: this.detailInfo.love
          },
          look: this.detailInfo.browseNum,
          share: this.detailInfo.share,
        }


        if (this.detailInfo.media) {
          this.photolist = JSON.parse(this.detailInfo.media) ? JSON.parse(this.detailInfo.media) : '';
          this.images = this.photolist.map(({url}) => this.getPathByAssetPath(url))
        }
      },
      /**预览图片 */
      previewImg(index) {
        ImagePreview({
          images: this.images,
          startPosition: index,
        })
      },
      /**
       * 点赞
       */
      likeClick() {
        this.likePostAction({
          postId: this.$route.query.id,
          userId: 34,
          type: 2,
        }).then(() => {
          this.getInfoDetail();
        })

      },
      /**
       * 收藏
       */
      collectionClick() {
        this.collectPost({
          postId: this.$route.query.id,
          userId: 34,
          type: 2
        });
        this.isCollection = !this.isCollection;
      },

      /**
       * 获取广告位
       */
      async getInfoDetailAdSlotByType() {
        this.aditem = await this.getBannerListByType({
          type: 1,
          adType: 2
        })
      },
      async getRecommendByPage() {
        this.recommendList = await this.getCityInfoList({
          page: this.pageSize,
          size: 10,
        })
        this.pageSize++;
      },
      addCommont() {
        console.log(8955, this.comment.trim())
        if (!this.comment.trim()) {
          this.isDisplayShow = !this.isDisplayShow;
          this.isRelease = !this.isRelease;
        }

      },
      /**
       * 分享
       */
      shareClick() {
        this.showMask = true;
      },
      /** 评论 */
      openComment(commentId, replyId) {
        this.commentId = commentId;
        this.replyId = replyId
        this.showComment = true;
      },
      async releaseComment(msg = null) {

        if (msg) {
          this.commentId = msg.commentId
          this.replyId = msg.userId
        }
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return

        if (!this.comment.trim() && !msg) {
          return Toast({
            message: '请输入评论',
            duration: 1500
          })
        }

        showLoading();
        const res = await this.informationComment({
          infoId: this.$route.query.id,
          body: this.comment || msg.body,
          ...msg ? {
            commentId: this.commentId,
            replyUserId: msg ? this.replyId : ''
          } : {}
        })
        showHandleStatusByFlag(res.code, "评论成功", res.msg);
        if (res.code) {
          console.log('评论成功后的操作')
          this.showComment = false;
          await this.getInfoDetail();
          this.comment = '';
        }
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
      }),
      getInfo() {
        console.log("this.detailInfo", this.detailInfo)
        const data = this.detailInfo,
          info = {
            id: data.id,
            title: data.title,
            context: data.body,
            releaseTime: computedDate(data.createdAt),
            loveUser: data.loveUser || [],
            loveNum: data.loveNum,
            share: data.share,
            attribute: +data.attribute || 0,
            video: data.video,
            people: data.people
          },

          user = {
            face: this.getSingleImg(JSON.parse(data.customPortrait)[0].url),
            name: data.customUser || '同城用户',
            desc: data.name
          }
        return {
          info, user
        }


      }
    },
    async created() {
      this.getZxConfig().then(() => {
        // console.log(this.$store.state)
        document.title = this.$store.state.cityInformation.zxConfig.field + '详情';
      })
      if (this.$route.query.isShare) {
        await this.informationShare({
          id: this.$route.query.id
        })
      }
      await this.getInfoDetail();
      // await this.getInfoDetailAdSlotByType();
      // await this.getRecommendByPage();

      const res = await this.rewardPrice();
      if (res.code == 1) {
        if (res.data) {
          console.log(res.data)
          this.hasPrice = res.data.length > 0;
        }
      }

      const that = this;

      // function shareConfig() {
      //   if (that.desc) {
      //     updateShareConfig({
      //       title: "【" + that.detailInfo.name + "】" + that.detailInfo.title,
      //       imgUrl: that.images.length && that.images[0] ? that.images[0] : that.platform.shareImg,
      //       desc: that.desc || '',
      //       link: window.location.href,
      //     });
      //   } else {
      //     window.requestAnimationFrame(shareConfig)
      //   }
      // }
      //
      // window.requestAnimationFrame(shareConfig)
      updateShareConfig({
        title: "【" + that.detailInfo.name + "】" + that.detailInfo.title,
        imgUrl: that.images.length && that.images[0] ? that.images[0] : that.platform.shareImg,
        desc: that.desc || '',
        link: window.location.href,
      });

    },
    watch: {
      "$route": "getInfoDetail"
    }
  };
</script>
