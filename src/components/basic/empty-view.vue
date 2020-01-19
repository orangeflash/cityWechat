<template>
  <div id="EmptyView">
    <section class="c-empty">
      <div class="c-empty__wrap">
        <img :src="PlaceholderImg" alt="" class="c-empty__img">
        <h3 class="c-empty__title">暂无数据</h3>
      </div>
    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";

  export default {
    name: "EmptyView",
    data() {
      return {
        PlaceholderImg,
      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #EmptyView {
    .c-empty {
      overflow: hidden;
      padding-bottom: 60px;
      &__wrap {
        margin-top: 110px;
        @include alignCenter;
        flex-direction: column;
      }
      &__img {
        width: 385px;
        height: 220px;
      }
      &__title {
        margin-top: 35px;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
</style>
