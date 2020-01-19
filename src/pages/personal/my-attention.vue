<template>
  <div class="my-attention">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <van-tabs @click="onClick('refresh')" :color="$themeColor">
      <van-tab title="小店">
        <scroller
          :on-refresh="shopRefresh"
          :on-infinite="shopInfinite"
        >
          <follow-shop @offCollection="offCollection" v-if="collectionStore.length"
                       :data="collectionStore"></follow-shop>
          <no-date v-else :notShowTips="true"></no-date>
        </scroller>
        <!--<div class="my-keep-cord" style="margin: 0;padding: 10px 0 0;background: #fff;">-->
        <!--<div class="keep-cord-single" v-if="collectionStore.length" v-for="(item,index) in collectionStore " :key="index">-->
        <!--<div class="avatar-img" >-->
        <!--<img-wrapper :src="getStoreLogo(item.storeLogo)"/>-->
        <!--</div>-->
        <!--<div class="store-info">-->
        <!--<div class="left">-->
        <!--<h1 class="store-title">{{item.storeName?item.storeName:'一个神秘的小店'}}</h1>-->
        <!--<div class="store-tag">{{item.typeName?item.typeName:'一个神奇的标签'}}</div>-->
        <!--<div class="store-tag">{{item.newName?item.newName:'一个神奇的二级标签'}}</div>-->
        <!--</div>-->
        <!--<div class="right">-->
        <!--<div class="off-collection store-off" @click="offCollection({type:'store',id:item.id})">取消收藏-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="no-related" v-if="!collectionStore.length">-->
        <!--<img-wrapper not-load="ture" :src="myPublicationPlaceholder" alt="" srcset="" />-->
        <!--<em class="no-related-title">暂无关注的小店</em>-->
        <!--</div>-->
        <!--</div>-->

      </van-tab>
      <van-tab title="帖子">
        <scroller
          :on-refresh="postRefresh"
          :on-infinite="postInfinite"
        >
          <follow-post @offCollection="offCollection" v-if="collectionPost.length" :data="collectionPost"></follow-post>
          <no-date v-else :notShowTips="true"></no-date>
        </scroller>
        <!--<div class="my-keep-post" style="margin: 0">-->
        <!--<div class="keep-cord-single" v-if="collectionPost.length" v-for="(item,index) in collectionPost" :key="index">-->
        <!--<img-wrapper :src="item.portrait" not-load="true" style="width: 70px;height: 70px;" class="avatar-img" />-->
        <!--<div class="keep-info">-->
        <!--<div  @click="$pushRoute({path:'/postDetail',query:{postId:item.postId,title:formatTitleHandle(item)}})">-->
        <!--<div class="keep-header">-->
        <!--<em class="avatar-name">{{item.userName?item.userName:'神秘人'}}</em>-->
        <!--<em class="keep-tag">{{item.typeName}}</em>-->
        <!--</div>-->
        <!--<div class="post-tag" v-if="item.tag">{{item.tag}}</div>-->
        <!--<p class="keep-post-body" v-html="item.body"></p>-->
        <!--</div>-->
        <!--<div class="post-hot">-->
        <!--<div class="left">-->
        <!--<em class="see-num hot-num">{{item.browse?item.browse:0}}浏览</em>-->
        <!--<em class="share-num hot-num">{{item.share?item.share:0}} 分享</em>-->
        <!--<em class="time-go-post hot-num">{{item.creatTime}}发布</em>-->
        <!--</div>-->
        <!--<div class="right">-->
        <!--<div class="off-collection" @click="offCollection({type:'post',id:item.postId})">取消收藏</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="no-related" v-if="!collectionPost.length">-->
        <!--<img-wrapper :src="myPublicationPlaceholder" not-load="true"  alt="" srcset="" />-->
        <!--<em class="no-related-title">暂无关注的帖子</em>-->
        <!--</div>-->
        <!--</div>-->
      </van-tab>
    </van-tabs>
  </div>

</template>

