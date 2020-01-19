<template>
  <!--第二种form表单列表-->
  <div class="dd-form-list-two">
    <div class="dd-form-list-two_block">
      <div class="dd-form-list-two_block_title">基本信息</div>
      <van-field
        clearable
        label="房屋租金"
        right-icon="question-o"
        placeholder="请输入"
      >
        <div slot="button" class="from-input_after">
          <em>元/月</em>
          <div>
            <i class="iconfont icon-multiple_choice"></i>
            面议
          </div>
        </div>
      </van-field>
    </div>
  </div>
</template>


<style scoped lang="scss">
  @import "../../../assets/common";
</style>
