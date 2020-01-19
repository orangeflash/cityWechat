<template>

  <div class="" v-if="getStores.length > 0">
    <div class="flex-bt dh flex-y-center br-b-F0 mar-lr">
      <div class="fon-wb col-2 fon-xxl">TA的店铺</div>
      <div class="col-9" @click="goPointPage({path:'/shopDetail',query:{storeId:getStores[0].id}})">进入TA的店铺<i
        class="iconfont icon-youjiantou2"></i></div>
    </div>
    <div>


      <business
        :business="store"
        v-for="(store,key) in getStores" :key="key"
      />


      <!--<div class="pad-30 bg-f"-->
           <!--@click="goPointPage({path:'/shopDetail',query:{storeId:store.id}})"-->
           <!--v-for="(store,key) in getStores" :key="key">-->
        <!--<div class="flex-bt flex-y-center">-->
          <!--<dd-layout-img @click="goPointPage({path:'/shopDetail',query:{storeId:store.id}})" :src="store.logo"-->
                         <!--:width="1.66" :height="1.66" :fillet="0.16" class="br-r-30 mar-r-25"/>-->
          <!--<div class="flex-g-1">-->
            <!--<div class="fon-wb fon-xl">-->
              <!--<span class="mar-r">{{store.name}}</span>-->
              <!--<img :src="renzheng" class="w-100 mar-r-10" v-if="store.isAuth == 1">-->
            <!--</div>-->
            <!--<div class="fon-b mar-t-20 mar-b-10">营业时间 | {{store.startTime}}-{{store.endTime}}</div>-->
            <!--<div class="dh-44 flex-y-center mar-t-20">-->
              <!--<div v-if="store.tag.length > 0">-->
                <!--<span v-for="(item,i) in store.tag"-->
                      <!--:key="i"-->
                      <!--v-if="item"-->
                      <!--class="bg-FFECF2 col-FF0E3B pad-8-10-4 br-r-4">{{item}}</span>-->
              <!--</div>-->

            <!--</div>-->
          <!--</div>-->
          <!--<div class="flex-center">-->
            <!--<i class="iconfont icon-youjiantou2 col-bb"></i>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="dh flex-y-center col-9">-->
          <!--<i class="iconfont icon-dingwei1 mar-r"></i>{{store.address}}-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>

</template>


<script>

  import DdLayoutImg from "./dd-layout-img";
  import {utilMixins} from "../../plugins/util-mixins";

  import renzheng from '../../assets/img/attest/renzheng.png'
  import Business from "../../components/template/item/business";
  import {computedDate} from "../../util";

  export default {
    mixins: [utilMixins],
    components: {Business, DdLayoutImg},
    props: {
      stores: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        renzheng
      }
    },
    computed: {
      getStores() {
        return this.stores.map(item => {

          return {
            logo: this.getSingleImg(JSON.parse(item.storeLogo)[0].url),
            name: item.storeName,
            viewNum: item.viewNum,
            startTime: item.businessStartTime,
            endTime: item.businessEndTime,
            tag: item.storeLabel,
            address: item.address,
            id: item.id,
            list: item.list || {},
            isAuth: +item.isAuth,
            typeName: item.typeName,
            newName: item.newName,
            distance: item.distance,
            enterTime: computedDate(item.enterTime)
          }



          //
          // console.log("item.storeLogo", item.storeLogo)
          //
          // let logo = item.storeLogo ? this.getSingleImg(JSON.parse(item.storeLogo)[0].url) : '';
          //
          // return {
          //   logo,
          //   name: item.storeName,
          //   isAuth: +item.isAuth,
          //   startTime: item.businessStartTime,
          //   endTime: item.businessEndTime,
          //   tag: item.storeLabel,
          //   id: item.id,
          //   address: item.address
          // }
        })
      }
    }
  }

</script>
