<template>

  <div class="pad-30 bg-f flex-y-center">
    <slot name="left"/>
    <div class="mar-r" @click="handle">
      <div class="dh miw-88 w-88 bg-f9 over-h" v-if="config.txtOrImg == 1">
        <img-wrapper :src="config.icon[0].url"/>
      </div>
      <div class="dh miw-88 w-88 fon-xl lineH-40 let-space-5 flex-center" v-else-if="config.txtOrImg == 0">
        <span class="pad-l-5 fon-wb" :style="{color:config.notice.color}">{{config.notice.title}}</span>
      </div>
    </div>
    <div class="flex-g-1 flex dh w100 pad-t-10 pad-b-10 br-r-20 flex-y-center"
         :class="!hiddenBoxSha&&'box-sha'">
      <!--<van-swipe class="dh w100" v-if="list.length > 0" :autoplay="3000" :show-indicators="false" vertical>-->
      <!--<van-swipe-item-->
      <!--class="dh-88 w100 flex-y-center"-->
      <!--v-for="(item,key) in list"-->
      <!--:key="key"-->
      <!--@click="goPointPage({name:'Announcement',params:{list,index:key}})"-->
      <!--&gt;-->
      <!--<div class="w100 pad-t-10">-->
      <!--<div class="fon-wb mar-b-5 fon-b w100 hide-e dh-40 lineH-40">{{item.title}}</div>-->
      <!--<div class="col-9 dh-34 lineH-34 w100 hide-e" v-if="item.content && item.content != 'undefined'">{{item.content}}</div>-->
      <!--</div>-->
      <!--</van-swipe-item>-->
      <!--</van-swipe>-->
      <dd-layout-announce v-if="show" style="margin: 0;padding: 0;" :announce-type="pagePath"
                          :mar="config.icon?[0,20]:[0]"/>
    </div>
    <slot name="right"/>
  </div>


</template>


<script>

  import {mapActions} from 'vuex'
  import _ from 'lodash'
  import {getEntryPath} from "../../plugins/get-entry-path";
  import DdLayoutAnnounce from "./dd-layout-announce";

  export default {
    components: {DdLayoutAnnounce},
    props: {
      config: {
        type: Object,
        default: Object
      },
      hiddenBoxSha: {
        type: Boolean,
        default: false,
      },
      pagePath: {
        type: String,
        default: 'home'
      }
    },
    data() {
      return {
        list: [{
          title: '暂无公告',
          content: '敬请期待...'
        }],
        show: false
      }
    },
    methods: {
      ...mapActions("home/components", ["getBasicStatistics", 'getAnnounceList', 'getBusinessList']),
      handle() {
        if (this.config.link) {
          this.goPointPage(getEntryPath(this.config.link))
        }
      },

    },
    computed: {
      dataList() {
        return _.map(this.list, ({content, title}) => title) || []
      },
      getParams() {
        switch (this.pagePath) {
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
          case 'information':
            return {
              type: 4,
              adType: 0
            }
        }
      }
    },
    watch: {
      config: {
        handler(newVal) {
          this.show = false
          setTimeout(() => {
            this.show = true
          }, 1)
        },
        immediate: true,
      }
    },
    created() {
    }
  }

</script>
