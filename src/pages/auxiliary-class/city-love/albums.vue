<template>

  <dd-layout-div mi-h="100vh" class="flex flex-col bg-f">
    <Header/>
    <dd-layout-div class="flex-g-1" :pad="userInfo?[30]:[73,30,30]">
      <dd-layout-div v-if="!userInfo">
        <dd-layout-div :font-size="50" :mar="[0,0,23]">个人相册</dd-layout-div>
        <p class="col-9">上传您的真实生活照，有助于您的交友进度哦.限制九张以内</p>
      </dd-layout-div>
      <dd-layout-div class="flex flex-wrap flex-bt" :mar="userInfo?[]:[55,0,0]">
        <dd-layout-img :src="src" v-for="(src,key) in getAlbums" class="mar-b-20" :key="key" :width="1.6"
                       @click="previewImage(src,getAlbums)"
                       :height="1.6"
                       :fillet="0.08">
          <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 t0 mar-t-20 mar-r op-6"
             @click.stop="deleteImage(key,'media')" v-if="!userInfo"></i>
        </dd-layout-img>
        <dd-layout-img :src="src" class="mar-b-20" v-for="(src,f) in filePaths" :key="'f'+f" :width="1.6" :height="1.6"
                       :fillet="0.08">
          <i class="iconfont icon-closev-active col-r fon-50 posi-a r0 t0 mar-t-20 mar-r op-6"
             @click="deleteImage(f,'filePaths')" v-if="!userInfo"></i>
        </dd-layout-img>
        <dd-layout-div v-if="!userInfo && (getAlbums.length +filePaths.length) < 9" class="posi-r flex-center"
                       :width="160" :height="160" bg="#EFF3F6" :fillet="8">
          <dd-file class="posi-a-i" :max="9" :multiple="true"
                   @change="getPhotos"/>
          <dd-layout-div class="t-c">
            <i class="iconfont icon-jia1 fon-50 col-9"></i>
            <dd-layout-div :font-size="26" class="col-9 mar-t-10">上传照片</dd-layout-div>
          </dd-layout-div>

        </dd-layout-div>

        <dd-layout-div :width="160" :height="160" v-for="i in getFillNum" :key="'g'+i"></dd-layout-div>


      </dd-layout-div>


    </dd-layout-div>

    <dd-layout-div bg="#fff" :pad="[30]" v-if="!userInfo">
      <dd-layout-div :bg="$themeColor" @click="saveAlbums" class="col-f fon-40 flex-center"
                     :height="98" :fillet="98">保存
      </dd-layout-div>
    </dd-layout-div>

  </dd-layout-div>


</template>
<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdFile from "../../../components/template/dd-form/dd-file";

  import {mapState, mapActions} from 'vuex'

  import {Toast} from 'vant'

  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdFile, DdLayoutImg},
    data() {
      return {
        filePaths: [],
        files: [],
        media: [],
        albums: [],
        userInfo: null
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveRegister", "cityLoveGetInfo"]),
      getPhotos(e) {
        this.filePaths = this.filePaths.concat(e.filePaths)
        this.files = this.files.concat(e.files)
        this.from = e.from
        if (this.getAlbums.length + this.filePaths.length >= 9) {
          this.filePaths.splice(8, this.filePaths.length)
          this.files.splice(8, this.filePaths.length)
        }

      },
      deleteImage(key, type) {
        if (type == 'filePaths') {
          this.filePaths.splice(key, 1)
          this.files.splice(key, 1)
        } else {

          this.albums.splice(key, 1)
        }
      },
      async saveAlbums() {
        const images = await this.uploadFile({
          files: this.files,
          from: this.from
        })

        const info = JSON.parse(JSON.stringify(this.registerInfo));
        delete info.userId
        delete info.id
        info.media = this.albums.concat(images);

        const result = await this.cityLoveRegister({
          ...info,
          icon: [
            {
              type: "img",
              url: this.registerInfo.icon,
            }
          ],
        })

        this.files = [];
        this.filePaths = []


        await this.cityLoveRegister({
          userId: this.user.id
        });

        Toast({
          message: '已保存',
          duration: 1500
        })


        this.albums = this.userInfo ? JSON.parse(JSON.stringify(this.userInfo.media)) : JSON.parse(JSON.stringify(this.registerInfo.media))

      },
      formatMedia() {

      }
    },
    computed: {
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo
      }),
      getAlbums() {
        return this.albums.map(item => {
          return this.getSingleImg(item.url)
        })
      },
      getFillNum() {

        return 4 - (this.albums.length + this.filePaths.length) % 4 - (this.userInfo ? 1 : 0)
      }
    },
    async created() {

      if (this.$route.query.userId && this.$route.query.userId != this.registerInfo.id) {
        this.userInfo = await this.cityLoveGetInfo({
          id: this.$route.query.userId
        })
        this.albums = JSON.parse(JSON.stringify(this.userInfo.media))

      } else {

        if (!this.registerInfo.id) {
          await this.cityLoveRegister({
            userId: this.user.id
          });
        }

        this.albums = JSON.parse(JSON.stringify(this.registerInfo.media))
      }


    }
  }
</script>
