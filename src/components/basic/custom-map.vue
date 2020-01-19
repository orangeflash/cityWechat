<template>
  <div id="CustomMap">
    <div ref="CustomMap" class="c-map"></div>
    <footer class="l-footer">
      <button class="feature-btn" @click="$emit('close')">关闭</button>
      <button class="feature-btn feature-btn--primary" @click="$emit('confirm')">确定</button>
    </footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {defaultLatLng} from "../../project-config/base";

  export default {
    name: "CustomMap",
    props: {
      symbol: Number,
      latLng: {
        type: Object,
        default: () => (defaultLatLng)
      }
    },
    data() {
      return {
        listener: null,
        marker: null,
      }
    },
    methods: {
      mapInit() {
        console.log("map")
        let center = new qq.maps.LatLng(this.myLatLng.latitude, this.myLatLng.longitude);
        const map = new qq.maps.Map(this.$refs.CustomMap, {
          center: center,
          zoom: 13
        });
        //创建marker
        this.marker = new qq.maps.Marker({
          position: center,
          map: map
        });
        //需要释放
        this.listener = qq.maps.event.addListener(
          map,
          'click',
          ({latLng: {lat, lng}}) => {
            this.myLatLng = {
              latitude: lat, longitude: lng
            };
          }
        );
      }
    },
    watch: {
      myLatLng({latitude, longitude}) {
        let center = new qq.maps.LatLng(latitude, longitude);
        this.marker.setPosition(center);
      }
    },
    computed: {
      myLatLng: {
        get() {
          return this.latLng;
        },
        set(val) {
          return this.$emit("update:latLng", val);
        }
      }
    },
    destroyed() {
      //释放事件
      this.listener && qq.maps.event.removeListener(this.listener);
    },
    created() {
      setTimeout(() => {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset="utf-8";
        script.src = "https://map.qq.com/api/js?v=2.exp&key=MRKBZ-7KUH4-EICUJ-X33NW-SCU42-UPBI4&callback=mapInit";
        if (window) {
          document.body.appendChild(script);
          window.mapInit =  () =>{
            this.mapInit(this);
          }
        }
      })
    }
  }
</script>
<style>
  #CustomMap a[title="到腾讯地图查看此区域"] {
    display: none !important;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #CustomMap {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    overflow: hidden;
    padding-bottom: 100px;
    box-sizing: border-box;
    .c-map {
      height: 100%;
      width: 100%;
    }
    .l-footer {
      box-shadow: 0 -2px 6px #ccc;
      @include positionAbsolute(null, 0, 0, 0);
      padding: 20px 0;
      background-color: #fff;
      display: flex;
      @include flex-center;
      .feature-btn {
        border-radius: 6px;
        font-size: 32px;
        border: 1PX solid #ccc;
        background-color: #f4f4f4;
        padding: 20px 80px;
        color: #2d2d2d;
        &:not(:first-child) {
          margin-left: 40px;
        }
        &--primary {
          background-color: #45a8be;
          border-color: #45a8be;
          color: #fff;
        }
      }
    }
  }
</style>
