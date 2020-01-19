<template>
  <div v-if="list.length > 0" class="bg-f posi-r mar-t-20" style="z-index: 100">
    <div class="posi-a t0 w100 hei50" style="background: #FFE4BF"></div>
    <div class="posi-a t50 w100 hei50 bg-f8 t50"></div>
    <div class="posi-r zIndex99">
      <dd-layout-div class="pad-lr pad-t-20">
        <dd-layout-div class="flex flex-bt flex-y-center">
          <div>
            <div class="mar-b-10">REWARD RECOMMEND</div>
            <dd-layout-div class="fon-wb" :font-size="34">
              <em class="pad-r-20" style="border-right: 2px solid #333">推荐悬赏</em>
              <em @click="show=true" class="mar-l-10 fon-b fon-normal">攻略</em>
            </dd-layout-div>
          </div>
          <dd-layout-div :pad="[12,0,6,12]" @click="goPointPage('/auxiliary/ys/jhList')" :fillet="8"
                         class="fon-sm">查看更多<i class="iconfont icon-right fon-xs"></i></dd-layout-div>
        </dd-layout-div>
        <div v-if="noticeList.length" class="posi-a w-264 flex-y-center bg-f br-r-30 h-50 pad-lr10"
             style="left:2.75rem;top: 0.45rem">
          <!--<em class="iconfont icon-dian1 col-v" style="font-size: 0.05rem"></em>-->
          <van-swipe class="flex-1 h-50" :autoplay="3000" :show-indicators="false" vertical>
            <van-swipe-item v-for="(i,key) in noticeList" :key="key">
              <div class="w100 hei100 flex-center col-v t-o1">{{i.title}}</div>
            </van-swipe-item>
          </van-swipe>
          <!--<em class="iconfont icon-dian1 col-v" style="font-size: 0.05rem"></em>-->
        </div>
      </dd-layout-div>
      <dd-layout-div class="flex over-a" :pad="[30,0]">
        <dd-layout-div
          :width="220" :mar="[0,0,0,20]" :fillet="15"
          @click="goPointPage('/postDetail?postId='+item.id)"
          class="over-h box-sha flex-g-0 posi-r flex-col flex-y-center bg-f pad-t-20"
          v-for="(item,key) in list" :key="key">
          <dd-layout-img
            :width="1"
            :height="1"
            :fillet="0.5"
            :src="item.face"
          />
          <div class="mar-t-20 fon-b">{{item.name}}</div>
          <div class="mar-t-10 fon-xss col-9 t-o1">{{item.typeName}}|{{item.nTypeName}}</div>
          <div class="base-pad fon-b">赏金<span class="col-r fon-lg">{{item.money}}</span>元</div>
          <div class="w100 h-59 bg-b fon-xs col-f flex-center">总赏金:{{item.zmoney}}元</div>
        </dd-layout-div>
      </dd-layout-div>
    </div>
    <van-dialog
      style="width: 88%;border-radius: 20px"
      v-model="show"
      :confirm-button-color="$themeColor"
    >
      <div class="pad-30 bg-t col-f fon-xl">悬赏攻略</div>
      <div class="over-y-s w100 pactBody base-pad b-box" style="height: 6rem;overflow-x:hidden" v-html="postConfig.rewardStrategy">
      </div>
    </van-dialog>
  </div>
</template>


<script>

  import {mapState, mapActions} from 'vuex'
  import {format} from "../../util";
  import {utilMixins} from "../../plugins/util-mixins";
  import DdLayoutImg from "./dd-layout-img";
  import MallScrollGoods from "../template/item/mall-scroll-goods";
  import Notice from "../../components/business-district/notice";

  export default {
    components: {MallScrollGoods, DdLayoutImg, Notice},
    mixins: [utilMixins],
    name: "activity",
    props: {
      config: {
        type: Object,
        default: null,
      }
    },
    data() {
      return {
        params: {
          page: 1,
          size: 50,
          recommend: 1
        },
        list: [],
        noticeList: [],
        show: false,
      }
    },
    methods: {
      ...mapActions("yS", ["rewardList", "rewardProfitList"]),
      async getNewInfo() {
        const vipData = await this.rewardProfitList();
        this.noticeList = _.map(vipData, (item) => {
          return {title: `恭喜${item.userName.substring(0, 1)}**获得${parseInt(item.money)}元赏金`}
        }) || []
      },
      getList() {
        this.rewardList(this.params).then(res => {
          this.list = res.map(data => {
            return {
              name: this.stringIntercept(data.customUser || data.linkMan || data.userName || '神秘人', 6),
              face: (data.customPortrait && data.customPortrait != '[]' && JSON.parse(data.customPortrait).length > 0 && this.getPathByAssetPath(JSON.parse(data.customPortrait)[0].url)) || data.portrait || this.PlaceholderAvatar,
              typeName: data.typeName,
              nTypeName: data.nTypeName,
              money: parseInt(+data.singleMoney),
              zmoney: parseInt(+data.money),
              id: data.postId
            }
          })
        })
      }
    },
    computed: {
      ...mapState("common", {
        postConfig: state => state.postConfig
      }),
    },
    watch:{
      config:{
        handler(newVal){
          this.getList();
          console.log('rewardconfigconfigconfig',newVal)
        },
        immediate: true,
        // deep: true,
      },
    },
    created() {
      this.getNewInfo();
    }
  }

</script>
