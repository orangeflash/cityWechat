<template>

  <dd-layout-div class="posi-f zIndex999999 t0 r0 b0 l0 bg-0 over-h" @load="loadHandle">
    <div class="bg-0 flex">
      <div style="width: 100vw;height: 100vh" class="flex-center flex-g-0" v-for="(src,key) in images" :key="key">
        <img :src="src" style="max-height: 100%;max-width: 100%">
      </div>
    </div>

  </dd-layout-div>


</template>

<script>

  export default {
    props: {
      images: {
        type: Array,
        default: () => [
          "https://hbimg.huabanimg.com/821fea6bed2e686e197271216c7bb75aa181a72f12d30-Z221uf_fw658",
          "https://hbimg.huabanimg.com/637a34921a51ffdfc79c20e19548d35fba369eba7e8d-sKVHhW_fw658",
          "https://hbimg.huabanimg.com/2899898c6e4579c761c1ccbc9451d9a8be04e7f33fa70-c0auV3_fw658",
          "https://hbimg.huabanimg.com/392c1bfb6f9b490d2fcf108437513757636d2e492ca38-SQ2SaW_fw658",
          "https://hbimg.huabanimg.com/ba2f211516d51c0d2b6f3c2aabc8c943fe220b663b7f8-ZrHDiC_fw658",
          "https://hbimg.huabanimg.com/1b265045b1090289a05726999b276d5faf68a73da9c4-zaYVhE_fw658",
        ]
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    },
    methods: {
      loadHandle(e) {


      }
    }
  }


</script>
