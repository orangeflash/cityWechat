<template>
  <div id="customTitle" :style="{marginTop:`${topMargin}px`,borderRadius:`${radius}px`}">
    <div class="title-style_two" :style="{background: `${backgroundColor}`}" v-if=" titleStyle == 1">
      <div class="line" :style="{background:`${color}`}"></div>
      <div class="sub-title__txt">
        <span :style="{color:`${color}`,background:`${backgroundColor}`}">{{title}}</span>
      </div>
    </div>
    <div class="title-style_one" :style="{background: `${backgroundColor}`}" v-else-if="titleStyle==2">
      <p class="title" :style="{color:`${color}`}">{{title}}</p>
      <div class="sub-title">
        <div class="line" :style="{background:`${color}`}"></div>
        <div class="sub-title__txt">
          <span :style="{color:`${color}`,background:`${backgroundColor}`}">{{subTitle}}</span>
        </div>
      </div>
    </div>
    <div class="title-style_three" :style="{background: `${backgroundColor}`}" v-else-if="titleStyle==3">
      <div class="title-style_three__typesetting1"  v-if="typesetting == 1" :style="{color:`${color}`}" >
        <em>{{title}}</em>{{subTitle}}
      </div>
      <div class="title-style_three__typesetting" :style="{color:`${color}`}" v-else>
        {{title}}<em>{{subTitle}}</em>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "CustomTitle",
    props: ["topMargin", "backgroundColor", "color", "fontWeight", "radius", "subTitle", "title", "titleStyle", "typesetting"],
    data() {
      return {}
    }
  }
</script>

<style lang="scss">
  @import "../../assets/common";

  #customTitle {
    text-align: center;
    overflow: hidden;

    .title-style_one {
      .title {
        padding-top: 20px;
        font-size: 30px;
      }
      .sub-title {
        padding: 20px 0;

        &__txt {
          display: block;
          margin-top: -10px;
          height: 20px;

          span {
            padding: 0 30px;
          }
        }
      }
    }

    .title-style_two {
      padding: 40px 0;
      height: 0;

      .sub-title__txt {
        font-size: 30px;
        height: 30px;
        margin-top: -15px;

        span {
          padding: 0 30px;
        }
      }
    }

    .line {
      height: 1px;
      display: block;
      width: 450px;
      margin: 0 auto;

    }
    .title-style_three{
      padding:0 30px;
      height: 80px;
      line-height: 80px;
      &__typesetting{
        text-align: left;
        font-size: 30px;
        position: relative;
        em{
          text-align: right;
          font-size: 20px;
          position: absolute;
          right: 0;
        }
      }
      &__typesetting1{
        text-align: center;
        em{
          font-size: 30px;
          margin-right: 20px;
        }
      }
    }
  }
</style>
