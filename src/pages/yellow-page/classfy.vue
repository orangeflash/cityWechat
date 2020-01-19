<template>
    <div id="classfy">
        <div class="list" v-for="(item,index) in classfyList" :key="index">
            <div class="oneClassfy">
                <img :src="getPathByAssetPath(item.icon[0].url)" alt>
                {{item.name}}
            </div>
            <div
                class="twoClassfy"
                @click="classfyPage(item.id)"
                v-for="(item,index) in item.son"
                :key="index"
            >{{item.name}}</div>
        </div>
        <!--<Footer :fullpath="fullpath"/>-->
    </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Footer from "../../components/yellow-page/footer";
export default {
    name: "Classfy",
    components: {
        Footer
    },
    data() {
        return {
            fullpath: "",
            classfyList: []
        };
    },
    methods: {
        ...mapActions("publication/businessEnter", ["getPostCategoryOptions"]),
        classfyPage(e) {
            this.$router.push({
                path: "/yellowPage/classfyPage",
                query: { id: e }
            });
        }
    },
    async created() {
        this.fullpath = this.$router.history.current.path;
        const list = await this.getPostCategoryOptions(8);
        for (let i in list) {
            list[i].icon = JSON.parse(list[i].icon);
        }
        this.classfyList = list;
    }
};
</script>
<style lang="scss">
#classfy {
    // background: #fff;
    // padding: 0 20px;
    padding-bottom: 140px;
    .list {
        margin-bottom: 20px;
        background: #fff;
        padding: 0 20px;
    }
    .oneClassfy {
        font-size: 30px;
        border-bottom: 1.1px solid #f9f9f9;
        padding: 20px 0;
        img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
            margin-right: 30px;
            border-radius: 10px;
        }
    }
    .twoClassfy {
        width: 25%;
        box-sizing: border-box;
        padding: 30px 0;
        border-right: 1.1px solid #f9f9f9;
        border-bottom: 1.1px solid #f9f9f9;
        font-size: 28px;
        color: #666;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
    }
}
</style>
