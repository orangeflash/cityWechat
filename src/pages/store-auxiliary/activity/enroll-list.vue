<template>

  <div class="enroll-list-details">
    <Header/>
    <div class="enroll-list">
      <scroller
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
        v-if="enrollList.length > 0"
      >
        <div class="dd-card-two flex pad-30 mar-r mar-l"
             @click.stop="$emit('click')"
             v-for="(item,key) in enrollList"
             style="min-height: 1.5rem"
        >
          <face
            :src="item.portrait"
            size="40"
          ></face>
          <div class="dd-card-two_info mar-r mar-l">
            <h3 class="fon-lg">{{item.userName}}</h3>
            <p class="col-9" v-for="(info,i) in item.enroll" :key="i">联系人{{info.name}}：{{info.value}}</p>
            <p class="col-9">
              <span>报名人数：<em class="col-t">{{item.num}}</em>人</span>
              <span>支付金额：<em class="col-t">￥{{(+item.money).toFixed(2)}}</em></span>
            </p>
          </div>
          <div class="dd-card-two_operation flex">
            <i></i>
            <i class="iconfont icon-comments col-t fon-50"  @click="goPointPage({path:'/conversation',query:{tId:item.userId}})"></i>
            <!--<i class="iconfont icon-dianhua1 col-t fon-45"  @click="callTel(info.value)"></i>-->
          </div>
        </div>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>

</template>


<script>

  import Card from '../../../components/template/card/two'
  import Face from '@/components/template/face'
  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";

  export default {
    components: {Card, Face},
    data() {
      return {
        isRequest:false,
        params: {
          activityId: null,
          page: 1,
          size: 10,
        },
        enrollList: []

      }
    },
    methods: {
      ...mapActions("activity", ["getActivityEnrollList"]),
      async onRefresh(done) {
        this.params.page = 1;
        const bool = await this.getEnrollList(true);
        done && done(bool);
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getEnrollList();
        done && done(!bool);
      },
      async getEnrollList(refresh) {
        showLoading();

        const result = await this.getActivityEnrollList(this.params);
        this.isRequest= true;



        this.enrollList = refresh ? result : this.enrollList.concat(result);
        hideLoading()
        return result.length >= this.params.size;
      }
    },
    computed: {},
    created() {

      const query = this.$route.query;


      this.isFailParams({
        field: query.activityId,
        tips: '缺少活动id',
        success() {
          this.params.activityId = query.activityId;
          this.onRefresh()
        }
      });


    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .enroll-list {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 130px;
  }

  .dd-card-two {
    box-shadow: 0px 0px 8px 0px rgba(221, 221, 221, 0.68);
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 20px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;

    icon-shanchu2 {
      color: cornflowerblue;
    }

    &_del {
      width: 60px;
      height: 150px;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      padding: 8px;
    }

    &_info {
      line-height: 40px;
      width: 70%;
    }

    &_operation {
      width: 60px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
    }
  }
</style>
