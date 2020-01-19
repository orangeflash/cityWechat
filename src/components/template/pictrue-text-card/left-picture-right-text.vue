<template>
  <!--左图右文-->

  <div class="left-pic-right-txt" @click="$emit('click')">
    <div class="left-pic-right-txt_cover">
      <img-wrapper
        :src="getSingleImg(data.imgs)"></img-wrapper>
    </div>
    <div class="left-pic-right-txt_info">
      <h4>{{data.title}}</h4>
      <p>{{data.apartment&&data.apartment +" &nbsp;| &nbsp;"+ data.measure+"㎡&nbsp; | &nbsp;"+ (data.deposit ||
        data.communityName || '')}}</p>
      <div v-if="type" class="left-pic-right-txt_info_operation">
        <span><em class="col-t fon-xl">{{data.rent}} </em > <span v-if="!isNaN(data.rent)&&data.rent">{{+data.identifying == 6?'万': +data.identifying == 5?'THB/平':'THB/月'}}</span></span>
        <DdButton :type="type" :name="buttonName" @click="$emit('button')"></DdButton>
      </div>
      <div
        v-else
        class="left-pic-right-txt_info_other">
        <div>
          <i class="iconfont icon-dizhi2"></i>{{data.area}}
        </div>
        <div class="price"><em>{{data.rent}}</em>
          <span v-if="!isNaN(data.rent)&&data.rent">{{+data.identifying == 6?'万': +data.identifying == 5?'THB/平':'THB/月'}}</span></div>
      </div>
    </div>
  </div>

</template>

<script>

  import DdButton from "@/components/template/button"
  import {utilMixins, computedDate} from "@/plugins/util-mixins";


  export default {
    props: ['type', 'buttonName', 'data'],
    components: {DdButton},
    data() {
      return {}
    },
    mixins: [utilMixins],
    created() {
      if (this.data && this.data.apartment && this.data.deposit) {
        const apartment = this.data.apartment.split("-");
        this.data.apartment = apartment[0] + "室" + apartment[1] + "厅";
      }
    },
  }


</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .left-pic-right-txt {
    display: flex;

    &_cover {
      width: 190px;
      height: 136px;
      overflow: hidden;
      border-radius: 8px;
      margin-right: 24px;
    }

    &_info {
      width: calc(100% - 214px);

      h4 {
        font-size: 30px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        height: 32px;
        line-height: 36px;
      }

      p {
        margin: 20px 0 25px;
        color: #999;
        font-size: 26px;
        height: 26px;
      }

      &_other {
        display: flex;
        justify-content: space-between;
        font-size: 26px;

        div {
          color: #999;

          i {
            color: #999;
            margin-right: 5px;
          }

          em {
            font-size: 32px;
            color: $themeColor;
          }
        }

        .price {
          color: #333;
        }
      }

      &_operation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: -10px;

        .price {
          color: $themeColor;
          font-size: 32px;
        }

        .price:after {
          content: ' THB/月';
          font-size: 26px;
          color: #333;
        }
      }
    }
  }

</style>
