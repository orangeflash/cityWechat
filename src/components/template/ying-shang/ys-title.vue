<template>
  <div class="mar-b bg-v flex-row flex-bt" style="background: #FFE4BF">
    <div class="flex-g-0 flex-col-center mar-r-10 pad-20" style="background: #FEC88C">
      <div @click="show=true" class="br-r-30 pad-10-10-4 mar-b-10" style="border: 1px solid #000;">悬赏攻略</div>
      <img :src="reward" class="w-77 mar-l-10 mar-r-10">
    </div>
    <div class="flex-g-1 base-pad fon-xsss col-3 flex-col flex-x-center"
         style="border-left: 1.1px dot-dash #B2A790;padding-left: 0.1rem;line-height: 0.26rem">
      <div class="flex-y-center pad-b-10">
        <div class="fon-xl mar-r">总赏金:<span class="col-f38">{{parseInt(dataInfo.money)}}</span><span
          class="fon-sm">元</span></div>
        <div v-if="type.type==1">招聘人数: <em class="col-f38">{{dataInfo.num}}</em>人 单人赏金: <em class="col-f38">{{parseInt(dataInfo.singleMoney)}}</em>元
        </div>
        <div v-if="type.type==3">悬赏任务: <em class="col-f38">{{dataInfo.num}}</em>人 单笔赏金: <em class="col-f38">{{parseInt(dataInfo.singleMoney)}}</em>元
        </div>
      </div>
      <div class="pad-t-10" v-if="type.type!=3"><em style="color: #39A7FE">获赏条件</em>:{{type.condition}}</div>
      <div class="pad-t-10" v-else><em style="color: #39A7FE">获赏条件</em>:{{dataInfo.condition}}</div>
    </div>
    <van-dialog
      style="width: 88%;border-radius: 20px"
      v-model="show"
      :confirm-button-color="$themeColor"
    >
      <div class="pad-30 bg-t col-f fon-xl">悬赏攻略</div>
      <div class="over-y-s w100 pactBody base-pad b-box" style="height: 6rem;overflow-x:hidden"
           v-html="postConfig.rewardStrategy">
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";
  import {utilMixins} from "../../../plugins/util-mixins";
  import reward from '../../../assets/img/city-information/reward.png'

  export default {
    name: "vip-package",
    components: {},
    props: ['dataInfo', 'type'],
    data() {
      return {
        reward,
        show: false,
      }
    },
    computed: {
      ...mapState("common", {
        postConfig: state => state.postConfig
      }),
    },
    mixins: [utilMixins],
  }
</script>

<style scoped lang="scss">

</style>
