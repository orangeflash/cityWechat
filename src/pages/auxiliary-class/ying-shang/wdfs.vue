<template>

  <div>
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 95px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="dataList.length"
      >
        <div v-for="(v,i) in dataList" :key="i" class="base-pad bg-f flex-y-center mar-t">
          <dd-layout-img class="flex-g-0 mar-r" :src="v.portrait" :width="0.85" :height="0.85"
                         :fillet="0.85"></dd-layout-img>
          <div class="flex-g-1">
            <div class="flex-x-bt pad-tb">
              <div>{{v.userName}}</div>
              <div v-if="active==1">{{stateName(v.state)}}</div>
            </div>
            <div class="flex-x-bt pad-tb">
              <div class="fon-lg">UID:{{v.userId}}</div>
              <div class="fon-sm col-9">{{formatDateByTimeStamp(v.createdAt,"YYYY-MM-DD HH:mm")}}</div>
            </div>
          </div>
        </div>
      </scroller>
      <not-data v-else/>
    </div>
  </div>


</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import {mapActions, mapState} from 'vuex'
  import {format, showDialog, timeStampToHMS} from "../../../util";
  import {getOperation} from "@/plugins/common/index";
  import Operation from "@/components/template/operation";
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutImg, DdTab, DdStoreOrder, Operation},
    data() {
      return {
        tabs: [{title: '已应赏'},
          {title: '待应赏'},
        ],
        active: 1,
        dataList: [],
        params: {
          page: 1,
          size: 10,
          type: 1,
        }
      }
    },
    methods: {
      ...mapActions("yS", ["rewardWdfs"]),
      stateName(state) {
        let s
        switch (+state) {
          case 1:
            s = '待确认'
            break
          case 2:
          case 3:
            s = '应赏成功'
            break
          case 4:
            s = '应赏失败'
            break
        }
        return s
      },
      tabsMethod(v) {
        this.params.type = (() => {
          this.active = v.value + 1
          return v.value + 1
        })();
        this.onRefresh();
        console.log(v)
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh) {
        let result = await this.rewardWdfs(this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.params.size;
      }
    },
    computed: {
    },
    created() {
      this.onRefresh();
    }
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";
</style>
