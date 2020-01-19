<template>
  <div id="Comment">
    <div class="comment">
      <header class="comment__header">
        <img class="picture" :src="PlaceholderImg" alt="">
        <em class="title">志汇家装304不锈钢水管</em>
      </header>
      <section class="comment__input">
        <van-field
          v-model="message"
          type="textarea"
          placeholder="说点什么吧......"
          rows="3"
        />
      </section>
      <section class="comment__upload">
        <aside class="comment__upload__top">
          <em class="label">上传图片</em>
          <strong class="tip">最多上传9张照片</strong>
        </aside>
          <ul class="comment-parent-img">
            <li class="commentImg" v-for="(item,index) in photoList" :key="index" @click="seeUpImg"> 
              <img :src="item" alt="" srcset="" class="updataImg">
              <van-icon name="close"  class="closeImg"  @click="closeImg(index)"/>
            </li>
            <van-uploader :after-read="onRead" class="comment__upload__bottom" >
              <i class="iconfont icon-jia1 comment__upload__bottom__icon commentImg"></i>
            </van-uploader>
          </ul>
      </section>
      <aside class="btn-group">
        <ul class="btn-wrap">
          <li class="btn-wrap__btn" @click="submitClick">提交</li>
          <li class="btn-wrap__btn" @click="cancelClick">取消</li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script>
  import { Uploader,Toast ,Icon,ImagePreview} from 'vant';
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {PlaceholderImg} from "../../project-config/base";

  export default {
    name: "Comment",
    data() {
      return {
        PlaceholderImg,
        message:'',
        photoList:[],
        require:'',
      }
    },
    methods: {
      onRead(file){
        if(this.photoList.length>=9){
          Toast('最多只能上传9张图片');
          return;
        }
        this.photoList.push(file.content);
      },
      ...mapActions("shop",["submitShopComment"]),
      // 提交数据
      submitClick(){
        if(this.message.trim().length != 0){
          this.require = this.submitShopComment({
              body:this.message,
              photoList:this.photoList,
              fId:1,
              userId:2,
          })
        }else if(this.message.trim().length==0) {
          Toast('没写内容不准提交哦！');
        }else if(this.require){
          if(this.message.msg==="success"){
             Toast('发表成功！积分 +3  ,稍后跳到商家详情页');
             this.$router.push("/shopDetail");
          }
        }else{
          Toast('网速不佳，请稍等');
        }
      },
      cancelClick(){
          this.$router.push("/shopDetail")
      },
      // 关闭图片;
      closeImg(index){
       this.photoList.splice(index,1);
      },
      // 预览图片
      seeUpImg(){
        ImagePreview({
            images: this.photoList,
            startPosition: 1,
        }) 
      },
    },
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #Comment {
    .comment {
      &__header {
        padding: 24px 30px;
        @include flex-center($justify: null);
        .picture {
          width: 40px;
          height: 40px;
          background: $themeColor;
          border-radius: 50%;
        }
        .title {
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          margin-left: 24px;
        }
      }
      &__input {
        height: 190px;
        background: #fff;
      }
      &__upload {
        padding: 31px 30px;
        background: #fff;
        margin-top: 1PX;
        &__top {
          margin-top: 1PX;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .label {
            font-size: 28px;
            color: rgba(51, 51, 51, 1);
          }
          .tip {
            font-size: 24px;
            color: rgba(153, 153, 153, 1);
          }
        }
        &__bottom {
          // width: 150px;
          // height: 150px;
          // margin-top: 31px;
          // @include flex-center;
          // background: #F8F8F8;
          &__icon {
              width: 150px;
          height: 150px;
          margin-top: 31px;
          @include flex-center;
          background: #F8F8F8;
            font-size: 64px;
            color: #DDDDDD;
          }
        }
      }
      .btn-group {
        @include positionAbsolute(null, 0, 0, 0);
        position: fixed;
        padding: 30px;
        background: #fff;
        z-index: 999;
        .btn-wrap {
          &__btn {
            width: 100%;
            height: 88px;
            line-height: 88px;
            background: $themeColor;
            border-radius: 8px;
            font-size: 32px;
            color: rgba(244, 244, 244, 1);
            @include flex-center;
            &:last-child {
              background: rgba(244, 244, 244, 1);
              color: #333333;
              margin-top: 31px;
            }
          }
        }
      }
    }
    .updataImg{
      width: 140px;
      height: 140px;
    }
    .commentImg{
       margin: 20px 0px 0px 20px; 
       position: relative;
       float: left;
      vertical-align: middle;
    }
    .comment-parent-img{
      display: flex;
      overflow-x: scroll;
      white-space:nowrap;
      align-items: center;
    }
    .closeImg{
      position: absolute;
      right: -10px;
      top: -10px;
    }
  }
</style>
