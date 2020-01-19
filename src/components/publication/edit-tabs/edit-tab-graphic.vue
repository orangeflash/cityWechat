<template>
  <div id="EditTabGraphic">
    <van-field
      class="text-area"
      v-model="inputVal"
      type="textarea"
      placeholder="请输入您要发布的内容"
      rows="5"
    />
    <!--<div ref="inputVal" class="edit-txt"-->
    <!--contenteditable="true"-->
    <!--@blur="editInputVal"-->
    <!--v-html="inputVal"-->
    <!--&gt;-->
    <!--</div>-->
    <section class="upload">
      <photo-body v-for="(item,index) in pictures" :key="index" @change-img="changeImgOne" :mark="index"
                  title="最多上传9张图片" :max="9" :photo-list="item.imgUrlList||[]"></photo-body>
      <!--<header class="upload__header">-->
      <!--<em class="upload__header__bold">上传图片</em>-->
      <!--<strong>最多上传9张图片</strong>-->
      <!--</header>-->
      <!--<div class="imgsBox-scroll">-->
      <!--<ul class="c-img-list" ref="imgsBox">-->
      <!--<li class="c-img-list__item" v-for="(item,index) in imgBaseList" :key="index">-->
      <!--<img-wrapper :src="item.url" alt=""/>-->
      <!--<van-icon @click="removeHandle(item.id)" name="clear" color="#f44" size="16" class="close-icon"/>-->
      <!--</li>-->
      <!--<li class="c-img-list__item" v-if="imgBaseList.length < 9">-->
      <!--<van-uploader multiple="true" :after-read="uploadHandle">-->
      <!--<i class="iconfont icon-jia1 add-icon"></i>-->
      <!--</van-uploader>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->

    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {requestByUpload} from "../../../util/request";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, randomNumber, showDialog, showLoading} from "../../../util";
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'

  export default {
    name: "EditTabGraphic",
    props: {
      editForm: {
        type: Object,
        default: () => {
        }
      }
    },
    components: {
      PhotoBody,
    },
    data() {
      return {
        inputVal: "",
        pictures: [
          {
            upImg: [],
            imgUrlList: [],
          },
        ],
      }
    },
    methods: {
      //图片变化
      changeImgOne(e, mark, from) {
        console.log(e, mark, this.pictures)
        this.pictures[mark].upImg = e;
        this.from = from;
      },
      // editInputVal(){
      //   this.inputVal =this.$refs.inputVal.innerHTML.replace(/</g,"&lt").replace(/>/g,"&gt")
      //   console.log(this.inputVal)
      // },
      // blurMethod(){
      //   this.inputVal=this.inputVal.replace("\n", "↵")
      //   console.log(this.inputVal)
      // },
      uploadHandle(e) {

        let formData = new FormData(),
          id = randomNumber();
        if (Array.isArray(e)) {
          for (let i = 0; i < e.length; i++) {
            if (this.imgBaseList.length >= 9) return false;
            formData = new FormData();
            formData.append("file", e[i].file);
            id = randomNumber();
            this.imgBaseList.push({
              url: e[i].content,
              id
            });
            requestByUpload(formData).then(res => {
              this.imgUrlList.push({
                url: res.src,
                id
              });
              let len = this.imgBaseList.length + 1 >= 9 ? 9 : this.imgBaseList.length + 1;
              this.$refs.imgsBox.style.width = len * (150 + 20) / 2 + "px"
            });
          }
        } else {
          formData.append("file", e.file);
          this.imgBaseList.push({
            url: e.content,
            id
          });
          requestByUpload(formData).then(res => {

            this.imgUrlList.push({
              url: res.src,
              id
            });
            this.$refs.imgsBox.style.width = (this.imgBaseList.length + 1) * (150 + 20) / 2 + "px"
          });
        }


        // const id = randomNumber();
        // this.imgBaseList.push({
        //   url: e.content,
        //   id
        // });
        // const formData = new FormData();
        // formData.append("file", e.file);
        // const res = await requestByUpload(formData);
        // this.imgUrlList.push({
        //   url: res.src,
        //   id
        // });
      },
      async removeHandle(id) {
        await showDialog("是否确认删除？");
        this.imgBaseList.splice(_.findIndex(this.imgBaseList, {id}), 1);
        this.imgUrlList.splice(_.findIndex(this.imgBaseList, {id}), 1);
      },
      getFormData() {
        return {
          media: this.pictures[0].upImg,
          body: this.inputVal.replace(/\n/g, "↵"),
          from: this.from
        }
      },
      initForm() {
        this.inputVal = JSON.parse(JSON.stringify(this.editForm)).body.replace(/↵/g, "\n");
        let photoList = this.editForm.media ? this.getImgArr(JSON.parse(this.editForm.media)) : []
        this.pictures[0].upImg = photoList;
        this.pictures[0].imgUrlList = photoList;
        // this.imgBaseList = _.cloneDeep(this.imgUrlList.map(({url}) => ({url: this.getPathByAssetPath(url)})));
      }
    },
    watch: {
      imgBaseList(newVal) {
        if (newVal && newVal.length) {
          this.$previewRefresh()
        }
      }
    },
    mixins: [utilMixins],
    computed: {
      previewId() {
        return this.randomNumber();
      }
    },
    created() {
      this.editForm && this.initForm();
    }
  }
</script>
<style>
  #EditTabGraphic .close-icon {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 0 10px 10px;
    font-size: 38px;
  }
</style>
<style scoped lang="scss">
  @import "../../../assets/common";

  strong {
    font-size: 28px;
  }

  #EditTabGraphic {
    margin-top: 16px;
    background-color: #fff;

    .text-area:after {
      display: none;
    }

    .upload {
      margin-top: 16px;
      background-color: #fff;
      /*padding: 0 29px 31px 29px;*/
      border-top: 1PX solid #DDDDDD;

      &__header {
        padding: 31px 0;
        @include flex-center($justify: space-between);
        font-size: 24px;
        color: rgba(153, 153, 153, 1);

        &__bold {
          font-size: 30px;
          font-weight: normal;
          color: #666;
        }
      }

      .c-img-list {
        //@include alignCenter;
        overflow-y: hidden;
        overflow-x: auto;
        height: 135px;

        &__item {
          margin-left: 20px;
          position: relative;
          width: 135px;
          height: 135px;
          float: left;

          &:first-child {
            margin-left: 0;
          }

          img {
            border: 1PX solid #ccc;
            overflow: hidden;
            border-radius: 6px;
          }
        }

        .add-icon {
          font-size: 68px;
          color: #999999;
          width: 135px;
          height: 135px;
          line-height: 135px;
          text-align: center;
          background: rgba(244, 244, 244, 1);
          border: 1PX solid rgba(221, 221, 221, 1);
          display: inline-block;
        }
      }
    }

    .imgsBox-scroll {
      width: 100%;
      height: 135px;
      overflow: auto;
    }
  }
</style>
