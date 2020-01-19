<template>
  <div class="no-data" :style="{padding: pad}">
    <img class="no-data-logo" style="width: 104.51px;height: 70px" :src="myPublicationPlaceholder"/>

    <p class="tips" v-if="!notShowTips">{{tips || '暂无数据'}}</p>
  </div>
</template>
<script>
  import myPublicationPlaceholder from "@/assets/img/personal/my_publication_placeholder.jpg"

  export default {
    props: ['tips', 'pad', 'notShowTips'],
    data() {
      return {
        myPublicationPlaceholder
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .no-data {
    text-align: center;
    padding: 60px 0;
    img.no-data-logo {
      margin: 0 auto;
    }

    p {
      color: #999;
      margin-top: 10px;
      font-size: 22px;
    }
  }
</style>
