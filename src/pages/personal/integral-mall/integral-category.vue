<template>
  <div id="integralCategory">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <not-data v-if="notData"></not-data>
    <ul class="integral-category-goods-list" v-else>
        <Goods :data="item" v-for="(item,index) in goodsList" :key="index"></Goods>
    </ul>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Goods from "./template/goods";
  import {hideLoading, showLoading} from "../../../util";

  export default {
    components: {Goods},
    data(){
      return{
        goodsList:[],
        notData:false,
      }
    },
    methods:{
      ...mapActions('integralMall', ["integralCategory", "integralGoodsDetails", "integralSlide","integralGoodsList"]),
      load(){
        showLoading()
        this.integralGoodsList({
          typeId:this.$route.query.id,
        }).then(result => {
          hideLoading();
          this.goodsList = result.data;
          if(this.goodsList.length == 0)this.notData = true;
        })
      }
    },
    created(){
      this.load();
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  .integral-category-goods-list{
    overflow: hidden;
  }


</style>
