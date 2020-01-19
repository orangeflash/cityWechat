<template>
  <div id="search">
    <div class="search-box">
      <i class="iconfont icon-sousuo search-box-icon"></i>
      <input type="text" name="" placeholder="请输入内容" class="search-btn" @keyup.enter="onSearch()" v-model="keyWords">
      <div slot="action" @click="onSearch()" class="search-click">搜索</div>
    </div>
    <div class="search-history">
      <div class="search-history-title">
        <span class="search-history-text">搜索历史</span>
        <i class="iconfont search-history-icon" @click="onClean">&#xe692;</i>
      </div>
      <template v-if="searchHistoryList.length">
        <van-button size="normal" class="history-info history-info-btn" v-for="(item,index) in searchHistoryList"
                    :key="index" >{{item}}
        </van-button>
      </template>
      <p v-else class="search-history-tips">暂无历史记录</p>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters, mapMutations} from "vuex";
  import {Search, Button, Dialog} from "vant";

  export default {
    name: "Search",
    props: ['source'],
    data() {
      return {
        keyWords: '',
        searchType: null
      };
    },
    methods: {
      ...mapActions("common/search", ["searchPostByType"]),
      ...mapMutations("common/search", ['setKeyWordsToHistory', 'cleanHistoryKeyWords']),
      async onSearch(text) {
        const keyWords = text || this.keyWords.trim();
        this.setKeyWordsToHistory(keyWords);
        this.goPointPage({path:"/cityInformation/cityInformationSearchList", query:{q:this.keyWords} })
      },
      onClean() {
        this.cleanHistoryKeyWords();
        Dialog.alert({
          title: '提示',
          message: '清除成功！',
          className: 'dialog-title'
        });
      },
    },
    computed: {
      ...mapState("common/search", {
        searchHistoryList: state => state.searchHistoryList
      })
    },
    created() {
      this.searchType = this.$route.query['searchType'];
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/common";

  #search {
    padding: 24px 30px;
    background-color: #fff;
    min-height: 100vh;
    .search-box {
      box-sizing: border-box;
      border-radius: 40px;
      display: flex;
      justify-content: space-between;
      position: relative;
      .search-box-icon {
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        left: 16px;
        color: rgb(153, 153, 153);
        border: none
      }
    }
    .search-btn {
      flex: 1;
      padding: 0px 60px;
      height: 64px;
      align-self: center;
      background-color: rgb(225, 225, 225);
      color: rgb(153, 153, 153);
      border-radius: 8px;
      border-width: 0px;
    }
    .search-click {
      display: inline-block;
      font-size: 30px;
      margin-left: 24px;
      min-width: 60px;
      line-height: 64px;
    }
    .search-history {
      margin-top: 33px;
      .search-history-title,
      .search-history-icon {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

      }
      .search-history-text {
        font-size: 26px;
        margin: 0px;
        color: rgb(153, 153, 153);
      }
      .search-history-tips {
        color: #a9a9a9;
        margin-top: 20px;
      }
    }
    .history-info {
      line-height: 64px;
      padding: 10px 20px;
      max-width: 100%;
      background-color: rgb(244, 244, 244);
      color: rgb(51, 51, 51);
      border-width: 0px;
      border-radius: 8px;
      margin: 16px 16px 0px 0px;
      @include t-overflow;
    }
    .hot-search {
      margin-top: 28px;
      font-size: 28px;
      color: rgb(153, 153, 153);
    }
    .hot-title {
      display: block;
      margin-bottom: 24px;
    }
    .dialog-title {
      .van-dialog__message {
        text-align: center
      }
    }
  }
</style>
