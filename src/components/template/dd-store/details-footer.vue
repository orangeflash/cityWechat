<template>
  <div>
    <div class="flex-bt dh-100 posi-f w100 b0 bg-f br-t-e">
      <div class="flex flex-y-center flex-g-1 t-c">
        <div
          v-for="(item,key) in menu"
          :key="key"
          class="flex-g-1 dh-100 flex-center"
          @click.stop="$emit('click',{item,key:key})"
        >
          <div>
            <i class="iconfont fon-40 col-6" :class="item.icon" v-if="item.icon"></i>
            <img :src="item.url || item.src" v-else-if="item.url || item.src">
            <p class="mar-t-5 fon-sm col-6" :class="{'col-t':item.useActive}">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="flex-g-1 flex">
        <div
          v-for="(item,key) in main"
          :key="key"
          class="flex-g-1 flex-center col-f fon-xll  posi-r"
          @click.stop="$emit('click',{item,key:key+menu.length})"
          :class="item.className">
          <div class="posi-a w100 hei100 l0 t0" :style="item.style"></div>
          <div class="dh-100 col-f fon-xll flex-center posi-r t-c">
            <div>
              <p class="fon-xll">{{item.name}}</p>
              <span v-if="item.childrenName" class="fon-b mar-t-10">{{item.childrenName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dh-100"></div>
  </div>


</template>

<script>

  export default {
    props: {
      menu: {
        type: Array,
        default() {
          return []
        }
      },
      main: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }

</script>
