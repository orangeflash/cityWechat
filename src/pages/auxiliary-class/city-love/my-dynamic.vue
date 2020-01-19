<template>

  <dd-layout-div height="100vh" class="flex flex-col" bg="#fff">

    <Header/>
    <div>
      <ul class="pad-30  br-b-EFF3F6 flex flex-bt flex-y-center">
        <li class="fon-lg mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            @click="changeTab(key)"
            :class="[params.type - 1 == key&&'fon-xxl fon-wb']">{{item.name}}
        </li>
      </ul>
    </div>
    <div class="flex-g-1 posi-r w100 posi-r">

      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length > 0"
      >

        <city-love-notice :list="list" :operation="true" @operation="operationHandle"/>
      </scroller>
      <not-data v-else-if="isRequest"/>


    </div>

  </dd-layout-div>


</template>


<script>

  import {mapActions} from 'vuex'
  import CityLoveNotice from "../../../components/template/item/city-love-notice";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {computedDate, showDialog, showHandleStatusByFlag} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {CityLoveNotice},
    data() {
      return {
        tabConfig: [
          {name: '显示中',},
          {name: '待审核',},
          {name: '已拒绝',},
        ],
        params: {
          page: 1,
          size: 10,
          type: 0
        },
        hasMore: true,
        isRequest: false,
        list: [],
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveGetMyreleaseDynamic", 'cityLoveDynamicChangeStatus', 'cityLoveDeleteDynamic']),
      async operationHandle(item, key) {

        console.log("item", item)

        return this.$root.$children[0].openPicker({
          actions: [
            {name: item.display == 1 ? '设置为私密' : '公开', type: 'display'},
            {name: '删除', type: 'delete'}
          ]
        }, async (e) => {
          console.log(e)

          switch (e.type) {
            case 'display':
              const res = await this.cityLoveDynamicChangeStatus({
                id: item.id,
                display: item.display == 1 ? 2 : 1
              })
              showHandleStatusByFlag(res.code, '更改成功', res.msg, (bool) => {
                if (bool) {
                  const solo = this.list[key];
                  solo.display = item.display == 1 ? 2 : 1;
                }
              })
              return;
            case 'delete':
              try {
                await showDialog("确定要删除该动态吗？");

                const res = await this.cityLoveDeleteDynamic({
                  id: item.id
                });

                showHandleStatusByFlag(res.code, '已删除', res.msg, (bool) => {
                  if (bool) {
                    this.list.splice(key, 1)
                  }
                })
              } catch (e) {
                console.log(e)
              }

              return
          }

        }, true);


      },
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
        if (!this.hasMore) return done && done(true)
        this.params.page++;
        const bool = await this.getDataList()
        done && done(!bool)
      },
      async getDataList(refresh) {


        let result = await this.cityLoveGetMyreleaseDynamic(this.params);
        result = result.map(item => {
          return {
            ...item,
            face: this.getSingleImg(item.icon),
            nickname: item.name,
            age: item.birthday,
            city: item.address,
            love: item.love,
            loveNum: item.loveNum || 0,
            share: item.share || 0,
            browse: item.viewNum || 0,
            sex: +item.sex,
            photos: item.media ? item.media.map(item => {
              return this.getSingleImg(item.url);
            }) : [],
            time: computedDate(item.createdAt),
            state: +item.state == 1 ? '待审核' : +item.state == 3 ? '已拒绝' : '',
            display: +item.display
          }
        });

        this.list = refresh ? result : this.list.concat(result);

        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        return this.hasMore
      }
    },
    created() {
      this.changeTab()
    }
  }

</script>
