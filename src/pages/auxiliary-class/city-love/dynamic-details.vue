<template>
  <!--动态详情-->
  <dd-layout-div mi-h="100vh" bg="#fff">

    <Header/>
    <dd-layout-div :pad="[30]">
      <div class="flex-y-center flex-bt br-b-EFF3F6 pad-b">
        <div class="flex flex-y-center">
          <dd-layout-img
            :src="getInfo.face"
            :width="0.85"
            :height="0.85"
            :fillet="0.85"
          />
          <div class="mar-l">
            <div class="fon-b mar-b-20">{{getInfo.nickname}}</div>

            <dd-layout-div class="col-f fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"
                           :bg="getInfo.sex==1?'#4FA6F6':'#F871A4'"><i
              class="iconfont col-f fon-xsss mar-r-5"
              :class="getInfo.sex==1?'icon-nanxianxing':'icon-nvxianxing'"></i>{{getInfo.age}}岁
            </dd-layout-div>

            <!--<p class="flex"><span class="col-f bg-F871A4 fon-xsss pad-6-4-4 br-r-4 flex-y-center"><i-->
            <!--class="iconfont icon-nvxianxing col-f fon-xsss mar-r-5"></i>{{getInfo.age}}岁</span></p>-->
          </div>
        </div>
        <dd-layout-div class="br-r-40" :pad="[12,20,8]" @click="followHandle"

                       :bg="getInfo.follow?'#f4f5f8':`${$themeColor}`"

                       :class="getInfo.follow?'col-9':'col-f'">
          <i class="iconfont icon-xin mar-r-10 col-f" v-if="!getInfo.follow"></i>{{getInfo.follow?'已关注':'关注'}}
        </dd-layout-div>
      </div>
      <div class="pad-t">
        <dd-layout-html class="pad-0" :html="getInfo.body"/>
        <div class="info-body pad-t t-c"
             v-if="getInfo.photos.length > 0">
          <img
            class="br-r-20 mar-b dis-b mar-a mw100 "
            @click.stop="previewImage(url,getInfo.photos)"
            v-for="(url,key) in getInfo.photos"
            :src="url"
            :key="key"/>
        </div>
      </div>
      <div class="mar-t flex-bt flex-y-center">
        <span class="bg-FAFAFA pad-14-20-10 br-r-40 flex-y-center fon-20">
          <i class="iconfont icon-dingwei1 fon-20 mar-r-10 mar-t-5"></i>{{getInfo.address}}
        </span>
        <span class="fon-xss col-9">{{getInfo.time}}</span>
      </div>

      <div class="flex-y-center flex-bt col-6 mar-t pad-b">
        <div>
          <span class="fon-sm"><i class="iconfont fon-40 icon-yanjing"></i>{{getInfo.viewNum}}</span>
        </div>
        <div>
          <span class="mar-l fon-sm" @click="loveHandle"><i class="iconfont icon-xin mar-r-10"
                                                            :class="getInfo.love&&'col-t'"></i>{{getInfo.loveNum}}</span>
          <!--<span class="mar-l fon-sm"><i class="iconfont icon-biaoqing1 mar-r-10"></i>42</span>-->
          <span class="mar-l fon-sm" @click="showMask = !showMask"><i class="iconfont icon-zhuanfa  mar-r-10"></i>{{getInfo.shareNum}}</span>
        </div>
      </div>

      <!--<dd-layout-comment-list-->
      <!--class="pad-0"-->
      <!--:hideComment="true"-->
      <!--:deliver="true"-->
      <!--/>-->

      <!--<dd-layout-comment-tool/>-->
    </dd-layout-div>

    <share-mask :show-mask.sync="showMask"/>

  </dd-layout-div>

</template>

<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdLayoutCommentList from "../../../components/layout/dd-layout-comment-list";
  import DdLayoutCommentTool from "../../../components/layout/dd-layout-comment-tool";
  import ShareMask from "@/components/publication/share-mask";
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {computedDate} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutCommentTool, DdLayoutCommentList, DdLayoutHtml, DdLayoutImg, ShareMask},
    data() {
      return {
        dynamicInfo: {},
        showMask: false,
      }
    },
    methods: {
      ...mapActions('cityLove', ["cityLoverGetDynamicDetails", "cityLoveDynamicLove", 'cityLoveShareDynamic']),
      ...mapActions("post", ["collectPost"]),
      async loveHandle() {

        await this.cityLoveDynamicLove({
          type: 4,
          postId: this.getInfo.id
        })
        this.getDynamicInfo()
      },
      async followHandle() {
        await this.collectPost({
          type: 12,
          postId: this.getInfo.friendId
        })
        this.getDynamicInfo()
      },
      async getDynamicInfo() {
        this.dynamicInfo = await this.cityLoverGetDynamicDetails({
          id: this.$route.query.id
        });

        updateShareConfig({
          title: "【同城交友】",
          imgUrl: this.getSingleImg(this.dynamicInfo.icon),
          desc: this.dynamicInfo.body,
        });

      }
    },
    computed: {
      getInfo() {
        const data = this.dynamicInfo,
          info = {
            id: data.id,
            nickname: data.name,
            face: this.getSingleImg(data.icon),
            city: data.city,
            age: data.birthday,
            address: data.address,
            photos: data.media ? data.media.map(data => {
              return this.getSingleImg(data.url);
            }) : [],
            body: data.body,
            time: computedDate(data.createdAt),
            loveNum: data.loveNum || 0,
            shareNum: data.shareNum || 0,
            viewNum: data.viewNum || 0,
            love: data.love,
            follow: data.follow,
            friendId: data.friendId,
            sex: data.sex
          }
        return info
      }
    },
    async created() {
      this.getDynamicInfo()
      const query = this.$route.query;
      console.log("query", query)
      if (query.isShare) {
        this.cityLoveShareDynamic({
          id: this.$route.query.id
        })
      }

    }
  }
</script>
