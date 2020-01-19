<template>
  <!--debug page-->
  <div id="debug-page" @click="showDeBug = true" :class="{'show-debug': showDeBug,'hide-debug':!showDeBug}">
    <div class="debug-operation" v-if="showDeBug">
      <span @click="showQuery = !showQuery">搜索</span>
      <span @click="cleanLocalStorage">清空缓存</span>
      <span @click="cleanDebug">清空debug</span>
      <span @click="refresh">刷新页面</span>
      <span @click="refreshDebug">刷新debug</span>
      <span @click.stop="showDeBug = !showDeBug">隐藏debug</span>
      <span @click.stop="close">关闭debug</span>
    </div>
    <div class="search-box" v-if="showQuery">
      <van-cell-group>
        <van-field
          v-model="url"
          center
          clearable
          label="URL:"
          placeholder="请输入API接口"
          @input="debugQuery"
        >
          <van-button @click="hideQuery" slot="button" size="small" type="primary"
                      :style="{background:$themeColor,border:'none'}">关闭
          </van-button>
        </van-field>
      </van-cell-group>
    </div>

    <ul class="debug-list" v-if="showDeBug">
      <li class="debug-post-single" v-for="(item,key) in debugData">
        <div><em>Request URL:</em>{{item.url}}</div>
        <div><em>Request Method:</em>{{item.method}}</div>
        <div><em>Request status:</em>{{item.status}}</div>
        <div><em>Request statusText:</em>{{item.statusText}}</div>
        <div>
          <em>Request Headers:</em>
        </div>
        <ul>
          <li><em>zh-appid:</em>{{item.headers['zh-appid']}}</li>
          <li><em>zh-city-id:</em>{{item.headers['zh-city-id']}}</li>
          <li><em>zh-session-key:</em>{{item.headers['zh-session-key']}}</li>
          <li><em>zh-type:</em>{{item.headers['zh-type']}}</li>
          <li><em>zh-zone-id:</em>{{item.headers['zh-zone-id']}}</li>
        </ul>
        <div>
          <em>param:</em>
          <p>{{item.data}}</p>
        </div>
        <div>
          <em>Preview:</em>
          <p>{{item.preview}}</p>
        </div>
        <div><em>time:</em>{{ formatDateTime(item.time) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';

  export default {
    data() {
      return {
        debugData: [],
        showDeBug: true,
        url: '',
        showQuery: false,
      }
    },
    methods: {
      ...mapActions(["setDebugStatus"]),
      cleanDebug() {
        localStorage.debugData = [];
        this.debugData = [];
      },
      refresh() {
        window.location.reload()
      },
      refreshDebug() {
        this.debugData = localStorage.getItem("debugData") ? JSON.parse(localStorage.getItem("debugData")).reverse() : [];
      },
      formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      },
      hideQuery() {
        this.refreshDebug();
        this.showQuery = !this.showQuery;
      },
      debugQuery() {
        let data = localStorage.getItem("debugData") ? JSON.parse(localStorage.getItem("debugData")).reverse() : [],
          len = data.length,
          fillData = [];
        this.debugData = [];

        for (let i = 0; i < len; i++) {
          if (data[i].url.indexOf(this.url) >= 0) {

            fillData.push(data[i]);
          }
          console.log(data[i].url.indexOf(this.url) >= 0)
        }
        console.log(data)
        console.log(this.url)
        this.debugData = fillData;

      },
      cleanLocalStorage() {
        alert("已清除缓存")
        localStorage.clear();
        localStorage.isClear = true;
        this.refresh();

      },
      close() {
        delete localStorage.debug;
        this.setDebugStatus(null);
      }
    },
    computed: {},
    created() {
      this.$nextTick(function () {
        this.debugData = localStorage.getItem("debugData") ? JSON.parse(localStorage.getItem("debugData")).reverse() : [];
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  .show-debug {

    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    top: 0;
    left: 0;
  }

  .search-box {
    position: fixed;
    top: 0;
    width: 100%;
  }

  .hide-debug {
    width: 88px;
    height: 88px;
    background-color: $themeColor;
    border-radius: 50%;
    bottom: 150px;
    right: 30px;
    overflow: hidden;
    line-height: 88px;
    text-align: center;

  }

  .hide-debug:before {
    content: "DeBug";
    color: #fff;
    font-size: 20px;
  }

  #debug-page {
    position: fixed;
    z-index: 999999;

    .debug-operation {
      display: flex;
      position: fixed;
      height: 88px;
      width: 100%;
      border-bottom: 1.1px solid #f4f4f4;
      background-color: #fff;
      align-items: center;

      span {
        flex: 1;
        text-align: center;
        font-size: 22px;
        height: 88px;
        line-height: 88px;
      }
    }

    .debug-list {
      margin-top: 90px;
    }

    .debug-post-single {
      border-bottom: 20px solid #f4f4f4;
      padding: 30px;
      line-height: 38px;
      word-wrap: break-word;
      word-break: normal;
      overflow: hidden;

      div,li {
        border-bottom: 1.1px solid #eee;
        word-wrap: break-word;
        word-break: normal;
        overflow: hidden;
        display: block;
      }

      em {
        color: $themeColor;
        float: left;
        width: 200px;
      }
    }
  }

</style>
