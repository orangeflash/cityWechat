<template>
  <div id="Personal">
    <article>
      <section>
        <PersonalHead/>
      </section>
      <div>
      <section class="mar-b-20">
        <PersonalOrder/>
      </section>
      <section class="mar-b-20">
        <PersonalService/>
      </section>
      <section class="mar-b-20">
        <PersonalTool/>
      </section>
      <section class="mar-b-20">
        <PersonalFeature/>
      </section>
      </div>
    </article>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import PersonalHead from "../../components/personal/personal-head";
  import PersonalOrder from "../../components/personal/personal-order";
  import PersonalService from "../../components/personal/personal-service";
  import PersonalTool from "../../components/personal/personal-tool";
  import PersonalFeature from "../../components/personal/personal-feature";
  import {updateShareConfig} from "../../util/wechat-util";
  export default {
    name: "Personal",
    components: {PersonalFeature, PersonalTool, PersonalService, PersonalOrder, PersonalHead},
    data() {
      return {}
    },
    methods: {
      ...mapActions("home", ['getPlatformInfo']),
    },
    computed: {

    },
    async created() {
      //配置转发信息
      let data = await this.getPlatformInfo();
      console.log("this.$route.path:"+this.$route.path)
      if(data.data){
        updateShareConfig({
          title: data.data.title,
          imgUrl: data.data.shareImg,
          desc: data.data.shareDescription,
          link: window.location.href,
        });
      }
    }
  }
</script>
