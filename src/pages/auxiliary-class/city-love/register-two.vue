<template>
  <dd-layout-div mi-h="100vh" class="bg-f">
    <dd-layout-img :width="7.5" :height="7.12" v-if="registerInfo.face" :src="registerInfo.face">
      <dd-file class="posi-a-i bg-t op-0 w100 hei100" v-model="registerInfo.face"
               @change="(e)=>registerInfo.files = [e.files[0]]"/>
    </dd-layout-img>
    <dd-layout-div v-else :height="712" bg="#F6F7F9">
      <dd-layout-div :pad="[70,0]" :width="588" class="mar-a">
        <div class="fon-50 fon-w5 mar-b">上传真实头像</div>
        <p class="col-9">立刻和同城的帅哥美女们交朋友！</p>
      </dd-layout-div>
      <dd-layout-div :height="395" :width="588" class="posi-r mar-a flex-center">
        <dd-layout-div class="l0 t0 posi-a"
                       :br="{top:`0.02rem solid ${$themeColor}`,left:`0.02rem solid ${$themeColor}`}" :width="50"
                       :height="50"></dd-layout-div>
        <dd-layout-div class="r0 t0 posi-a"
                       :br="{top:`0.02rem solid ${$themeColor}`,right:`0.02rem solid ${$themeColor}`}" :width="50"
                       :height="50"></dd-layout-div>
        <dd-layout-div class="r0 b0 posi-a"
                       :br="{right:`0.02rem solid ${$themeColor}`,bottom:`0.02rem solid ${$themeColor}`}" :width="50"
                       :height="50"></dd-layout-div>
        <dd-layout-div class="l0 b0 posi-a"
                       :br="{left:`0.02rem solid ${$themeColor}`,bottom:`0.02rem solid ${$themeColor}`}" :width="50"
                       :height="50"></dd-layout-div>
        <dd-layout-div :width="206" :height="206" class=" posi-r flex-center" :fillet="200">
          <div class="posi-a bg-t op-1 w100 hei100 t0 l0 br-r-c"></div>
          <i class="iconfont posi-r icon-ai-camera col-t mar-t-15 fon-68"></i>
          <dd-file class="posi-a-i bg-t op-0 w100 hei100 br-r-c" v-model="registerInfo.face"
                   @change="(e)=>registerInfo.files = [e.files[0]]"/>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div :width="588" class="mar-a flex-bt" :pad="[48,0,0]">
      <div class="t-c">
        <dd-layout-img :src="image1"
                       :width="1.83" :height="1.83" :fillet="0.4">
          <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 b0 mar-b-10 mar-r-10 op-6"></i>
        </dd-layout-img>
        <p class="mar-t-25">不遮挡面部</p>
      </div>
      <div class="t-c">
        <dd-layout-img :src="image2"
                       :width="1.83" :height="1.83" :fillet="0.4">
          <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 b0 mar-b-10 mar-r-10  op-6"></i>
        </dd-layout-img>
        <p class="mar-t-25">不上传非本人</p>
      </div>
      <div class="t-c">
        <dd-layout-img :src="image3"
                       :width="1.83" :height="1.83" :fillet="0.4">
          <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 b0 mar-b-10 mar-r-10  op-6"></i>
        </dd-layout-img>
        <p class="mar-t-25">不上传非人像</p>
      </div>
    </dd-layout-div>
    <dd-layout-div :bg="getType(judgeParams) == 'boolean'?$themeColor:'#DAD9DD'" :mar="[70,'auto',0]" :width="588"
                   class="col-f fon-40 flex-center"
                   @click="clickHandle" :height="98" :fillet="98">下一步
    </dd-layout-div>
  </dd-layout-div>

</template>
<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdFile from "../../../components/template/dd-form/dd-file";

  import image1 from '../../../assets/img/other/20190621102827.png'
  import image2 from '../../../assets/img/other/20190621102830.png'
  import image3 from '../../../assets/img/other/20190621102833.png'


  import {mapState} from 'vuex'
  import {Toast} from 'vant'

  export default {
    components: {DdFile, DdLayoutImg},
    data() {
      return {
        face: '',image1,
        image2,
        image3,
      }
    },
    methods: {
      getFilePaht(e) {
        console.log(e)
      },
      clickHandle() {

        if (this.judgeParams == true) {
          this.registerInfo.height = 160
          this.registerInfo.weight = 50
          this.goPointPage('/auxiliary/cityLove/registerThree')
        } else {
          Toast({
            message: this.judgeParams,
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo
      }),

      judgeParams() {

        if (!this.registerInfo.name.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.birthday.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.city.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.face.trim()) return this.goPointPage("/auxiliary/cityLove/registerTwo")
        if (!this.registerInfo.height) return this.goPointPage("/auxiliary/cityLove/registerThree")
        if (!this.registerInfo.weight) return this.goPointPage("/auxiliary/cityLove/registerThree")
        return true
      }
    },
    async created() {
      if (this.registerInfo.id) {
        this.goPointPage("/auxiliary/cityLove")
      } else {
        this.registerInfo.tel = null;
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.registerInfo.tel = this.user.userTel
      }
    }
  }
</script>
