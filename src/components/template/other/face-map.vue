<template>

  <div class="dd-face-map"
       v-if="faces&&faces.length > 0"
       :style="{paddingLeft:(size || 48)/3/50 + 'rem','overflow':'hidden'}"
  >
    <div
      v-for="(src,key) in faces"
      :key="key"
      :style="{'marginLeft':-(size || -48)/3/50 + 'rem','float':'left'}"
      @click.stop="$emit('click',key)"
      v-if="key < (max || 10)"
    >
      <face
        :src="src"
        :size="size"
      />
    </div>
    <div
      :style="{'marginLeft':-(size || -48)/3/50 + 'rem','float':'left'}"
      @click.stop="$emit('click',-1)"
      v-if="faces.length > (max || 10)"
    >
      <face
        :src="more"
        :size="size"
      />
    </div>

  </div>

</template>

<script>

  import Face from '@/components/template/face'
  import more from "@/assets/img/more.png";       //已结束


  export default {
    components: {Face},
    props: ['faces', 'size', 'max'],
    data() {
      return {
        more
      }
    }
  }


</script>
