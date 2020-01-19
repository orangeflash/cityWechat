<template>
  <!--首页帖子信息-->
  <div id="BasicNoteItem" class="pad-30 mar-b-20 bg-f pr"
       @click="goPointPage({path:'/postDetail',query:{postId:getInfo.post.postId}})">
    <!--用户信息-->
    <div class="flex-bt">
      <div class="flex-y-center">
        <div class="posi-r mar-r">
          <face :src="getInfo.user.face" :size="76/2"/>
          <img :src="vip" v-if="getInfo.user.isVip == 1" class="posi-a b0 r0 w-30">
        </div>
        <div class="">
          <div class="mar-b-10 flex-y-center">
            <span class="fon-b mar-r-10">{{getInfo.user.name}}</span>
            <img :src="renzheng" class="w-100 mar-r-10" v-if="getInfo.user.isAuth == 1">
            <img :src="top" class="w-88 mar-t-5" v-if="getInfo.post.isTop == 1">
          </div>
          <div class="col-9 fon-xss">{{getInfo.post.releaseTime}}</div>
        </div>
      </div>
      <div class="flex-g-0 flex flex-col-start" v-if="getInfo.post.typeName">
        <span class="bg-E3F2FF col-058DFF pad-8-14-4 br-r-16 fon-wb ">{{getInfo.post.typeName}}</span>
      </div>
    </div>
    <!--帖子信息-->
    <div>
      <div class="mar-t">
        <img :src="redBag" v-if="getInfo.post.isRedBag == 1" class="w-109">
        <img :src="reward" v-if="getInfo.post.offerReward == 1" class="w-34">
        <span v-html="getInfo.post.context" class="lineH-38 fon-normal fon-lg lineH-48"></span>
      </div>
      <div class="mar-t flex-wrap flex" v-if="getInfo.post.tag.length > 0">
        <span class="bg_search_bg col-597EB2 mar-b-10 pad-8-10-6 mar-r-10 br-r-4" v-for="(item,key) in getInfo.post.tag"
              :key="key">#{{item}}</span>
      </div>
      <div class="mar-t posi-r" v-if="getInfo.post.pictures.length > 0">
        <ul class="flex-bt">
          <li
            class="w-167 dh-167 over-h br-r-4 posi-r flex-center"
            @click.stop="!getInfo.post.isVideo && showImage(url,getInfo.post.pictures)"
            v-if="key < 4"
            v-for="(url,key) in getInfo.post.pictures" :key="key">
            <img v-if="getInfo.post.isVideo" class="posi-a w50" src="@/assets/img/pause.png">
            <img-wrapper :src="url"/>
          </li>
          <div class="flex" v-if="getInfo.post.pictures.length < 4">
            <li
              class="w-167 dh-167 "
              v-for="i in (4 - getInfo.post.pictures.length)"
              :key="'p'+i"
            ></li>
          </div>

        </ul>
        <span v-if="getInfo.post.pictures.length > 4" class="col-f bg-0-3 posi-a b0 r0 pad-8-14-4 br-r-16">
          4/{{getInfo.post.pictures.length}}
        </span>
      </div>
      <div class="flex-bt flex-y-center mar-t">
        <div>
          <span class="col-9 fon-xss">{{getInfo.post.browse}}阅读</span>
          <span class="fon-xss col-f38 mar-l" v-if="getInfo.user.userId == user.id && showOperation">{{getInfo.post.status}}</span>
          <span v-else-if="parseFloat(getInfo.post.distance) < 5000" class="col-9 fon-xss mar-l">~{{getInfo.post.distance}}</span>
        </div>
        <div v-if="showOperation && getInfo.user.userId == user.id && !getInfo.post.hideoPeration"
             class="bg-t col-f pad-12-20-10 br-r-20"
             @click.stop="operation(getInfo.post)">
          操作/编辑
        </div>
        <div class="flex-y-center" v-else>
          <span class="col-9 fon-xss mar-l flex-y-center" v-if="postConfig.comment == '1'"><i
            class="iconfont icon-pinglun3 mar-t-5 fon-xxl mar-r-10"></i>{{getInfo.post.comment}}</span>
          <span class="col-9 fon-xss mar-l"><i class="iconfont icon-tuijian fon-xxl mar-r-10"></i>{{getInfo.post.love}}</span>
        </div>

      </div>
    </div>
    <!--评论信息-->
    <div class="pad-lr-20 mar-t bg-F8F9FA"
         v-if="getInfo.post.faceMap&&getInfo.post.faceMap.length > 0 || getInfo.comment&&getInfo.comment.length > 0 ">
      <div class="flex-y-center fon-xss col-9 pad-t-20 pad-b-15" v-if="getInfo.post.faceMap.faces.length > 0">
        {{getInfo.post.love}}赞
        <face-map class="mar-lr-20" v-bind="getInfo.post.faceMap"/>
      </div>

      <div class="pad-b-20" :class="getInfo.post.love== 0&& 'pad-t-20'"
           v-if="getInfo.comment.length > 0 && postConfig.comment == '1'">
        <div>
          <div class="lineH-34 mar-b-10" v-for="(c,key) in getInfo.comment" :key="key" v-if="key < 3">
            <div class="mar-b-10"><span class="col-name ">{{c.userName}}：</span>{{c.body}}</div>
            <div class="lineH-34 mar-b-10" v-if="c.reply.length > 0 && getLenght(key,k) < 3"
                 v-for="(reply,k) in c.reply"
                 :key="k">
              <span class="col-name">{{reply.userName}}：</span>回复<span class="col-name">{{reply.replyUserName}}：</span>{{reply.body}}
            </div>
          </div>
        </div>
        <div class="col-name" v-if="getInfo.post.commentTotal > 3">共有{{getInfo.post.commentTotal}}条评论>></div>

      </div>
    </div>
    <status-stamp ptype="1" :data="getInfo.post" top="1.3rem"></status-stamp>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "../../../project-config/base";
  import {computedDate, hideLoading, keyLenByObj, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import UserInfo from "@/components/template/user";

  import renzheng from '../../../assets/img/attest/prz.png'
  import vip from '../../../assets/img/attest/vip.png'

  import Face from '@/components/template/face'
  import FaceMap from "../../template/other/face-map";
  import top from '../../../assets/img/city-information/top.png'
  import redBag from '../../../assets/img/city-information/red-bag.png'
  import reward from '../../../assets/img/city-information/reward.png'
  import StatusStamp from "@/components/template/status-stamp";

  export default {
    name: "BasicNoteItem",
    props: ["postData", "hideExpansionBar", 'mark', 'showPayMask', 'hidecomment', 'showredmoney', 'hideOper', 'hideStatus', 'showOperation'],
    components: {FaceMap, Face, UserInfo, StatusStamp},
    data() {
      return {
        vip,
        top,
        redBag,
        reward,
        renzheng,
        showMoreFeature: false,
        showCommentMask: false,
        message: "",
        PlaceholderImg,
        backendPath,
        PlaceholderAvatar,
        showFeatureBar: false,
        showTopOption: false,
        showDetails: false,
        toppingOptionsInfo: [],        //置顶选项
      }
    },
    methods: {
      ...mapActions("post", [
        "submitComment",
        "likePostAction",
        "cancelPostAction",
        "getToppingOptions",
        "PayPostRefreshAction",
        "deletePostAction"]),
      ...mapActions("publication", ["createToppingOrder", "payToppingAction", "getPublicationPrice"]),
      operation(item) {
        return this.$root.$children[0].openArticleMore(item, (tips) => {
          this.$parent.onRefresh()
        }, true);
      },
      getLenght(key, k) {
        let len = 0
        this.getInfo.comment.forEach((item, index) => {
          if (key >= index) {
            len++;
            if (k < item.reply.length - 1) len++;

          }
        })

        console.log("len", len)


        return len;
      },
      async likeHandle() {
        const code = await this.likePostAction({
          postId: this.postData.postId,
          userId: this.user.id,
          type: 1
        });
        if (!code) {
          return showHandleStatusByFlag(code)
        }
        this.showFeatureBar = false;
        if (this.isLiked) {
          this.postData.dz.splice(_.findIndex(this.lovers, {userId: this.user.id}), 1);
          showDialog("已取消点赞！", "提示", false)
        } else {
          const user = _.cloneDeep(this.user);
          user.userId = user.id;
          this.postData.dz.push(user);
          showDialog("点赞成功！", "提示", false)
        }
      },
      showImage(src, pictures) {
        this.previewImage(src, pictures)
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
      ...mapState("common", {
        postConfig: state => state.postConfig,
      }),
      isLiked() {
        return _.find(this.lovers, {userId: this.user.id});
      },

      isSelfPost() {
        return this.user && this.user.id === this.postData.userId
      },
      comments() {


        return this.postData.comment || []
      },
      lovers() {
        return this.postData.dz || []
      },
      getInfo() {
        let info = {};
        let data = this.postData;
        info.user = {
          name: this.stringIntercept(data.customUser || data.linkMan || data.userName || '神秘人', 6),
          face: (data.customPortrait && data.customPortrait != '[]' && JSON.parse(data.customPortrait).length > 0 && this.getPathByAssetPath(JSON.parse(data.customPortrait)[0].url)) || data.portrait || this.PlaceholderAvatar,
          userId: data.userId,
          isVip: +data.isVip,
          isAuth: +data.isAuth,

        }

        let pictures = [], isVideo = false;

        if (data.media && data.media.length > 2) {
          let mediaImg = this.getMediaList(data.media).img
          if (mediaImg && mediaImg.length > 0) {
            pictures = this.getMediaList(data.media).img
          }
          let mediaVideo = this.getMediaList(data.media).video
          if (mediaVideo) {
            try {
              pictures = JSON.parse(data.media).map(item => {
                return this.getPathByAssetPath(item.preview)
              })
              isVideo = true
            } catch (e) {
              console.log(e)
            }

          }
        }

        const expire = new Date().getTime() > data.expireTime * 1000;

        info.post = {
          context: this.formatBody(this.interpretation(data.body)),
          tag: data.tag ? data.tag.split(",") : [],
          pictures: pictures || [],
          releaseTime: computedDate(data.creatTime) + '发布',
          typeName: this.stringIntercept(data.typeName, 10, false) || null,
          browse: data.browse,
          comment: data.comment ? data.comment.length : 0,
          love: data.love || 0,
          postId: data.postId,
          share: data.share,
          typeId: data.typeId,
          typePid: data.typePid,
          isTop: +data.isTop,
          isRedBag: +data.isRedBag,
          isReward: data.isReward || 2,
          offerReward: data.offerReward,
          distance: data.distance,
          faceMap: {
            faces: data.dz ? data.dz.map(item => {
              return item.portrait
            }) : [],
            size: 32 / 2,
            max: 10
          },
          isVideo,
          hideoPeration: expire || +data.isEnd == 1,
          rewardState: data.rewardState,
          status: expire ? '已过期' : +data.status == 0 ? '待审核' : +data.status == 2 ? '已拒绝' : +data.isEnd ? '您已结束该信息' : ''
        }

        info.comment = [];
        let len = 0, max = 3, total = 0;
        data.comment && data.comment.forEach(item => {
          if (len < max) {
            len++;
            total++;
            let itemComment = {
              body: this.formatBody(this.interpretation(item.body)),
              userName: item.userName,
              userId: item.userId,
              portrait: item.portrait,
              creatTime: item.creatTime,
              commentId: item.commentId,
              reply: []
            }

            item.reply.forEach(reply => {
              total++;
              if (len < max) {
                len++;
                itemComment.reply.push(reply);
              }

            })
            info.comment.push(itemComment)
          }
        })
        info.post.commentTotal = total
        return info

      }
    },
  }
</script>
