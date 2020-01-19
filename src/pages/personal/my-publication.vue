<template>
  <div id="MyPublication">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <router-view/>

    <!--&lt;!&ndash;这个头部是组件来的 E&ndash;&gt;-->
    <!--<van-tabs sticky @click="changeTab" :color="$themeColor" v-model="active">-->
    <!--<van-tab :title="label" v-for="(label,key) in labelArr" :key="key">-->
    <!--<scroller-->
    <!--v-if="dataList.length"-->
    <!--:on-refresh="onRefresh"-->
    <!--:on-infinite="onInfinite">-->
    <!--<section class="l-list" v-for="item in dataList" :key="item.postId">-->

    <!--<basic-note-item @refresh="onRefresh" @showMore="onShowMore" @topPost="onTopPost" :postData="item"></basic-note-item>-->

    <!--&lt;!&ndash;<list-note-item&ndash;&gt;-->
    <!--&lt;!&ndash;@refresh="onRefresh"&ndash;&gt;-->
    <!--&lt;!&ndash;:hide-expansion-bar="key===3"&ndash;&gt;-->
    <!--&lt;!&ndash;@showToppingOption="showToppingOptionHandle"&ndash;&gt;-->
    <!--&lt;!&ndash;@showMoreFeature="showMoreFeatureHandle"&ndash;&gt;-->
    <!--&lt;!&ndash;:postData="item" :mark='1'/>&ndash;&gt;-->
    <!--</section>-->
    <!--</scroller>-->
    <!--<section class="c-empty" v-else>-->
    <!--<div class="c-empty__wrap">-->
    <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
    <!--<h3 class="c-empty__title">暂无搜索结果</h3>-->
    <!--</div>-->
    <!--</section>-->
    <!--</van-tab>-->
    <!--</van-tabs>-->

    <!--<van-actionsheet-->
    <!--v-model="showMore"-->
    <!--:actions="featureActions"-->
    <!--cancel-text="取消"-->
    <!--@select="onFeatureSelect"-->
    <!--@cancel="showMoreFeature=false"-->
    <!--v-if="!(isRedBag===1)&&!(isEnd===1)"-->
    <!--/>-->


    <!--<van-actionsheet-->
    <!--v-model="showMoreFeature"-->
    <!--:actions="featureActions"-->
    <!--cancel-text="取消"-->
    <!--@select="onFeatureSelect"-->
    <!--@cancel="showMoreFeature=false"-->
    <!--v-if="!(isRedBag===1)&&!(isEnd===1)"-->
    <!--/>-->
    <!--<van-actionsheet-->
    <!--v-model="showMoreFeature"-->
    <!--:actions="featureActionsIsEnd"-->
    <!--cancel-text="取消"-->
    <!--@select="onFeatureSelect"-->
    <!--@cancel="showMoreFeature=false"-->
    <!--v-else-if="isEnd===1"-->
    <!--/>-->
    <!--<van-actionsheet-->
    <!--v-model="showMoreFeature"-->
    <!--:actions="featureActionsHaveRed"-->
    <!--cancel-text="取消"-->
    <!--@select="onFeatureSelect"-->
    <!--@cancel="showMoreFeature=false"-->
    <!--v-else-->
    <!--/>-->
    <!--<van-actionsheet-->
    <!--v-model="showTopOption"-->
    <!--:actions="toppingOptions"-->
    <!--cancel-text="取消"-->
    <!--@select="onTopOptionSelect"-->
    <!--@cancel="showTopOption=false"-->
    <!--/>-->

  </div>
</template>

<script>
  import Header from "@/components/header";

  export default {
    components: {Header},
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../assets/common";

  #MyPublication {
    position: fixed;
    width: 100%;

  }

</style>
