<script src="../../../../cityNode/src/service/complieVideo.js"></script>
<template>
  <ul class="c-speak" :class="isPlay&&'c-speak--playing'">
    <li class="c-speak__item"></li>
    <li class="c-speak__item"></li>
    <li class="c-speak__item"></li>
  </ul>
</template>

<script>
  export default {
    props:["isPlay"],
    name: "speak-icon"
  }
</script>

<style scoped lang="scss">
  .c-speak {
    position: relative;
    &--playing{
      .c-speak__item {
        animation: opacity-loop .8s steps(3) infinite alternate;

      }
    }
  }

  @keyframes opacity-loop {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .c-speak__item {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 2Px solid transparent;
    border-radius: 50%;
    border-right-color: #fff;
  }

  .c-speak__item:nth-child(1) {
    width: 26px;
    height: 20px;
    animation: none;
  }

  @for $i from 2 through 4 {
    .c-speak__item:nth-child(#{$i}) {
      $step: $i * .6;
      width: 40px * $step;
      height: 30px * $step;
      animation-delay: .2s * $step;
    }
  }
</style>
