<template>
  <layout-one :after-right="true" :body-src="getSingleImg(packageInfo.logo)" :body="layoutBodyOne">
    <template slot="body-bd-f">
      <span class="t-o">{{packageInfo.title}}</span>
      <span class="flex-g-0 fon-xs col-9">剩余：{{packageInfo.num}}份</span>
    </template>
    <template slot="body-bd-s">
      <span class="card-name">{{packageInfo.vipTypeName}}</span>
    </template>
    <template slot="body-bd-t">
      <span class="fon-xs">价值<span class="fon-xl col-t">￥{{packageInfo.money}}</span></span>
      <span @click="goPointPage({path:'/auxiliary/vip/giftDetails',query:{id:packageInfo.id}})" class="flex-g-0 box-btn-f">免费领取</span>
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
      props: ['packageInfo'],
      data() {
        return {
          layoutBodyOne:{
            hd: 1,
            bd: 1,
            img: {
              wid: 1.6,
              hei: 1.6,
            },
          },
          PlaceholderAvatar,
        }
      },
      mixins: [utilMixins],
    }
</script>

<style scoped lang="scss">
  .card-name {
    font-size: 22px;
    margin: 10px 0 10px;
    padding: 5px 12px;
    border: 1px solid #F5C98F;
    border-radius: 5px;
    color: #FF0000;
    background: #FFEFD2;
  }
</style>
