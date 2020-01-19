<template>

  <div class="flex-bt dh flex-y-center bg-f pad-lr">
    <div>
      <i class="iconfont icon-gonggao col-t"></i>
    </div>
    <div class="flex-g-1 dh-40  hide-e mar-l">
      <van-swipe class=" flex-y-center w100  hide-e posi-r" :height="20" :autoplay="3000" :show-indicators="false" vertical>
        <van-swipe-item class="dh-40 w100" v-for="(item,key) in notices.length?notices:['']" :key="key">
          <div class=" hide-e fon-b dh-40 lineH-40"
               :class="notices.length>1?'dh':''"
          >{{item || '暂无信息'}}
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      notices: {
        type: Array,
        default: ['']
      }
    },
  }

</script>
