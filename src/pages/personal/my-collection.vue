<template>
    <div id="my-collection">
        <van-tabs @click="onClick" :color="$themeColor">
            <van-tab title="店铺">
                <div class="collection-comment collection-shop-cord" v-for="i in 4" :key="i">
                    <PersonalShopCord />
                </div>
            </van-tab>
            <van-tab title="用户">
                <div class="collection-comment" v-for="i in 4" :key="i">
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
           
<script>
import { Tab, Tabs } from 'vant';
import PersonalShopCord from '@/components/personal/personal-shop';
export default{
    name:'myCollection',
    components:{PersonalShopCord},
    data(){
        return{
          themeColor:'@themeColor',
          myCollectionId:1,
        }
    },
    methods:{
        onClick(index,title){


        }
    },
    created(){},
    mounted(){},
}
</script>
<style lang="scss" scoped>
  @import '@/assets/common.scss';
 #my-collection{
    .collection-comment{
        margin-top: 16px;
    }
   }
</style>
