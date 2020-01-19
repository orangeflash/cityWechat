<template>
  <div id="choicelocation">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <section class="choicelocation-header">
      <i class="iconfont icon-dingwei"></i>
      <em class="choicelocation-seatNow">当前站点：{{address}}</em>
    </section>
    <div class="choicelocation-body">
      <ul class="choicelocation-provincial ">
        <li class="choicelocation-provincial-item" :class="{action:!choiceId}" @click="changeProvincial()">全部</li>
        <li class="choicelocation-provincial-item" @click="changeProvincial(item)" v-for="(item,i) in city"
            :class="{action:item.choice}">{{item.name}}
        </li>
      </ul>
      <ul class="choicelocation-citys">
        <ul class="choicelocation-citys-item" v-for="provincial in city"
            v-if="!choiceId || (choiceId && choiceId == provincial.id)">
          <li v-for="region in provincial.son">
            <p>{{ region.name}}</p>
            <ul class="choicelocation-city-detalis">
              <van-button type="default" size="small" v-for="(son , index) in region.son"
                          @click='changeCityHandle(son,region)' :key="index">{{son.name}}
              </van-button>
            </ul>
          </li>
        </ul>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {setGlobalData} from "../../util";
  import Header from "@/components/header";
  export default {
    name: 'choicelocation',
    components: {Header},
    data() {
      return {
        choiceId: null
      }
    },
    computed: {
      ...mapState("home", {
        locationAddress: state => state.locationAddress
      }),
      address() {
        return this.locationAddress.zoneName || this.locationAddress.cityName || '定位中'
      },
      ...mapState("home/geolocation", {
        city: state => state.city
      })
    },
    methods: {
      ...mapActions("home/geolocation", ["getGeolocationAddress"]),
      ...mapActions("home", ["getTabDragLayout", "getPageDragLayout"]),
      ...mapMutations("home", ["CHANGE_LOCATION"]),
      changeCityHandle(region, city) {
        const cityId = city.id;
        const regionId = region.id;
        setGlobalData({
          cityId,
          zoneId: regionId || '',
          zoneName: region.name || region.cityName,
        });
        this.CHANGE_LOCATION({
          zoneName: region.name || region.cityName
        });

        this.getTabDragLayout();
        this.getPageDragLayout();
        this.$popRoute();
      },
      changeProvincial(item) {
        let obj = this;
        if (item) {
          this.city.forEach(v => {
            if (v.choice == null) {
              this.$set(v, 'choice', false);
            }
            v.choice = false;
            if (item.id === v.id) {
              v.choice = true;
              obj.choiceId = item.id;
            }
          });
        } else {
          this.city.forEach(v => {
            v.choice = false;
          })
          obj.choiceId = null;
        }
      }
    },
    async created() {
      await this.getGeolocationAddress();
    },
  }
</script>
<style scoped lang="scss">
  @import '../../assets/theme';
  @import '../../assets/common';

  #choicelocation {
    padding-bottom: 30px;
    position: fixed;
    width: 100%;
    .choicelocation-header {
      background-color: #fff;
      height: 88px;
      line-height: 88px;
      padding: 0px 30px;
      border-bottom: 0.01rem solid #eee;
      .iconfont {
        color: $themeColor;
        font-size: 40px;
      }
      .choicelocation-seatNow {
        font-size: $font-size-lg;
        color: rgb(102, 102, 102);
      }
    }
    .choicelocation-body {
      position: fixed;
      top: 1.8rem;
      bottom: 0;
      width: 100%;
      .choicelocation-provincial {
        float: left;
        width: 2rem;
        height: 100%;
        background: #f4f4f4;
        overflow: auto;
        .choicelocation-provincial-item {
          line-height: 0.88rem;
          color: #666;
          text-align: center;
          font-size: 0.3rem;
          color: #666;
          height: 88px;
          overflow: hidden;
        }
        li.choicelocation-provincial-item.action {
          background: #fff;
          color: $themeColor;
          font-size: 0.32rem;
        }
      }
      .choicelocation-citys {
        margin-left: 2rem;
        background: #fff;
        height: 100%;
        overflow: auto;
        .choicelocation-citys-item {
          color: #666;
          font-size: 0.26rem;
          /*display: flex;*/
          p {
            padding: 0.3rem;
          }
          .choicelocation-city-detalis {
            margin-left: 0.3rem;
          }
          button {
            margin: 0 0.1rem 0.1rem 0;
            font-size: 0.28rem;
            color: #333;

          }
          .van-button--small{
            padding: 0 20px;
            height: 40px;
          }
        }
      }
    }
  }
</style>
