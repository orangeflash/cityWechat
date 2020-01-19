<template>
  <div id="CellList">
    <!--{{ranklist}}-->
    <van-cell-group>
      <van-cell center  v-for="(item,index) in ranklist" :key="index">
        <template slot="icon">
          <img-wrapper :src="item.portrait||PlaceholderAvatar" not-load="true" class="hdimg"/>
        </template>
        <template slot="title" class="cellbd">
          <div class="cellbd_t">
            <span class="cellbd_t_span">{{item.userName||'神秘人'}}</span>
          </div>
          <div class="cellbd_f">
            <img-wrapper :src="getIcon(index)" not-load="true" v-if="index<3" class="cellbd_f_img"/>
            <div v-else class="cellbd_f_pm">
              <span>{{index+1}}</span>
            </div>
            <span class="cellbd_f_span">第{{index+1}}名</span>
          </div>
        </template>
        <template>
          <div class="cellft">
            {{item.money||0}}元
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "../../project-config/base";
  import No1 from '@/assets/img/redbag/one.png'
  import No2 from '@/assets/img/redbag/two.png'
  import No3 from '@/assets/img/redbag/three.png'
  export default {
    name: "CellList",
    props: ["ranklist"],
    data() {
      return {
        No1,
        No2,
        No3,
        PlaceholderAvatar,
        bgimg: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1071899407,1665501066&fm=58&bpow=748&bpoh=1055'
      }
    },
    methods: {
      getIcon(index){
        return index===0?No1:index===1?No2:No3;
      }
    },
    computed: {
      // value: {
      //   get() {
      //     return this.checked;
      //   },
      //   set(newVal) {
      //     this.$emit("update:checked", newVal)
      //   }
      // }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #CellList {
    font-size: 28px;

    .hdimg {
      @include widhei($width: 90px, $height: 90px, $brs: 50%);
      margin-right: 20px;
    }

    .cellbd {
      @include flex-between;
      &_t {
        @include flex-center($justify: flex-start,$align:flex-start);
        &_span {
          color: #61708F;
          margin-bottom: 15px;
        }
      }

      &_f {
        @include flex-center($justify: flex-start);

        &_img {
          @include widhei($width: 40px, $height: 40px);
        }
        &_pm {
          @include widhei($width: 40px, $height: 40px);
          @include flex-center;
          color: #333333;
          span {
            @include widhei($width: 30px, $height: 40px);
            @include flex-center;
            background: #FFBB00;
            font-size: 26px;
            position: relative;
            &:before{
              @include triangle($width:70px,$direction:top,$color:#fff);
              transform: translate(0px, 10px);
            }
          }
        }
        &_span {
          margin-left: 25px;
          font-size: 28px;
        }
      }
    }

    .cellft {
      color: #FF3333;
      font-size: 32px;
    }
  }
</style>
