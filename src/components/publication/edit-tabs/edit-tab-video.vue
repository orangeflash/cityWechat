<template>
  <div id="EditTabVideo">
    <van-field
      class="text-area"
      v-model="inputVal"
      type="textarea"
      placeholder="请输入您要发布的内容"
      rows="5"
    />
    <section class="category">
      <h5 class="category__title">
        请先选择视频来源
      </h5>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell class="category__cell" title="本地视频" clickable @click="radio = 1">
            <van-radio :name="1"/>
          </van-cell>
          <van-cell title="视频链接" clickable @click="radio = 0">
            <van-radio :name="0"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </section>
    <section class="upload">
      <div class="upload__wrap" v-show="radio">
        <header class="upload__header">
          <em class="upload__header__bold">上传视频</em>
          <strong>视频大小不超过20M</strong>
        </header>
        <ul class="c-upload-list">
          <li class="c-upload-list__item" @click="showVideoHandle" v-show="videoFileContent">
            <video controls
                   :poster="getPathByAssetPath(preview)"
                   preload="metadata" class="video-player"
                   ref="video"
                   :src="videoFileContent"></video>
          </li>
          <li class="c-upload-list__item">
            <van-uploader accept="video/*"
                          :after-read="uploadHandle">
              <i class="iconfont icon-bofang video-icon"></i>
            </van-uploader>
          </li>
        </ul>
      </div>
      <section class="upload__input" v-show="!radio">
        <van-field
          class="video-input"
          v-model="txVideoUrl"
          placeholder="请在此处黏贴视频链接"
        />
      </section>
    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {requestByUpload} from "../../../util/request";
  import {Toast} from "vant";

  export default {
    name: "EditTabVideo",
    props: {
      editForm: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        radio: 1,
        inputVal: "",
        txVideoUrl: "",
        videoFileContent: null,
        videoFileUrl: "",         //视频的路径
        preview: "",                //视频封面的参数值 JSON
      }
    },
    methods: {
      async uploadHandle(e) {
        const formData = new FormData();
        formData.append("file", e.file);
        if (e.file.size > 20 * 1024 * 1024) {
          return Toast.fail({
            message: '视频文件过大限制20M',
            duration: 1500
          })
        }
        this.videoFileContent = e.content;
        //上传视频的时候需要加个参数，是给后台加封面用的
        const data = await requestByUpload(formData, true);

        if (data.preview) {
          this.videoFileUrl = data.src;
          this.preview = data.preview;
        } else {
          Toast.fail({
            message: '视频上传失败,请重新上传',
            duration: 500
          });
          this.videoFileContent = false;
        }


      },
      showVideoHandle() {
        const ele = this.$refs.video;
        ele.play();

      },
      getFormData() {
        console.log(this.inputVal);
        const res = {
          body: this.inputVal.replace(/\n/g, "↵")
        };
        if (this.radio) {
          res["media"] = [{
            preview: this.preview,
            type: "video",
            url: this.videoFileUrl
          }]
        } else {
          res["media"] = [{
            type: "qqVideo",
            url: this.txVideoUrl
          }]
        }
        return res;
      },
      initForm() {

        this.inputVal = JSON.parse(JSON.stringify(this.editForm)).body.replace(/↵/g, "\n");

        const mediaList = JSON.parse(this.editForm.media);
        try {
          const videoList = JSON.parse(this.editForm.video);
          this.txVideoUrl = videoList[0].url;
        } catch (e) {
          console.log("%c no Tencent's video list", "color:red;font-size:24px;")
        }

        this.videoFileContent = this.getPathByAssetPath(mediaList[0].url);

        this.videoFileUrl = mediaList[0].url;
        this.preview = mediaList[0].preview;

      }
    },
    computed: {},
    created() {
      this.editForm && this.initForm();
    }
  }
</script>


<style>
  #EditTabVideo .van-cell__title {
    color: #666;
    font-size: 17px;
  }

</style>


<style scoped lang="scss">
  @import "../../../assets/common";

  #EditTabVideo {
    margin-top: 16px;

    .text-area:after {
      display: none;
    }

    .category {
      background-color: #fff;

      &__title {
        font-size: 28px;
        color: rgba(153, 153, 153, 1);
        padding: 22px 30px;
        background-color: #F4F4F4;
      }

      &__cell:after {
        left: 0;
      }
    }

    .upload {
      margin-top: 16px;
      background-color: #fff;

      &__wrap {
        padding: 0 29px;
      }

      &__header {
        padding: 31px 0;
        @include flex-center($justify: space-between);
        font-size: 24px;
        color: rgba(153, 153, 153, 1);

        &__bold {
          font-size: 30px;
          color: #666;
        }
      }

      .c-upload-list {
        @include alignCenter;
        padding-bottom: 20px;

        &__item {
          width: 135px;
          height: 135px;
          background: rgba(244, 244, 244, 1);
          border: 1PX solid rgba(221, 221, 221, 1);
          @include flex-center;

          &:not(:last-child) {
            margin-right: 30px;
          }

          .video-icon {
            font-size: 68px;
            color: #999999;
            cursor: pointer;
          }

          .video-player {
            width: 100%;
            height: 100%;
          }
        }
      }

      &__input {
        margin-top: 30px;

        ::-webkit-input-placeholder {
          font-size: 28px;
          line-height: 1.5;
          color: #999;
        }
      }
    }

  }
</style>
