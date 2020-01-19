<template>

  <!--收藏-顺风车-->
  <div class="free-ride_collection">
    <ul class="free-ride_collection__list">
      <scroller
        v-if="collectionList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <li class="free-ride_collection__list__single"
            v-for="(item,key) in collectionList"
            :key="key"
            @click="goPointPage({path:'/auxiliary/freeRide/details',query:{id:item.id}})">
          <Top :time="item.rideTime" :over="+item.isGo==1" :labels="item.labels"></Top>
          <div class="free-ride_collection__list__single__info">
            <StartEnd :over="+item.isGo==1" :start="item.startPlace" :end="item.endPlace"></StartEnd>
            <div class="free-ride_collection__list__single__info__operation">
              <div class="free-ride_collection__list__single__info__operation__status" v-if="+item.isGo==1">
                <img :src="end"  alt="">
              </div>
              <span class="operation" @click.stop="cancelCollection(item,key)">取消收藏</span>
            </div>
          </div>
        </li>
      </scroller>
      <not-data v-else></not-data>
    </ul>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Top from '@/components/template/free-ride-card/top'
  import end from '@/assets/img/auxiliary/free-ride/end.png';
  import StartEnd from '@/components/template/start-end'
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {getAuxiliaryConfigColor} from '@/plugins/auxiliary/auxiliary-config'


  export default {
    components: {StartEnd, Top},
    data() {
      return {
        end,
        collectionList: [],
        params: {
          type: 5,
          page: 1,
          size: 10,
        },
      }
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      ...mapActions("personal", ["getCollection"]),

      // key的作用就是在本地进行删除当前的，目的就是为了减少对后台的请求
      async cancelCollection(item, key) {
        try {
          await showDialog("确定要取消吗？");
          showLoading();
          let res = await this.collectPost({
            postId: item.id,
            type: 5,
          });
          if (res.code == 1) {
            res = res.data;
            if (res.status == 2) {
              this.collectionList.splice(key, 1);
              Toast({
                message: '已取消',
                duration: 1000
              })
            } else {
              Toast({
                message: '已收藏',
                duration: 1000
              })
            }
          }else{
            hideLoading();
          }
        } catch (e) {
          console.log('原来是误操作啊！')
        }
      },
      async getCollectionList(refresh) {
        // showLoading();
        const params = this.params,
          result = await this.getCollection({
            ...params,
            userId: this.user.id
          })
        let data = this.labelsChnage(result);
        console.table(data);
        this.collectionList = refresh ? data : this.collectionList.concat(data);
        return data.length < 10;
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getCollectionList(true);
        done && done(true)
      },
      labelsChnage(result){
        result.forEach(v=>{
          v.labels = [];
          if(+v.type == 2){
            v.labels.push({
              name:'长期',
              color:'#FF3838'
            })
          }
          // switch (v.name) {
          //   case '货找车':
          //     label.color= '#FF3838';
          //     break;
          //   case '车找货':
          //     label.color= '#2F8EE2';
          //     break;
          //   case '人找车':
          //     label.color= '#12C8D3';
          //     break;
          //   case '车找人':
          //     label.color= '#7594B6';
          //     break;
          // }
          v.labels.push({
              name:v.name,
            color:getAuxiliaryConfigColor(v.name)
        })
        });
        return result;
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getCollectionList();
        done && done(bool)
      },
      load() {
        this.getCollectionList();
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    created() {
      this.load()
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .free-ride_collection {
    padding-bottom: 120px;

    .free-ride_collection__list {
      margin: 30px;
      position: fixed;

      width: calc(100% - 60px);
      height: calc(100% - 90px);

      &__single {
        background: #fff;
        margin-bottom: 30px;
        border-radius: 12px;

        &__info {
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;

          &__operation {
            width: 280px;
            position: relative;
            z-index: 0;

            &__status {
              width: 168px;
              height: 138px;
              overflow: hidden;
              margin-top: -20px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .operation {
              position: absolute;
              right: 0;
              top: 30px;
              border-radius: 22px;
              border: 1px solid $themeColor;
              color: $themeColor;
              padding: 10px 26px;
              z-index: 0;
            }
          }
        }
      }
    }
  }
</style>
