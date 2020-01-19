<template>
  <ul class="housing-deal-collection">
    <scroller
      v-if="collectionList.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite"
    >
      <li class="housing-deal-collection_single"
          v-for="(item,key) in collectionList" :key="key"
      >
        <div class="housing-deal-collection_single_top">
          <Top
            :time="computedDate(item.createdAt)"
            :labelsConfig="labelsConfig(item)"
          ></Top>
        </div>
        <div class="housing-deal-collection_single_center">
          <PictrueTextCard
            type="operation"
            @button="cancelCollection(item,key)"
            :data="item"
            v-if="+item.identifying==3 || +item.identifying==5 || +item.identifying==6"
            @click="goPointPage({path:'/auxiliary/housingDeal/details',query:{id:item.id,isLease:true}})"
          ></PictrueTextCard>
          <ContentOne
            type="operation"
            @button="cancelCollection(item,key)"
            :data="item"
            @click="goPointPage({path:'/auxiliary/housingDeal/details',query:{id:item.id,isLease:false}})"
            v-else
          ></ContentOne>
        </div>
      </li>
    </scroller>
    <not-data v-else></not-data>
  </ul>
</template>

<script>
  import Top from '@/components/template/housing-deal-card/top';
  import PictrueTextCard from '@/components/template/pictrue-text-card/left-picture-right-text';
  import ContentOne from '@/components/template/housing-deal-card/content-one';
  import {mapActions} from 'vuex';
  import {utilMixins} from "@/plugins/util-mixins";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant';

  export default {
    mixins: [utilMixins],
    components: {Top, PictrueTextCard, ContentOne},
    data() {
      return {
        collectionList: [],
        params: {
          page: 1,
          size: 10,
          type: 9
        }
      }
    },
    methods: {
      ...mapActions(['getMyCollection']),
      ...mapActions(['collectionPost']),
      async cancelCollection(item, key) {
        try {
          await showDialog("您确定要取消收藏该信息么？");
          showLoading();
          const result = await this.collectionPost({
            postId: item.id,
            type: 9
          })
          result.status == 2 ? Toast({
            message: '已取消',
            duration: 1500
          }) : Toast.fail({
            message: '取消失败',
            duration: 1500,
          })
          result.status == 2 && this.collectionList.splice(key, 1);
          //hideLoading();
        } catch (e) {
          console.log("原来是误操作啊")
        }

      },
      async onRefresh(done) {

        await this.getData(true);
        done && done(true)
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(bool)
      },
      async getData(refresh) {
        refresh && (this.params.page = 1);
        const result = await this.getMyCollection(this.params);
        this.collectionList = refresh ? result : this.collectionList.concat(result);
        return result.length < this.params.size;
      },
      labelsConfig(item) {
        let type = +item.identifying == 3 ? '房屋出租' : +item.identifying == 4 ? '房屋求租' : +item.identifying == 5 ? '新房出售' : '二手房',
          labels = [];
        labels.push({
          name: item.typeName,
          color: getAuxiliaryConfigColor(item.typeName)
        })
        labels.push({
          name: item.rentType,
          color: getAuxiliaryConfigColor(item.rentType)
        })
        return {
          back: true,
          labels
        }
      },
    },
    created() {
      this.getData(true);
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .housing-deal-collection {
    margin: 30px;
    position: fixed;
    width: calc(100% - 60px);
    height: calc(100% - 90px);

    &_single {
      border-radius: 16px;
      background: #fff;
      overflow: hidden;
      margin-bottom: 16px;

      &_top {
        border-bottom: 1.1px solid #eee;
        padding: 24px 24px 14px;
      }

      &_center {
        padding: 24px;
      }
    }
  }
</style>
