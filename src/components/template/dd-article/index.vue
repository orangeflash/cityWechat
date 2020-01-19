<template>

  <!-- 文章 -->
  <div class="dd-article pad-30 flex">
    <div class="dd-article_user mar-r">
      <face
        :src="face"
        size="36"
        borderRadius="36"
      ></face>
    </div>
    <div class="dd-article_info" @click.stop="$emit('click')">
      <div class="dd-article_info_up flex-x-bt flex-x-center">
        <div class="dd-article_info_up_user">
          <div class="user_info flex-y-center">
            <span class="user_info_nickname">{{nickname}}</span>
            <em class="tag top" v-if="ifTop==2">置顶</em>
            <em class="tag redBag"v-if="ifRed>0">红包</em>
          </div>
          <p class="release_time">{{time}} 发布</p>
        </div>
        <div class="dd-article_info_up_btn bg-t" @click.stop="$emit('call','asdad')">
          <i class="iconfont icon-dianhua2"></i>
          <span>拨打电话</span>
        </div>
      </div>
      <div class="dd-article_info_center">
        <div class="dd-article_info_center_text">
          <em class="col-t">#信息招聘</em>
          <span>{{info}}</span>
          <p class="col-t">全文</p>
        </div>

        <ul class="dd-article_info_center_photos flex flex-wrap">
          <li v-for="item in imgs">
            <img-wrapper
              :src=item></img-wrapper>
          </li>
        </ul>
      </div>
    </div>

  </div>


</template>

<script>

  import Face from "@/components/template/face";

  const type = {
    type: String,
    default: ""
  }

  export default {
    components: {Face},
    props: {
      userInfo: {
        type: Object,
        default: Object
      },
      ifTop:{
        type:Number,
        default:1,
      },
      ifRed:{
        type:Number,
        default:0,
      },
      imgs:{
        type:Array,
        default:[],
      },
      info: type,
      time:type,
      face:'',
      nickname:'',
      article:{

      }
    },
    created() {
      // console.log("use",)
      console.log(this.imgs)
    }

  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-article {
    background: #fff;
    border-bottom: 1px solid #f4f4f4;

    &_info {
      width: calc(100% - 0.9rem);

      &_up {
        height: 72px;

        &_user {
          .user_info {
            &_nickname {
              font-size: 26px;
            }

            .tag {
              display: inline-block;
              padding: 10px 10px 6px;
              border-radius: 4px;
              font-size: 20px;
              margin-left: 10px;
            }

            .tag.top {
              background: #FFDA77;
              color: #FF4A22;
            }

            .tag.redBag {
              background: #FF5D38;
              color: #FFDA77;
            }
          }

          p {
            color: #bbb;
            font-size: 20px;
            margin-top: 10px;
          }
        }

        &_btn {
          color: #fff;
          padding: 12px 20px 8px;
          border-radius: 8px;

          i {
            font-size: 26px;
          }
        }
      }

      &_center {
        &_text {
          font-size: 26px;
          line-height: 36px;
          margin: 15px 0;

          p {
            text-align: right;
          }
        }

        &_photos {
          li {
            width: 190px;
            height: 190px;
            overflow: hidden;
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>
