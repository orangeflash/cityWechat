<template>

  <dd-article
    :data="item"
    @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
    class="bg-f"
  >
    {{item}}
    <div slot="mask" class="posi-a t0 l0 r0 b0">
      <div class="posi-a b0 w100 dh col-f hide-e flex flex-y-center c-b-0-tb-200">
        <span class="pad-lr fon-b">{{item.title}}</span></div>
    </div>
    <div slot="content" class="pad-30">
      <div class="flex-bt flex-y-center">
        <div><span class="col-t fon-b mar-r">底价:￥{{item.nowPrice}}</span><em
          class="col-9 t-d-l">原价:￥{{item.oldPrice}}</em></div>
        <div class="col-9"><i class="iconfont icon-huo col-t mar-r-10"></i>{{item.browseNum}}</div>
      </div>
      <div class="flex-bt mar-t-20 flex-y-center">
        <div class="col-6">已有<span class="col-t">{{item.joinNum}}</span>人参与砍价</div>
        <span class="c-b-t-lr-300 pad-14-20-10 br-r-20 col-f sd-t">去砍价</span>
      </div>
    </div>
  </dd-article>

</template>


<script>
  import DdArticle from '@/components/template/dd-article/two'

  export default {
    components: {DdArticle},
    props: {
      item: {
        type: Object,
        default: Object,
      }
    }
  }


</script>
