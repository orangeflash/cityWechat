<template>

  <div>
    <div class="posi-f w100">
      <Header/>
      <!--<dd-tab :tabs="tabs" @click="tabsMethod"/>-->
    </div>
    <div class="posi-f w100" style="height: calc(100% - 51px);margin-top: 51px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="dataList.length"
      >
        <div v-for="(v,i) in dataList" :key="i" class="mar-t">
          <basic-note-item
            :hideExpansionBar="true"
            :hidecomment="true"
            :showredmoney="true"
            @refresh="onRefresh"
            :postData="v"
          ></basic-note-item>
        </div>
      </scroller>
      <not-data v-else/>
    </div>
  </div>


</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {mapActions, mapState} from 'vuex'
  import {format, showDialog, timeStampToHMS} from "../../../util";
  import {getOperation} from "@/plugins/common/index";
  import Operation from "@/components/template/operation";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdTab, BasicNoteItem},
    data() {
      return {
        tabs: [{title: '全部'},
          {title: '进行中'},
        ],
        dataList: [],
        params: {
          page: 1,
          size: 10,
        }
      }
    },
    methods: {
      ...mapActions("yS", ["rewardWdys"]),
      tabsMethod(v) {
        console.log(v)
        this.onRefresh();
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
        let result = await this.rewardWdys(this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.params.size;
      }
    },
    computed: {},
    created() {
      this.onRefresh();
    }
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";
</style>
