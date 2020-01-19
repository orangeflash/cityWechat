<template>

  <div>
    <van-popup v-model="show" position="bottom" style="overflow: initial;background: #f4f4f4;"
               @close="$emit('input',show)">
      <CellList :is-last="true" :not-center="true" style-class="padding:0.35rem 0.3rem;" class="mar-b-20">
        <div slot="icon" class="qg-img">
          <img-wrapper v-if="info.cover" :src="info.cover"></img-wrapper>
        </div>
        <template slot="content">
          <div class="flex-x-bt">
            <div class="flex-y-center">
              <span class="fon-40 col-r">￥{{info.money}}</span><span class="mar-l-10 col-9 t-d-l">￥{{info.price}}</span>
            </div>
          </div>
          <div class="mar-t col-3 t-o1">{{info.title}}</div>
        </template>
      </CellList>
      <div class="qg-con">
        <dd-address-rendering
          v-if="info.delivery==1"
          class="bg-f"
          @change="getAddressInfo"></dd-address-rendering>
        <van-cell
          v-else-if="info.delivery==2"
          @click="openSelfMention = !openSelfMention"
          :title="selfMention.detailedAddress||'请选择'" size="large"
          :label="selfMention.address||'自提地点详细地址'" is-link
          :value="selfMention.linkTel"
        />
        <div class="">
          <CellList style-class="padding:0.35rem 0.3rem" :after-right="true">
            <div slot="title" class="flex-g-0 fon-lg col-3">购买数量</div>
            <template slot="footer">
              <van-stepper v-model="params.num" :max="info.max || 1"/>

            </template>
          </CellList>
          <van-field
            style="padding:0.35rem 0.3rem"
            v-model="params.note"
            label="备注信息"
            type="textarea"
            placeholder="请输入备注信息"
            rows="1"
            size="100"
            autosize
          />
          <!--<CellList style-class="padding:0.35rem 0.3rem" :after-right="true" title="快递费用" extra="0.01元" extra-class="col-6">-->
          <!--</CellList>-->
          <CellList style-class="padding:0.35rem 0.3rem" :after-right="true">
            <template slot="footer">
              <span class="col-t fon-lg">共{{params.num}}份 合计{{getTotalMoney}}元</span>
            </template>
          </CellList>
          <CellList style-class="padding:0.35rem 0.3rem"
                    v-if="info.endTime"
                    :title="`注：购买后，请在${info.endTime}前找商家消费`">
          </CellList>
        </div>
        <dd-button
          @click="downOrder"
          class="mar-30"
          type="release"
          name="立即购买"
        ></dd-button>
      </div>
    </van-popup>
    <van-popup
      v-model="openSelfMention"
      :position="selfMentionList.length > 0 ?'bottom':'center'"
      style="background: transparent"
    >

      <div v-if="selfMentionList.length > 0">
        <div class="bg-f dh flex-center fon-lg br-b-d">选取自提点</div>
        <van-cell
          v-for="(item,key) in selfMentionList"
          @click="choiceSelfMention(item)"
          :key="key"
          :title="item.detailedAddress" size="large" :label="item.address"
          :value="item.linkTel"
        />
      </div>
      <div v-else style="padding:10px 30px;border-radius: 8px;color: #fff;font-size: 16px">
        暂无数据
      </div>
    </van-popup>

  </div>

</template>


<script>

  import CellList from "@/components/template/dd-store/cell-list";
  import DdButton from "@/components/template/button"
  import DdAddressRendering from '@/components/template/dd-addres-rendering';
  import {mapActions} from 'vuex'

  export default {
    components: {CellList, DdButton, DdAddressRendering},
    props: {
      info: {
        type: Object,
        default() {
          return {}
        }
      },
      value: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        show: false,
        openSelfMention: false,
        selfMention: {},
        selfMentionList: [],
        params: {
          num: 1,
          note: ''
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/releaseGood", ["getDeliverSet"]),
      downOrder() {
        this.show = !this.show;
        this.params = {
          ...this.params,
          ...this.info
        }


        this.$emit('confirm', this.params);

      },
      getAddressInfo(e) {

        this.params.receivedName = e.linkName;
        this.params.receivedAddress = e.address + e.detailedAddress;
        this.params.receivedTel = e.linkTel;

      },
      /** 选取自提点 */
      choiceSelfMention(item) {
        this.selfMention = item;
        this.params.selfId = item.id;
        this.openSelfMention = !this.openSelfMention;
        this.params.receivedTel = this.user.userTel
        this.params.receivedName = this.user.userName
      },
    },
    watch: {
      value(newValue) {

        this.show = newValue
      },
      info(newValue) {
        //获取自提点

        this.getDeliverSet({
          storeId: newValue.storeId,
        }).then(result => {
          this.selfMentionList = result;

        })
      }
    },
    computed: {
      getTotalMoney() {
        this.params.totalMoney = (this.params.num * (this.info.money || 0)).toFixed(2);
        return this.params.totalMoney
      }
    },
    created() {

    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";


  .ljkt-jt {
    margin-left: 20px;

    &:after {
      @include triangle($width: 12px, $direction: right, $color: $themeColor);
    }
  }

  .jdt-con {
    position: relative;
    width: 80%;
    height: 36px;
    line-height: 36px;
    background: #fff8ff;
    box-sizing: border-box;
    /*border:1.1px solid #fff;*/
    border-radius: 20px;

    .jdt1 {
      position: absolute;
      height: 100%;
      border-radius: 20px;
      color: #fff;
      background: #FFCD19;
      box-sizing: border-box;
      /*border:1.1px solid #fff;*/
      z-index: 2;
    }

    .jdt2 {
      position: absolute;
      height: 100%;
      width: 100%;
      padding: 0 20px;
      border-radius: 20px;
      color: #fff;
      box-sizing: border-box;
      /*border:1.1px solid #fff;*/
      background: #fff;
      opacity: 0.2;
      z-index: 1;
    }

    .jdt3 {
      position: absolute;
      height: 100%;
      width: 100%;
      padding: 0 20px;
      color: #FF0000;
      z-index: 3;
      box-sizing: border-box;
      font-size: $font-size-sm;
    }
  }

  .qg-img {
    margin-top: -90px;
    margin-right: 30px;
    width: 190px;
    height: 190px;
    border-radius: 10px;
  }

  .qg-con {
    max-height: 60vh;
    /*background: #f4f4f4;*/
    overflow-y: scroll;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 160px;
  }
</style>
