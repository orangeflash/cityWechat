<template>
  <div>
    <router-view/>
    <div v-if="kpBanner==1" class="posi-f w100 hei100 zIndex999999 t0 l0">
      <Banner v-if="banners.length"
              height="100"
              unit="vh"
              :swiper="{children:banners}"/>
      <div @click="tg" class="posi-a countC flex-center br-r-8 fon-b col-f"><span class="mar-r-10">{{second}}</span>跳过</div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapMutations} from 'vuex'
  import Banner from '../../components/home/banner';
  export default {
    components: {Banner},
    data() {
      return {
        second:'',
      }
    },
    methods:{
      ...mapMutations("home", ["SET_KPBANNER"]),
      tg(){
        this.SET_KPBANNER(2)
        clearInterval(this.dsq)
      },
    },
    computed: {
      ...mapState("home", {
        kpBanner: s => s.kpBanner
      }),
      banners() {
        let openImg = this.platform.openImg && this.platform.openImg.split(',') || []
        return openImg.map(item => {
          return {url: item}
        })
      },
    },
    created(){
      if(this.platform.isOpenImg!=1) return
      this.second=+this.platform.countDown
      this.dsq = setInterval(() => {
        this.second--
        if (this.second <= 0) {
          this.SET_KPBANNER(false)
          clearInterval(this.dsq)
        }
      }, 1000)
    },
  }
</script>
<style scoped lang="scss">
  @import "../../assets/theme";
  .countC{
    width: 130px;
    height: 60px;
    top: 30px;
    right: 30px;
    background-color: rgba(147,147,147, .6);
  }
</style>
