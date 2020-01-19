<template>

  <!--我的收藏-->

  <div class="activity-collection" style="position: fixed;width: 100%;top:0;bottom: 1rem">

    <scroller
      v-if="collections.length"
      :onRefresh="onRefresh"
      :onInfinite="onInfinite"
    >
      <dd-store-order
        v-bind="item"
        v-for="(item,key) in collections"
        :key="key"
        @click="goPointPage('/auxiliary/activity/details?activityId='+item.activityId)"
        @button="operation"
      >
        <div slot="attr" class="flex-bt flex-y-center col-9 mar-t">
          <span>{{item.typeName}}</span>
          <span>金额：<em class="price col-t">￥{{item.money}}</em></span>
        </div>
      </dd-store-order>

    </scroller>


  </div>

</template>


<script>
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdStoreOrder from '@/components/template/dd-store/order'

  import {Toast} from "vant"
  import {mapActions} from "vuex";
  import {format, showDialog} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder},
    data() {
      return {
        collections: [],
        params: {
          page: 1,
          size: 10,
          type: 11
        }
      }
    },
    methods: {
      ...mapActions(["getMyCollection", "collectionPost"]),
      /** 刷新 */
      async onRefresh(done) {
        this.params.page = 1;
        const bool = await this.getCollection(true);
        done && done(!bool);
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getCollection();
        done && done(!bool);
      },
      async getCollection(refresh) {

        let result = await this.getMyCollection(this.params);
        result = result.map(item => {
          return {
            cover: item.showImgs.length&&this.getSingleImg(item.showImgs[0].url),
            title: item.name,
            num: item.num,
            price: item.money,
            time: format(item.startTime * 1000) + ' ~ ' + format(item.endTime * 1000),
            activityId: item.activityId,
            money: item.currentPrice,
            typeName: item.typeName,
            bts: [
              {name: '取消收藏', type: 'default', field: 'cancel', activityId: item.activityId},
              {name: '去报名', type: 'main', field: 'enroll', activityId: item.activityId},
            ],
          }
        })
        this.collections = refresh ? result : this.collections.concat(result);
        return this.collections.length >= this.params.size;

      },
      async operation(item) {
        switch (item.field) {
          case "enroll":
            this.goPointPage({
              path: '/auxiliary/activity/enroll',
              query: {
                activityId: item.activityId
              }
            })
            break;
          case "cancel":
            try {
              await showDialog("您确定要取消收藏该活动么？")
              const res = await this.collectionPost({
                postId: item.activityId,
                type: 11
              });
              this.collectionState.state = +res.status == 1;
              if (+res.status == 1) {
                Toast({
                  message: '已收藏',
                  duration: 1000
                });

              } else if (+res.status == 2) {
                Toast({
                  message: '已取消',
                  duration: 1000
                })
              } else {
                Toast.fail({
                  message: '操作失败',
                  duration: 1500
                })
              }
            } catch (e) {
              console.log(e);
            }


            break;
        }
      }
    },
    created() {
      this.onRefresh();
    }
  }

</script>
