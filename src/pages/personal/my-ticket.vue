<template>
  <div id="myTicket">
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
    name: "myTicket",
    components: {EmptyView,Header},
    data() {
      return {
        active: 0,
        tabArr: [{
          name: '全部',
          id: '0',
        }, {
          name: '未使用',
          id: '1',
        },
          {
            name: '已使用',
            id: '2',
          },
          {
            name: '已过期',
            id: '3',
          },
        ],
      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #myTicket {
    .c-content {
      margin-top: 20px;
    }
  }
</style>
