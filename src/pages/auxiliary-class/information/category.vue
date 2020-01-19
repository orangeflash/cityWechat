<template>
  <div class="dd-category">
    <Header/>
    <dd-tree-select
      class="mar-t-100"
      :fixedTop="true"
      @choice="choiceResult"
      :trees="trees"
    ></dd-tree-select>
    <div class="ps-f list">
      <scroller
        class="pad-b-20"
        v-if="dataList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite">
            <div class="base-pad bg-f mar-t" v-for="(v,i) in dataList" :key="i" @click="goPointPage({path:'/auxiliary/xx/details',query:{id:v.id}})">
              <div class="flex-x-bt br-b-e fon-b pad-tb">
                <div class="">
                  <span class="yuan cbred" v-if="v.buyType=='1'">{{stateName(v.buyType)}}</span>
                  <span class="yuan cbblue" v-else>{{stateName(v.buyType)}}</span>
                  <span class="fon-w6">{{v.typeName}}</span>
                </div>
                <div class="fon-sm fon-w6 col-r">￥{{v.price}}元/{{v.unit}}</div>
              </div>
              <div class="col-6 flex w100 fon-sm pad-t-20 pad-b-10 listlh">
                <div class="flex-g-1 w60 hide-e">品牌：{{v.brand}}</div>
                <div class="flex-g-1 w40 hide-e">数量：{{v.number}}{{v.unit}}</div>
              </div>
              <div class="fon-sm col-6 flex w100 pad-tb pad-t-10 pad-b-10 listlh">
                <div class="flex-g-1 w60 hide-e">交货地：{{v.address}}</div>
                <div class="flex-g-1 w40 hide-e">规格：{{v.spec}}</div>
              </div>
              <div class="fon-sm col-9 flex-x-bt pad-t-10">
                <div class="fon-xss">
                  <span class="textbox mar-r-5" :class="{'col-activeb':v.guarantee =='1'}">保</span>
                  <span class="textbox mar-r-5" :class="{'col-activeg':v.isAuth=='1'}">实</span>
                  <!--<span class="textbox mar-r-5">V</span>-->
                </div>
                <div>
                  <span class="col-9 fon-xs mar-l flex-y-center"><i class="iconfont icon-Group- fon-xxl mar-r-10"></i>{{formatDateByTimeStamp(v.createdAt,"YYYY-MM-DD HH:mm")}}</span>
                </div>
              </div>
            </div>
      </scroller>
      <not-data class="pad-t mar-t" v-if="dataList.length == 0 && isRequest"></not-data>
    </div>
  </div>


</template>

<script>
  import DdTreeSelect from '@/components/template/dd-tree-select'
  import {mapActions, mapState} from 'vuex';
  import {format, hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig,getLocation} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {DdTreeSelect},
    data() {
      return {
        trees: [
          {
            title: '区域',
            items: []
          },
          {
            title: '分类',
            items: []
          },
          {
            title: '排序',
            items: [
              {text: '最新', order: 1},
              {text: '最热', order: 2},
              {text: '价格升序', order: 3},
              {text: '离我最近', order: 4},
            ]
          },
        ],
        dataList: [],
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          typeId: null,    //分类Id
          word: null,       //关键字
          order: 1,
          zoneId: ""
        },
      }
    },
    methods: {
      ...mapActions(["getCityList"]),
      ...mapActions("common", [ "getLocationByLatLng"]),
      ...mapActions('Xx',['getXxConfig','getXxtype','XxList']),
      choiceResult(item) {
        item.order && (this.params.order = item.order);
        if(item.order=='4'){
          this.params.lat=this.lat
          this.params.lng=this.lng
        }
        (item.zoneId || item.zoneId == "") && (this.params.zoneId = item.zoneId);
        (item.typeId || item.zoneId == "") && (this.params.typeId = item.typeId);
        this.onRefresh();
      },
      stateName(buyType) {
        let s
        switch (buyType) {
          case '1':
            s = '买'
            break
          case '2':
            s = '卖'
            break
        }
        return s
      },
      /** 获取信息列表 */
      async getXxList(refresh) {
        showLoading();
        let result = await this.XxList(this.params);
        this.isRequest = true;
        /** 由于组件的字段已经规划好，所以在拿取数据的时候进行重新定义 */
        result = result.map(item => {
          return {
            buyType: item.buyType,
            typeName: item.typeName,
            address: item.address,
            brand: item.brand,
            createdAt: item.createdAt,
            isAuth: item.isAuth,
            number: item.number,
            price: item.price,
            spec: item.spec,
            unit: item.unit,
            id: item.id,
          }
        })
        this.dataList = refresh ? result : this.dataList.concat(result);
        hideLoading();
        return result.length >= this.params.size;
      },
      /** 刷新列表 */
      async onRefresh(done) {
        this.params.page = 1;
        await this.getXxList(true);
        done && done();
      },
      /** 加载更多 */ async onInfinite(done) {
        this.params.page++;
        const bool = await this.getXxList();
        done && done(!bool);
      },
      /** 获取树信息列表 */
      getTreeList() {
        this.getCityList().then(({city, zone}) => {
            const result = [{
              text: city.cityName,
              zoneId: "",
            }].concat(zone.map(item => {
              return {
                text: item.name,
                zoneId: item.id
              }
            }))
            this.$set(this.trees[0], 'items', result);
          }
        )
        this.getXxtype().then(result => {
          console.log("getXxtype", result);
          result = [{
            text: '全部',
            typeId: "",
          }].concat(result.map(item => {
            if (+item.id == +this.params.typeId) {
              this.$set(this.trees[1], 'title', item.name);
            }
            return {
              text: item.name,
              typeId: item.id
            }
          }))
          this.$set(this.trees[1], 'items', result);

        })
      },
      /** 定位 */
      async initLocation() {
        try {
          showLoading("定位中", "提示", false);
          const {latitude, longitude} = await getLocation();
          this.latLng = {
            latitude,
            longitude
          };
          this.address = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address;
          this.lat = this.latLng.latitude
          this.lng = this.latLng.longitude
          hideLoading();
        } catch (e) {
          console.log(
            "%c 是不是没有配置白名单的原因啊？？？",
            "color:blue;font-size:18px"
          );
          Toast("定位失败");
        }
      },
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.typeId,
        tips: "缺少类型Id",
        success() {
          this.params.typeId = query.typeId;
          this.getTreeList();
          this.onRefresh();
        }
      }),
        window.wxReady(() => {
          this.initLocation();
        });
    }
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .list {
    height: calc(100% - 200px);
    top: 200px;
  }
  .yuan{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
  }
  .cbred{
    color: #f00;
    border:1.1px solid #f00;
  }
  .cbblue{
    color: #1C9BFC;
    border:1.1px solid #1C9BFC;
  }
  .textbox{
    border-radius: 5px;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border:1.1px solid #999;
  }
  .col-activeg{
    color: #6EB7BE;
    border:1.1px solid #6EB7BE;
  }
  .col-activeb{
    color: #4DBFC6;
    border:1.1px solid #4DBFC6;
  }
  .w60{width:50%}
  .w40{width:50%}
  .listlh{
    height: 28px;
    line-height: 28px;
  }
</style>
