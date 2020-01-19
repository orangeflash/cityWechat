<template>

  <dd-layout-div height="100vh" class="bg-f flex flex-col">
    <Header/>
    <div>
      <ul class="pad-30  br-b-EFF3F6 flex flex-bt flex-y-center">
        <li class="fon-lg t-c flex-g-1 mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            :class="key == params.type - 1 &&'fon-xxl fon-wb'" @click="changeTab(key)">{{item.name}}
        </li>
      </ul>
    </div>


    <div class="flex-g-1 posi-r w100 posi-r">

      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length > 0"
      >
        <city-love-cell :list="list" type="browse" button="查看资料"

                        buttonColor="linear-gradient(-90deg,rgba(0,191,255,1) 0%,rgba(57,255,243,1) 100%)"/>

      </scroller>
      <not-data v-else/>

    </div>

  </dd-layout-div>


</template>

<script>

  import {mapActions} from 'vuex'
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {computedDate, format} from "../../../util";
  import CityLoveCell from "../../../components/template/item/city-love-cell";

  export default {
    mixins: [utilMixins],
    components: {CityLoveCell, DdLayoutImg},
    data() {
      return {
        tabConfig: [
          {name: '谁看过我'},
          {name: '我看过谁'},
        ],
        params: {
          page: 1,
          size: 10,
          type: 1
        },
        list: [],
      }
    },
    methods: {
      ...mapActions("cityLove", ['cityLoveTelOrder']),
      changeTab(index = 0) {
        this.params.type = index + 1;
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getDataList(true)

        done && done(true)
      },
      async onInfinite(done) {
        if (!this.hasMore) return done && done(false)
        this.params.page++;
        const bool = await this.getDataList()
        done && done(bool)
      },
      async getDataList(refresh) {

        let result = await this.cityLoveTelOrder(this.params);


        result = result.map(item => {
          return {
            id: item.id,
            face: this.getSingleImg(item.icon),
            nickname: item.name,
            sex: +item.sex,
            age: item.birthday,
            // city: item.city.split("-")[1],
            userId: item.userId,
            time: computedDate(item.createdAt),
            friendId: item.friendId
          }
        })


        this.list = refresh ? result : this.list.concat(result)

        this.hasMore = result.length >= this.params.size

        return this.hasMore

      }
    },
    created() {
      this.changeTab()
    }
  }

</script>
