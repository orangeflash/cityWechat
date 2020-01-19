<template>
  <div v-show="showMap" class="iframe">
    <van-popup v-model="showMap" position="bottom" :overlay="false" :lazy-render="false">
      <iframe id="mapPage" ref="mapIframe" :src="getMapSrc" width="100%" height="90%" frameborder=0>
      </iframe>
      <div class="footbtn">
        <div @click="$emit('hide')">取消</div>
        <div @click="confirmLocation">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import {showDialog} from "../../../util";

  export default {
    name: "DdMap",
    props: ['showMap'],
    data() {
      return {
        show: false,
        chooselocation: '',
      }
    },
    methods: {
      async confirmLocation() {
        const loc = this.chooselocation;
        if (!loc) return showDialog('请选择位置', '提示')
        // await showDialog(JSON.stringify(loc),'位置信息')
        // this.$parent.chooseDdMapLocation = loc
        this.$parent.showmap = false;
        this.$emit('confirm', loc)


      },
    },
    computed: {
      getMapSrc() {
        return "https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=" + this.platform.mapKey + "&referer=myapp"
      }
      // show: function () {
      //   // `this` 指向 vm 实例
      //   return this.showMap
      // }
      // value: {
      //   get() {
      //     return this.checked;
      //   },
      //   set(newVal) {
      //     this.$emit("update:checked", newVal)
      //   }
      // }
    },
    created() {
      const that = this;
      (function () {
        // var iframe = document.getElementById('mapPage').contentWindow;
        // document.getElementById('mapPage').onload = function(){
        //   iframe.postMessage('hello','https://apis.map.qq.com/tools/locpicker');
        // };
        // document.getElementById('mapPage').src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=EOJBZ-HSBW6-G2VSM-EE3KV-4OAAK-RXFWT&referer=myapp"
        window.addEventListener('message', function (event) {

          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data;
          if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'

            that.chooselocation = loc;
            // showDialog(JSON.stringify(loc),'位置信息')
          }
        }, false);
      }())

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .iframe {
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100%;
    height: 100%;

    .van-popup {
      height: 100%;
    }

    .footbtn {
      border-top: 1.1px solid #e5e5e5;
      @include widhei;
      height: 10%;
      box-sizing: border-box;
      padding: 0 30px;
      @include flex-center($justify: space-around);

      div {
        width: 40%;
        font-size: $font-size-lg;
        @include flex-center;
        height: 60%;
        border-radius: 20px;
        border: 1.1px solid #d5d5d5;
        color: #666;
      }

      div:nth-child(2) {
        background: $themeColor;
        color: #fff;
        border: 1.1px solid #fff;
      }
    }
  }
</style>
