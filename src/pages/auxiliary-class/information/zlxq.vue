<template>

  <div class="myziliao" style="padding-bottom: 120px;">
      <Header/>
      <div class="pad-t-20 bg-f">
      <div class="pad-30">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll col-3">基本资料</span>
          </div>
        </div>
      </div>
      </div>
      <van-cell-group>
      <van-cell size="large">
        <div slot="title" class="flex">
          <span class="fon-b" style="width: 1.5rem">用户名：</span>
          <span class="fon-b">{{zlInfo.realName}}</span>
        </div>
      </van-cell>
        <van-cell size="large">
          <div slot="title" class="flex">
            <span class="fon-b" style="width: 1.5rem">经营范围：</span>
            <span class="fon-b">{{zlInfo.typeName}}</span>
          </div>
        </van-cell>
        <van-cell size="large">
          <div slot="title" class="flex">
            <span class="fon-b" style="width: 1.5rem">发货方式：</span>
            <span class="fon-b">{{zlInfo.deliveryMode}}</span>
          </div>
        </van-cell>
        <van-cell size="large">
          <div slot="title" class="flex">
            <span class="fon-b" style="width: 1.5rem">身份：</span>
            <span class="fon-b">{{zlInfo.identity}}</span>
          </div>
        </van-cell>
        <van-cell size="large">
          <div slot="title" class="flex">
            <span class="fon-b" style="width: 1.5rem">诚信签名：</span>
            <span class="fon-b">{{zlInfo.sign}}</span>
          </div>
        </van-cell>
        <van-cell size="large">
          <div slot="title" class="flex">
            <span class="fon-b" style="width: 1.5rem">经营地址：</span>
            <span class="fon-b">{{zlInfo.address}}</span>
          </div>
        </van-cell>
      </van-cell-group>
      <div class="pad-t-20 bg-f mar-t">
        <div class="pad-30">
          <div class="flex-y-center flex-bt">
            <div>
              <span class="fon-xll col-3">客户实力</span>
            </div>
          </div>
        </div>
        <div class="pad-30">
          <img
            class="br-r-20 mar-b dis-b mar-a mw100"
            v-for="(item,key) in zlInfo.media"
            :src="getSingleImg(item.url)"
            :key="key"/>
        </div>
      </div>

  </div>


</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {hideLoading, showDialog, showLoading} from "@/util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {},
    data() {
      return {
        active: 1,
        dataList: [],
        zlInfo: {},
      }
    },
    methods: {
      ...mapActions("Xx", ["seeXx"]),
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      async getInfo(params) {
        showLoading();
        const res = await this.seeXx(params)
        hideLoading();
        this.findInfo(res)
        console.log('详情', res)
        this.zlInfo = {
          address: res.address,
          deliveryMode: res.deliveryMode,
          identity: res.identity,
          media: res.media,
          realName: res.realName,
          typeName: res.typeName,
          sign: res.sign,
        }
      },
    },
    created() {
      console.log('编辑的时候渲染', this.$route.query)
      let query = this.$route.query;
      this.isFailParams({
        field: query.postId,
        tips: '缺少信息id',
      }, async () => {
        this.getInfo({postId: query.postId})
        this.postId = query.postId;
      })
    },
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";
</style>
