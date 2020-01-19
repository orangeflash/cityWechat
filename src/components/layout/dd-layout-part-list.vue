<template>

  <div class="bg-f">
    <div class="pad-30">
      <div class="flex-y-center flex-bt">
        <div>
          <span class="fon-xll fon-wb col-3">{{infoTitle}}</span>
        </div>
        <div class="col-bb" @click="goPointPage(link)" v-if="linkTips">{{linkTips}}<i class="iconfont icon-youjiantou2"></i></div>
      </div>
    </div>
    <div class="flex over-a pad-b">
      <slot/>
    </div>
  </div>

</template>

<script>

  export default {
    props: {
      infoTitle: {
        type: String,
        default: ''
      },
      linkTips: {
        type: String,
        default: ''
      },
      link: {
        type: String,
        default: ''
      }
    }
  }

</script>
