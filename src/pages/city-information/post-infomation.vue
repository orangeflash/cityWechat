<template>
    <div id="post-infomation">
        <div class="select-category">
           <em class="select-text">请选择主题分类</em>
           <div v-for="(item,index) in selectList.data" :key="index"  class="select-tag" :class="{selectaAtive : ischangeIndex==index}"  @click="selClick(index)">{{item.name}}</div>
           <!-- {{selectList.data}} -->
        </div>
        <van-cell-group class="post-content">
            <van-field v-model="value" placeholder='请输入标题'  class="post-title"/>
             <van-field
                v-model="message"
                type="textarea"
                placeholder="请输入内容"
                rows="1"
                :autosize='{ maxHeight: 150, minHeight: 150}'
                clearable
            />
        </van-cell-group>
        <div class="update-img">
            <div class="update-title">
               <em>上传图片</em>
               <em>最多上传9张图片</em>
            </div>
            <ul class="picture-group">
                <li class="preview-picture" v-for="(item,index) in upDataImgList" :key="index">
                    <img :src="item" alt="" srcset="" class="post-img"   @click="PreviewImg"/>
                    <van-icon name="close" class="closeImg" @click="removeImg(index)"/>
                </li>
                <van-uploader :after-read="onRead">
                    <img :src=postImg alt="" srcset="" class="post-img">
                </van-uploader>
            </ul>
        </div>
        <div class="update-img update-video">
            <div class="update-title">
               <em>是否上传视频</em>
               <van-switch :value="checked" size="26px" @input="onInput" class="post-switch" />
            </div>
            <van-uploader :after-read="onRead" v-show="checked" accept="video/*">
                <img :src=postVideo alt="" srcset="" class="post-img">
            </van-uploader>
        </div>
        <van-field v-model="link" placeholder="视频连接地址" v-show="checked"/>
        <van-button size="large" type="primary" class="isPost" @click="postClick">确认发布</van-button>
    </div>
</template>

<script>
import {Field,Uploader,Switch,Button,Dialog,ImagePreview,Icon} from 'vant';
import {mapState,mapActions,mapGetters} from "vuex" ;
import postImg from '../../assets/img/city-information/post-img.png'
import postVideo from '../../assets/img/city-information/post-video.png'
export default{
   name:'PostInformation',
   components:{},
   data(){
       return{
        selectList:[],
        value:'',
        message:'',
        postImg,
        postVideo,
        checked:false,
        link:'',
        ischangeIndex:0,
        upDataImgList:[],
       }
   },
    methods:{
       ...mapActions("cityInformation",["getCategory",'postCategory']),
        async getCategoryList () {
           this.selectList = await this.getCategory({
                type:3,
           })
       },
       //添加图片 以及预览图片
       onRead(file){
        if(this.upDataImgList.length>=9){
            Dialog.alert({
                title: '提示',
                message: '最多只能上传9张图片！'
            });
            return
        }
        this.upDataImgList.push(file.content);
       },

       // 移除点击删除按钮的那张图片
       removeImg(index) {
           this.upDataImgList.splice(index,1);
       },
       // 预览上传图片
       PreviewImg(){
          ImagePreview({
             images:this.upDataImgList,
             startPosition: 1,
          });
       },
       onInput(checked) {
            this.checked = checked;
       },
       selClick(index){
          this.ischangeIndex=index;
       },
       postClick(){
          if(this.value.trim().length!=0 || this.message.trim().length != 0){
            //  if(!this.link.includes("qq.com")) {
            //       Dialog.alert({
            //          title: '提示',
            //           message: '链接要是腾讯视频的！！！',
            //      });
            //      return
            // };
                Dialog.confirm({
                title: '发表成功',
                confirmButtonText:"跳转到同城首页",
                cancelButtonText:'再发布一条',
                closeOnClickOverlay : true,
                }).then(() => {

                }).catch(() => {

                });
          }else{
            // if(!this.link.includes("qq.com")) {
            //      Dialog.alert({
            //          title: '提示',
            //           message: '链接要是腾讯视频的！！！',
            //      })
            //     return;
            // }
              Dialog.alert({
                  title: '标题',
                  message: '要写东西才能发表哦！',
                  closeOnClickOverlay : true,
              }).then(() => {

              });
          }
       }

   },
   created(){
      this.getCategoryList();
   },
   mounted(){

   },

}
</script>

<style scoped lang="scss">
@import '../../assets/theme';
@import '../../assets/common';
   #post-infomation{
       padding:16px 0px 160px 0px;
       .van-hairline--surround::after{
         border-width:0px;
       }
       .select-category{
        padding:32px 30px 40px 30px;
        background-color: #fff;
        .select-text{
            display:block;
            font-size:$font-size-xs;
            color:rgba(51,51,51,1);
            margin:0px 0px 12px 0px;
        }
        .select-tag{
            padding:10px 20px;
            display: inline-block;
            border:1PX solid rgba(221,221,221,1);
            border-radius:8px;
            line-height: 40px;
            text-align: center;
            margin:11px 11px 0px 0px;
        }
        .selectaAtive{
           border:1PX solid rgba(245,138,91,1);
           color:rgba(245,138,91,1) !important;
        }
       }
       .post-title{
           height: 80px;
           line-height: 50px;
           border-bottom:1PX solid #eee;
       }
       .post-content{
           margin:16px 0px;
       }
       .update-img{
           background-color: #fff;
           padding:32px 30px;
           .update-title{
                display: flex;
                justify-content: space-between;
                em{
                    font-size:$font-size-base;
                    // color: #666;
                  &:nth-of-type(2){
                    font-size:$font-size-xss;
                    color: rgb(153,153,153);
                   }
                }
           }
           .post-img{
              width:135px;
              height:135px;
              margin-top:32px;
           }
       }
       .update-video{
           margin-top:16px;
           border-bottom:1PX solid rgba(221,221,221,1);
           .update-title{
               line-height: 50px;
           }
       }
       .van-switch--on{
           background:$themeColor;
       }
       .isPost{
           position: fixed;
           z-index:999;
           left:0px;
           bottom: 0px;
          background:$themeColor;
       }
       .jump-confirmation{
           background-color: #fff;
           padding:30px;
           border-radius:8px;
           width:80%;
           text-align:center;
           justify-content: center;
           align-self:center;
           .jump-select{
               margin-top:50px;
               display:flex;
               justify-content:center;
           }
           .jump-info,
           .jump-home{
               color:rgb(51,51,51);
               display:inline-block;
               font-size:24px;
               color:#fff;
               border:1PX solid #eee;
               padding:20px 30px;
               background:$themeColor;
               border-radius:8px;
           }
           .jump-info{
               margin-right:30px;
           }
           .Prompt-description{
               font-size:22px;
               color:rgb(153,153,153)
           }
       }
   }
   .preview-picture{
       display: inline-block;
       position: relative;
       margin-right: 10px;
   }
   .picture-group{
       overflow-y: hidden;
       overflow-x:scroll;
       justify-content: center;
       white-space: nowrap;
   }
   .picture-group::-webkit-scrollbar {
        display: none;
   }
   .closeImg{
       position: absolute;
       right: -10px;
       top: 10px;
   }
</style>
