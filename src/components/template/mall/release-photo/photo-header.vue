<template>
  <div id="PhotoHeader">
    <div class="head__upload">
      <div class="head__upload_bg"></div>
      <div class="head__upload_bd">
        <!--单图logo上传-->
        <div v-if="portrait" class="head__upload_bdtop">
          <dd-layout-img :width="1.50" :height="1.50" :src="filePaths[0]" :fillet="1.5" v-if="filePaths[0]"/>
          <dd-file :width="150" :height="150" class="flex-center posi-a-i" :class="filePaths[0]&&'op-0'"
                   @change="fileChangeHandle">
            <i slot="cover" class="topimg iconfont icon-ai-camera"></i>
          </dd-file>

          <!--<i @click="uploadImg" v-if="!tempFilePaths.length" class="topimg iconfont icon-ai-camera"></i>-->
          <!--<div v-if="tempFilePaths.length" class="head__upload_img" v-for="(item,index) in tempFilePaths" :key="index">-->
          <!--<img-wrapper-->
          <!--:src="item"-->
          <!--alt-->
          <!--/>-->
          <!--<van-icon-->
          <!--@click.stop="deletePic(index)"-->
          <!--name="clear"-->
          <!--color="#666666"-->
          <!--size="16"-->
          <!--class="close-icon"-->
          <!--/>-->
          <!--</div>-->
        </div>
        <!--多图上传-->
        <div v-else class="head__upload_bdtop">
          <dd-file :multiple="true" :width="150" :height="150" :max="max" class="flex-center"
                   @change="fileChangeHandle">
            <i slot="cover" class="topimg iconfont icon-ai-camera"></i>
          </dd-file>
        </div>
        <div class="head__upload_bdft t-c lh-base">{{title}}</div>
      </div>
      <div v-if="!portrait" class="photo-list">
        <div v-for="(item,index) in filePaths" class="photo-list-img">
          <div class="photo-list-img-div">
            <img-wrapper
              :src="item"
              alt
            />
          </div>
          <van-icon
            @click="deletePic(index)"
            name="clear"
            color="#666666"
            size="16"
            class="close-icon"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../../plugins/util-mixins";
  import {chooseImage, uploadImage} from "../../../../util/wechat-util";
  import {showLoading, showText} from "../../../../util";
  import DdFile from "../../dd-form/dd-file";
  import DdLayoutImg from "../../../layout/dd-layout-img";

  export default {
    name: "ReleaseCoupon",
    components: {DdLayoutImg, DdFile},
    props: ["photoList", "max", "title", "portrait", 'deliver'],
    data() {
      return {
        tempFilePaths: this.photoList || [],
        changeImgArr: [],
        filePaths: [],
        files: []
      }
    },
    methods: {
      fileChangeHandle(e) {

        if (this.portrait) {
          this.filePaths = e.filePaths
          this.files = e.files
        } else {
          this.filePaths = this.filePaths.concat(e.filePaths).slice(0, +this.max);
          this.files = this.files.concat(e.files).slice(0, +this.max);
        }
        this.deliver ? this.$emit('click', {
          name: 'photoHeader',
          value: {photos: this.files}
        }) : this.$emit('change-img', this.files)
      },
      // async uploadImg() {
      //   const vm = this;
      //   if (this.tempFilePaths.length >= this.max) return showText('最多上传' + this.max + '张图片')
      //   const {localIds} = await chooseImage(this.max - this.tempFilePaths.length);
      //   let serverIdArr = [];
      //   for (let item of localIds) {
      //     const {serverId} = await uploadImage(item, 1);
      //     serverIdArr.push(serverId)
      //   }
      //   this.tempFilePaths = this.tempFilePaths.concat(localIds)
      //   this.changeImgArr = this.changeImgArr.concat(serverIdArr);
      //   this.deliver ? this.$emit('click', {
      //     name: 'photoHeader',
      //     value: {photos: this.files}
      //   }) : this.$emit('change-img', this.files)
      // },
      // 删除图片
      deletePic(index) {
        this.filePaths.splice(index, 1)
        this.files.splice(index, 1)
        this.deliver ? this.$emit('click', {
          name: 'photoHeader',
          value: {photos: this.files}
        }) : this.$emit('change-img', this.files)
      },
    },
    mixins: [utilMixins],
    computed: {},
    watch: {
      photoList: {
        handler(newval) {
          this.filePaths = Object.assign([], newval);
          this.files = Object.assign([], newval);
        },
        immediate: true,
        // deep: true,
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../assets/theme";

  #PhotoHeader {
    font-size: $font-size-base;

    .head__upload {
      background: #fff;
    }

    .head__upload_bg {
      height: 120px;
      background: $themeColor;
    }

    .head__upload_bd {
      /*border-bottom: 1px solid #eee;*/
      background: #fff;
      box-sizing: border-box;
      height: 200px;
      padding: 30px;
      @include flex-center($direction: column, $justify: flex-end);
      position: relative;

      &top {
        position: absolute;
        border-radius: 50%;
        width: 150px;
        height: 150px;
        top: -75px;
        left: 50%;
        transform: translate(-50%, 0);
        box-shadow: 0px 0px 8px $themeColor;
        background: #fff;
        @include flex-center;

        .topimg {
          font-size: 60px;
          color: $themeColor;
        }
      }

      &ft {
        color: #999;
      }

      /*头像容器*/
      .head__upload_img {
        @include widhei();
        border-radius: 50%;
        overflow: hidden;

        .close-icon {
          color: #dddddd;
          position: absolute;
          right: 2px;
          top: 2px;
          padding: 0 0 10px 10px;
          font-size: 34px;
        }
      }
    }

    /*多图*/
    .photo-list {
      display: flex;
      flex-wrap: wrap;
      padding: 30px;

      &-img {
        position: relative;
        z-index: 0;
        width: 20vw;
        height: 20vw;
        margin: 0px 10px 30px 10px;
        @include flex-center();

        &-div {
          overflow: hidden;
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }

        .close-icon {
          z-index: 1;
          position: absolute;
          right: -12px;
          top: -12px;
          padding: 0 0 0px 0px;
          font-size: 34px;
        }
      }
    }
  }
</style>
