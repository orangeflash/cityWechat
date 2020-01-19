<template>
  <div id="MagicCube"
       :style="{marginTop:`${topMargin}px`,paddingTop:`${upDownPadding}px`,paddingBottom:`${upDownPadding}px`}">
    <div class="magic-cube-box">
      <template v-if="reverse">
        <section class="two-column">
          <div class="img-wrap" :style="{borderRadius:`${radius}px`}" @click="$pushRoute(pictureList[1].entry)">
            <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                         :src="getCardImage(1)"
                         alt=""/>
          </div>
          <div class="img-wrap" @click="$pushRoute(pictureList[2].entry)">
            <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                         :src="getCardImage(2)"
                         alt=""/>
          </div>
        </section>
        <section class="one-column" @click="$pushRoute(pictureList[0].entry)">
          <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                       :src="getCardImage(0)"
                       alt=""/>
        </section>
      </template>
      <template v-else>
        <section class="one-column" @click="$pushRoute(pictureList[0].entry)">
          <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                       :src="getCardImage(0)"
                       alt=""/>
        </section>
        <section class="two-column">
          <div class="img-wrap" @click="$pushRoute(pictureList[1].entry)">
            <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                         :src="getCardImage(1)"
                         alt=""/>
          </div>
          <div class="img-wrap" @click="$pushRoute(pictureList[2].entry)">
            <img-wrapper class="card-img" fill="true" not-load="true" :style="{borderRadius:`${radius}px`}"
                         :src="getCardImage(2)"
                         alt=""/>
          </div>
        </section>
      </template>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "MagicCube",
    props: ["pictureList", "reverse", "topMargin", "upDownPadding", "radius"],
    data() {
      return {}
    },
    methods: {
      getCardImage(index) {
        const pic = this.pictureList[index] || {};
        return pic.url
      }
    },
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #MagicCube {
    $padding: 12px;
    width: 100%;
    padding-right: $padding;
    box-sizing: border-box;

    .magic-cube-box {
      height: 320px;
      display: flex;
      align-items: center;
    }

    .one-column {
      flex: 1;
      margin-left: $padding;
      height: 100%;
      overflow: hidden;
    }

    .card-img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;
    }

    .two-column {
      flex: 1;
      height: 100%;
      display: flex;
      margin-left: $padding;
      flex-direction: column;
      overflow: hidden;

      .img-wrap {
        flex: 1;
        width: 100%;
        overflow: hidden;
        font-size: 0;

        &:first-child {
          margin-bottom: $padding;
        }
      }

    }
  }
</style>
