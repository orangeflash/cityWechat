<template>

  <ul class="dd-form-list">
    <li v-if="!item.input && item.isShow" class="dd-form-list__flex" v-for="(item,key) in listInfo" :key="key">
      <div class="dd-form-list__label padding">
        <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
        <em v-else-if="item.symbol" :class="item.symbol">{{item.symbolName}}</em>
      </div>
      <h4 class="remarks" v-if="item.remarks">
        <label class="form_label" :class="labelColor&&'ash'">{{item.label || '备注：'}}</label>
        <span v-if="item.desc">{{item.before}}{{item.desc}}{{item.after}}</span>
      </h4>
      <div class="dd-form-list__details" v-else>
        <label class="form_label" :class="labelColor&&'ash'" v-if="item.label"><em>{{item.label}}</em></label>
        <span  v-if="item.type&&item.type=='choice'">
          <van-radio-group  v-model="item.desc" :disabled="item.disabled"  @change="$emit('choiceRadio',item,key,item.desc)" style="display:flex">
            <van-radio :name="k"  v-for="(r,k) in item.data " :key="k" :checked-color="$themeColor">{{r}}</van-radio>
          </van-radio-group>
        </span>
        <input v-else-if="item.type" :type="item.type" v-model="item.desc" @input="$emit('inputForm',item,key)"
               :placeholder="item.placeholder"/>
        <span v-else @click.stop="$emit('choiceForm',item,key)"  :class="{symbol:item.symbol}">{{item.before}}{{item.desc}}{{item.after}}</span>
      </div>
    </li>
    <li class="dd-form-list__block" v-else-if="item.isShow">
      <div class="remraks-box">
        <div class="dd-form-list__label">
          <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
          <em v-else-if="item.symbol">{{item.symbolName}}</em>
        </div>
        <label class="form_label" :class="labelColor&&'ash'">{{item.label || '备注信息：'}}</label>
      </div>
      <div class="textarea-box">
        <textarea :placeholder="item.placeholder" v-model="item.desc" @input="$emit('inputForm',item,key)"></textarea>
      </div>
    </li>
  </ul>

</template>
<script>
  export default {
    props: ['listInfo','labelColor'],
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-form-list {
    padding: 0 24px;
    background: #fff;

    li.dd-form-list__block {
      padding: 30px 0;
      border-bottom: 1.1px solid #eee;

      .remraks-box {
        overflow: hidden;
      }

      .dd-form-list__label {
        float: left;
      }


      label {
        float: left;
        font-size: 30px;
        margin-top: 5px;
      }

      .textarea-box {
        padding: 20px;
        background: #F8F8F8;
        margin-top: 24px;

        textarea {
          width: 100%;
          resize: none;
          outline: none;
          line-height: 40px;
          font-size: 26px;
          border: none;
          background: rgba(0, 0, 0, 0);
          min-height: 120px;
        }
      }
    }

    li.dd-form-list__flex {
      display: flex;
      align-items: center;
      padding: 30px 0;
      border-bottom: 1.1px solid #eee;


      .dd-form-list__details {
        font-size: 30px;
        display: flex;
        width: calc(100% - 36px);
        align-items: center;


        input {
          border: none;
          padding: 0;
          height: 40px;
          line-height: 40px;
          width: calc(100% - 180px);
        }

        span {
          width: calc(100% - 180px);
          margin-left: 10px;
          display: flex;
          div{
            flex: 1;
          }
        }
      }

      h4.remarks {
        display: block;
        overflow: hidden;
        font-size: 30px;
        width: calc(100% - 36px);
        line-height: 40px;
        label {
          float: left;
          width: 170px;
          text-align: right;
          display: inline-block;
        }

        span {
          display: block;
          margin-left: 180px;
          line-height: 40px;
          width: calc(100% - 180px);
        }

        div {
          margin-left: 90px;
          line-height: 40px;
        }
      }


    }
    span.symbol{
      width: calc(100% - 50px) !important;
    }
    .dd-form-list__label {
      display: flex;
      align-items: center;
      margin-right: 20px;
      em {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        line-height: 36px;
        text-align: center;
        color: #fff;
      }

      em.start {
        background: #12C8D3;
      }

      em.end {
        background: #FF3838;
      }

      em.center {
        background: #FF8D1E;
      }

      i {
        font-size: 40px;
        color: #999;
        height: 32px;
      }

    }
    .form_label {
      width: 170px;
      text-align: right;
      display: flex;
      align-items: center;
      em {
        width: 100%;
        text-align: right;
      }
    }
    .ash{
      color: #666 !important;
    }
  }
</style>
