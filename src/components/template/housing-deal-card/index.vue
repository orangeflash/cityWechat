<template>

  <div class="dd-housing-deal-card"
       @click="goPointPage({path:'/auxiliary/housingDeal/details',query:{id:item.id,isLease:+item.identifying==3 || +item.identifying==5 || +item.identifying==6}})">
    <div class="dd-housing-deal-card_top">
      <Top
        :time="computedDate(item.createdAt)"
        :labelsConfig="labelsConfig"
      ></Top>
    </div>
    <div class="dd-housing-deal-card_info">
      <StatusStamp :data="item"></StatusStamp>
      <PictrueTextCard
        v-if="+item.identifying==3 || +item.identifying==5 || +item.identifying==6"
        :data="item"
      ></PictrueTextCard>
      <ContentOne
        v-else-if="+item.identifying==4"
        :data="item"></ContentOne>

    </div>
    <div class="dd-housing-deal-card_label">
      <Labels v-bind="tagConfig"></Labels>
    </div>
  </div>

</template>

<script>
  import Top from './top';
  import ContentOne from './content-one';
  import PictrueTextCard from '../pictrue-text-card/left-picture-right-text';
  import Labels from '../labels'
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {utilMixins} from "@/plugins/util-mixins";
  import StatusStamp from "@/components/template/status-stamp";

  export default {
    mixins: [utilMixins],
    components: {Top, PictrueTextCard, Labels, ContentOne, StatusStamp},
    props: ['item', 'type'],
    data() {
      return {
        labelsConfig: {
          back: true,
          labels: []
        },
        tagConfig: {
          labels: []
        }
      }
    },
    methods: {
      getLabels(item) {
        this.labelsConfig.labels.push({
          name: item.name,
          color: getAuxiliaryConfigColor(item.name)
        })
        this.labelsConfig.labels.push({
          name: item.rentType,
          color: getAuxiliaryConfigColor(item.rentType || item.saleType)
        });

        console.log("this.labelsConfig.labels")
        return this.labelsConfig
      },
      getTag(item) {
        this.tagConfig.labels = [];
        // item.data && item.data.forEach(v => {
        //   this.tagConfig.labels.push({
        //     name: v,
        //     color: getAuxiliaryConfigColor(v)
        //   })
        // })
        item.label && item.label.forEach(v => {
          this.tagConfig.labels.push({
            name: v,
            color: getAuxiliaryConfigColor(v)
          })
        })
        return this.tagConfig;
      }
    },
    created() {
      console.log(this.item)
      this.getLabels(this.item);
      this.getTag(this.item)
    }
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-housing-deal-card {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 16px;

    &_top {
      padding: 24px 24px 16px;
      border-bottom: 1.1px solid #eee;
    }

    &_info {
      padding: 24px;
      position: relative;
      z-index: 0;
    }

    &_label {
      padding: 10px 24px 20px;
    }
  }

</style>
