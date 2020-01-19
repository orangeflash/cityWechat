<template>
  <div id="ReleaseCoupon">
    <release-spec :parent-spec="parentSpec||[]" :parent-group="parentGroup||[]" @get-spec-group="getSpecGroup"
                  :show="showSpec"/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import ReleaseSpec from '../../../components/template/mall/release-photo/release-spec'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";

  export default {
    name: "ReleaseCoupon",
    components: {
      ReleaseSpec,
    },
    data() {
      return {
        showSpec: true,
        parentSpec: [],
        parentGroup: [],
        param:{},
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/releaseGood", ["getGoodsInfo","postModifySpec"]),
      //规格组合
      async getSpecGroup(spec, group) {
        console.log('添加的规格为', spec, group)
        if(!spec.length) return showText('请至少添加一组规格',2000)
        try {
          await showDialog("确定修改此规格吗？");
          showLoading();
          const res = await this.postModifySpec({
            goodsId: this.goodsId,
            spec,
            group,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.$router.go(-1);
          },1000)
        } catch (e) {
          console.log("没有提交该信息")
        }
      },
    },
    mixins: [utilMixins],
    computed: {},
    async created() {
      if (this.$route.query.id) {
        showLoading('填充数据中...')
        let result = await this.getGoodsInfo({
          goodsId: this.$route.query.id
        })
        this.parentSpec=result.spec;
        this.parentGroup=result.group;
        this.goodsId=this.$route.query.id
        hideLoading()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #ReleaseCoupon {
    font-size: $font-size-base;
  }
</style>