<script>
  import {Tab, Tabs, Dialog} from 'vant';
  import myPublicationPlaceholder from "../../assets/img/personal/my_publication_placeholder.jpg"
  import avatar from "../../assets/img/city-information/小头像.png"
  import {mapActions} from 'vuex';
  import {computedDate} from "../../util/index"
  import {utilMixins} from "../../plugins/util-mixins";
  import Header from "@/components/header";
  import FollowShop from "../../components/follow/follow-shop";
  import FollowPost from "../../components/follow/follow-post";
  import NoDate from "@/components/no-data";
  import {hideLoading, showLoading} from "../../util";
  export default {
    components: {Header, NoDate,
      FollowPost,FollowShop
    },
    data() {
      return {
        myPublicationPlaceholder,
        avatar,
        collectionStore: [],
        collectionPost: [],
        userId: this.$store.state.user.id,
        postPage: 1,
        storePage: 1,
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions("personal", ["getCollection"]),
      ...mapActions("post", ["collectPost"]),
      getStoreLogo(item) {
        const imgs = this.getMediaList(item).img;
        return imgs ? imgs[0] : '';
      },
      formatTitleHandle(item) {
        if (!item) return ''
        let body = item.body || '';
        body = body.replace(/\r|\n|\\s/g, "") || '暂无内容';
        body = body.replace(/↵/g, "\r\n");
        body = body.length > 40 ? body.slice(0, 60) + " ... " : body;
        return item.typeName ? `【${item.typeName}】${body}` : body
      },
      async onClick(type) {
        const postList = await this.getCollection({
          userId: this.userId ? this.userId : '',
          type: 1,
          page: this.postPage,
          size: 10
        });

        if(type == 'refresh'){
          this.collectionPost = postList;
        }else if (Array.isArray(postList) && postList.length>0) {
          this.collectionPost = this.collectionStore.concat(postList);
        }
        if(this.collectionPost.length){
          this.collectionPost.map(item => {
            item.creatTime = computedDate(item.creatTime);
            return item.creatTime;
          })
        }


        return postList.length > 0;
      },
      async getCollectionData(type) {

        const storeList =  await this.getCollection({
          userId: this.userId ? this.userId : '',
          type: 2,
          page: this.storePage,
          size: 10
        });

        if(type == 'refresh'){
          this.collectionStore = storeList;
        }else if (Array.isArray(storeList) && storeList.length>0) {
          this.collectionStore = this.collectionStore.concat(storeList);
        }
        if(  this.collectionStore.length){
          this.collectionStore.map(item => {
            item.creatTime = computedDate(item.creatTime);
            return item.creatTime;
          })

        }

        return storeList.length > 0;

      },
      async offCollection(params) {
        // await Dialog.confirm({
        //   title:'提示',
        //   message:'你确定要取消吗？',
        //   overlay:true,
        // })

        showLoading();
        if (params.type === "store") {
          const storeData = await this.collectPost({
            userId: this.$store.state.user.id,
            postId: params.id,
            type: 2,
            page: this.storePage,
            size: 10,
          });
          await this.getCollectionData('refresh');
        } else if (params.type === "post") {
          const postData = await this.collectPost({
            userId: this.$store.state.user.id,
            postId: params.id,
            type: 1,
            page: this.postPage,
            size: 10,
          });
          await this.onClick('refresh');
        }
        hideLoading();
      },
      async shopRefresh(done){
        this.storePage=1;
        await this.getCollectionData('refresh');
        setTimeout(()=>{
          done && done();
        },800)
      },
      async shopInfinite(done){
        this.storePage++;
        const bool =  await this.getCollectionData();
        if(!bool) this.storePage--;
        setTimeout(()=>done(!bool),800)
      },
      async postRefresh(done){
        this.postPage=1;
        await this.collectPost('refresh');
        setTimeout(()=>{
          done && done();
        },800)
      },
      async postInfinite(done){
        this.postPage++;
        const bool = await this.onClick();
        if(!bool) this.postPage--;
        setTimeout(()=>done(!bool),800)
      }
    },
    created() {
      this.getCollectionData();
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";


  /**  设置你滚动插件的高度*/
  .van-tab__pane {
    min-height: calc(100vh - 150px);
    position: fixed;
    width: 100%;
  }

  .my-attention {
    position: fixed;
    width: 100%;
    .my-keep-cord {
      margin-top: 110px;
      height: 100%;

      img {
        width: 385px;
        height: 220px;
      }
    }

    .my-keep-post {
      margin-top: 110px;

      img {
        width: 385px;
        height: 220px;
      }
    }

    .no-related {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    .post-hot {
      display: flex;
      height: 50px;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .keep-cord-single {
      display: flex;
      position: relative;
      padding: 0px 30px 30px 30px;
      border-bottom: 1.1px solid #f4f4f4;
      background: #fff;
      margin: 0;

    }

    .keep-info {
      margin-left: 20px;
      flex: 1;
      padding-bottom: 0px;
    }

    .avatar-img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }

    .keep-header {
      overflow: hidden;

      .keep-tag {
        border: 1PX solid rgba(244, 244, 244, 1);
        border-radius: 5px;
        padding: 10px;
        float: right;
        color: $themeColor;
        font-size: $font-size-sm;
      }
    }

    .keep-post-body {
      word-break: break-all;
      margin-top: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
    }

    .hot-num {
      color: #444;
      font-size: $font-size-xs;
    }

    .post-tag {
      margin-top: 15px;
      display: inline-block;
      padding: 8px;
      color: $themeColor;
      border: 1PX solid $themeColor;
      border-radius: 5px;
    }

    .off-collection {
      color: #ff6b01;
      padding: 15px;
      border-radius: 8px;
      border: 1PX solid #ff6b01;
    }

    .store-info {
      margin-left: 20px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
    }

    .store-title {
      font-size: $font-size-lg;
      line-height: 40px;
    }

    .store-tag {
      display: inline-block;
      padding: 10px 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #888;
      font-size: 24px;
      border: 1PX solid #999;
      border-radius: 8px;
      margin: 15px 15px 0px 0px;
      text-align: center;
    }

    .store-off {
      width: 100px;
      float: right;
    }

    .no-related-title {
      color: #ccc;
      font-size: $font-size-base;
    }
  }
</style>
