<template>
  <div id="MyOrder">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <van-tabs :color="$themeColor" v-model="active">
      <van-tab :title="item.name" v-for="(item,key) in tabArr" :key="key">
        <section class="c-content">
          <empty-view></empty-view>
        </section>
      </van-tab>
    </van-tabs>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import EmptyView from "../../components/basic/empty-view";
  import Header from "@/components/header";
  export default {
    name: "MyOrder",
    components: {EmptyView,Header},
    data() {
      return {
        active: 0,
        tabArr: [{
          name: '全部',
          id: '0',
        },
          {
            name: '待付款',
            id: '1',
          },
          {
            name: '待发货',
            id: '2',
          },
          {
            name: '待收货',
            id: '3',
          },
          {
            name: '已完成',
            id: '4',
          },
          {
            name: '售后/退款',
            id: '5',
          }
        ]
      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #MyOrder {
    .c-content {
      margin-top: 20px;
    }
  }
</style>
