<template>

  <dd-layout-div :width="width" :height="height" :fillet="fillet" class="posi-r w100 hei100">
    <slot name="cover"></slot>
    <input type="file" v-show="isH5 || isDev||wxJSSDKError" class=" op-0 posi-a w100 hei100 t0 l0" id="ddFile"
           ref="ddFile"
           :multiple="multiple"
           @change="getFiles" :accept="accept"/>
    <div v-show="!isDev&&!isH5&&!wxJSSDKError" class=" op-0 posi-a w100 hei100 t0 l0" @click="uploadImg"></div>
  </dd-layout-div>


</template>


<script>

  import {isDev, isH5} from '../../../project-config/base'
  import {chooseImage, uploadImage} from "../../../util/wechat-util";
  import {showDialog} from "../../../util";

  import {Toast} from 'vant'

  export default {
    props: {
      accept: {           //文件选择的格式 默认所有的图片格式
        default: 'image/*'
      },
      value: {},      // 绑定的数据可以为 string | array
      width: {},
      height: {},
      fillet: {},
      multiple: {     // 是否可以多图  more =》 false
        type: Boolean,
        default: false
      },
      max: {        // 最大图片数量 默认一张
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        isDev,
        isH5:isH5(),
        wxJSSDKError: false,
        urls: [],
        tempFilePaths: [],
        changeImgArr: [],
      }
    },
    methods: {

      getFileDom() {
        if (this.$refs.ddFile.files) {
          return this.$refs.ddFile.files
        } else {
          window.requestAnimationFrame(this.getFileDom)
        }
      },

      getFiles() {
        const filesDom = this.getFileDom()

        if (!filesDom) return false;
        let urls = [], files = [];


        for (let i in filesDom) {
          if (!isNaN(+i) && i < this.max) {
            filesDom[i].from = (isH5() || isDev || this.wxJSSDKError) ? 'default' : 'wx';//用在文件上传的时候
            files.push(filesDom[i])
            urls.push(URL.createObjectURL(filesDom[i]));//用于创建 URL 的 File 对象
          }
        }


        if (this.getType(this.value) == 'string') {
          this.$emit('input', urls[0])
        } else if (this.getType(this.value) == 'array') {
          this.$emit('input', urls)
        }
        this.$emit('change', {
          filePaths: urls,
          files,
          from: (isH5() || isDev || this.wxJSSDKError) ? 'default' : 'wx',//用在文件上传的时候
        })
        this.$refs.ddFile.value = null

      },
      async uploadImg() {
        const {localIds} = await chooseImage(this.max - this.tempFilePaths.length);
        if (localIds) {
          let serverIdArr = [];
          for (let item of localIds) {
            const {serverId} = await uploadImage(item, 1);
            serverIdArr.push(serverId)
          }
          this.tempFilePaths = this.tempFilePaths.concat(localIds)
          this.changeImgArr = this.changeImgArr.concat(serverIdArr);


          if (this.getType(this.value) == 'string') {
            this.$emit('input', this.tempFilePaths[0])
          } else if (this.getType(this.value) == 'array') {
            this.$emit('input', this.tempFilePaths)
          }

          this.$emit('change', {
            filePaths: this.tempFilePaths,
            files: this.changeImgArr
          })
        } else {
          Toast({
            message: '网络错误，请重新选择',
            duration: 1500
          })

          this.wxJSSDKError = true
        }
      },
    },
    created() {

    }
  }

</script>
