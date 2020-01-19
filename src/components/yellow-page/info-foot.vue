<template>
    <div id="PurchaseToolbar">
        <ul class="feature">
            <div class="feature__item" v-for="(item,index) in footList" :key="index" @click="$emit('listClick',item.name)">
                <i class="iconfont feature__item__icon" :class="item.icon" :style="{color:item.state==0?'#666':$themeColor}"></i>
                <em class="feature__item__label" :style="{color:item.state==0?'#666':$themeColor}">{{item.name}}</em>
            </div>
        </ul>
        <div class="concat-btn" @click="$emit('callShop')">
            <p>{{infoRight.name}}</p>
            <p :style="{fontSize:infoRight.size}">{{infoRight.content}}</p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
    name: "InfoFoot",
    props: ["footList", "infoRight"],
    data() {
        return {};
    },
    methods: {},
    computed: {
        ...mapState("common", {
            storeConfig: state => state.storeConfig
        }),
        ...mapState({
            user: state => state.user
        }),
        storeCanEnter() {
            return +this.storeConfig.enter === 1;
        }
    },
    created() {}
};
</script>

<style scoped lang="scss">
@import "../../assets/common";

#PurchaseToolbar {
    @include positionAbsolute(null, 0, 0, 0);
    position: fixed;
    height: 120px;
    background: #fff;
    z-index: 99;
    @include flex-center;
    .feature {
        flex: 1;
        height: 100%;
        @include flex-center;
        &__item {
            flex: 1;
            @include flex-center;
            flex-direction: column;
            font-size: 20px;
            height: 100%;
            color: rgba(120, 120, 120, 1);
            &__icon {
                font-size: 44px;
                margin-bottom: 10px;
            }
            &:active {
                transition: background-color 0.1s linear;
                background-color: #f0f0f0;
            }
        }
    }
    .concat-btn {
        height: 100%;
        width: 308px;
        background: $themeColor;
        // @include flex-center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        font-size: 36px;
        color: rgba(255, 255, 255, 1);
        p {
            width: 100%;
        }
    }
}
</style>
