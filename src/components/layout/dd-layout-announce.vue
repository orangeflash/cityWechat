<template>

  <dd-layout-div class="flex flex-g-1 flex-bt bg-f flex-y-center " :pad="[30]" v-if="list.length > 0">
    <!--<slot name="left"/>-->
    <!--<dd-layout-img   class="bg-tran" :width="0.8" :height="0.8"/>-->
    <img :src="announce" v-if="announce" class="w-80 flex-g-0">
    <dd-layout-div class="flex-g-1 over-h" :mar="mar || [0,30]" :height="80">
      <dd-layout-div ref="layoutAnnounce">
        <dd-layout-div :height="40" class="hide-e fon-sm" :line-height="40" @click="clickHandle(item,key)"
                       v-for="(item,key) in list"
                       :key="key">
          {{item.title}}
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <slot name="right"/>
  </dd-layout-div>

</template>


<script>
  import {mapActions} from 'vuex'
  import DdLayoutImg from "./dd-layout-img";


  import JobHuntIcon from "../../assets/img/job-hunt/announce.png";
  import cityInformation from '../../assets/img/announce/cityInformation.png'
  import freeCar from '../../assets/img/announce/freeCar.png'
  import house from '../../assets/img/announce/house.png'
  import activity from '../../assets/img/announce/activity.png'
  import assemble from '../../assets/img/announce/assemble.png'
  import bargain from '../../assets/img/announce/bargain.png'
  import card from '../../assets/img/announce/card.png'
  import friend from '../../assets/img/announce/friend.png'
  import mall from '../../assets/img/announce/mall.png'
  import yellow from '../../assets/img/announce/yellow.png'
  import dzInformation from '../../assets/img/city-information/info-notice.png'


  export default {
    components: {DdLayoutImg},
    props: {
      autoplay: {
        type: Number,
        default: 3000
      },
      announceList: {
        type: Array,
        default: () => []
      },
      height: {
        type: Number,
        default: 40
      },
      announceType: {
        type: String,
        default: null
      },
      mar: {
        default: null
      }
    },
    data() {
      return {
        list: [],
        timeOut: null,
        index: 0,
        multiple: 100,
        announce: '',
      }
    },
    methods: {
      ...mapActions("home/components", ['getAnnounceList']),
      clickHandle(item, key) {
        if (item.id) {
          let path = '';
          switch (this.announceType) {
            case 'jobHunt':       //求职招聘
              path = `/auxiliary/jobHunt/jobHuntDetails?id=${item.id}`
              break;
            case 'cityInformation': //资讯
              path = `/cityInformation/detail?id=${item.id}`
              break;
            case 'freeCar':     //顺风车
              path = `/auxiliary/freeRide/details?id=${item.id}`
              break;
            case 'activity':    //活动
              path = `/auxiliary/activity/details?activityId=${item.id}`
              break;
            case 'rushBuy':     //抢购
              path = `/auxiliary/rushBuy/rushBuyDetails?id=${item.id}`
              break;
            case 'bargain':     //砍价
              path = `/auxiliary/bargain/details?bargainId=${item.id}`
              break;
            case 'assemble':      //拼团
              path = `/auxiliary/assemble/goodsDetails?assembleId=${item.id}`
              break;
            case 'mall':        //商城
              path = `/auxiliary/mall/details?goodsId=${item.id}`
              break;
            case 'yellow':      //黄页
              path = `/yellowPage/yellowInfo?id=${item.id}`
              break;
            case 'store':
            case 'storePersonal':
              path = `/shopDetail?storeId=${item.id}`
              break;
            case 'classification':
              path = `/postDetail?postId=${item.id}`
              break;
            case 'dzInformation':
              path = `/auxiliary/xx/details?id=${item.id}`
              break;
          }
          path && this.goPointPage(path)
        } else {
          this.goPointPage({name: 'Announcement', params: {list: this.list, index: key}})
        }
      },
      move(dom) {
        if (this.list.length <= 2) return false;
        this.timeOut = setTimeout(() => {
          this.index++;
          dom.style.transitionDuration = `500ms`
          dom.style.transform = `translateY(-${this.index * this.height / this.multiple}rem)`;
          if (this.index == this.list.length - 2) {
            const fristDom = dom.firstChild;
            fristDom.style.transform = `translateY(${this.list.length * this.height / this.multiple}rem)`
          } else if (this.index == this.list.length - 1) {
            const fristDom = dom.firstChild;
            const nextDom = fristDom.nextSibling;
            nextDom.style.transform = `translateY(${(this.list.length) * this.height / this.multiple}rem)`
          }

          if (this.index == this.list.length) {
            setTimeout(() => {
              dom.style.transitionDuration = `0ms`
              dom.style.transform = `translateY(0rem)`;
              const fristDom = dom.firstChild,
                nextDom = fristDom.nextSibling;
              fristDom.style.transform = `translateY(0rem)`;
              nextDom.style.transform = `translateY(0rem)`;
              this.index = 0;
            }, 500)
          }

          this.move(dom);
        }, this.autoplay)
      },
      begin() {
        if (this.$refs.layoutAnnounce) {
          const dom = this.$refs.layoutAnnounce.$el;
          dom.style.transform = `translateY(0rem)`
          dom.style.transitionDuration = `500ms`
          this.move(dom)
        } else {
          window.requestAnimationFrame(this.begin)
        }
      },
      getAnnounce() {

      }
    },
    computed: {
      getParams() {


        switch (this.announceType) {
          case 'cityInformation':   //资讯
            this.announce = cityInformation
            return {
              type: 4,
              adType: 0
            };

          case 'jobHunt':           //求职招聘
            this.announce = JobHuntIcon
            return {
              type: 8,
              adType: 0
            };
          case 'bargain':     //砍价
            this.announce = bargain
            return {
              type: 9,
              adType: 0

            }
          case 'housingDeal':     //房屋租售
            this.announce = house;
            return {
              type: 9,
              adType: 0
            }
          case 'freeCar':     //顺风车
            this.announce = freeCar
            return {
              type: 10,
              adType: 0
            }
          case 'activity':     //活动
            this.announce = activity
            return {
              type: 11,
              adType: 0
            }
          case 'dzInformation':     //信息定制
            this.announce = dzInformation
            return {
              type: 13,
              adType: 0
            }
          case 'assemble':
            this.announce = assemble;
            return {
              type: 0,
              adType: 0
            }
          case 'card':    //名片
            this.announce = card;
            return {
              type: 12,
              adType: 0
            }
          case 'friend':    //交友
            this.announce = friend
            return {
              type: 7,
              adType: 0
            }
          case 'yellow':      //黄页
            this.announce = yellow
            return {
              type: 5,
              adType: 0
            }
          case 'mall':      //商城
            this.announce = mall
            return {
              type: 6,
              adType: 0
            }
          case "home":
            return {
              type: 1,
              adType: 0
            };
          case "classification":
            return {
              type: 2,
              adType: 0
            }
          case 'store':
            return {
              type: 3,
              adType: 1
            }
          case 'storePersonal':
            return {
              type: 3,
              adType: 2
            }
          case 'information':
            return {
              type: 4,
              adType: 0
            }
        }
      }
    },
    created() {
      if (this.announceList.length > 0) {
        this.list = this.announceList
      } else {
        if (this.list.length == 0) {
          this.getAnnounceList(this.getParams).then(result => {
            console.log("getAnnounceList", result)
            this.list = result
            this.begin()
          })

        }
      }
    },
    destroyed() {
      clearTimeout(this.timeOut)
    }
  }


</script>
