<template>

  <div class=" bg-f" v-if="infos.length" :style="{marginTop:`${topMargin}px`,marginBottom:`${isBottom}px`}">
    <div class="dh flex-y-center flex-bt pad-lr br-b-d">
      <div class="fon-lg flex flex-y-center ">
        <i class="iconfont icon-zixun col-t fon-40 mar-t-10 mar-r"></i>
        {{infoTitle}}
      </div>
      <div class="fon-lg col-6" @click="goPointPage('/cityInformation')">全部<i class="iconfont icon-youjiantou2"></i>
      </div>
    </div>
    <div>
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in infos" :key="index" v-if="item">
          <div class="h-200 pad-lr pad-t flex-bt"
               @click="goPointPage({path:'/cityInformation/detail',query:{id:item.id}})">
            <div class="flex-g-1 mar-r dh">
              <div class="order-title-r2 fon-lg-i dh-100">{{item.title}}</div>
              <div class="col-9 mar-t fon-b">{{item.name}}<span class="mar-l"><i
                class="iconfont icon-yanjing3 mar-r-10"></i>{{item.view}}看过</span>
              </div>
            </div>
            <div class="bg-e-i miw-200 w-200 dh-160 over-h">
              <img-wrapper :src="item.cover"/>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>

</template>

<script>

  import {mapActions} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    props: {
      infoTitle: {
        type: String,
        default: '同城资讯'
      },
      topMargin: {
        type: Number,
        default: 0
      },
      isBottom: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        infos: []
      }
    },
    methods: {
      ...mapActions("cityInformation", ['getCityInfoList']),
    },
    async created() {
      let zoneId = JSON.parse(localStorage.getItem("GlobalData")).cityId ? JSON.parse(localStorage.getItem("GlobalData")).cityId : 258;

      this.getCityInfoList({
        page: 1,
        size: 10,
        zoneId
      }).then(result => {
        this.infos = result.map(item => {
          let media = JSON.parse(item.media);
          console.log("media", media)

          if (media[0].url) {
            return {
              title: item.title,
              name: item.customUser || '神秘人',
              view: item.browseNum,
              cover: this.getSingleImg(media[0].url),
              love: item.loveNum,
              id: item.id
            }
          } else {
            return null
          }
        });
      })
    }
  }


</script>
