<template>

  <div class="dh-100 bg-0-5 posi-f t0 l0 r0 flex-bt zIndex9999 pad-l">
    <user-info
      size="36"
      :src="logo"
      border-radius="0.08"
      :name="`<em class='col-f'>欢迎进入</em>`+name"
      info="关注公众号，享专属服务"
      fontSize="28"
      :color="$themeColor"
      infoColor="#fff"
    />
    <div class="posi-r flex-y-center pad-r">
      <span class="posi-a t0 r0 bg-f col-t fon-46 tsf-45 flex-x-center flex-col-start"
            style="width: 1rem;height:1rem;margin-top: -0.5rem;margin-right: -0.5rem"
            @click="$emit('close')"
      ><em class="pad-l-10">+</em></span>
      <span class="bg-t col-f pad-20-15-17 br-r-10 mar-r" @click="$emit('follow')">立即关注</span>
    </div>

  </div>

</template>


<script>
  import UserInfo from "@/components/template/user";
  import {mapState} from "vuex"

  export default {
    components: {UserInfo},
    props: ['logo', 'name'],
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
        isDebug: state => state.isDebug,
        user: state => state.user
      }),
    },
  }
</script>
<style>
  .pad-20-15-17 {
    padding: 20px 15px 17px;
  }
</style>
