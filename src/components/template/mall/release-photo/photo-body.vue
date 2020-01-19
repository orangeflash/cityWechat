<template>
  <div id="PhotoHeader" class="pad-0">
    <div class="head__upload">
      <div v-if="title" class="head-title flex-row flex-x-end">
        <div class="flex-g-1" :class="titleClass">{{title}}</div>
        <div class="flex-g-0 t-r">{{fTitle}}</div>
      </div>
      <div class="photo-list">
        <!--<div v-for="(item,index) in tempFilePaths" class="photo-list-img">-->
        <!--<div class="photo-list-img-div">-->
        <!--<img-wrapper-->
        <!--:src="item"-->
        <!--alt-->
        <!--/>-->
        <!--</div>-->
        <!--<van-icon-->
        <!--@click="deletePic(index)"-->
        <!--name="clear"-->
        <!--color="#666666"-->
        <!--size="16"-->
        <!--class="close-icon"/>-->
        <!--</div>-->
        <!--<div v-if="tempFilePaths.length<+max" class="photo-list-img add-border" @click="uploadImg">-->
        <!--<van-icon-->
        <!--name="add-o"-->
        <!--color="#BABABA"-->
        <!--size="25px"-->
        <!--class=""/>-->
        <!--</div>-->
        <dd-layout-div width="20vw" height="20vw" :mar="[0,10,30]" class="posi-r" v-for="(src,index) in filePaths"
                       :key="index">
          <img-wrapper :src="src"/>
          <van-icon
            @click="deletePic(index)"
            name="clear"
            color="#666666"
            size="16"
            class="close-icon posi-a r0 t0"/>
        </dd-layout-div>
        <dd-file width="20vw" height="20vw" :mar="[0,10,30]" :fillet="[10]" v-if="filePaths.length < max"
                 :multiple="max > 1" :max="max"
                 class="flex-center bsd-b"
                 @change="fileChangeHandle">
          <van-icon
            slot="cover"
            name="add-o"
            color="#BABABA"
            size="25px"
            class=""/>
        </dd-file>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../../plugins/util-mixins";
  import {chooseImage, uploadImage} from "../../../../util/wechat-util";
  import {showLoading} from "../../../../util";
  import DdFile from "../../dd-form/dd-file";
  import DdLayoutImg from "../../../layout/dd-layout-img";

  export default {
    name: "ReleaseCoupon",
    components: {DdLayoutImg, DdFile},
    props: ["photoList", "max", "title", "titleClass", "fTitle", 'mark', 'deliver'],
    data() {
      return {
        tempFilePaths: this.photoList || [],
        changeImgArr: [],
        filePaths: [],
        files: [],
        from: null
      }
    },
    methods: {
      fileChangeHandle(e) {
        console.log(e)
        this.filePaths = this.filePaths.concat(e.filePaths).slice(0, +this.max)
        this.files = this.files.concat(e.files).slice(0, +this.max)
        this.from = e.from

        this.deliver ? this.$emit('click', {
          name: 'photoBody',
          value: {photos: this.files, mark: this.mark, from: this.from}
        }) : this.$emit('change-img', this.files, this.mark, this.from)

      },
      // async uploadImg() {
      //   const vm = this;
      //   const {localIds} = await chooseImage(this.max - this.tempFilePaths.length);
      //   let serverIdArr = [];
      //   for (let item of localIds) {
      //     const {serverId} = await uploadImage(item, 1);
      //     serverIdArr.push(serverId)
      //   }
      //   this.tempFilePaths = this.tempFilePaths.concat(localIds)
      //   this.changeImgArr = this.changeImgArr.concat(serverIdArr);
      //   this.deliver ? this.$emit('click', {
      //     name: 'photoBody',
      //     value: {photos: this.files, mark: this.mark}
      //   }) : this.$emit('change-img', this.files, this.mark)
      // },
      // 删除图片
      deletePic(index) {
        console.log(index, this.deliver)
        this.filePaths.splice(index, 1);
        this.files.splice(index, 1);


        this.deliver ? this.$emit('click', {
          name: 'photoBody',
          value: {photos: this.files, mark: this.mark, from: this.from}
        }) : this.$emit('change-img', this.files, this.mark, this.from)
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
      // console.log('photoListcreated',this.photoList)
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
      height: 165px;
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

        img {
          @include widhei($brs: 50%);
        }

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

      .add-border {
        border: 1PX dashed #999;
        border-radius: 10px;
      }
    }
  }
</style>
