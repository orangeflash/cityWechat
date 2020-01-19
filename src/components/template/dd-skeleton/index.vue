<template>
  <!--骨框架 - 首页-->

  <div class="dd-skeleton bg-f posi-f" style="height: 100%;width: 100%">
    <div class="bg-f4 mar-30" style="height: 3rem;"></div>
    <div class="mar-30 dh bg-f4"></div>
    <ul class="flex mar-b-20" v-for="(ul,i) in 2" :key="Math.random()*100">
      <li class="flex-1 flex-center" v-for="(item,key) in 5" :key="Math.random()*100">
        <div class="br-r-c bg-f4" style="width: 0.84rem;height: 0.84rem;"></div>
      </li>
    </ul>
    <div class="mar-t dh bg-f4"></div>
    <div class="mar-30 bg-f4" style="height: 2.5rem;" v-for="(single,i) in 5" :key="Math.random()*100"></div>
  </div>

</template>
