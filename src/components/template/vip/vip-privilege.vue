<template>
  <layout-one :after-right="true" :body-src="getSingleImg(dataInfo.logo)" :body="layoutBodyOne">
    <template slot="body-bd-f">
      <span class="t-o">{{dataInfo.title}}</span>
      <span class="flex-g-0 fon-xs col-9"><span class="iconfont icon-yanjing3 col-t mar-r-10"></span>{{dataInfo.view}}</span>
    </template>
    <template slot="body-bd-s">
      <span class="col-t mar-t fon-xs"><span class="fon-xl">{{dataInfo.discount}}折</span>优惠</span>
      <span class="flex-g-0 fon-xs col-9">已有{{dataInfo.receiveNum}}人领取</span>
    </template>
    <template slot="body-bd-t">
      <span class="fon-xs col-9 t-o1">{{dataInfo.explain}}</span>
      <span v-if="type=='my'" @click="goPointPage({path:'/auxiliary/vip/privilegeDetails',query:{id:dataInfo.privilegeId}})" class="flex-g-0 box-btn-f br-r-30">{{dataInfo.state==0?'立即使用':'查看详情'}}</span>
      <span v-else-if="type=='verification'"></span>
      <span v-else @click="goPointPage({path:'/auxiliary/vip/privilegeDetails',query:{id:dataInfo.id}})" class="flex-g-0 box-btn-f br-r-30">立即领取</span>
    </template>
  </layout-one>
</template>

<script>
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";
    export default {
      name: "vip-package",
      components: {LayoutOne},
      props: ['dataInfo','type'],
      data() {
        return {
          layoutBodyOne:{
            hd: 1,
            bd: 1,
            img: {
              wid: 1.7,
              hei: 1.7,
            },
          },
          PlaceholderAvatar,
        }
      },
      mixins: [utilMixins],
    }
</script>

<style scoped lang="scss">

</style>
