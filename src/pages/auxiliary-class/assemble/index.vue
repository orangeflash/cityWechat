<template>
  <div clas="assemble">
    <dd-layout-search :config="searchConfig" search-type="11"/>
    <component
      v-for="(com,key) in pageConfig"
      :key="key"
      :is="com.name"
      v-bind="com.value"
      @click="handleMethods"
    />
    <div class="bg-f">
      <ul class="pad-30  flex flex-bt flex-y-center">
        <li class="fon-lg mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            @click="changeTab(key)"
            :class="[params.type - 1 == key&&'fon-xxl fon-wb']">{{item.name}}
        </li>
      </ul>
    </div>
    <dd-layout-div bg="#F4F5F8">
      <assemble :order="order" v-for="(order,key) in goodsList" :key="'o'+key"/>
    </dd-layout-div>


    <not-data v-if="goodsList.length == 0 && isRequest"/>
    <more :status="hasMore"/>
    <!--<DdContainer>-->
    <!--<div slot="container">-->

    <!---->

    <!--<dd-store-order-->
    <!--v-for="(item,key) in goodsList"-->
    <!--:key="key"-->
    <!--:order="item"-->
    <!--class="bg-f mar-b-20 mar-t-10"-->
    <!--@click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.id)"-->
    <!--&gt;-->
    <!--<div slot="cover-mask"-->
    <!--class="posi-a t0 l0 col-f pad-8-10-4 br-br-r-15"-->
    <!--style="background: linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);-->
    <!--box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">{{item.groupNum}}人拼-->
    <!--</div>-->
    <!--<div slot="title" class="order-title-r2">{{item.name}}</div>-->
    <!--<div slot="desc" class="flex mar-t-20 mar-b">-->
    <!--<span class="bg-f8 col-9 br-r-10 pad-14-20-10 mar-r"-->
    <!--v-for="(name,key) in item.lables"-->
    <!--v-if="key<2"-->
    <!--:key="key">{{name}}</span>-->
    <!--</div>-->
    <!--<div slot="down" class="flex-y-center flex-bt">-->
    <!--<div>-->
    <!--<div class="mar-b-10">-->
    <!--<span class="col-t fon-lg mar-r-10">￥{{item.money}}</span>-->
    <!--<em class="col-9 t-d-l"> ￥{{item.originalPrice}} </em>-->
    <!--</div>-->
    <!--<div class="col-9">已拼{{item.salesNum}}件</div>-->
    <!--</div>-->
    <!--<div class="br-r-30 col-f pad-14-20-10"-->
    <!--style="background:linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);-->
    <!--box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">去购买-->
    <!--</div>-->
    <!--</div>-->
    <!--</dd-store-order>-->
    <!--</div>-->
    <!--</DdContainer>-->

  </div>

</template>


<script>
  import Banner from '@/components/home/banner';
  import ButtonGroup from '@/components/template/button-group'  // 按钮组
  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdContainer from '@/components/template/other/container'
  import DdLayoutSearch from '../../../components/layout/dd-layout-search'
  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";

  import Assemble from '../../../components/template/item/assemble'     //全民拼团


  export default {
    mixins: [utilMixins],
    components: {Banner, ButtonGroup, DdTab, DdContainer, DdStoreOrder, DdLayoutSearch, Assemble},
    data() {
      return {
        searchConfig: {
          shape: 3,
        },
        tabConfig: [
          {name: '最新'},
          {name: '精选'},
          {name: '最热'},
        ],
        pageConfig: [
          {
            name: 'banner',    //组件名
            value: {          //参数值
              height: 240,
              swiper: {
                children: []
              }
            }
          },
          {
            name: 'button-group',
            value: {
              parentClass: 'mar-b-20',
              btns: [],
              deliver: true
            }
          }
        ],
        goodsList: [],
        hasMore: true,
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          type: 1
        }
      }
    },
    methods: {
      ...mapActions(['getInformationAdList']),
      ...mapActions("storeAuxiliary/storeAssemble", ["assembleConfig", "getAssembleList", "getGoodsCategory"]),
      changeTab(index = 0) {
        this.params.type = index + 1;
        this.onRefresh();
      },
      /** 处理组件事件 */
      handleMethods(result) {
        switch (result.name) {
          case 'tabs':
            // this.params.sort = this.sort[result.value]
            this.onRefresh();
            break;
          case 'buttonGround':
            let parent = this.pageConfig[1].value.btns
            const obj = parent[result.value.key];

            parent.forEach(item => this.$set(item, 'active', false))

            this.$set(obj, 'active', true);
            this.params.typePid = result.value.id;
            this.params.type = result.value.type;
            this.onRefresh()
            break;

        }
      },
      onRefresh() {
        this.params.page = 1;
        this.getDatas(true);
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getDatas();
      },
      async getDatas(refresh) {

        showLoading();
        let result = await this.getAssembleList(this.params);


        result = result.map(item => {
          return {
            id: item.id,
            cover: {
              src: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
              width: 2.4,
              height: 2.4,
              borderRadius: 0.16
            },
            name: item.title,
            lables: (() => {
              let arr = []
              for (let key in item.label) arr.push(item.label[key]);
              return arr
            })(),
            money: item.groupPrice,
            originalPrice: item.originalPrice,
            salesNum: item.salesNum,
            groupNum: item.groupNum
          }
        })
        this.goodsList = refresh ? result : this.goodsList.concat(result);
        hideLoading();
        this.hasMore = result.length >= this.params.size;
        if (!this.isRequest) this.onscroll(this.onInfinite, this.$route.path);
        this.isRequest = true;

        return this.hasMore
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      })
    },
    created() {
      // 获取广告信息
      this.getInformationAdList({
        type: 14,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.pageConfig[0].value.swiper.children = result.data || [];
          this.pageConfig[0].value.height = this.platform.slideNum;
        }
      })
      this.onRefresh();
      this.getGoodsCategory({term: 15}).then(result => {
        this.pageConfig[1].value.btns = result
      })

      this.assembleConfig().then(result => {
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '拼团';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        });
      })


    }
  }

</script>
