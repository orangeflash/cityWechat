<template>

  <!--发布动态-->
  <dd-layout-div mi-h="100vh" class="pad-lr bg-f">

    <div class="flex-bt br-b-EFF3F6 pad-tb flex-y-center">
      <span class="fon-lg" @click="$router.go(-1)">取消</span>
      <dd-layout-div
        bg="linear-gradient(-90deg,rgba(11,194,255,1) 0%,rgba(87,255,229,1) 100%)"
        :pad="[17,30,15]"
        :fillet="60"
        class="fon-lg"
        @click="beginRelease"
      >发布
      </dd-layout-div>
    </div>
    <textarea placeholder="记录这一刻，晒给懂你的人..." v-model="params.body" class="out-n br-n fon-w5 w100 dh-180 mar-t fon-lg"/>

    <div class="flex flex-wrap flex-bt">
      <dd-layout-img :src="src" v-for="(src,key) in filePaths" :key="key" :width="2.23" class="mar-b-10" :height="2.23"
                     :fillet="0.3">
        <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 t0 mar-t-20 mar-r op-6"
           @click="deleteImage(key)"></i>
      </dd-layout-img>
      <dd-layout-div :width="223" :height="223" v-if="files.length < 9" class="posi-r mar-b-10" bg="#EFF3F6"
                     :fillet="30">
        <dd-file class="w100 hei100 posi-a-i flex-center" :multiple="true" :max="9" @change="getFiles">
          <i slot="cover" class="iconfont icon-jia1 fon-68 col-9"></i>
        </dd-file>
      </dd-layout-div>
      <dd-layout-div v-if="filePaths.length % 3 == 1" class="mar-b-10" :height="223" :width="223"></dd-layout-div>
    </div>
    <dd-layout-div :pad="[30]" bg="#EFF3F6" :fillet="8" class="flex lineH-48 mar-t-20">
      <i class="iconfont icon-jinggaotianchong col-t mar-r mar-t-5"></i>
      <div class="fon-sm  fon-w5">尊敬的用户，您发布的内容须遵守相关法律法规和 社区规则，请严格遵守相关规定，以免违规。</div>
    </dd-layout-div>

    <dd-layout-div :br="{top:'0.01rem solid #EFF3F6',bottom:'0.01rem solid #EFF3F6'}" class="mar-t">
      <dd-layout-div class="flex-bt flex-y-center" :mi-h="40" :pad="[30,0]" @click="showmap = !showmap"
                     :br="{bottom:'0.01rem solid #EFF3F6'}">
        <span class="col-t fon-xl flex lineH-48 flex-y-center"><i
          class="iconfont icon-dingwei1 col-t fon-xxl mar-r"></i>{{params.address || '请选择'}}</span>
        <i class="iconfont icon-iconfontjiantou4 col-9"></i>
      </dd-layout-div>
      <div class="flex-bt flex-y-center dh-110">
        <span class=" fon-xl"><i class="iconfont icon-suo col-bb fon-xxl mar-r"></i>仅自己可见</span>
        <dd-switch class="pad-0" v-model="display"/>
      </div>
    </dd-layout-div>

    <dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>

  </dd-layout-div>

</template>
<script>
  import DdFile from "../../../components/template/dd-form/dd-file";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdSwitch from "../../../components/template/dd-form/switch";
  import DdMap from "../../../components/template/dd-map"

  import {mapActions} from 'vuex'
  import {hideLoading, showHandleStatusByFlag, showLoading} from "../../../util";

  import {Toast} from 'vant'

  export default {
    components: {DdSwitch, DdLayoutImg, DdFile, DdMap},
    data() {
      return {
        showmap: false,
        filePaths: [],
        files: [],
        params: {
          body: '',
          media: [],
          display: 1,
          address: ''

        },
        display: false,
      }
    },
    methods: {
      ...mapActions("cityLove", ['cityLoveReleaseDynamic']),
      getFiles(e) {
        this.filePaths = this.filePaths.concat(e.filePaths)
        this.files = this.files.concat(e.files)
        if (this.files.length > 9) {
          this.filePaths.splice(9, this.files.length)
          this.files.splice(9, this.files.length)
        }
        this.from = e.from;
      },
      deleteImage(key) {
        this.filePaths.splice(key, 1)
        this.files.splice(key, 1)
      },
      choiceAddress(e) {
        console.log(e)
        this.params.address = e.cityname + ' • ' + e.poiname;
        this.showmap = false;
      },
      async beginRelease() {

        if (!this.params.address) return Toast({
          message: '请选择地址',
          duration: 1500
        })

        if (this.canRelease) {
          if (this.files.length > 0) {
            this.params.media = await this.uploadFile({
              files: this.files,
              from: this.from
            })
          }

          console.log(this.params.media)

          this.params.display = this.display ? 2 : 1
          showLoading("发布中...")
          const res = await this.cityLoveReleaseDynamic(this.params)
          hideLoading();

          console.log("res > 0", res > 0, res)

          showHandleStatusByFlag(res > 0, '发布成功', res.msg, (bool) => {
            if (bool) {
              this.params.media = [];
              this.params.body = ''
              this.filePaths = []
              this.files = [];
              this.$router.go(-1)
            }
          })

        } else {
          console.log("不可发布")
        }
      }
    },
    computed: {
      canRelease() {
        return !!this.params.body.trim() || this.filePaths.length > 0
      }
    }
  }
</script>
