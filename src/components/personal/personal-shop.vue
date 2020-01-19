<template>
	<div class="store-cord">
		<img-wrapper :src="storeImg" alt="" class="store-img"/>
		<article class="store-information">
			<h4 class="store-title">店铺名称</h4>
			<span class="store-management">家装水电材料</span>
			<span class="store-management">家装水电材料</span>
			<span>...</span>
		</article>
		<div class="cancel-collection">取消收藏</div>
	</div>
</template>
           
<script>
import storeImg from '@/assets/img/personal/我的评论.png'
export default{
    data(){
        return{
            storeImg,
        }
    },
    methods:{},
    created(){},
    mounted(){},        
}
</script>
<style scoped lang="scss">
  .store-cord{
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0px 30px;
      height: 172px;
      .store-img{
          width:108px;
          height:108px;
      }
      .store-information{
          margin-left: 35px;
          .store-title{
            font-size:28px;
            line-height:70px;
            color:rgba(51,51,51,1);
          }
      }
      .store-management{
          border:1PX solid rgba(156,175,192,1);
          border-radius:4px;
          display: inline-block;
          padding: 10px 15px;
          font-size:24px;
          color:rgba(156,175,192,1);
      }
      .cancel-collection{
          align-self:center;
          margin-left: 30px;
          font-size:24px;
          padding: 15px 15px;
          color:rgba(255,107,1,1);
          border:1PX solid rgba(255,107,1,1);
          border-radius:6px;
      }
  }  
</style>
