<template>
  <div id="ReleaseSpec">
    <van-popup v-model="value" position="bottom">
      <div class="spec-con">
        <div class="spec-main">
          <div class="spec-name-con">
            <div v-for="(item,pIndex) in spec" :key="pIndex">
              <InputWithCmp
                v-model="item.spec_name"
                placeholder="请输入规格标题"
                title="规格名称:"
              >
                <span class="spec-add-spec" @click="addSpecVal(pIndex)">+添加规格</span>
                <span class="delete-icon" @click="delSpecMethod(pIndex)"><i class="iconfont icon-close"></i></span>
              </InputWithCmp>
              <div class="spec-name-label">
                <div v-for="(specitem,index) in item.spec_val" :key="index" class="spec-name-label-main">
                  <div class="label">
                    <van-field v-model="specitem.spec_val_name" placeholder="参数名称"/>
                  </div>
                  <van-icon
                    @click="delSpecVal(pIndex,index)"
                    name="clear"
                    color="#666666"
                    size="16"
                    class="close-icon"/>
                </div>
                <!--<div class="spec-name-label-main">-->
                <!--<div class="label add-label">+</div>-->
                <!--</div>-->
              </div>
            </div>
            <div class="add-spec-btn" @click="addSpecMethod">
              <van-icon
                name="add-o"
                color="#BABABA"
                size="20px"/>
            </div>
            <div class="add-tips">注意：最多只能添加3组规格</div>
          </div>
        </div>
        <div class="spec-group mar-t">
          <div class="head-title">
            <div>价格/库存{{platform.openVip?'/会员价':''}}</div>
            <div @click="refreshGroup" class="refresh">刷新规格组合表</div>
          </div>
          <div class="spec-group-con">
            <!--<div class="spec-group-con-title">“属性一”+“属性三”</div>-->
            <div class="spec-group-con-body" style="margin-top: 0;">
              <div class="body-con mar-r">
                <input type="number" v-model="syncMoney" placeholder="输入价格"/>
                <div class="body-r" @click="syncKey('syncMoney')">同步</div>
              </div>
              <div class="body-con mar-r">
                <input type="number" v-model="syncNum" placeholder="输入库存"/>
                <div class="body-r" @click="syncKey('syncNum')">同步</div>
              </div>
              <div class="body-con" v-if="platform.openVip">
                <input type="number" v-model="syncVipMoney" placeholder="会员价格"/>
                <div class="body-r" @click="syncKey('syncVipMoney')">同步</div>
              </div>
            </div>
          </div>
          <div class="spec-group-con" v-for="(item,index) in group" :key="index">
            <div class="spec-group-con-title">{{item.data}}</div>
            <div class="spec-group-con-body">
              <div class="body-con">
                <input type="number" v-model="item.money" placeholder="输入价格"/>
                <!--<div class="body-r">同步</div>-->
              </div>
              <div class="body-con mar-l mar-r">
                <input type="number" v-model="item.num" placeholder="输入库存"/>
                <!--<div class="body-r">同步</div>-->
              </div>
              <div class="body-con" v-if="platform.openVip">
                <input type="number" v-model="item.vipMoney" placeholder="会员价格"/>
                <!--<div class="body-r">同步</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer-container">
        <button
          class="footer-btn"
          @click="confirm"
        >确定
        </button>
      </footer>
    </van-popup>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import InputWithCmp from "../../../publication/input-with-cmp";
  import {utilMixins} from "../../../../plugins/util-mixins";
  import {chooseImage, uploadImage} from "../../../../util/wechat-util";
  import {showLoading, showText} from "../../../../util";

  export default {
    name: "ReleaseSpec",
    props: ["show", "parentSpec", "parentGroup"],
    components: {
      InputWithCmp
    },
    data() {
      return {
        spec: [],
        syncMoney: '',
        syncNum: '',
        money: '',
        num: '',
        vipMoney: null,
        syncVipMoney: null,
      }
    },
    methods: {
      addSpecMethod() {
        if (this.spec.length > 2) return showText('最多添加3组规格')
        let specObj = {
          spec_name: '规格' + this.spec.length,
          spec_val: [
            // {spec_val_name:'',}
          ]
        }
        this.$set(this.spec, this.spec.length, specObj)
        console.log(this.spec)
        // this.spec=this.spec.concat(specObj)
      },
      delSpecMethod(index) {
        this.$delete(this.spec, index)
        console.log(index, this.spec)
      },
      addSpecVal(index) {
        let specValObj = {spec_val_name: '属性' + index + this.spec[index].spec_val.length,}
        this.$set(this.spec[index].spec_val, this.spec[index].spec_val.length, specValObj)
        console.log(index, this.spec)
      },
      delSpecVal(pIndex, index) {
        this.$delete(this.spec[pIndex].spec_val, index)
        console.log(pIndex, index, this.spec)
      },
      confirm() {
        // if(!this.spec.length){
        //   showText('请至少添加一组规格',2000)
        // }
        for (let i in this.spec) {
          if (!this.spec[i].spec_name.trim()) {
            return showText('规格名称不能为空', 2000)
          }
          if (!this.spec[i].spec_val.length) {
            return showText('请删除未添加属性的规格', 2000)
          }
          for (let j in this.spec[i].spec_val) {
            if (!this.spec[i].spec_val[j].spec_val_name.trim()) {
              return showText('规格的属性名称不能为空', 2000)
            }
          }
        }
        for (let i in this.group) {
          if (!Number(this.group[i].money) || !Number(this.group[i].num)) {
            return showText('规格组合的价格和库存不能为空', 2000)
          }
        }
        let spec = this.spec.map((item) => {
          let obj = {}
          obj.name = item.spec_name.trim()
          obj.data = item.spec_val.map((item) => (item.spec_val_name.trim())).toString()
          return obj
        })
        console.log(spec, this.group)
        this.$emit('get-spec-group', spec, this.group)
        this.value = false;
      },
      refreshGroup() {
        this.money = ''
        this.num = ''
      },
      syncKey(key) {
        console.log(4684163153, key)
        if (!Number(this[key])) return showText('请输入合理数据后同步')
        if (key == 'syncMoney') {
          this.money = this[key]
          //这样处理因为group是计算属性有缓存，即使$set(this.group)也不能实时更新数据。
          if (this.parentGroup.length) {
            this.parentGroup.forEach(item => {
              item.money = this[key]
            })
          }
        }
        if (key == 'syncNum') {
          this.num = this[key]
          if (this.parentGroup.length) {
            this.parentGroup.forEach(item => {
              item.num = this[key]
            })
          }
        }
        if (key == 'syncVipMoney') {

          this.vipMoney = this[key]
          if (this.parentGroup.length) {
            this.parentGroup.forEach(item => {
              item.vipMoney = this[key]
            })
          }
        }
      },
    },
    mixins: [utilMixins],
    watch: {
      parentSpec(newVal) {
        console.log('parentSpec', newVal)
        if (newVal.length > 0) {
          this.spec = newVal.map((item) => {
            return {
              spec_name: item.name,
              spec_val: item.data.map((item) => {
                return {spec_val_name: item}
              }),
            }
          })
        }
      },
      parentGroup(newVal) {
        console.log('parentGroup', newVal)
        if (newVal.length > 0) {
          // console.log('group',this.group)
          // newVal.forEach(item=>{
          //   console.log(_.find(this.group,{data:item.data}))
          //   // this.$set(this.group,)
          // })
        }
      },
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      group() {
        if (!this.spec.length) return []
        let _result_arr = this.spec.map(_e => _e['spec_val'])
        // 笛卡尔积
        let _recursion_spec_obj = (data) => {

          let len = data.length
          if (len >= 2) {
            let len1 = data[0].length
            let len2 = data[1].length
            let newlen = len1 * len2
            let temp = new Array(newlen)
            let index = 0
            for (let i = 0; i < len1; i++) {
              for (let j = 0; j < len2; j++) {
                if (Array.isArray(data[0][i])) {
                  temp[index] = [...data[0][i], data[1][j]]
                } else {
                  temp[index] = [data[0][i], data[1][j]]
                }
                index++
              }
            }
            let newArray = new Array(len - 1)
            for (let i = 2; i < len; i++) {
              newArray[i - 1] = data[i]
            }
            newArray[0] = temp
            return _recursion_spec_obj(newArray)
          } else {
            return data[0]
          }

        }
        // console.log('_result_arr',_result_arr,_recursion_spec_obj(_result_arr))
        // return
        return _recursion_spec_obj(_result_arr).map((item) => {
          let arr = [];
          item.length > 1 ? item.forEach((item) => {
            arr.push(item.spec_val_name.trim())
          }) : arr = item.spec_val_name.trim();
          //如果编辑传入了group,根据编辑数据里的库存和价格渲染
          if (this.parentGroup.length) {
            return {
              data: arr.toString(),
              money: _.find(this.parentGroup, {data: arr.toString()}) && _.find(this.parentGroup, {data: arr.toString()}).money || this.money,
              num: _.find(this.parentGroup, {data: arr.toString()}) && _.find(this.parentGroup, {data: arr.toString()}).num || this.num,
              vipMoney: _.find(this.parentGroup, {data: arr.toString()}) && _.find(this.parentGroup, {data: arr.toString()}).vipMoney || this.vipMoney,
            }
          } else {
            return {
              data: arr.toString(),
              money: this.money,
              num: this.num,
              vipMoney: this.vipMoney,
            }
          }
        })
        console.log(_recursion_spec_obj(_result_arr), this.group)
      },
      value: {
        get() {
          return this.show;
        },
        set(newVal) {
          this.$emit("update:show", newVal)
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../assets/theme";

  #ReleaseSpec {
    font-size: $font-size-base;

    .footer-container {
      position: absolute;
    }

    .spec-con {
      overflow-Y: scroll;
      height: 100vh;
      background: #f5f5f5;
      padding-bottom: 120px;
      box-sizing: border-box;

      .spec-main {
        background: #fff;

        .spec-name-con {
          padding: 20px 30px;

          .spec-add-spec {
            font-size: $font-size-sm;
            background: $themeColor;
            color: #fff;
            width: 130px;
            height: 50px;
            border-radius: 5px;
            margin-right: 10px;
            @include flex-center();
          }

          .delete-icon {
            background: #e60000;
            color: #fff;
            width: 50px;
            height: 50px;
            border-radius: 5px;
            @include flex-center();

            .iconfont {
              margin-top: 5px;
            }
          }

          .spec-name-label {
            display: flex;;
            flex-wrap: wrap;

            .spec-name-label-main {
              position: relative;
              z-index: 0;
              margin: 20px 30px 10px 10px;
              @include flex-center();

              .label {
                width: 135px;

                .van-cell {
                  padding: 0px;
                  color: $themeColor;
                }

                @include flex-center();
                border: 1PX solid $themeColor;
                color: $themeColor;
                padding: 5px 20px;
                border-radius: 10px;
              }

              .add-label {
                width: 80px;
                border: 1PX solid #dddddd;
                color: #999;
              }

              .close-icon {
                z-index: 1;
                position: absolute;
                right: -12px;
                top: -12px;
                padding: 0 0 0px 0px;
                font-size: 34px;
              }
            }
          }

          .add-spec-btn {
            margin: 10px 0;
            padding: 16px 30px;
            border: 1PX solid #f5f5f5;
            border-radius: 10px;
            background: #f5f5f5;
            @include flex-center()
          }

          .add-tips {
            font-size: $font-size-sm;
            color: #999;
            padding: 10px 0;
            text-align: center;
          }
        }
      }

      .spec-group {
        background: #fff;

        .spec-group-con {
          padding: 30px 30px;
          border-top: 1PX solid #f5f5f5;

          &-title {
            color: #999;
          }

          &-body {
            @include flex-between;
            margin-top: 30px;

            .body-con {
              width: 42vw;
              height: 60px;
              display: flex;
              border-radius: 20px;

              input {
                width: 70%;
                height: 100%;
                border: none;
                box-sizing: border-box;
                padding: 0 20px;
                background: #f5f5f5;
              }

              .body-r {
                flex: 1;
                @include flex-center();
                border: 1PX solid #f5f5f5;
                color: $themeColor;
                background: #fff;
              }
            }
          }
        }

        .head-title {
          @include flex-between;

          .refresh {
            padding: 15px 20px;
            background: $themeColor;
            border-radius: 10px;
            color: #fff;
          }
        }
      }
    }
  }
</style>
