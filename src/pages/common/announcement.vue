<template>
  <div id="Announcement">
    <ul class="c-announcement">
      <li class="c-announcement__item" v-for="(item,key) in announcementList" v-if="key == index" :key="key">
        <p class="c-announcement__title" v-html="item.title"></p>
        <div class="c-announcement__content" v-html="item.content"></div>
      </li>
    </ul>
    <footer class="c-footer">
      <button class="c-footer__btn" @click="$popRoute">我知道了</button>
    </footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "Announcement",
    data() {
      return {
        title: "",
        announcementList: [],
        index:0
      }
    },
    methods: {},
    computed: {},
    created() {
      this.announcementList = this.$route.params.list;
      this.index = this.$route.params.index;
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #Announcement {
    background-color: #f4f4f4;
    min-height: 100vh;
    .c-announcement {
      padding: 0 30px;
      background-color: #fff;
      &__item {
        padding: 50px 0;
        flex-direction: column;
        background-color: #fff;
        &:not(:first-child) {
          margin-top: 30px;
        }
      }
      &__title {
        /*font-weight: bold;*/
        /*color: #1a8c44;*/
        font-size: 32px;
        display: block;
        text-align: left;
        word-break:break-all;
        line-height: 40px;
      }
      &__content {
        margin-top: 30px;
        width: 100%;
        text-align: left;
        font-size: 26px;
        box-sizing: border-box;
        line-height: 32px;
      }
    }
    .c-footer {
      @include absoluteFull(fixed);
      top: auto;
      height: 150px;
      background-color: #fff;
      padding: 30px;
      box-sizing: border-box;
      &__btn{
        @include flex-center;
        font-size: 32px;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        color: #fff;
        background-color: $themeColor;
      }
    }
  }
</style>
