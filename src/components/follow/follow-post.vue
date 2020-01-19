<template>
  <ul id="follow-post">
    <li class="follow-post_single" v-for="(item,index) in data" :key="index">
      <div class="follow-post_single_face">
        <img-wrapper :src="item.portrait"></img-wrapper>
      </div>
      <div class="follow-post_single_info" @click="goPointPage({path:'/postDetail',query:{postId:item.postId}})">
        <div class="follow-post_single_info_up">
          {{item.userName?item.userName:'神秘人'}}
          <em class="post-label">{{item.typeName}}</em>
        </div>
        <div class="follow-post_single_info_center" v-html="item.body"></div>
        <div class="follow-post_single_info_down">
          <em class="number">{{item.browse?item.browse:0}}</em>浏览
          <em class="number">{{item.share?item.share:0}}</em>分享
          <em class="number">{{item.creatTime}}</em>发布
          <div class="cancel-btn" @click.stop="$emit('offCollection',{type:'post',id:item.postId})"><em>取消收藏</em></div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
  import {utilMixins} from "../../plugins/util-mixins";
  import {goPointPage} from "@/util/wechat-util";

  export default {
    props: ['data'],
    data() {
      return {}
    },
    mixins: [utilMixins],
    methods: {
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
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #follow-post {
    margin-top: 20px;

    .follow-post_single {
      border-bottom: 1.1px solid #ddd;
      padding: 32px 30px;
      overflow: hidden;
      background: #fff;

      &_face {
        width: 108px;
        height: 108px;
        overflow: hidden;
        border-radius: 50%;
        float: left;
      }

      &_info {
        overflow: hidden;
        margin-left: 138px;

        &_up {
          overflow: hidden;
          height: 60px;
          line-height: 60px;

          .post-label {
            float: right;
            border: 1.1px solid #f4f4f4;
            border-radius: 4px;
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            float: right;
            color: $themeColor;
            font-size: 26px;
          }
        }

        &_center {
          font-size: 28px;
          line-height: 36px;
          margin-bottom: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;

        }

        &_down {
          color: #444;

          .cancel-btn {
            float: right;
            height: 50px;
            width: 126px;
            border: 1PX solid #ff6b01;
            border-radius: 0.08rem;
            display: flex;
            align-items: center;
            margin-top: -25px;

            em {
              color: #ff6b01;
              display: block;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
</style>
